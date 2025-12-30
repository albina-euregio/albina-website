import React, { useEffect } from "react";
import { useIntl } from "../i18n";
import StationOverlay from "../components/weather/station-overlay";
import LeafletMap from "../components/leaflet/leaflet-map";
import HTMLHeader from "../components/organisms/html-header";
import { useStationData } from "../stores/stationDataStore";

import BeobachterAT from "../stores/Beobachter-AT.json";
import BeobachterIT from "../stores/Beobachter-IT.json";
import WeatherStationDialog, {
  useStationId
} from "../components/dialogs/weather-station-dialog";
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
    $smet: BeobachterAT.includes(observer)
      ? `https://api.avalanche.report/lawine/grafiken/smet/all/${observer.number}.smet.gz`
      : "",
    $png: "https://wiski.tirol.gv.at/lawine/grafiken/{width}/beobachter/{name}{year}.png?{t}",
    plot: observer["plot.id"]
  })
);

function StationMap(props) {
  const intl = useIntl();
  const [stationId, setStationId] = useStationId();
  const { load, data } = useStationData("microRegion");

  useEffect(() => {
    const footer = document.getElementById("page-footer");
    if (!footer) return;
    footer.style.display = "none";
    return () => {
      footer.style.display = "";
    };
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stationOverlay = (
    <StationOverlay
      key={"stations"}
      onMarkerSelected={feature => {
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
      {!!data.length && (
        <WeatherStationDialog
          stationData={[...data, ...observers]}
          stationId={stationId}
          setStationId={setStationId}
        />
      )}
      <HTMLHeader title={intl.formatMessage({ id: "menu:weather:stations" })} />
      <section id="section-weather-map" className="section section-weather-map">
        <div className="section-map">
          <LeafletMap
            loaded={props.domainId !== false}
            onViewportChanged={() => {}}
            onInit={e => {
              e.invalidateSize();
            }}
            mapConfigOverride={{ maxZoom: 12 }}
            tileLayerConfigOverride={{ maxZoom: 12 }}
            overlays={overlays}
          />
        </div>
      </section>
    </>
  );
}

export default StationMap;
