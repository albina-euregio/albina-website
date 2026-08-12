import React, { useEffect, useRef } from "react";
import {
  LngLatBounds,
  Map as MlMap,
  Marker,
  NavigationControl
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAPLIBRE_STYLE } from "../maplibre/maplibre-style.ts";
import type { IncidentData } from "../../stores/incidentDataStore.ts";

const SOURCE_ID = "incident-geometry";

/** Parses the admin-gui "lat, lng" per-line text into `[lat, lng]` pairs. */
function parseCoordinatesText(text: string | undefined): [number, number][] {
  if (!text) return [];
  const points: [number, number][] = [];
  for (const line of text.split("\n")) {
    const [lat, lng] = line.split(",").map(s => parseFloat(s.trim()));
    if (!isNaN(lat) && !isNaN(lng)) points.push([lat, lng]);
  }
  return points;
}

function hasGeometry(incident: IncidentData): boolean {
  const d = incident.publicData;
  return (
    incident.hasLocation ||
    !!d.lineCoordinatesText?.trim() ||
    !!d.polygonCoordinatesText?.trim()
  );
}

/**
 * Read-only map of the incident location, mirroring the drawing conventions of
 * the admin-gui report editor: a blue point marker, blue line, and green
 * polygon over the shared topographic base map.
 */
function IncidentLocationMap({ incident }: { incident: IncidentData }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MlMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const d = incident.publicData;
    const linePoints = parseCoordinatesText(d.lineCoordinatesText);
    const polygonPoints = parseCoordinatesText(d.polygonCoordinatesText);

    const features: GeoJSON.Feature[] = [];
    const allPoints: [number, number][] = []; // [lng, lat]

    if (linePoints.length) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: linePoints.map(([la, lo]) => [lo, la])
        }
      });
      linePoints.forEach(([la, lo]) => allPoints.push([lo, la]));
    }

    if (polygonPoints.length) {
      const ring = polygonPoints.map(([la, lo]) => [lo, la]);
      // Close the linear ring as required by GeoJSON.
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) ring.push([...first]);
      features.push({
        type: "Feature",
        properties: {},
        geometry: { type: "Polygon", coordinates: [ring] }
      });
      polygonPoints.forEach(([la, lo]) => allPoints.push([lo, la]));
    }

    if (incident.hasLocation) {
      allPoints.push([incident.lon as number, incident.lat as number]);
    }

    const map = new MlMap({
      dragRotate: false,
      container: containerRef.current,
      style: MAPLIBRE_STYLE,
      center: allPoints[0] ?? [11.404, 47.268],
      zoom: 12,
      maxZoom: 17,
      attributionControl: { compact: true }
    });
    map.addControl(new NavigationControl({ showCompass: false }), "top-left");

    map.on("load", () => {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features }
      });
      map.addLayer({
        id: "incident-polygon-fill",
        type: "fill",
        source: SOURCE_ID,
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: { "fill-color": "green", "fill-opacity": 0.3 }
      });
      map.addLayer({
        id: "incident-polygon-outline",
        type: "line",
        source: SOURCE_ID,
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: { "line-color": "green", "line-width": 2 }
      });
      map.addLayer({
        id: "incident-line",
        type: "line",
        source: SOURCE_ID,
        filter: ["==", ["geometry-type"], "LineString"],
        paint: { "line-color": "blue", "line-width": 4 }
      });

      if (incident.hasLocation) {
        new Marker({ color: "#2a81cb" })
          .setLngLat([incident.lon as number, incident.lat as number])
          .addTo(map);
      }

      if (allPoints.length === 1) {
        map.jumpTo({ center: allPoints[0], zoom: 15 });
      } else if (allPoints.length > 1) {
        const bounds = new LngLatBounds();
        for (const p of allPoints) bounds.extend(p);
        map.fitBounds(bounds, { maxZoom: 15, animate: false, padding: 40 });
      }
      map.resize();
    });

    mapRef.current = map;

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => map.resize())
        : undefined;
    resizeObserver?.observe(containerRef.current);

    return () => {
      resizeObserver?.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incident]);

  if (!hasGeometry(incident)) return null;

  return (
    <div
      ref={containerRef}
      className="incident-details-map"
      style={{ width: "100%", height: "300px" }}
    />
  );
}

export default IncidentLocationMap;
