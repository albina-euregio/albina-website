import React, { useMemo } from "react";
import "leaflet/styles.css";
import LeafletMapControls from "./leaflet-map-controls";

import {
  MapContainer,
  TileLayer,
  AttributionControl,
  ScaleControl,
  MapContainerProps,
  TileLayerProps,
  WMSTileLayer
} from "react-leaflet";
import L from "leaflet";
import { $province } from "../../appStore.ts";
import { useStore } from "@nanostores/react";
import { eawsRegionsBounds } from "../../stores/eawsRegions.ts";

interface Props {
  loaded: boolean;
  gestureHandling: boolean;
  controls: React.ReactNode;
  showDefaultControls?: boolean;
  mapConfigOverride: Partial<MapContainerProps>;
  tileLayerConfigOverride: Partial<TileLayerProps>;
  secondaryTileLayerConfigOverride?: Partial<TileLayerProps>;
  overlays: React.ReactNode;
  onInit: (map: L.Map) => void;
  enableStationPinsToggle?: boolean;
  showMarkersWithoutValue?: boolean;
  onToggleMarkersWithoutValue?: (nextValue: boolean) => void;
}

const LeafletMap = (props: Props) => {
  const province = useStore($province);
  const showDefaultControls = props.showDefaultControls ?? true;

  const bounds = useMemo(
    () => eawsRegionsBounds(province ? [province] : config.regionCodes),
    [province]
  );
  const effectiveBounds = props.mapConfigOverride.bounds ?? bounds.pad(0.1);

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
      bounds={effectiveBounds}
      attributionControl={false}
    >
      {showDefaultControls && (
        <AttributionControl prefix={config.map.attribution} />
      )}
      {showDefaultControls && props.loaded && (
        <ScaleControl imperial={false} position="bottomleft" />
      )}
      {showDefaultControls && props.loaded && props.controls}
      {config.map.tileLayer.wms ? (
        <WMSTileLayer
          {...{
            ...config.map.tileLayer,
            ...props.tileLayerConfigOverride
          }}
        />
      ) : (
        <TileLayer
          {...{
            ...config.map.tileLayer,
            ...props.tileLayerConfigOverride
          }}
        />
      )}

      {props.secondaryTileLayerConfigOverride && (
        <TileLayer
          {...{
            ...config.map.tileLayer,
            ...props.secondaryTileLayerConfigOverride
          }}
        />
      )}
      {props.overlays}
      {showDefaultControls && <LeafletMapControls {...props} />}
    </MapContainer>
  );
};
export default LeafletMap;
