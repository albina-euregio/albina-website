import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useStore } from "@nanostores/react";
import type { Feature } from "@albina-euregio/linea/listing";
import { $focusRegions } from "../../appStore.ts";
import { eawsRegionsBounds } from "../../stores/eawsRegions.ts";

const STATIONS_SOURCE_ID = "stations";
const STATIONS_LAYER_ID = "stations-circles";

interface Props {
  features: Feature[];
  onMarkerSelected: (id: string) => void;
  onInit?: (map: maplibregl.Map) => void;
}

/**
 * Minimalistic MapLibre GL map for the station dashboard.
 *
 * For now it renders the station overlay as monochrome circle markers only.
 * Parameter colors, values, observers styling, tooltips, controls, … will be
 * added in separate steps.
 */
function toFeatureCollection(
  features: Feature[]
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: features
      .filter(f => {
        const [lng, lat] = f.geometry?.coordinates ?? [];
        return Number.isFinite(lng) && Number.isFinite(lat);
      })
      .map(f => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [f.geometry.coordinates[0], f.geometry.coordinates[1]]
        },
        properties: {
          id: String(f.id),
          name: f.properties.name
        }
      }))
  };
}

function MapLibreMap({ features, onMarkerSelected, onInit }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
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
    // map.addControl(
    //   new maplibregl.AttributionControl({ compact: true }),
    //   "bottomright"
    // );
    map.on("load", () => {
      map.addSource(STATIONS_SOURCE_ID, {
        type: "geojson",
        data: toFeatureCollection(features)
      });
      map.addLayer({
        id: STATIONS_LAYER_ID,
        type: "circle",
        source: STATIONS_SOURCE_ID,
        paint: {
          "circle-radius": 5,
          "circle-color": "#666666",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1
        }
      });

      const tooltip = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 10,
        className: "maplibre-station-tooltip"
      });

      map.on("click", STATIONS_LAYER_ID, e => {
        const id = e.features?.[0]?.properties?.id;
        if (typeof id === "string") onMarkerSelectedRef.current(id);
      });
      map.on("mousemove", STATIONS_LAYER_ID, e => {
        map.getCanvas().style.cursor = "pointer";
        const feature = e.features?.[0];
        const name = feature?.properties?.name;
        if (feature?.geometry.type !== "Point" || typeof name !== "string") {
          return;
        }
        tooltip
          .setLngLat(feature.geometry.coordinates as [number, number])
          .setText(name)
          .addTo(map);
      });
      map.on("mouseleave", STATIONS_LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
        tooltip.remove();
      });

      onInit?.(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the station source in sync with the (filtered) features.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource(STATIONS_SOURCE_ID);
    if (source instanceof maplibregl.GeoJSONSource) {
      source.setData(toFeatureCollection(features));
    }
  }, [features]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

export default MapLibreMap;
