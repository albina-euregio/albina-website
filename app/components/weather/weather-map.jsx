import React, { useState } from "react";
import { observer } from "mobx-react";
import LeafletMap from "../leaflet/leaflet-map";
import DataOverlay from "./dataOverlay";
import { useIntl } from "../../i18n";

import GridOverlay from "./grid-overlay";
import StationOverlay from "./station-overlay";
import { CustomLeafletControl } from "./customLeafletControl";

/**
 * @param store {WeatherMapStore}
 */
const WeatherMap = ({
  store,
  playerCB,
  isPlaying,
  onMarkerSelected,
  onViewportChanged
}) => {
  const intl = useIntl();
  const [showStations, setShowStations] = useState(
    !/android|ip(hone|od|ad)/i.test(navigator.userAgent)
  );

  const domainId = store.domainId;
  const startDate = store.startDate;
  const itemId = store.domainConfig.timeSpanToDataId[store.timeSpan];
  const item = store.item;
  const grid = store.grid;
  const stations = store.stations;
  const selectedFeature = store.selectedFeature;

  const overlays = [];
  let showStationsToggle = false;
  if (item) {
    if (domainId) {
      overlays.push(
        <DataOverlay key="background-map" store={store} playerCB={playerCB} />
      );
    }

    if (item.layer.grid && grid && grid.features) {
      overlays.push(
        <GridOverlay
          key={"grid"}
          item={item}
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

    if (item.layer.stations && stations && stations.features && !isPlaying) {
      if (showStations)
        overlays.push(
          <StationOverlay
            key={"stations"}
            onMarkerSelected={onMarkerSelected}
            selectedFeature={selectedFeature}
            item={item}
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
        loaded={domainId !== false}
        identifier={domainId + "_" + itemId}
        onViewportChanged={onViewportChanged}
        overlays={overlays}
        controls={[showHideStationsCtrl]}
        mapConfigOverride={store.config.settings.mapOptionsOverride}
        tileLayerConfigOverride={store.config.settings.mapOptionsOverride}
        startDate={startDate}
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

export default observer(WeatherMap);
