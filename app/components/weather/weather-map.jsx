import React, { useMemo } from "react";
import { observer } from "mobx-react";
import LeafletMap from "../leaflet/leaflet-map";
import DataOverlay from "../leaflet/dataOverlay";
import { useIntl } from "react-intl";

import GridOverlay from "./grid-overlay";
import StationOverlay from "./station-overlay";
import { MAP_STORE } from "../../stores/mapStore";
import { CustomLeafletControl } from "../leaflet/controls/customLeafletControl";

const WeatherMap = props => {
  const intl = useIntl();

  const overlays = [];
  let showStationsToggle = false;
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
      if (MAP_STORE.showStations)
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
      showStationsToggle = true;
    }
  }

  let showHideStationsCtrlInnerHTML = `<a class="leaflet-bar-part leaflet-bar-part-single tooltip" title="${intl.formatMessage(
    { id: "weathermap:showHidePin" }
  )}"></a>`;
  let showHideStationsCtrl = (
    <CustomLeafletControl
      key="showHideControler"
      config={config.map.showHideOptions}
      containerElement="div"
      classNames={
        MAP_STORE.showStations
          ? "leaflet-control-showhide leaflet-control-hide leaflet-bar leaflet-control"
          : "leaflet-control-showhide leaflet-control-show leaflet-bar leaflet-control"
      }
      innerHTML={showHideStationsCtrlInnerHTML}
      onClick={() => MAP_STORE.setShowStations(!MAP_STORE.showStations)}
      enabled={showStationsToggle}
    />
  );

  return (
    <>
      <LeafletMap
        loaded={props.domainId !== false}
        identifier={props.domainId + "_" + props.itemId}
        onViewportChanged={props.onViewportChanged}
        overlays={overlays}
        controls={[showHideStationsCtrl]}
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

export default observer(WeatherMap);
