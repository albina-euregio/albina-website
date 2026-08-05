import React, { useCallback, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useStore } from "@nanostores/react";
import { $focusRegions } from "../../appStore.ts";
import { eawsRegionsBounds, padBounds } from "../../stores/eawsRegions.ts";
import { MAPLIBRE_STYLE } from "../maplibre/maplibre-style.ts";
import MapLegend, { type MapLegendItem } from "../maplibre/map-legend.tsx";
import { coloredCircleLayer } from "../maplibre/colored-circle-layer.ts";
import { useIntl } from "../../i18n";
import { useIncidentReportMessages } from "../../i18n/incident-report";
import { DATE_TIME_FORMAT_SHORT } from "../../util/date";
import {
  involvementLabel,
  involvementText
} from "../../util/incident-involvement.ts";
import { incidentBadges } from "../../util/incident-badges.ts";
import {
  INCIDENT_INVOLVEMENTS,
  involvementSeverity,
  type IncidentData,
  type IncidentInvolvement
} from "../../stores/incidentDataStore.ts";

const SOURCE_ID = "incidents";
const CIRCLE_LAYER_ID = "incidents-circles";

function involvementColorProperty(involvement: IncidentInvolvement): string {
  return `--incident-involvement-${involvement}`;
}

function involvementColor(): (involvement: IncidentInvolvement) => string {
  const styles = getComputedStyle(document.documentElement);
  return involvement =>
    styles.getPropertyValue(involvementColorProperty(involvement)).trim() ||
    "#fff";
}

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

/**
 * Wraps a trailing "(…)" clause of an already-escaped string in a
 * non-breaking span, so e.g. "3 persons involved (1 fatal, 1 injured)" can
 * only wrap before the opening parenthesis, never inside it.
 */
function nowrapTrailingParenthetical(text: string): string {
  const match = text.match(/^(.*\S)(\s+)(\([^)]*\))$/);
  return match
    ? `${match[1]}${match[2]}<span class="incident-tooltip__nowrap">${match[3]}</span>`
    : text;
}

function IncidentMapLegend() {
  const messages = useIncidentReportMessages();
  const items: MapLegendItem[] = INCIDENT_INVOLVEMENTS.map(involvement => ({
    key: involvement,
    color: `var(${involvementColorProperty(involvement)})`,
    label: involvementLabel(messages, involvement)
  }));
  return <MapLegend items={items} />;
}

function toFeatureCollection(
  incidents: IncidentData[],
  renderTooltip: (incident: IncidentData) => string
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  const markerColor = involvementColor();
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
          color: markerColor(incident.involvement),
          // Draw the more severe markers on top of the lighter ones, so
          // fatalities stay visible where incidents pile up.
          severity: involvementSeverity(incident.involvement),
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

  const renderTooltip = useCallback(
    (incident: IncidentData): string => {
      const esc = (value: string | undefined): string | undefined =>
        value ? escapeHtml(value) : undefined;

      const title = esc(incident.location);
      const dateTime = esc(
        incident.dateTime
          ? intl.formatDate(incident.dateTime, DATE_TIME_FORMAT_SHORT)
          : undefined
      );

      // Only show the outcome when a persons count is known.
      const involved =
        incident.numberInvolved ||
        incident.fatalities + incident.injuredSurvivors;
      const outcomeText = involved
        ? esc(involvementText(incident, intl, messages))
        : undefined;
      const outcome = outcomeText
        ? `<p class="incident-tooltip__outcome">${nowrapTrailingParenthetical(outcomeText)}</p>`
        : undefined;

      const badges = incidentBadges(incident, intl, messages).map(
        badge => `<span class="incident-badge">${esc(badge.text)}</span>`
      );
      const header = [
        title ? `<p class="incident-tooltip__title">${title}</p>` : undefined,
        dateTime
          ? `<p class="incident-tooltip__meta">${dateTime}</p>`
          : undefined
      ].filter(Boolean);

      if (!header.length && !outcome && !badges.length) return "";
      const headerHtml = header.length
        ? `<div class="incident-tooltip__header">${header.join("")}</div>`
        : "";
      const badgesHtml = badges.length
        ? `<div class="incident-badges">${badges.join("")}</div>`
        : "";
      const bodyHtml =
        outcome || badgesHtml
          ? `<div class="incident-tooltip__body">${outcome ?? ""}${badgesHtml}</div>`
          : "";
      // Thread the marker's involvement colour into the card via a custom property
      return `<div class="incident-tooltip" style="--incident-involvement-color: var(--incident-involvement-${incident.involvement})">${headerHtml}${bodyHtml}</div>`;
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

      map.addLayer(coloredCircleLayer(CIRCLE_LAYER_ID, SOURCE_ID));

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

  return (
    <div className="incident-map">
      <div ref={containerRef} className="incident-map__canvas" />
      <IncidentMapLegend />
    </div>
  );
}

export default IncidentMapLibreMap;
