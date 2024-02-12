import React, { useEffect, useState } from "react";
import { useIntl } from "../i18n";
import StationOverlay from "../components/weather/station-overlay";
import LeafletMap from "../components/leaflet/leaflet-map";
import HTMLHeader from "../components/organisms/html-header";
import { StationData, useStationData } from "../stores/stationDataStore";

import BeobachterAT from "../stores/Beobachter-AT.json";
import BeobachterIT from "../stores/Beobachter-IT.json";
import WeatherStationDialog from "../components/dialogs/weather-station-dialog";
import type { ObserverData } from "../components/dialogs/weather-station-diagrams";

const longitudeOffset = /Beobachter (Boden|Obertilliach|Nordkette|Kühtai)/;

export const observers = [...BeobachterAT, ...BeobachterIT].map(
  (observer): ObserverData => ({
    geometry: {
      coordinates: [
        +observer.longitude + (longitudeOffset.test(observer.name) ? 0.005 : 0),
        +observer.latitude
      ]
    },
    name: observer.name,
    id: "observer-" + observer["plot.id"],
    plot: observer["plot.id"]
  })
);

function StationMap(props) {
  const intl = useIntl();
  const [stationData, setStationData] = useState<
    StationData[] | ObserverData[]
  >();
  const [stationId, setStationId] = useState<string>();
  const { load, data } = useStationData("microRegion");

  useEffect(() => {
    load();
  }, [load]);

  const stationOverlay = (
    <StationOverlay
      key={"stations"}
      onMarkerSelected={feature => {
        setStationData(data);
        setStationId(feature.id);
      }}
      itemId="any"
      item={{
        id: "name",
        colors: [[25, 171, 255]],
        thresholds: [],
        clusterOperation: "none"
      }}
      features={data}
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
        setStationId={setStationId}
      />
      <HTMLHeader title={intl.formatMessage({ id: "menu:weather:stations" })} />
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

export default StationMap;
