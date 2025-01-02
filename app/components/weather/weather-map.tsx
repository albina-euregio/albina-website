import React, { useState } from "react";
import LeafletMap from "../leaflet/leaflet-map";
import DataOverlay from "./dataOverlay";
import { useIntl } from "../../i18n";
import * as store from "../../stores/weatherMapStore";
import { useStore } from "@nanostores/react";
import GridOverlay from "./grid-overlay";
import StationOverlay from "./station-overlay";
import { CustomLeafletControl } from "./customLeafletControl";

const WeatherMap = ({
  playerCB,
  isPlaying,
  onMarkerSelected,
  onViewportChanged
}) => {
  const intl = useIntl();
  const [showStations, setShowStations] = useState(
    !/android|ip(hone|od|ad)/i.test(navigator.userAgent)
  );

  const domainId = useStore(store.domainId);
  const timeSpan = useStore(store.timeSpan);
  const domainConfig = useStore(store.domainConfig);
  const itemId = domainConfig.timeSpanToDataId[timeSpan];
  const grid = useStore(store.grid);
  const stations = useStore(store.stations);
  const selectedFeature = useStore(store.selectedFeature);

  const overlays = [];
  let showStationsToggle = false;
  if (domainConfig) {
    if (domainId) {
      overlays.push(
        <DataOverlay key="background-map" store={store} playerCB={playerCB} />
      );
    }

    if (domainConfig.layer.grid && grid?.features) {
      overlays.push(
        <GridOverlay
          key={"grid"}
          item={domainConfig}
          grid={grid}
          onLoading={() => {
            playerCB("grid", "loading");
          }}
          onLoad={() => {
            playerCB("gird", "load");
          }}
          onTileerror={() => {
            playerCB("grid", "error");
          }}
        />
      );
    }

    if (domainConfig.layer.stations && stations?.features && !isPlaying) {
      if (showStations)
        overlays.push(
          <StationOverlay
            key={"stations"}
            onMarkerSelected={onMarkerSelected}
            selectedFeature={selectedFeature}
            item={domainConfig}
            itemId={itemId}
            features={stations.features}
            onLoading={() => {
              playerCB("stations", "loading");
            }}
            onLoad={() => {
              playerCB("stations", "load");
            }}
            onTileerror={() => {
              playerCB("stations", "error");
            }}
          />
        );
      showStationsToggle = true;
    }
  }

  const showHideStationsCtrlInnerHTML = `<a class="leaflet-bar-part leaflet-bar-part-single tooltip" title="${intl.formatMessage(
    {
      id: showStations ? "weathermap:hidePins" : "weathermap:showPins"
    }
  )}"></a>`;
  const showHideStationsCtrl = (
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
        loaded={domainId !== false}
        identifier={domainId + "_" + itemId}
        onViewportChanged={onViewportChanged}
        overlays={overlays}
        controls={[showHideStationsCtrl]}
        mapConfigOverride={store.config.settings.mapOptionsOverride}
        tileLayerConfigOverride={store.config.settings.mapOptionsOverride}
        gestureHandling={false}
        onInit={map => {
          map.on("click", () => {
            onMarkerSelected(null);
          });
        }}
        timeAwareLayers={["background-map"]}
      />
    </>
  );
};

export default WeatherMap;
