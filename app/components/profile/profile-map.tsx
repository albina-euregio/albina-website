import React, { useCallback, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useStore } from "@nanostores/react";
import { $focusRegions } from "../../appStore.ts";
import { eawsRegionsBounds, padBounds } from "../../stores/eawsRegions.ts";
import { useIntl } from "../../i18n";
import { DATE_TIME_FORMAT_SHORT } from "../../util/date";
import { escapeHtml } from "../../util/escape-html.ts";
import { MAPLIBRE_STYLE } from "../maplibre/maplibre-style.ts";
import MapLegend, { type MapLegendItem } from "../maplibre/map-legend.tsx";
import { coloredCircleLayer } from "../maplibre/colored-circle-layer.ts";
import {
  SNOW_PROFILE_STABILITIES,
  snowProfileStabilitySeverity,
  stabilityLabelId,
  type SnowProfileData,
  type SnowProfileStability
} from "../../stores/profileDataStore.ts";

const SOURCE_ID = "snowprofiles";
const CIRCLE_LAYER_ID = "snowprofiles-circles";

/** CSS custom property holding the marker color for a stability. */
function stabilityColorProperty(stability: SnowProfileStability): string {
  return `--snowprofile-stability-${stability}`;
}

interface Props {
  snowProfiles: SnowProfileData[];
  onSnowProfileSelected: (id: string) => void;
}

function SnowProfileMapLegend() {
  const intl = useIntl();
  const items: MapLegendItem[] = SNOW_PROFILE_STABILITIES.map(stability => ({
    key: stability,
    color: `var(${stabilityColorProperty(stability)})`,
    label: intl.formatMessage({ id: stabilityLabelId(stability) })
  }));
  return <MapLegend items={items} />;
}

function toFeatureCollection(
  snowProfiles: SnowProfileData[],
  renderTooltip: (profile: SnowProfileData) => string
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  // Read the stability marker colors from CSS (`--snowprofile-stability-*`) once
  // per rebuild, treating a missing stability as "no test".
  const styles = getComputedStyle(document.documentElement);
  const markerColor = (stability: SnowProfileStability | undefined): string =>
    styles
      .getPropertyValue(stabilityColorProperty(stability ?? "no-test"))
      .trim() || "#fff";
  return {
    type: "FeatureCollection",
    features: snowProfiles
      .filter(p => p.hasLocation)
      .map(profile => ({
        type: "Feature",
        id: profile.id,
        geometry: {
          type: "Point",
          coordinates: [profile.lon as number, profile.lat as number]
        },
        properties: {
          id: profile.id,
          location: profile.location,
          color: markerColor(profile.stability),
          // Draw the less stable markers on top of the rest where they pile up.
          severity: snowProfileStabilitySeverity(
            profile.stability ?? "no-test"
          ),
          tooltip: renderTooltip(profile)
        }
      }))
  };
}

function SnowProfileMapLibreMap({
  snowProfiles,
  onSnowProfileSelected
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const tooltipRef = useRef<maplibregl.Popup | null>(null);
  const dataRef = useRef<GeoJSON.FeatureCollection<GeoJSON.Point>>({
    type: "FeatureCollection",
    features: []
  });
  const onSnowProfileSelectedRef = useRef(onSnowProfileSelected);
  const focusRegions = useStore($focusRegions);
  const intl = useIntl();

  // Mirror the incident map's marker tooltip: a stability-coloured spine, the
  // location title, a date/time meta line, then the elevation and an aspect chip.
  const renderTooltip = useCallback(
    (profile: SnowProfileData): string => {
      const esc = (value: string | undefined): string | undefined =>
        value ? escapeHtml(value) : undefined;

      const title = esc(profile.location);
      const dateTime = esc(
        profile.dateTime
          ? intl.formatDate(profile.dateTime, DATE_TIME_FORMAT_SHORT)
          : undefined
      );
      const elevation =
        profile.elevation != null
          ? esc(intl.formatNumberUnit(profile.elevation, "m"))
          : undefined;
      const aspect = esc(profile.aspect);

      const header = [
        title
          ? `<p class="snowprofile-tooltip__title">${title}</p>`
          : undefined,
        dateTime
          ? `<p class="snowprofile-tooltip__meta">${dateTime}</p>`
          : undefined
      ].filter(Boolean);

      const facts = [
        elevation
          ? `<span class="snowprofile-fact-badge">${elevation}</span>`
          : undefined,
        aspect
          ? `<span class="snowprofile-fact-badge">${aspect}</span>`
          : undefined
      ].filter(Boolean);

      if (!header.length && !facts.length) return "";
      const headerHtml = header.length
        ? `<div class="snowprofile-tooltip__header">${header.join("")}</div>`
        : "";
      const bodyHtml = facts.length
        ? `<div class="snowprofile-tooltip__body">${facts.join("")}</div>`
        : "";
      // Thread the marker's stability colour into the card via a custom property.
      const stability = profile.stability ?? "no-test";
      return `<div class="snowprofile-tooltip" style="--snowprofile-stability-color: var(${stabilityColorProperty(stability)})">${headerHtml}${bodyHtml}</div>`;
    },
    [intl]
  );

  useEffect(() => {
    onSnowProfileSelectedRef.current = onSnowProfileSelected;
  }, [onSnowProfileSelected]);

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
      className: "maplibre-snowprofile-tooltip"
    });

    map.on("load", () => {
      map.addSource(SOURCE_ID, { type: "geojson", data: dataRef.current });

      map.addLayer(coloredCircleLayer(CIRCLE_LAYER_ID, SOURCE_ID));

      map.on("click", CIRCLE_LAYER_ID, e => {
        const id = e.features?.[0]?.properties?.id;
        if (typeof id === "string") onSnowProfileSelectedRef.current(id);
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
    const data = toFeatureCollection(snowProfiles, renderTooltip);
    dataRef.current = data;

    const map = mapRef.current;
    const source = map?.getSource(SOURCE_ID);
    if (map && source instanceof maplibregl.GeoJSONSource) {
      source.setData(data);
    }
  }, [snowProfiles, renderTooltip]);

  return (
    <div className="snowprofile-map">
      <div ref={containerRef} className="snowprofile-map__canvas" />
      <SnowProfileMapLegend />
    </div>
  );
}

export default SnowProfileMapLibreMap;
