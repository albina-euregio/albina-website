import React, { useState } from "react";
import LeafletMap from "./leaflet-map";
import DataOverlay from "./dataOverlay";
import { useIntl } from "../../i18n";
import * as store from "../../stores/weatherMapStore";
import { useStore } from "@nanostores/react";
import GridOverlay from "./grid-overlay";
import StationOverlay from "./station-overlay";
import { CustomLeafletControl } from "./customLeafletControl";

interface Props {
  isPlaying: boolean;
  onMarkerSelected: (id: string | null) => void;
}

const WeatherMap = ({ isPlaying, onMarkerSelected }: Props) => {
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

  const overlays = [];
  let showStationsToggle = false;
  if (domainConfig) {
    if (domainId) {
      overlays.push(<DataOverlay key="background-map" />);
    }

    if (domainConfig.layer.grid && grid?.features) {
      overlays.push(
        <GridOverlay key={"grid"} item={domainConfig} grid={grid} />
      );
    }

    if (domainConfig.layer.stations && stations?.length && !isPlaying) {
      if (showStations)
        overlays.push(
          <StationOverlay
            key={"stations"}
            onMarkerSelected={onMarkerSelected}
            item={domainConfig}
            itemId={itemId}
            features={stations}
          />
        );
      showStationsToggle = true;
    }
  }

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
      innerHTML={`<a class="leaflet-bar-part leaflet-bar-part-single tooltip" title="${intl.formatMessage(
        {
          id: showStations ? "weathermap:hidePins" : "weathermap:showPins"
        }
      )}"></a>`}
      onClick={() => setShowStations(v => !v)}
      enabled={showStationsToggle}
    />
  );

  return (
    <>
      <LeafletMap
        loaded={!!domainId}
        overlays={overlays}
        controls={[showHideStationsCtrl]}
        mapConfigOverride={{
          maxZoom: 12,
          minZoom: 7,
          keyboard: false
        }}
        gestureHandling={false}
        onInit={map => {
          map.invalidateSize();
          map.on("click", () => {
            onMarkerSelected(null);
          });
        }}
      />
    </>
  );
};

export default WeatherMap;
