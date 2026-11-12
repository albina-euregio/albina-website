import React, { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "es-toolkit";
import {
  GeoJSONSource,
  GeolocateControl,
  ImageSource,
  type ImageSourceSpecification,
  type LngLatLike,
  Map as MlMap,
  type MapMouseEvent,
  Marker,
  ScaleControl
} from "maplibre-gl";
import MapLibreMap, {
  CIRCLE_LAYER_ID,
  PinDisplayMode,
  type MarkerItem
} from "../station/station-map-maplibre";
import { GeonamesControl } from "../maplibre/maplibre-geonames-control";
import * as store from "../../stores/weatherMapStore";
import { useStore } from "@nanostores/react";
import { useIntl } from "../../i18n";
import type { ParameterType } from "../station/station-parameter-data";
import type { AustriaLambertGrid } from "../../util/austria-lambert";
import type {
  ReprojectionRequest,
  ReprojectionResponse
} from "../../util/austria-lambert.worker";

let reprojectionWorker: Worker | undefined;
let reprojectionId = 0;

/** Reprojects an overlay image off the main thread. */
async function reprojectInWorker(
  image: HTMLImageElement,
  { lambert, bbox }: AustriaLambertGrid
): Promise<ImageData> {
  reprojectionWorker ??= new Worker(
    new URL("../../util/austria-lambert.worker.ts", import.meta.url),
    { type: "module" }
  );
  const worker = reprojectionWorker;
  const request: ReprojectionRequest = {
    id: ++reprojectionId,
    image: await createImageBitmap(image),
    grid: {
      lambert,
      bounds: [bbox.getWest(), bbox.getSouth(), bbox.getEast(), bbox.getNorth()]
    }
  };
  return new Promise((resolve, reject) => {
    const onMessage = ({ data }: MessageEvent<ReprojectionResponse>) => {
      if (data.id !== request.id) return;
      worker.removeEventListener("message", onMessage);
      if ("image" in data) resolve(data.image);
      else reject(new Error(data.error));
    };
    worker.addEventListener("message", onMessage);
    worker.postMessage(request, [request.image]);
  });
}

interface Props {
  isPlaying: boolean;
  onMarkerSelected: (id: string | null) => void;
}

const IMAGE_SOURCE_ID = "weather-overlay";
const IMAGE_LAYER_ID = "weather-overlay";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class WindUtil {
  static readonly SOURCE_ID = "weather-wind-direction";
  static readonly LAYER_ID = "weather-wind-direction";
  static readonly ARROW_IMAGE = "weather-wind-arrow";
  // Small black arrow (9×12 box), the same `directionArrow-centered` shape the
  // Leaflet grid markers drew. Points up; rotated by `direction + 180`.
  static readonly ARROW_PATH =
    "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0 9 4.5z";
  static readonly ARROW_WIDTH = 9;
  static readonly ARROW_HEIGHT = 12;

  /** Register the small black wind-direction arrow image once (no-op on SSR). */
  static ensureArrowImage(map: MlMap): void {
    if (typeof document === "undefined" || map.hasImage(WindUtil.ARROW_IMAGE))
      return;
    const pixelRatio = 2;
    const pad = 1;
    const width = (WindUtil.ARROW_WIDTH + pad * 2) * pixelRatio;
    const height = (WindUtil.ARROW_HEIGHT + pad * 2) * pixelRatio;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(pixelRatio, pixelRatio);
    ctx.translate(pad, pad);
    const path = new Path2D(WindUtil.ARROW_PATH);
    ctx.fillStyle = "#000";
    ctx.fill(path, "evenodd");
    ctx.lineWidth = 0.6;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.stroke(path);
    map.addImage(WindUtil.ARROW_IMAGE, ctx.getImageData(0, 0, width, height), {
      pixelRatio
    });
  }
}

const EMPTY_FC: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: "FeatureCollection",
  features: []
};

// Stations start shown, except hidden by default on mobile — the old weather
// show/hide-pins default, now the initial state of the map's pins control.
const SHOW_PINS_BY_DEFAULT =
  typeof navigator === "undefined" ||
  !/android|ip(hone|od|ad)/i.test(navigator.userAgent);

/**
 * Read the displayed value at a coordinate: the first of temperature, wind
 * speed, snow height or snow line that the current overlays provide (the same
 * precedence the Leaflet data marker used). Reads the live store so the click
 * handler never holds a stale overlay set.
 */
async function readOverlayValue(lngLat: LngLatLike): Promise<number | null> {
  const overlays = store.dataOverlays.get();
  const byType = {} as Partial<Record<store.OverlayType, number | null>>;
  for (const overlay of overlays) {
    byType[overlay.type] = await overlay.valueForPixel(lngLat);
  }
  return (
    byType.temperature ??
    byType.windSpeed ??
    byType.snowHeight ??
    byType.snowLine ??
    null
  );
}

type RGB = [number, number, number];

/**
 * Parse a "#rrggbb" hex color into an [r, g, b] triple — only needed to
 * bridge into MapLibreMap's `MarkerItem` contract below, which is RGB-native
 * because it's shared with the real stations feature's hardcoded RGB data.
 */
function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * The data marker's DOM: a dashed (forecast) disc colored by the value's
 * highest exceeded threshold (white when missing), with the value as text in a
 * contrasting color (by relative luminance) — like the old `StationMarker`.
 * Non-interactive so it never shadows the next click.
 */
function createDataMarkerElement(
  value: number | null,
  thresholds: store.RemoteThreshold[]
): HTMLDivElement {
  let fillColor = "#fff";
  let textColor = "#000";
  if (value != null) {
    let hex = thresholds[0].color;
    for (let i = 0; i < thresholds.length - 1; i++) {
      if (value > (thresholds[i].range[1] as number)) {
        hex = thresholds[i + 1].color;
      }
    }
    const [r, g, b] = hexToRgb(hex);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    fillColor = hex;
    textColor = luminance > 0.435 ? "#000" : "#fff";
  }
  const el = document.createElement("div");
  el.style.pointerEvents = "none";
  el.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10.5" stroke="#000" stroke-width="1" stroke-dasharray="1.3675" fill="${fillColor}"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}">${value == null ? "-" : value}</text></svg>`;
  return el;
}

const WeatherMap = ({ isPlaying, onMarkerSelected }: Props) => {
  const intl = useIntl();
  const domainConfig = useStore(store.domainConfig);
  const stations = useStore(store.stations);
  const imageOverlayURLs = useStore(store.imageOverlayURLs);
  const imageOverlayExtent = useStore(store.imageOverlayExtent);
  const dataOverlays = useStore(store.dataOverlays);

  const mapRef = useRef<MlMap | null>(null);
  // The transient "data marker" placed on click, and a token so a slow pixel
  // read from an older click can't overwrite a newer one.
  const dataMarkerRef = useRef<Marker | null>(null);
  const clickGenRef = useRef(0);
  const [mapReady, setMapReady] = useState(false);

  // Keep the weather raster overlay in sync with the selected time/domain. It
  // multiplies against the basemap, beneath the wind arrows and station markers.
  useEffect(() => {
    const map = mapRef.current;
    const [, url] = imageOverlayURLs;
    if (!mapReady || !map || !url || !imageOverlayExtent) return;

    // An image published on the Austria Lambert grid can't be placed by its
    // corners, so it is reprojected to Web Mercator first; an older image
    // already is, and is shown as is.
    let stale = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = async () => {
      if (stale) return;
      const { bbox, lambertGrid: lambert } = imageOverlayExtent;
      let overlay: HTMLImageElement | ImageData = image;
      if (lambert) {
        try {
          overlay = await reprojectInWorker(image, lambert);
        } catch (e) {
          console.error(`Failed to reproject ${url}`, e);
          return;
        }
        if (stale) return;
      }
      // MapLibre image sources want the four corners as `[lng, lat]` in
      // TL, TR, BR, BL (i.e. NW, NE, SE, SW) order.
      const coordinates: ImageSourceSpecification["coordinates"] = [
        bbox.getNorthWest().toArray(),
        bbox.getNorthEast().toArray(),
        bbox.getSouthEast().toArray(),
        bbox.getSouthWest().toArray()
      ];

      if (!map.getSource(IMAGE_SOURCE_ID)) {
        map.addSource(IMAGE_SOURCE_ID, { type: "image", coordinates });
        map.addLayer(
          {
            id: IMAGE_LAYER_ID,
            type: "raster",
            source: IMAGE_SOURCE_ID,
            paint: {
              "raster-opacity": 1,
              "raster-fade-duration": 0,
              "raster-layer-blend": "multiply"
            }
          },
          map.getLayer(WindUtil.LAYER_ID) ? WindUtil.LAYER_ID : CIRCLE_LAYER_ID
        );
      }
      const source = map.getSource(IMAGE_SOURCE_ID);
      if (!(source instanceof ImageSource)) return;
      source.setCoordinates(coordinates);
      source.updateImage({ image: overlay });
    };
    image.onerror = () => {
      if (!stale) console.error(`Failed to fetch ${url}`);
    };
    image.src = url;
    return () => {
      stale = true;
    };
  }, [imageOverlayExtent, imageOverlayURLs, mapReady]);

  // Wind-direction indicators: a grid of black arrows across the bbox, each
  // sampled from the `windDirection` overlay image. Present only for domains
  // that have such an overlay (wind/gust); recomputed when the data changes or
  // the zoom changes (the grid density scales with zoom).
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    const windOverlay = dataOverlays.find(o => o.type === "windDirection");

    let stale = false;
    let generation = 0;

    const setData = (data: GeoJSON.FeatureCollection<GeoJSON.Point>) => {
      const source = map.getSource(WindUtil.SOURCE_ID);
      if (source instanceof GeoJSONSource) source.setData(data);
    };

    const recompute = async () => {
      const gen = ++generation;
      if (!windOverlay) {
        setData(EMPTY_FC);
        return;
      }

      // Sample direction at each interior grid point.
      const bbox = await windOverlay.bounds.catch(() => null);
      if (!bbox || stale || gen !== generation) return;
      const west = bbox.getWest();
      const east = bbox.getEast();
      const south = bbox.getSouth();
      const north = bbox.getNorth();
      // Grid density scales with zoom, in cells across the bbox.
      const grids = Math.max(16, Math.round((map.getZoom() - 7) * 32));
      const distH = (east - west) / grids;
      const distV = (north - south) / grids;

      const features: GeoJSON.Feature<GeoJSON.Point>[] = [];
      for (let lng = west + distH; lng < east - 0.001; lng += distH) {
        for (let lat = south + distV; lat < north - 0.001; lat += distV) {
          const direction = await windOverlay.valueForPixel({ lng, lat });
          if (direction == null) continue;
          features.push({
            type: "Feature",
            geometry: { type: "Point", coordinates: [lng, lat] },
            properties: { direction }
          });
        }
      }

      // A newer run (zoom change) or unmount superseded this one.
      if (stale || gen !== generation) return;

      if (!map.getSource(WindUtil.SOURCE_ID)) {
        WindUtil.ensureArrowImage(map);
        map.addSource(WindUtil.SOURCE_ID, { type: "geojson", data: EMPTY_FC });
        map.addLayer(
          {
            id: WindUtil.LAYER_ID,
            type: "symbol",
            source: WindUtil.SOURCE_ID,
            layout: {
              "icon-image": WindUtil.ARROW_IMAGE,
              "icon-rotate": ["+", ["get", "direction"], 180],
              "icon-allow-overlap": true,
              "icon-ignore-placement": true
            }
          },
          CIRCLE_LAYER_ID
        );
      }
      setData({ type: "FeatureCollection", features });
    };

    void recompute();
    const onZoomEnd = debounce(() => void recompute(), 500);
    map.on("zoomend", onZoomEnd);

    return () => {
      stale = true;
      map.off("zoomend", onZoomEnd);
    };
  }, [dataOverlays, mapReady]);

  // Click-to-read: clicking the map (off the station markers) drops a marker
  // showing the overlay value sampled at that point, like the old DataOverlay.
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    const onClick = async (e: MapMouseEvent) => {
      // Station markers own their own click (selection); don't shadow them.
      if (
        map.queryRenderedFeatures(e.point, { layers: [CIRCLE_LAYER_ID] }).length
      )
        return;

      const gen = ++clickGenRef.current;
      const bounds = await store.dataOverlays
        .get()[0]
        ?.bounds.catch(() => null);
      if (gen !== clickGenRef.current || !bounds?.contains(e.lngLat)) return;

      const value = await readOverlayValue(e.lngLat);
      if (gen !== clickGenRef.current || !mapRef.current) return;

      const dc = store.domainConfig.get();
      if (!dc) return;
      const element = createDataMarkerElement(value, dc.thresholds);
      dataMarkerRef.current?.remove();
      dataMarkerRef.current = new Marker({
        element,
        anchor: "center"
      })
        .setLngLat(e.lngLat)
        .addTo(map);
    };

    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
      dataMarkerRef.current?.remove();
      dataMarkerRef.current = null;
    };
  }, [mapReady]);

  // New data (time/domain change) invalidates the clicked readout.
  useEffect(() => {
    dataMarkerRef.current?.remove();
    dataMarkerRef.current = null;
  }, [dataOverlays]);

  // MapLibreMap's marker coloring is shared with the (unrelated) real
  // stations feature, whose parameter data is already in this
  // numeric-cutpoints + RGB-record shape — so convert to it only here, at
  // this one remaining boundary. Memoized because MapLibreMap redraws its
  // markers whenever this changes identity.
  const markerItem: MarkerItem | null = useMemo(
    () =>
      domainConfig
        ? {
            colors: Object.fromEntries(
              domainConfig.thresholds.map((t, i) => [i + 1, hexToRgb(t.color)])
            ),
            thresholds: domainConfig.thresholds
              .slice(0, -1)
              .map(t => t.range[1] as number),
            direction: domainConfig.direction
          }
        : null,
    [domainConfig]
  );

  if (!domainConfig || !markerItem) return null;

  const itemId = domainConfig.dataId as ParameterType;
  const showStations = !!domainConfig.dataId && !isPlaying;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <MapLibreMap
        features={showStations ? stations : []}
        item={markerItem}
        itemId={itemId}
        pinDisplayModes={
          SHOW_PINS_BY_DEFAULT
            ? [PinDisplayMode.WithValue, PinDisplayMode.None]
            : [PinDisplayMode.None, PinDisplayMode.WithValue]
        }
        onMarkerSelected={id => onMarkerSelected(id)}
        onInit={map => {
          mapRef.current = map;
          // Restore the search/geolocate/scale controls the weather map lost
          // in the MapLibre migration (matching the bulletin map). The
          // NavigationControl and pins toggle are added by MapLibreMap itself.
          map.addControl(
            new GeonamesControl({
              ...config.map.geonames,
              lang: intl.locale.slice(0, 2),
              title: intl.formatMessage({ id: "bulletin:map:search" }),
              placeholder: intl.formatMessage({
                id: "bulletin:map:search:hover"
              }),
              noResults: intl.formatMessage({
                id: "bulletin:map:search:no-results"
              })
            }),
            "top-left"
          );
          map.addControl(
            new GeolocateControl({
              positionOptions: { enableHighAccuracy: true },
              trackUserLocation: false,
              showAccuracyCircle: true
            }),
            "top-left"
          );
          map.addControl(new ScaleControl({ unit: "metric" }), "bottom-left");
          setMapReady(true);
        }}
      />
    </div>
  );
};

export default WeatherMap;
