import React from "react";

import LeafletMap from "../leaflet/leaflet-map";
import DataOverlay from "../leaflet/dataOverlay";

import GridOverlay from "./grid-overlay";
import StationOverlay from "./station-overlay";
import { MAP_STORE } from "../../stores/mapStore";

const WeatherMap = props => {
  //console.log("WeatherMap->start xxx1", props);
  const overlays = [];
  if (props.item) {
    if (props.overlay) {
      //console.log("wather-map->#2 yyy2:", props.overlay);
      if (props.overlay) {
        overlays.push(
          <DataOverlay
            key="background-map"
            overlay={props.overlay}
            currentTime={props.currentTime}
            debug={props.debug}
            playerCB={props.playerCB}
            item={props.item}
            dataOverlays={props.dataOverlays}
            dataOverlaysEnabled={props.dataOverlaysEnabled}
            rgbToValue={props.rgbToValue}
          />
        );
      }
    }

    if (props.item.layer.grid && props.grid && props.grid.features) {
      overlays.push(
        <GridOverlay
          key={"grid"}
          zoom={MAP_STORE.mapZoom}
          item={props.item}
          grid={props.grid}
          onLoading={() => {
            props.playerCB("grid", "loading");
          }}
          onLoad={() => {
            props.playerCB("gird", "load");
          }}
          onTileerror={() => {
            props.playerCB("grid", "error");
          }}
        />
      );
    }

    if (
      props.item.layer.stations &&
      props.stations &&
      props.stations.features &&
      !props.isPlaying
    ) {
      overlays.push(
        <StationOverlay
          key={"stations"}
          zoom={MAP_STORE.mapZoom}
          onMarkerSelected={props.onMarkerSelected}
          selectedFeature={props.selectedFeature}
          item={props.item}
          itemId={props.stationDataId}
          features={props.stations.features}
          onLoading={() => {
            props.playerCB("stations", "loading");
          }}
          onLoad={() => {
            props.playerCB("stations", "load");
          }}
          onTileerror={() => {
            props.playerCB("stations", "error");
          }}
        />
      );
    }
  }

  const controls = [];

  //console.log("weatherMap->render xxx1", overlays);
  return (
    <>
      <LeafletMap
        loaded={props.domainId !== false}
        identifier={props.domainId + "_" + props.itemId}
        onViewportChanged={props.onViewportChanged}
        overlays={overlays}
        controls={controls}
        timeArray={props.timeArray}
        mapConfigOverride={config.weathermaps.settings.mapOptionsOverride}
        tileLayerConfigOverride={config.weathermaps.settings.mapOptionsOverride}
        startDate={props.startDate}
        gestureHandling={false}
        onInit={map => {
          map.on("click", () => {
            props.onMarkerSelected(null);
          });
        }}
        timeAwareLayers={["background-map"]}
      />
    </>
  );
};

export default WeatherMap;
