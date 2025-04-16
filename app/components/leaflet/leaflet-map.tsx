import React from "react";
import "leaflet/dist/leaflet.css";
import { useSearchParams } from "react-router-dom";
import LeafletMapControls from "./leaflet-map-controls";

import {
  MapContainer,
  TileLayer,
  AttributionControl,
  ScaleControl,
  MapContainerProps,
  TileLayerProps
} from "react-leaflet";
import L from "leaflet";

interface Props {
  loaded: boolean;
  gestureHandling: boolean;
  controls: React.ReactNode;
  mapConfigOverride: Partial<MapContainerProps>;
  tileLayerConfigOverride: Partial<TileLayerProps>;
  overlays: React.ReactNode;
  onInit: (map: L.Map) => void;
}

const LeafletMap = (props: Props) => {
  const [searchParams] = useSearchParams();
  const province = searchParams.get("province") as
    | "AT-07"
    | "IT-32-BZ"
    | "IT-32-TN";

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
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        keyboard: true,
        ...config.map.initOptions,
        ...props.mapConfigOverride
      }}
      bounds={config.map[`${province}.bounds`] ?? config.map.euregioBounds}
      attributionControl={false}
    >
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
