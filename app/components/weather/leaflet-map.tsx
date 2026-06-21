import React, { useMemo } from "react";
import "leaflet/styles.css";
import LeafletMapControls from "./leaflet-map-controls.tsx";

import {
  MapContainer,
  TileLayer,
  AttributionControl,
  ScaleControl,
  MapContainerProps,
  WMSTileLayer
} from "react-leaflet";
import L from "leaflet";
import { $focusRegions } from "../../appStore.ts";
import { useStore } from "@nanostores/react";
import { eawsRegionsBounds } from "../../stores/eawsRegions.ts";

interface Props {
  loaded: boolean;
  gestureHandling: boolean;
  controls: React.ReactNode;
  showDefaultControls?: boolean;
  mapConfigOverride: Partial<MapContainerProps>;
  overlays: React.ReactNode;
  onInit: (map: L.Map) => void;
  enableStationPinsToggle?: boolean;
  showMarkersWithoutValue?: boolean;
  onToggleMarkersWithoutValue?: (nextValue: boolean) => void;
}

const LeafletMap = (props: Props) => {
  const focusRegions = useStore($focusRegions);
  const showDefaultControls = props.showDefaultControls ?? true;

  const bounds = useMemo((): L.LatLngBoundsExpression => {
    const { west, south, east, north } =
      eawsRegionsBounds(focusRegions).pad(0.1);
    return [
      [south, west],
      [north, east]
    ];
  }, [focusRegions]);
  const effectiveBounds: L.LatLngBoundsExpression =
    props.mapConfigOverride.bounds ?? bounds;

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
        <WMSTileLayer {...config.map.tileLayer} />
      ) : (
        <TileLayer {...config.map.tileLayer} />
      )}
      {props.overlays}
      {showDefaultControls && <LeafletMapControls {...props} />}
    </MapContainer>
  );
};
export default LeafletMap;
