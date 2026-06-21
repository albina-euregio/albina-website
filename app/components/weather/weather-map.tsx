import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import MapLibreMap, {
  CIRCLE_LAYER_ID,
  type MarkerItem
} from "../station/station-map-maplibre";
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

  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Keep the weather raster overlay in sync with the selected time/domain. The
  // image lives beneath the station markers (inserted before CIRCLE_LAYER_ID).
  useEffect(() => {
    const map = mapRef.current;
    const [url] = overlayURLs;
    if (!mapReady || !map || !url) return;

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
      map.addLayer(
        {
          id: IMAGE_LAYER_ID,
          type: "raster",
          source: IMAGE_SOURCE_ID,
          paint: { "raster-opacity": 1, "raster-fade-duration": 0 }
        },
        CIRCLE_LAYER_ID
      );
    }
  }, [overlayURLs, mapReady]);

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
  // TODO: migrate GridOverlay + showHideStationsCtrl here.
  const showStations = domainConfig.layer.stations && !isPlaying;

  return (
    <MapLibreMap
      features={showStations ? stations : []}
      item={domainConfig as unknown as MarkerItem}
      itemId={itemId}
      showMarkersWithoutValue={false}
      onMarkerSelected={id => onMarkerSelected(id)}
      onInit={map => {
        mapRef.current = map;
        setMapReady(true);
      }}
    />
  );
};

export default WeatherMap;
