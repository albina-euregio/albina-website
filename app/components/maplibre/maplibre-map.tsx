import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useStore } from "@nanostores/react";
import type { Feature } from "@albina-euregio/linea/listing";
import { useIntl } from "../../i18n";
import type { ParameterType } from "../station/station-parameter-data";
import { $focusRegions } from "../../appStore.ts";
import { eawsRegionsBounds } from "../../stores/eawsRegions.ts";

/**
 * Station dashboard map (MapLibre GL).
 *
 * Stations/observers are rendered with native vector layers fed by a single
 * GeoJSON source:
 *  - a `circle` layer for the colored marker discs,
 *  - a `symbol` layer for the numeric value (text),
 *  - a `symbol` layer for the wind direction arrow (VW/VW_MAX).
 *
 * Per-feature appearance (color, value text, contrast color, wind direction,
 * stacking key) is precomputed into the GeoJSON `properties` and consumed by
 * data-driven style expressions, so updating the data is just `setData`.
 *
 * Text needs a `glyphs` endpoint; we self-host a single font range under
 * public/fonts/ (see public/fonts/README.md) — labels are only digits, which
 * fit in the 0-255 range. The wind arrow is an SDF image added at runtime so it
 * can be tinted per wind-speed color.
 *
 * Stacking: the whole map is its own stacking context
 * (`.section-map { z-index: 0 }` in _map.scss) so the canvas and the hover
 * tooltip cannot overlay the fixed filter bar.
 */

type RGB = [number, number, number];

export interface MarkerItem {
  /** Threshold-indexed colors, 1-based (matches AVAILABLE_PARAMETERS). */
  colors: Record<number, RGB>;
  thresholds: number[];
  unit?: string;
  direction?: "DW" | false;
}

interface Props {
  /** Stations, colored by the selected parameter value. */
  features: Feature[];
  /** Observers, rendered as fixed gray pins without a value. */
  observers?: Feature[];
  item: MarkerItem;
  itemId: ParameterType;
  /** Show markers that have no value for the selected parameter. */
  showMarkersWithoutValue?: boolean;
  onMarkerSelected: (id: string) => void;
  onInit?: (map: maplibregl.Map) => void;
}

const SOURCE_ID = "stations";
const CIRCLE_LAYER_ID = "stations-circles";
const WIND_LAYER_ID = "stations-wind";
const LABEL_LAYER_ID = "stations-labels";
const WIND_ARROW_IMAGE = "wind-arrow";
// Self-hosted glyphs (see public/fonts/). LABEL_FONT must match the folder name.
const GLYPHS_URL = `${import.meta.env.BASE_URL}fonts/{fontstack}/{range}.pbf`;
const LABEL_FONT = ["Noto Sans Regular"];

const NO_VALUE_COLOR: RGB = [200, 200, 200];
const OBSERVER_ITEM: MarkerItem = {
  colors: { 1: [100, 100, 100] },
  thresholds: []
};

const WIND_ARROW_PATH =
  "M13 1 L26 10 Q26 11 25 11 L20 11 L20 27 Q20 28 19 28 L7 28 Q6 28 6 27 L6 11 L1 11 Q0 11 0 10 L13 1 Z";

/**
 * Pick the marker fill for `value` by walking the parameter's thresholds:
 * the color for the highest threshold the value exceeds (else the first color).
 * Same threshold→color logic as the old station overlay.
 */
function getColor(value: number, item: MarkerItem): RGB {
  const colors = Object.values(item.colors);
  let color = colors[0];
  item.thresholds.forEach((threshold, i) => {
    if (value > threshold) color = colors[i + 1];
  });
  return color;
}

/** Black on light fills, white on dark fills (per relative luminance). */
function getContrastTextColor([r, g, b]: RGB): string {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.435 ? "#000" : "#fff";
}

/**
 * Read a parameter value off a feature, e.g. `feature.HS` — a `StationData`
 * getter. Returns undefined when the value is missing or not a finite number.
 */
function getParamValue(
  feature: Feature,
  itemId: ParameterType
): number | undefined {
  const raw = (feature as unknown as Record<string, unknown>)[itemId];
  const num = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(num) ? num : undefined;
}

/**
 * Render the wind arrow path to an SDF-able alpha image (white shape on
 * transparent) so the symbol layer can tint it per wind-speed via `icon-color`.
 * Returns null when no canvas is available (e.g. SSR / tests).
 */
function createWindArrowImage(): {
  image: ImageData;
  pixelRatio: number;
} | null {
  if (typeof document === "undefined") return null;
  const pixelRatio = 2;
  const size = 28 * pixelRatio;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.scale(pixelRatio, pixelRatio);
  ctx.fillStyle = "#fff";
  ctx.fill(new Path2D(WIND_ARROW_PATH));
  return { image: ctx.getImageData(0, 0, size, size), pixelRatio };
}

/**
 * Convert stations + observers into a GeoJSON FeatureCollection whose
 * properties drive the style: `color`, `value` (text), `textColor`, `isWind`,
 * `direction`, `sortKey` (value-based stacking order).
 */
function toFeatureCollection(
  features: Feature[],
  observers: Feature[] | undefined,
  item: MarkerItem,
  itemId: ParameterType,
  showMarkersWithoutValue: boolean,
  formatNumber: (value: number) => string
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  const out: GeoJSON.Feature<GeoJSON.Point>[] = [];

  const add = (
    list: Feature[],
    markerItem: MarkerItem,
    isObserver: boolean
  ) => {
    for (const feature of list) {
      const [lng, lat] = feature.geometry?.coordinates ?? [];
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;

      // Observers never carry a value; stations read the selected parameter.
      const value = isObserver ? undefined : getParamValue(feature, itemId);
      const hasValue = value !== undefined;
      if (!hasValue && !showMarkersWithoutValue) continue;

      // Fill: parameter color by threshold, else gray (observer vs. no-value).
      const fill = hasValue
        ? getColor(value, markerItem)
        : isObserver
          ? Object.values(markerItem.colors)[0]
          : NO_VALUE_COLOR;

      // Wind parameters draw a direction arrow once the speed is meaningful.
      let isWind = false;
      let direction = 0;
      if (
        !isObserver &&
        markerItem.direction === "DW" &&
        value !== undefined &&
        value >= 3.5
      ) {
        const dw = getParamValue(feature, "DW" as ParameterType);
        if (dw !== undefined) {
          isWind = true;
          direction = dw;
        }
      }

      const altitude = feature.geometry?.coordinates?.[2];
      out.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [lng, lat] },
        properties: {
          id: String(feature.id),
          name: feature.properties.name,
          altitude: typeof altitude === "number" ? altitude : null,
          color: `rgb(${fill[0]}, ${fill[1]}, ${fill[2]})`,
          textColor: getContrastTextColor(fill),
          value: hasValue ? formatNumber(value) : "",
          isWind,
          direction,
          // Markers with values stack above markers without, ordered by value.
          sortKey: hasValue ? Math.round(Math.abs(value)) : -1
        }
      });
    }
  };

  add(features, item, false);
  if (observers) add(observers, OBSERVER_ITEM, true);

  return { type: "FeatureCollection", features: out };
}

/**
 * Renders the basemap plus a vector overlay of stations (`features`) and
 * observers (`observers`). Stations are colored by the selected parameter
 * (`item` / `itemId`); observers are fixed gray pins. See the file header.
 */
function MapLibreMap({
  features,
  observers,
  item,
  itemId,
  showMarkersWithoutValue = true,
  onMarkerSelected,
  onInit
}: Props) {
  const intl = useIntl();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const tooltipRef = useRef<maplibregl.Popup | null>(null);
  // Latest GeoJSON, so the load handler can seed the source even if the data
  // changes before the style finishes loading.
  const dataRef = useRef<GeoJSON.FeatureCollection<GeoJSON.Point>>({
    type: "FeatureCollection",
    features: []
  });
  // Held in a ref so the layer click handler always calls the latest callback.
  const onMarkerSelectedRef = useRef(onMarkerSelected);
  const focusRegions = useStore($focusRegions);

  useEffect(() => {
    onMarkerSelectedRef.current = onMarkerSelected;
  }, [onMarkerSelected]);

  // Initialize the map once: basemap, source + layers, the hover tooltip and a
  // ResizeObserver. The data itself is kept in sync by the effect below.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const bounds = eawsRegionsBounds(focusRegions).pad(0.1);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        glyphs: GLYPHS_URL,
        sources: {
          basemap: {
            type: "raster",
            tiles: [config.map.tileLayer.url],
            tileSize: 256,
            minzoom: config.map.tileLayer.minZoom,
            maxzoom: config.map.tileLayer.maxZoom,
            attribution: config.map.attribution
          }
        },
        layers: [{ id: "basemap", type: "raster", source: "basemap" }]
      },
      bounds: [
        [bounds.getWest(), bounds.getSouth()],
        [bounds.getEast(), bounds.getNorth()]
      ],
      attributionControl: false
    });

    tooltipRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
      className: "maplibre-station-tooltip"
    });

    map.on("load", () => {
      // SDF arrow image, tinted per feature via icon-color.
      const arrow = createWindArrowImage();
      if (arrow && !map.hasImage(WIND_ARROW_IMAGE)) {
        map.addImage(WIND_ARROW_IMAGE, arrow.image, {
          sdf: true,
          pixelRatio: arrow.pixelRatio
        });
      }

      map.addSource(SOURCE_ID, { type: "geojson", data: dataRef.current });

      // Colored marker discs (everything except wind arrows).
      map.addLayer({
        id: CIRCLE_LAYER_ID,
        type: "circle",
        source: SOURCE_ID,
        filter: ["!", ["get", "isWind"]],
        paint: {
          "circle-radius": 11,
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#000",
          "circle-stroke-width": 1
        },
        layout: { "circle-sort-key": ["get", "sortKey"] }
      });

      // Wind direction arrows (VW/VW_MAX), tinted by wind-speed color.
      map.addLayer({
        id: WIND_LAYER_ID,
        type: "symbol",
        source: SOURCE_ID,
        filter: ["get", "isWind"],
        layout: {
          "icon-image": WIND_ARROW_IMAGE,
          "icon-rotate": ["+", ["get", "direction"], 180],
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "symbol-sort-key": ["get", "sortKey"]
        },
        paint: { "icon-color": ["get", "color"] }
      });

      // Numeric value, drawn on top of discs and arrows. Collision detection
      // (the default, i.e. no allow-overlap) hides labels that would overlap;
      // a lower sort key is placed first and wins, so higher values stay.
      map.addLayer({
        id: LABEL_LAYER_ID,
        type: "symbol",
        source: SOURCE_ID,
        layout: {
          "text-field": ["get", "value"],
          "text-font": LABEL_FONT,
          "text-size": 11,
          "symbol-sort-key": ["-", 0, ["get", "sortKey"]]
        },
        paint: { "text-color": ["get", "textColor"] }
      });

      // Click selects the station; hover shows the shared tooltip.
      const markerLayers = [CIRCLE_LAYER_ID, WIND_LAYER_ID];
      for (const layer of markerLayers) {
        map.on("click", layer, e => {
          const id = e.features?.[0]?.properties?.id;
          if (typeof id === "string") onMarkerSelectedRef.current(id);
        });
        map.on("mouseenter", layer, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layer, () => {
          map.getCanvas().style.cursor = "";
          tooltipRef.current?.remove();
        });
        map.on("mousemove", layer, e => {
          const feature = e.features?.[0];
          if (feature?.geometry.type !== "Point") return;
          const { name, altitude } = feature.properties ?? {};
          const text =
            typeof altitude === "number"
              ? `${name} (${altitude} m)`
              : `${name}`;
          tooltipRef.current
            ?.setLngLat(feature.geometry.coordinates as [number, number])
            .setText(text)
            .addTo(map);
        });
      }

      onInit?.(map);
    });

    mapRef.current = map;

    // MapLibre's trackResize only listens to window resize, so it misses
    // container size changes (e.g. the initial layout settling). Observe the
    // container and resize the map accordingly.
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => map.resize())
        : undefined;
    resizeObserver?.observe(containerRef.current);

    return () => {
      resizeObserver?.disconnect();
      tooltipRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recompute the GeoJSON whenever the data or the selected parameter changes
  // and push it to the source (or stash it for the load handler to seed).
  useEffect(() => {
    const data = toFeatureCollection(
      features,
      observers,
      item,
      itemId,
      showMarkersWithoutValue,
      value => intl.formatNumber(value)
    );
    dataRef.current = data;

    const source = mapRef.current?.getSource(SOURCE_ID);
    if (source instanceof maplibregl.GeoJSONSource) {
      source.setData(data);
    }
  }, [features, observers, item, itemId, showMarkersWithoutValue, intl]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

export default MapLibreMap;
