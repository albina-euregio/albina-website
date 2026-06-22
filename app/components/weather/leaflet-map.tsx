import React, { useMemo } from "react";
import "leaflet/styles.css";
import LeafletMapControls from "./leaflet-map-controls.tsx";

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
import { $focusRegions } from "../../appStore.ts";
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

const LeafletMapOpenTopo = (props: Props) => {
  return LeafletMap({
    ...props,
    mapConfigOverride: {
      ...props.mapConfigOverride,
      maxZoom: 14
    },
    tileLayerConfigOverride: {
      ...props.tileLayerConfigOverride,
      maxNativeZoom: 10,
      maxZoom: 10
    },
    secondaryTileLayerConfigOverride: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution:
        "Map data: OpenStreetMap contributors, SRTM | Map style: OpenTopoMap (CC-BY-SA)",
      maxNativeZoom: 17,
      minZoom: 10.25,
      maxZoom: 14
    }
  });
};
export { LeafletMapOpenTopo };
