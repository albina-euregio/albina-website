import React, { useState } from "react";
import { observer } from "mobx-react";
import LeafletMap from "../leaflet/leaflet-map";
import DataOverlay from "./dataOverlay";
import { useIntl } from "../../i18n";

import GridOverlay from "./grid-overlay";
import StationOverlay from "./station-overlay";
import { CustomLeafletControl } from "./customLeafletControl";

const WeatherMap = props => {
  const intl = useIntl();
  const [showStations, setShowStations] = useState(
    !/android|ip(hone|od|ad)/i.test(navigator.userAgent)
  );

  const overlays = [];
  let showStationsToggle = false;
  if (props.item) {
    if (props.domainId) {
      overlays.push(
        <DataOverlay
          key="background-map"
          domainId={props.domainId}
          //overlay={props.overlay}
          getOverlayFileName={props.getOverlayFileName}
          dataOverlayFilePostFix={props.dataOverlayFilePostFix}
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

    if (props.item.layer.grid && props.grid && props.grid.features) {
      overlays.push(
        <GridOverlay
          key={"grid"}
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
      if (showStations)
        overlays.push(
          <StationOverlay
            key={"stations"}
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
    {
      id: showStations ? "weathermap:hidePins" : "weathermap:showPins"
    }
  )}"></a>`;
  let showHideStationsCtrl = (
    <CustomLeafletControl
      key="showHideControler"
      config={config.map.showHideOptions}
      containerElement="div"
      classNames={
        showStations
          ? "leaflet-control-showhide leaflet-control-hide leaflet-bar leaflet-control"
          : "leaflet-control-showhide leaflet-control-show leaflet-bar leaflet-control"
      }
      innerHTML={showHideStationsCtrlInnerHTML}
      onClick={() => setShowStations(v => !v)}
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
