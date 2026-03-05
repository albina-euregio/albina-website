import React, { useMemo } from "react";
import "leaflet/styles.css";
import LeafletMapControls from "./leaflet-map-controls";

import {
  MapContainer,
  TileLayer,
  AttributionControl,
  ScaleControl,
  MapContainerProps,
  TileLayerProps
} from "react-leaflet";
import L, { LatLngBounds } from "leaflet";
import { $province } from "../../appStore.ts";
import { useStore } from "@nanostores/react";
import { eawsRegion } from "../../stores/eawsRegions.ts";

interface Props {
  loaded: boolean;
  gestureHandling: boolean;
  controls: React.ReactNode;
  mapConfigOverride: Partial<MapContainerProps>;
  tileLayerConfigOverride: Partial<TileLayerProps>;
  overlays: React.ReactNode;
  onInit: (map: L.Map) => void;
  enableStationPinsToggle?: boolean;
  showMarkersWithoutValue?: boolean;
  onToggleMarkersWithoutValue?: (nextValue: boolean) => void;
}

const LeafletMap = (props: Props) => {
  const province = useStore($province);

  const bounds = useMemo(
    () =>
      (province ? [province] : config.regionCodes).reduce((b, r) => {
        eawsRegion(province);
        const region = eawsRegion(r);
        if (region?.bbox) {
          b.extend(
            new LatLngBounds([
              [region.bbox[1], region.bbox[0]],
              [region.bbox[3], region.bbox[2]]
            ])
          );
        }
        return b;
      }, new LatLngBounds([])),
    [province]
  );

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
        pinchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        keyboard: true,
        ...config.map.initOptions,
        ...props.mapConfigOverride
      }}
      bounds={bounds.pad(0.1)}
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
