import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useIntl } from "react-intl";
import StationOverlay from "../components/weather/station-overlay";
import LeafletMap from "../components/leaflet/leaflet-map";
import HTMLHeader from "../components/organisms/html-header";
import StationDataStore, { StationData } from "../stores/stationDataStore";

import BeobachterAT from "../stores/Beobachter-AT.json";
import BeobachterIT from "../stores/Beobachter-IT.json";
import WeatherStationDialog from "../components/dialogs/weather-station-dialog";

const longitudeOffset = /Beobachter (Boden|Obertilliach|Nordkette|Kühtai)/;

const observers = [...BeobachterAT, ...BeobachterIT].map(observer => ({
  geometry: {
    coordinates: [
      +observer.longitude + (longitudeOffset.test(observer.name) ? 0.005 : 0),
      +observer.latitude
    ]
  },
  name: observer.name,
  id: "observer-" + observer["plot.id"],
  plot: observer["plot.id"]
}));

function StationMap(props) {
  const intl = useIntl();
  const [store] = useState(() =>
    new StationDataStore().sortBy("microRegion", "asc")
  );
  const [stationData, setStationData] = useState<StationData[]>();
  const [stationId, setStationId] = useState<string>();

  useEffect(() => {
    store.load();
  }, [store]);

  const stationOverlay = (
    <StationOverlay
      key={"stations"}
      onMarkerSelected={feature => {
        setStationData(store.data);
        setStationId(feature.id);
      }}
      itemId="any"
      item={{
        id: "name",
        colors: [[25, 171, 255]],
        thresholds: [],
        clusterOperation: "none"
      }}
      features={store.data}
    />
  );

  const observerOverlay = (
    <StationOverlay
      key={"observers"}
      onMarkerSelected={feature => {
        setStationData(observers);
        setStationId(feature.id);
      }}
      itemId="any"
      item={{
        id: "name",
        colors: [[202, 0, 32]],
        thresholds: [],
        clusterOperation: "none"
      }}
      features={observers}
    />
  );
  const overlays = [stationOverlay, observerOverlay];
  return (
    <>
      <WeatherStationDialog
        stationData={stationData}
        stationId={stationId}
        setStationId={stationId => setStationId(stationId)}
      />
      <HTMLHeader title={intl.formatMessage({ id: "menu:lawis:station" })} />
      <section id="section-weather-map" className="section section-weather-map">
        <div className="section-map">
          <LeafletMap
            loaded={props.domainId !== false}
            onViewportChanged={() => {}}
            mapConfigOverride={config.weathermaps.settings.mapOptionsOverride}
            tileLayerConfigOverride={
              config.weathermaps.settings.mapOptionsOverride
            }
            overlays={overlays}
          />
        </div>
      </section>
    </>
  );
}

export default observer(StationMap);
