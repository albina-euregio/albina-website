import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useStore } from "@nanostores/react";
import type { Feature } from "@albina-euregio/linea/listing";
import { useIntl } from "../../i18n";
import type { ParameterType } from "../station/station-parameter-data";
import { $focusRegions } from "../../appStore.ts";
import { eawsRegionsBounds } from "../../stores/eawsRegions.ts";
import { MAPLIBRE_STYLE } from "./maplibre-style";

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
 * fit in the 0-255 range. The wind arrow is a plain RGBA image baked at runtime
 * per wind-speed color (fill + black border), one image per color.
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
const LABEL_LAYER_ID = "stations-labels";
// Self-hosted glyphs (see public/fonts/). LABEL_FONT must match the folder name.
const LABEL_FONT = ["Noto Sans Regular"];

/**
 * Pick the marker fill style for `value` by walking the parameter's thresholds:
 * the color for the highest threshold the value exceeds (else the first color).
 * A missing value gets the gray no-value fill. Same threshold→color logic as
 * the old station overlay.
 *
 * The returned `color` is the CSS fill and `textColor` the contrasting label
 * color: black on light fills, white on dark fills (per relative luminance).
 */
function fillStyleForValue(
  value: number | undefined,
  item: MarkerItem
): { color: string; textColor: string } {
  let rgb: RGB = [200, 200, 200];
  if (value !== undefined) {
    const colors = Object.values(item.colors);
    rgb = colors[0];
    item.thresholds.forEach((threshold, i) => {
      if (value > threshold) rgb = colors[i + 1];
    });
  }
  const [r, g, b] = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return {
    color: `rgb(${r}, ${g}, ${b})`,
    textColor: luminance > 0.435 ? "#000" : "#fff"
  };
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

/** Wind-specific helpers: speed threshold, direction, and arrow images/layer. */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class WindUtil {
  /** MapLibre layer id for the wind direction arrows. */
  static readonly LAYER_ID = "stations-wind";

  /** Minimum wind speed at which a direction arrow is drawn. */
  static readonly MIN_SPEED = 3.5;

  /** Wind arrow path, drawn in a 28×28 box (see imageName/ensureImages). */
  static readonly ARROW_PATH =
    "M13 1 L26 10 Q26 11 25 11 L20 11 L20 27 Q20 28 19 28 L7 28 Q6 28 6 27 L6 11 L1 11 Q0 11 0 10 L13 1 Z";

  /** Image id for a wind arrow of the given fill color. */
  static imageName(color: string): string {
    return `wind-arrow-${color}`;
  }

  /**
   * Wind direction (degrees) to draw for a station, or undefined when no arrow
   * applies: observers, non-wind parameters, missing/too-low speed, or no DW.
   */
  static direction(
    feature: Feature,
    speed: number | undefined,
    markerItem: MarkerItem
  ): number | undefined {
    if (
      markerItem.direction !== "DW" ||
      speed === undefined ||
      speed < WindUtil.MIN_SPEED
    ) {
      return undefined;
    }
    return getParamValue(feature, "DW" as ParameterType);
  }

  /**
   * The wind-related GeoJSON properties for a marker of the given fill `color`:
   * whether it draws a wind arrow, its image id, and the rotation. `icon` is
   * null and `direction` 0 when no arrow applies.
   */
  static properties(
    feature: Feature,
    speed: number | undefined,
    markerItem: MarkerItem
  ): { isWind: boolean; icon: string | null; direction: number } {
    const { color } = fillStyleForValue(speed, markerItem);
    const direction = WindUtil.direction(feature, speed, markerItem);
    const isWind = direction !== undefined;
    return {
      isWind,
      icon: isWind ? WindUtil.imageName(color) : null,
      direction: direction ?? 0
    };
  }

  /**
   * Wind direction arrows layer (VW/VW_MAX); the per-color image carries the
   * fill and the black border (see ensureImages). Rotated by direction (+180°
   * so the arrow points downwind). Always placed; collisions ignored.
   */
  static addLayer(map: maplibregl.Map, source: string) {
    map.addLayer({
      id: WindUtil.LAYER_ID,
      type: "symbol",
      source,
      filter: ["get", "isWind"],
      layout: {
        "icon-image": ["get", "icon"],
        "icon-rotate": ["+", ["get", "direction"], 180],
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "symbol-sort-key": ["get", "sortKey"]
      }
    });
  }

  /**
   * Register a wind arrow image for every wind-speed color present in the data.
   * Each image bakes the wind arrow path as the given fill color with a black
   * border (a plain image, not an SDF, so it can carry both the fill and the
   * border). Padding leaves room for the stroke. No-ops when no canvas is
   * available (e.g. SSR / tests).
   */
  static ensureImages(
    map: maplibregl.Map,
    data: GeoJSON.FeatureCollection<GeoJSON.Point>
  ) {
    if (typeof document === "undefined") return;
    const pixelRatio = 2;
    const pad = 1;
    const logical = 28 + pad * 2;
    const size = logical * pixelRatio;
    for (const feature of data.features) {
      const props = feature.properties;
      if (!props?.isWind || typeof props.icon !== "string") continue;
      if (map.hasImage(props.icon)) continue;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      ctx.scale(pixelRatio, pixelRatio);
      ctx.translate(pad, pad);
      const path = new Path2D(WindUtil.ARROW_PATH);
      ctx.fillStyle = props.color;
      ctx.fill(path);
      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#000";
      ctx.stroke(path);
      map.addImage(props.icon, ctx.getImageData(0, 0, size, size), {
        pixelRatio
      });
    }
  }
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

  // Stations: colored by the selected parameter, with a wind arrow once the
  // wind speed is meaningful.
  for (const feature of features) {
    const value = getParamValue(feature, itemId);
    const hasValue = value !== undefined;
    if (!hasValue && !showMarkersWithoutValue) continue;

    // Fill: parameter color by threshold, else gray for a missing value.
    const { color, textColor } = fillStyleForValue(value, item);
    out.push({
      ...feature,
      properties: {
        id: String(feature.id),
        name: feature.properties.name,
        altitude: feature.geometry?.coordinates?.[2],
        color,
        textColor,
        value: hasValue ? formatNumber(value) : "",
        ...WindUtil.properties(feature, value, item),
        // Markers with values stack above markers without, ordered by value.
        sortKey: hasValue ? Math.round(Math.abs(value)) : -1
      }
    });
  }

  // Observers: fixed gray pins, no value and never a wind arrow. They only
  // carry a no-value marker, so they appear only when those are shown.
  for (const feature of observers && showMarkersWithoutValue ? observers : []) {
    out.push({
      ...feature,
      properties: {
        id: String(feature.id),
        name: feature.properties.name,
        altitude: feature.geometry?.coordinates?.[2],
        color: "rgb(100, 100, 100)",
        textColor: null,
        value: "",
        isWind: false,
        sortKey: -1
      }
    });
  }

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
      style: MAPLIBRE_STYLE,
      bounds: [
        [bounds.getWest(), bounds.getSouth()],
        [bounds.getEast(), bounds.getNorth()]
      ]
    });

    tooltipRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
      className: "maplibre-station-tooltip"
    });

    map.on("load", () => {
      // Wind arrow images (one per wind-speed color) for the current data.
      WindUtil.ensureImages(map, dataRef.current);

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

      WindUtil.addLayer(map, SOURCE_ID);

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
      const markerLayers = [CIRCLE_LAYER_ID, WindUtil.LAYER_ID];
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

    const map = mapRef.current;
    const source = map?.getSource(SOURCE_ID);
    if (map && source instanceof maplibregl.GeoJSONSource) {
      WindUtil.ensureImages(map, data);
      source.setData(data);
    }
  }, [features, observers, item, itemId, showMarkersWithoutValue, intl]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

export default MapLibreMap;
