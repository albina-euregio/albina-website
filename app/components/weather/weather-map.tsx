import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import MapLibreMap, {
  CIRCLE_LAYER_ID,
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

/** A loaded data overlay image that can be sampled by normalized pixel. */
interface DataOverlay {
  type: store.OverlayType;
  valueForPixel(coords: { x: number; y: number }): Promise<number | null>;
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

// Basemap attribution, surfaced on the (topmost, interactive) stations map
// because the basemap itself lives on the bottom, non-interactive map whose
// own attribution control would be covered and unclickable.
const BASEMAP_ATTRIBUTION = Object.values(MAPLIBRE_STYLE.sources)
  .map(source => ("attribution" in source ? source.attribution : undefined))
  .filter((a): a is string => typeof a === "string");

const fill = { position: "absolute", inset: 0 } as const;

const WIND_SOURCE_ID = "weather-wind-direction";
const WIND_LAYER_ID = "weather-wind-direction";
const WIND_ARROW_IMAGE = "weather-wind-arrow";
// Grid density scales with zoom from this base (the historical weather-map
// minZoom): `max(4, round((zoom - base) * 8))` cells across the bbox.
const WIND_GRID_ZOOM_BASE = 7;
// Small black arrow (9×12 box), the same `directionArrow-centered` shape the
// Leaflet grid markers drew. Points up; rotated by `direction + 180`.
const WIND_ARROW_PATH =
  "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0 9 4.5z";
const WIND_ARROW_WIDTH = 9;
const WIND_ARROW_HEIGHT = 12;

const EMPTY_FC: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: "FeatureCollection",
  features: []
};

/** Debounce, leading-edge cancelled — recompute at most once per `wait` ms. */
function debounce(func: () => void, wait: number): () => void {
  let timeout: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

/** Register the small black wind-direction arrow image once (no-op on SSR). */
function ensureWindArrowImage(map: maplibregl.Map): void {
  if (typeof document === "undefined" || map.hasImage(WIND_ARROW_IMAGE)) return;
  const pixelRatio = 2;
  const pad = 1;
  const width = (WIND_ARROW_WIDTH + pad * 2) * pixelRatio;
  const height = (WIND_ARROW_HEIGHT + pad * 2) * pixelRatio;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(pixelRatio, pixelRatio);
  ctx.translate(pad, pad);
  const path = new Path2D(WIND_ARROW_PATH);
  ctx.fillStyle = "#000";
  ctx.fill(path, "evenodd");
  ctx.lineWidth = 0.6;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  ctx.stroke(path);
  map.addImage(WIND_ARROW_IMAGE, ctx.getImageData(0, 0, width, height), {
    pixelRatio
  });
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
      interactive: false,
      attributionControl: false
    } as const;
    const basemap = new maplibregl.Map({
      ...shared,
      container: basemapContainer,
      style: MAPLIBRE_STYLE
    });
    const overlay = new maplibregl.Map({
      ...shared,
      container: overlayContainer,
      style: TRANSPARENT_STYLE
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

    // The bbox is `[[south, west], [north, east]]` (lat, lng); MapLibre image
    // sources want the four corners as `[lng, lat]` in TL, TR, BR, BL order.
    const [[south, west], [north, east]] = store.config.settings.bbox;
    const coordinates: maplibregl.ImageSourceSpecification["coordinates"] = [
      [west, north],
      [east, north],
      [east, south],
      [west, south]
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
    const windOverlay = (dataOverlays as DataOverlay[]).find(
      o => o.type === "windDirection"
    );

    let stale = false;
    let generation = 0;

    const setData = (data: GeoJSON.FeatureCollection<GeoJSON.Point>) => {
      const source = map.getSource(WIND_SOURCE_ID);
      if (source instanceof maplibregl.GeoJSONSource) source.setData(data);
    };

    const recompute = async () => {
      const gen = ++generation;
      if (!windOverlay) {
        setData(EMPTY_FC);
        return;
      }

      // Sample direction at each interior grid point. The fraction within the
      // image is taken in Web Mercator (linear in lng, non-linear in lat), so
      // the y axis must go through MercatorCoordinate, not raw latitude.
      const [[south, west], [north, east]] = store.config.settings.bbox;
      const grids = Math.max(
        4,
        Math.round((map.getZoom() - WIND_GRID_ZOOM_BASE) * 8)
      );
      const distH = (east - west) / grids;
      const distV = (north - south) / grids;
      const sw = maplibregl.MercatorCoordinate.fromLngLat({
        lng: west,
        lat: south
      });
      const ne = maplibregl.MercatorCoordinate.fromLngLat({
        lng: east,
        lat: north
      });

      const features: GeoJSON.Feature<GeoJSON.Point>[] = [];
      for (let lng = west + distH; lng < east - 0.001; lng += distH) {
        for (let lat = south + distV; lat < north - 0.001; lat += distV) {
          const p = maplibregl.MercatorCoordinate.fromLngLat({ lng, lat });
          const direction = await windOverlay.valueForPixel({
            x: (p.x - sw.x) / (ne.x - sw.x),
            y: (p.y - ne.y) / (sw.y - ne.y)
          });
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

      if (!map.getSource(WIND_SOURCE_ID)) {
        ensureWindArrowImage(map);
        map.addSource(WIND_SOURCE_ID, { type: "geojson", data: EMPTY_FC });
        map.addLayer(
          {
            id: WIND_LAYER_ID,
            type: "symbol",
            source: WIND_SOURCE_ID,
            layout: {
              "icon-image": WIND_ARROW_IMAGE,
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

  if (!domainConfig) return null;

  const itemId = domainConfig.timeSpanToDataId[timeSpan] as ParameterType;
  // TODO: migrate showHideStationsCtrl here.
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
          showMarkersWithoutValue={false}
          onMarkerSelected={id => onMarkerSelected(id)}
          mapOptions={{ style: TRANSPARENT_STYLE, attributionControl: false }}
          onInit={map => {
            mapRef.current = map;
            map.addControl(
              new maplibregl.AttributionControl({
                customAttribution: BASEMAP_ATTRIBUTION
              }),
              "bottom-right"
            );
            setMapReady(true);
          }}
        />
      </div>
    </div>
  );
};

export default WeatherMap;
