import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useStore } from "@nanostores/react";
import type { Feature } from "@albina-euregio/linea/listing";
import { useIntl } from "../../i18n";
import type { ParameterType } from "../station/station-parameter-data";
import { $focusRegions } from "../../appStore.ts";
import { eawsRegionsBounds } from "../../stores/eawsRegions.ts";

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

const NO_VALUE_COLOR: RGB = [200, 200, 200];
const OBSERVER_ITEM: MarkerItem = {
  colors: { 1: [100, 100, 100] },
  thresholds: []
};

const WIND_ARROW_PATH =
  "M13 1 L26 10 Q26 11 25 11 L20 11 L20 27 Q20 28 19 28 L7 28 Q6 28 6 27 L6 11 L1 11 Q0 11 0 10 L13 1 Z";

/**
 * Minimalistic MapLibre GL map for the station dashboard.
 *
 * Stations are rendered as DOM markers (so the numeric value can be drawn
 * without a glyph endpoint), colored by the selected parameter's thresholds.
 * Wind parameters (VW/VW_MAX) additionally show a direction arrow.
 */
function getColor(value: number, item: MarkerItem): RGB {
  const colors = Object.values(item.colors);
  let color = colors[0];
  item.thresholds.forEach((threshold, i) => {
    if (value > threshold) color = colors[i + 1];
  });
  return color;
}

function getContrastTextColor([r, g, b]: RGB): string {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.435 ? "#000" : "#fff";
}

function getParamValue(
  feature: Feature,
  itemId: ParameterType
): number | undefined {
  const raw = (feature as unknown as Record<string, unknown>)[itemId];
  const num = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(num) ? num : undefined;
}

function buildMarkerElement(
  fill: RGB,
  textColor: string,
  valueText: string,
  direction: number | false,
  zIndex: number
): HTMLElement {
  const el = document.createElement("div");
  el.className = "station-marker";
  el.style.cursor = "pointer";
  el.style.zIndex = String(zIndex);
  const rgb = `rgb(${fill[0]}, ${fill[1]}, ${fill[2]})`;

  if (typeof direction === "number") {
    el.style.position = "relative";
    el.style.width = "28px";
    el.style.height = "28px";
    el.innerHTML = `
      <svg style="position:absolute;top:0;left:0;transform:rotate(${direction + 180}deg)" width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
        <path d="${WIND_ARROW_PATH}" fill="${rgb}" stroke="#000" stroke-width="1" stroke-linejoin="round" />
      </svg>
      <svg style="position:absolute;top:3px;left:3px" width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-size="10" font-weight="bold">${valueText}</text>
      </svg>`;
    return el;
  }

  el.style.width = "22px";
  el.style.height = "22px";
  el.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="10.5" stroke="#000" stroke-width="1" fill="${rgb}" />
      <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-size="10" font-weight="bold">${valueText}</text>
    </svg>`;
  return el;
}

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
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const tooltipRef = useRef<maplibregl.Popup | null>(null);
  const onMarkerSelectedRef = useRef(onMarkerSelected);
  const focusRegions = useStore($focusRegions);

  useEffect(() => {
    onMarkerSelectedRef.current = onMarkerSelected;
  }, [onMarkerSelected]);

  // Initialize the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const bounds = eawsRegionsBounds(focusRegions).pad(0.1);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
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

    map.on("load", () => onInit?.(map));

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
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      tooltipRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the markers in sync with the (filtered) features and selected parameter.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const tooltip = tooltipRef.current;
    const addMarkers = (
      list: Feature[],
      markerItem: MarkerItem,
      isObserver: boolean
    ) => {
      for (const feature of list) {
        const [lng, lat] = feature.geometry?.coordinates ?? [];
        if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;

        const value = isObserver ? undefined : getParamValue(feature, itemId);
        const hasValue = value !== undefined;
        if (!hasValue && !showMarkersWithoutValue) continue;

        const fill = hasValue
          ? getColor(value, markerItem)
          : isObserver
            ? Object.values(markerItem.colors)[0]
            : NO_VALUE_COLOR;
        const valueText = hasValue ? intl.formatNumber(value) : "";

        let direction: number | false = false;
        if (
          !isObserver &&
          markerItem.direction === "DW" &&
          value !== undefined &&
          value >= 3.5
        ) {
          const dw = getParamValue(feature, "DW" as ParameterType);
          if (dw !== undefined) direction = dw;
        }

        // Markers with values render above markers without, ordered by value.
        const zIndex = hasValue ? 1 + Math.round(Math.abs(value)) : 0;
        const el = buildMarkerElement(
          fill,
          getContrastTextColor(fill),
          valueText,
          direction,
          zIndex
        );

        const id = String(feature.id);
        el.addEventListener("click", e => {
          e.stopPropagation();
          onMarkerSelectedRef.current(id);
        });

        const altitude = feature.geometry?.coordinates?.[2];
        const tooltipText = `${feature.properties.name} (${altitude} m)`;
        if (tooltip) {
          el.addEventListener("mouseenter", () => {
            tooltip.setLngLat([lng, lat]).setText(tooltipText).addTo(map);
          });
          el.addEventListener("mouseleave", () => tooltip.remove());
        }

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);
        markersRef.current.push(marker);
      }
    };

    addMarkers(features, item, false);
    if (observers) addMarkers(observers, OBSERVER_ITEM, true);
  }, [features, observers, item, itemId, showMarkersWithoutValue, intl]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

export default MapLibreMap;
