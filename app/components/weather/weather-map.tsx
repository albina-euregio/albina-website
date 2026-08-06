import React, { useEffect, useRef, useState } from "react";
import { debounce } from "es-toolkit";
import maplibregl from "maplibre-gl";
import MapLibreMap, {
  CIRCLE_LAYER_ID,
  PinDisplayMode,
  type MarkerItem
} from "../station/station-map-maplibre";
import { MAPLIBRE_STYLE } from "../maplibre/maplibre-style";
import * as store from "../../stores/weatherMapStore";
import { useStore } from "@nanostores/react";
import type { ParameterType } from "../station/station-parameter-data";

interface Props {
  isPlaying: boolean;
  onMarkerSelected: (id: string | null) => void;
}

const IMAGE_SOURCE_ID = "weather-overlay";
const IMAGE_LAYER_ID = "weather-overlay";

// Empty, transparent style: no basemap, no sources. `glyphs` is kept so the
// stations map (which reuses this) can still render its numeric labels.
const TRANSPARENT_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: MAPLIBRE_STYLE.glyphs,
  sources: {},
  layers: []
};

const fill = { position: "absolute", inset: 0 } as const;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class WindUtil {
  static readonly SOURCE_ID = "weather-wind-direction";
  static readonly LAYER_ID = "weather-wind-direction";
  static readonly ARROW_IMAGE = "weather-wind-arrow";
  // Grid density scales with zoom from this base (the historical weather-map
  // minZoom): `max(4, round((zoom - base) * 8))` cells across the bbox.
  static readonly GRID_ZOOM_BASE = 7;
  // Small black arrow (9×12 box), the same `directionArrow-centered` shape the
  // Leaflet grid markers drew. Points up; rotated by `direction + 180`.
  static readonly ARROW_PATH =
    "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0 9 4.5z";
  static readonly ARROW_WIDTH = 9;
  static readonly ARROW_HEIGHT = 12;

  /** Register the small black wind-direction arrow image once (no-op on SSR). */
  static ensureArrowImage(map: maplibregl.Map): void {
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
async function readOverlayValue(
  lngLat: maplibregl.LngLatLike
): Promise<number | null> {
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

/** Parse a "#rrggbb" hex color into an [r, g, b] triple. */
function hexToRgb(hex: string): [number, number, number] {
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
  item: MarkerItem
): HTMLDivElement {
  let fillColor = "#fff";
  let textColor = "#000";
  if (value != null) {
    const colors = Object.values(item.colors);
    let color = colors[0];
    item.thresholds.forEach((threshold, i) => {
      if (value > threshold) color = colors[i + 1];
    });
    // Colors are either an [r, g, b] triple or a "#rrggbb" hex string
    // (relative-snow uses hex); normalize both to numeric channels.
    const [r, g, b] =
      typeof color === "string" ? hexToRgb(color) : (color as number[]);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    fillColor = `rgb(${r}, ${g}, ${b})`;
    textColor = luminance > 0.435 ? "#000" : "#fff";
  }
  const el = document.createElement("div");
  el.style.pointerEvents = "none";
  el.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10.5" stroke="#000" stroke-width="1" stroke-dasharray="1.3675" fill="${fillColor}"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}">${value == null ? "-" : value}</text></svg>`;
  return el;
}

const WeatherMap = ({ isPlaying, onMarkerSelected }: Props) => {
  const timeSpan = useStore(store.timeSpan);
  const domainConfig = useStore(store.domainConfig);
  const stations = useStore(store.stations);
  const overlayURLs = useStore(store.overlayURLs);
  const dataOverlays = useStore(store.dataOverlays);

  // Top stations map (the interaction driver) and the two synced maps below it.
  const mapRef = useRef<maplibregl.Map | null>(null);
  const basemapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<maplibregl.Map | null>(null);
  const basemapContainerRef = useRef<HTMLDivElement | null>(null);
  const overlayContainerRef = useRef<HTMLDivElement | null>(null);
  // The transient "data marker" placed on click, and a token so a slow pixel
  // read from an older click can't overwrite a newer one.
  const dataMarkerRef = useRef<maplibregl.Marker | null>(null);
  const clickGenRef = useRef(0);
  const [mapReady, setMapReady] = useState(false);
  const [overlayReady, setOverlayReady] = useState(false);

  // Create the basemap + weather maps once the stations map exists, and keep
  // their cameras locked to it. They are non-interactive; the stations map on
  // top receives every gesture and we mirror it onto these two.
  useEffect(() => {
    const top = mapRef.current;
    const basemapContainer = basemapContainerRef.current;
    const overlayContainer = overlayContainerRef.current;
    if (!mapReady || !top || !basemapContainer || !overlayContainer) return;
    if (basemapRef.current) return;

    // Both maps are non-interactive and slaved to the top map. The map is
    // north-up and never tilts (dragRotate off), so center + zoom fully
    // describe the camera — no bearing/pitch to mirror.
    const shared = {
      center: top.getCenter(),
      zoom: top.getZoom(),
      interactive: false
    } as const;
    // The basemap keeps its own attribution control (bottom-right); the
    // transparent overlay and the stations map on top suppress theirs.
    const basemap = new maplibregl.Map({
      ...shared,
      container: basemapContainer,
      style: MAPLIBRE_STYLE
    });
    const overlay = new maplibregl.Map({
      ...shared,
      container: overlayContainer,
      style: TRANSPARENT_STYLE,
      attributionControl: false
    });
    basemapRef.current = basemap;
    overlayRef.current = overlay;
    overlay.on("load", () => setOverlayReady(true));

    const synced = [basemap, overlay];
    const sync = () =>
      synced.forEach(m =>
        m.jumpTo({ center: top.getCenter(), zoom: top.getZoom() })
      );
    const onResize = () => {
      synced.forEach(m => m.resize());
      sync();
    };
    top.on("move", sync);
    top.on("resize", onResize);

    return () => {
      top.off("move", sync);
      top.off("resize", onResize);
      synced.forEach(m => m.remove());
      basemapRef.current = null;
      overlayRef.current = null;
      setOverlayReady(false);
    };
  }, [mapReady]);

  // Keep the weather raster overlay (on the middle map) in sync with the
  // selected time/domain. It multiplies against the basemap below it; the
  // station markers live on the separate map above, so they stay unaffected.
  useEffect(() => {
    const map = overlayRef.current;
    const [url] = overlayURLs;
    if (!overlayReady || !map || !url) return;

    // MapLibre image sources want the four corners as `[lng, lat]` in
    // TL, TR, BR, BL (i.e. NW, NE, SE, SW) order.
    const bbox = store.config.settings.bbox;
    const coordinates: maplibregl.ImageSourceSpecification["coordinates"] = [
      bbox.getNorthWest().toArray(),
      bbox.getNorthEast().toArray(),
      bbox.getSouthEast().toArray(),
      bbox.getSouthWest().toArray()
    ];

    const source = map.getSource(IMAGE_SOURCE_ID);
    if (source instanceof maplibregl.ImageSource) {
      source.updateImage({ url, coordinates });
    } else {
      map.addSource(IMAGE_SOURCE_ID, { type: "image", url, coordinates });
      map.addLayer({
        id: IMAGE_LAYER_ID,
        type: "raster",
        source: IMAGE_SOURCE_ID,
        paint: { "raster-opacity": 1, "raster-fade-duration": 0 }
      });
    }
  }, [overlayURLs, overlayReady]);

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
      if (source instanceof maplibregl.GeoJSONSource) source.setData(data);
    };

    const recompute = async () => {
      const gen = ++generation;
      if (!windOverlay) {
        setData(EMPTY_FC);
        return;
      }

      // Sample direction at each interior grid point.
      const bbox = store.config.settings.bbox;
      const west = bbox.getWest();
      const east = bbox.getEast();
      const south = bbox.getSouth();
      const north = bbox.getNorth();
      const grids = Math.max(
        4,
        Math.round((map.getZoom() - WindUtil.GRID_ZOOM_BASE) * 8)
      );
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

    const onClick = async (e: maplibregl.MapMouseEvent) => {
      // Station markers own their own click (selection); don't shadow them.
      if (
        map.queryRenderedFeatures(e.point, { layers: [CIRCLE_LAYER_ID] }).length
      )
        return;

      if (!store.config.settings.bbox.contains(e.lngLat)) return;

      const gen = ++clickGenRef.current;
      const value = await readOverlayValue(e.lngLat);
      if (gen !== clickGenRef.current || !mapRef.current) return;

      const item = store.domainConfig.get() as unknown as MarkerItem;
      const element = createDataMarkerElement(value, item);
      dataMarkerRef.current?.remove();
      dataMarkerRef.current = new maplibregl.Marker({
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

  if (!domainConfig) return null;

  const itemId = domainConfig.timeSpanToDataId[timeSpan] as ParameterType;
  const showStations = domainConfig.layer.stations && !isPlaying;

  // Three stacked maps so the weather raster can multiply against the basemap
  // while the station markers (and wind arrows) stay crisp on top:
  //  - bottom (z0): basemap only, non-interactive;
  //  - middle (z1): the weather image, `mix-blend-mode: multiply`;
  //  - top (z2): the stations map (transparent style) owning all interaction.
  // `isolation: isolate` scopes the blend to these layers.
  return (
    <div style={{ ...fill, isolation: "isolate" }}>
      <div ref={basemapContainerRef} style={{ ...fill, zIndex: 0 }} />
      <div
        ref={overlayContainerRef}
        style={{ ...fill, zIndex: 1, mixBlendMode: "multiply" }}
      />
      <div style={{ ...fill, zIndex: 2 }}>
        <MapLibreMap
          features={showStations ? stations : []}
          item={domainConfig as unknown as MarkerItem}
          itemId={itemId}
          pinDisplayModes={
            SHOW_PINS_BY_DEFAULT
              ? [PinDisplayMode.WithValue, PinDisplayMode.None]
              : [PinDisplayMode.None, PinDisplayMode.WithValue]
          }
          onMarkerSelected={id => onMarkerSelected(id)}
          mapOptions={{ style: TRANSPARENT_STYLE, attributionControl: false }}
          onInit={map => {
            mapRef.current = map;
            setMapReady(true);
          }}
        />
      </div>
    </div>
  );
};

export default WeatherMap;
