import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useStore } from "@nanostores/react";
import { $focusRegions } from "../../appStore.ts";
import { eawsRegionsBounds, padBounds } from "../../stores/eawsRegions.ts";
import { useIntl } from "../../i18n";
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

/**
 * Reads the stability marker colors from CSS (`--snowprofile-stability-*`),
 * treating a missing stability as "no test".
 */
function stabilityColor(): (
  stability: SnowProfileStability | undefined
) => string {
  const styles = getComputedStyle(document.documentElement);
  return stability =>
    styles
      .getPropertyValue(stabilityColorProperty(stability ?? "no-test"))
      .trim() || "#fff";
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
  snowProfiles: SnowProfileData[]
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  const markerColor = stabilityColor();
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
          severity: profile.stability
            ? snowProfileStabilitySeverity(profile.stability)
            : 0
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
        const location = feature.properties?.location;
        tooltipRef.current
          ?.setLngLat(feature.geometry.coordinates as [number, number])
          .setText(typeof location === "string" ? location : "")
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
    const data = toFeatureCollection(snowProfiles);
    dataRef.current = data;

    const map = mapRef.current;
    const source = map?.getSource(SOURCE_ID);
    if (map && source instanceof maplibregl.GeoJSONSource) {
      source.setData(data);
    }
  }, [snowProfiles]);

  return (
    <div className="snowprofile-map">
      <div ref={containerRef} className="snowprofile-map__canvas" />
      <SnowProfileMapLegend />
    </div>
  );
}

export default SnowProfileMapLibreMap;
