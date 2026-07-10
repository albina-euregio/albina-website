import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useStore } from "@nanostores/react";
import { $focusRegions } from "../../appStore.ts";
import { eawsRegionsBounds, padBounds } from "../../stores/eawsRegions.ts";
import { MAPLIBRE_STYLE } from "../maplibre/maplibre-style.ts";
import type { IncidentData } from "../../stores/incidentDataStore.ts";

const SOURCE_ID = "incidents";
const CIRCLE_LAYER_ID = "incidents-circles";

interface Props {
  incidents: IncidentData[];
  onIncidentSelected: (id: string) => void;
}

function toFeatureCollection(
  incidents: IncidentData[]
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
          color: incident.color
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
    const data = toFeatureCollection(incidents);
    dataRef.current = data;

    const map = mapRef.current;
    const source = map?.getSource(SOURCE_ID);
    if (map && source instanceof maplibregl.GeoJSONSource) {
      source.setData(data);
    }
  }, [incidents]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

export default IncidentMapLibreMap;
