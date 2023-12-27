import React from "react";
import "leaflet/dist/leaflet.css";
import "./leaflet-player.css";
import { useParams } from "react-router-dom";
import LeafletMapControls from "./leaflet-map-controls";

import {
  MapContainer,
  useMapEvents,
  TileLayer,
  AttributionControl,
  ScaleControl,
  MapContainerProps,
  TileLayerProps
} from "react-leaflet";

const EventHandler = () => {
  const map = useMapEvents({
    zoomend: () => {
      const newZoom = Math.round(map.getZoom());
      map.setMaxBounds(config.map.maxBounds[newZoom]);
    }
  });
  return null;
};

type Props = {
  loaded: boolean;
  gestureHandling: boolean;
  controls: boolean;
  mapConfigOverride: Partial<MapContainerProps>;
  tileLayerConfigOverride: Partial<TileLayerProps>;
  overlays: React.ReactElement;
  onInit: (map: L.Map) => void;
};

const LeafletMap = (props: Props) => {
  const params = useParams();

  return (
    <MapContainer
      className={props.loaded ? "" : "map-disabled"}
      gestureHandling={props.gestureHandling}
      style={{
        width: "100%",
        height: "100%",
        zIndex: 1,
        opacity: 1
      }}
      zoomControl={false}
      {...{
        ...(props.loaded
          ? {
              dragging: true,
              touchZoom: true,
              doubleClickZoom: true,
              scrollWheelZoom: true,
              boxZoom: true,
              keyboard: true
            }
          : {
              dragging: false,
              touchZoom: false,
              doubleClickZoom: false,
              scrollWheelZoom: false,
              boxZoom: false,
              keyboard: false
            }),
        ...config.map.initOptions,
        ...props.mapConfigOverride
      }}
      bounds={
        config.map[
          `${params.province as "AT-7" | "IT-32-BZ" | "IT-32-TN"}.bounds`
        ] ?? config.map.euregioBounds
      }
      attributionControl={false}
      whenCreated={map => {
        // Workaround for https://github.com/elmarquis/Leaflet.GestureHandling/issues/75
        map.gestureHandling?._handleMouseOver?.();
      }}
    >
      <EventHandler />
      <AttributionControl prefix={config.map.attribution} />
      {props.loaded && <ScaleControl imperial={false} position="bottomleft" />}
      {props.loaded && props.controls}
      <TileLayer
        {...{
          ...config.map.tileLayer,
          ...props.tileLayerConfigOverride
        }}
      />
      {props.overlays}
      <LeafletMapControls {...props} />
    </MapContainer>
  );
};
export default LeafletMap;
