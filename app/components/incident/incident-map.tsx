import React, { useCallback, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useStore } from "@nanostores/react";
import { $focusRegions } from "../../appStore.ts";
import { eawsRegionsBounds, padBounds } from "../../stores/eawsRegions.ts";
import { MAPLIBRE_STYLE } from "../maplibre/maplibre-style.ts";
import { useIntl, type MessageId } from "../../i18n";
import {
  translateIncidentValue,
  useIncidentReportMessages
} from "../../i18n/incident-report";
import { DATE_TIME_FORMAT_SHORT } from "../../util/date";
import type { IncidentData } from "../../stores/incidentDataStore.ts";

const SOURCE_ID = "incidents";
const CIRCLE_LAYER_ID = "incidents-circles";

interface Props {
  incidents: IncidentData[];
  onIncidentSelected: (id: string) => void;
}

/** Escapes text before it is interpolated into the tooltip's HTML string. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toFeatureCollection(
  incidents: IncidentData[],
  renderTooltip: (incident: IncidentData) => string
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: incidents
      .filter(i => i.hasLocation)
      .map(incident => ({
        type: "Feature",
        id: incident.id,
        geometry: {
          type: "Point",
          coordinates: [incident.lon as number, incident.lat as number]
        },
        properties: {
          id: incident.id,
          location: incident.location,
          color: incident.color,
          tooltip: renderTooltip(incident)
        }
      }))
  };
}

function IncidentMapLibreMap({ incidents, onIncidentSelected }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const tooltipRef = useRef<maplibregl.Popup | null>(null);
  const dataRef = useRef<GeoJSON.FeatureCollection<GeoJSON.Point>>({
    type: "FeatureCollection",
    features: []
  });
  const onIncidentSelectedRef = useRef(onIncidentSelected);
  const focusRegions = useStore($focusRegions);
  const intl = useIntl();
  const messages = useIncidentReportMessages();

  /**
   * Builds the hover-tooltip HTML for an incident marker. Empty lines are
   * dropped, and all text is translated the same way as the incident table and
   * details dialog. Kept as a closure so it reads `intl`/`messages` from this
   * component's hooks rather than receiving them as arguments.
   */
  const renderTooltip = useCallback(
    (incident: IncidentData): string => {
      const esc = (value: string | undefined): string | undefined =>
        value ? escapeHtml(value) : undefined;
      /** An icon-prefixed line; `icon` is a fontello glyph class or a raw marker. */
      const line = (
        icon: string,
        value: string | undefined
      ): string | undefined =>
        value ? `<span class="${icon}"></span>${value}` : undefined;

      const dateTime = esc(
        incident.dateTime
          ? intl.formatDate(incident.dateTime, DATE_TIME_FORMAT_SHORT)
          : undefined
      );
      const dangerRating = incident.dangerRating
        ? esc(
            intl.formatMessage({
              id: `danger-level:${incident.dangerRating}` as MessageId
            })
          )
        : undefined;
      // Type and size share the avalanche line, with no labels. An `unknown`
      // value carries no information, so it is dropped rather than shown.
      const avalanchePart = (
        field: "avalancheType" | "avalancheSize"
      ): string | undefined =>
        incident[field] && incident[field] !== "unknown"
          ? esc(translateIncidentValue(messages, field, incident[field]))
          : undefined;
      const avalanche = [
        avalanchePart("avalancheType"),
        avalanchePart("avalancheSize")
      ]
        .filter(Boolean)
        .join(" · ");
      const personInvolvement = esc(
        translateIncidentValue(
          messages,
          "personInvolvement",
          incident.personInvolvement
        )
      );
      // Alert icon when persons were involved; neutral info icon otherwise.
      const personIcon =
        incident.personInvolvement === "Yes" ? "icon-attention" : "icon-info";

      const lines = [
        line("icon-location", esc(incident.location)),
        line("icon-calendar", dateTime),
        // A color swatch stands in for the danger-rating icon, matching the marker.
        dangerRating &&
          `<span class="incident-tooltip__swatch" style="background:${incident.color}"></span>${dangerRating}`,
        line("icon-snow", avalanche || undefined),
        line(personIcon, personInvolvement)
      ].filter(Boolean);

      return lines.length
        ? `<ul class="incident-tooltip__facts">${lines
            .map(l => `<li>${l}</li>`)
            .join("")}</ul>`
        : "";
    },
    [intl, messages]
  );

  useEffect(() => {
    onIncidentSelectedRef.current = onIncidentSelected;
  }, [onIncidentSelected]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const bounds = padBounds(eawsRegionsBounds(focusRegions), 0.1);

    const map = new maplibregl.Map({
      dragRotate: false,
      container: containerRef.current,
      style: MAPLIBRE_STYLE,
      bounds
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-left"
    );

    tooltipRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
      className: "maplibre-incident-tooltip"
    });

    map.on("load", () => {
      map.addSource(SOURCE_ID, { type: "geojson", data: dataRef.current });

      map.addLayer({
        id: CIRCLE_LAYER_ID,
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-radius": 8,
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#000",
          "circle-stroke-width": 1
        }
      });

      map.on("click", CIRCLE_LAYER_ID, e => {
        const id = e.features?.[0]?.properties?.id;
        if (typeof id === "string") onIncidentSelectedRef.current(id);
      });
      map.on("mouseenter", CIRCLE_LAYER_ID, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", CIRCLE_LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
        tooltipRef.current?.remove();
      });
      map.on("mousemove", CIRCLE_LAYER_ID, e => {
        const feature = e.features?.[0];
        if (feature?.geometry.type !== "Point") return;
        const tooltip = feature.properties?.tooltip;
        if (typeof tooltip !== "string" || !tooltip) return;
        tooltipRef.current
          ?.setLngLat(feature.geometry.coordinates as [number, number])
          .setHTML(tooltip)
          .addTo(map);
      });
    });

    mapRef.current = map;

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

  useEffect(() => {
    const data = toFeatureCollection(incidents, renderTooltip);
    dataRef.current = data;

    const map = mapRef.current;
    const source = map?.getSource(SOURCE_ID);
    if (map && source instanceof maplibregl.GeoJSONSource) {
      source.setData(data);
    }
  }, [incidents, renderTooltip]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

export default IncidentMapLibreMap;
