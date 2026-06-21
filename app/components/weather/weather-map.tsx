import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import MapLibreMap, {
  CIRCLE_LAYER_ID,
  type MarkerItem
} from "../station/station-map-maplibre";
import * as store from "../../stores/weatherMapStore";
import { useStore } from "@nanostores/react";
import type { ParameterType } from "../station/station-parameter-data";

interface Props {
  isPlaying: boolean;
  onMarkerSelected: (id: string | null) => void;
}

const IMAGE_SOURCE_ID = "weather-overlay";
const IMAGE_LAYER_ID = "weather-overlay";

const WeatherMap = ({ isPlaying, onMarkerSelected }: Props) => {
  const timeSpan = useStore(store.timeSpan);
  const domainConfig = useStore(store.domainConfig);
  const stations = useStore(store.stations);
  const overlayURLs = useStore(store.overlayURLs);

  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Keep the weather raster overlay in sync with the selected time/domain. The
  // image lives beneath the station markers (inserted before CIRCLE_LAYER_ID).
  useEffect(() => {
    const map = mapRef.current;
    const [url] = overlayURLs;
    if (!mapReady || !map || !url) return;

    // The bbox is `[[south, west], [north, east]]` (lat, lng); MapLibre image
    // sources want the four corners as `[lng, lat]` in TL, TR, BR, BL order.
    const [[south, west], [north, east]] = store.config.settings.bbox;
    const coordinates: maplibregl.ImageSourceSpecification["coordinates"] = [
      [west, north],
      [east, north],
      [east, south],
      [west, south]
    ];

    const source = map.getSource(IMAGE_SOURCE_ID);
    if (source instanceof maplibregl.ImageSource) {
      source.updateImage({ url, coordinates });
    } else {
      map.addSource(IMAGE_SOURCE_ID, { type: "image", url, coordinates });
      map.addLayer(
        {
          id: IMAGE_LAYER_ID,
          type: "raster",
          source: IMAGE_SOURCE_ID,
          paint: { "raster-opacity": 1, "raster-fade-duration": 0 }
        },
        CIRCLE_LAYER_ID
      );
    }
  }, [overlayURLs, mapReady]);

  if (!domainConfig) return null;

  const itemId = domainConfig.timeSpanToDataId[timeSpan] as ParameterType;
  // TODO: migrate GridOverlay + showHideStationsCtrl here.
  const showStations = domainConfig.layer.stations && !isPlaying;

  return (
    <MapLibreMap
      features={showStations ? stations : []}
      item={domainConfig as unknown as MarkerItem}
      itemId={itemId}
      showMarkersWithoutValue={false}
      onMarkerSelected={id => onMarkerSelected(id)}
      onInit={map => {
        mapRef.current = map;
        setMapReady(true);
      }}
    />
  );
};

export default WeatherMap;
