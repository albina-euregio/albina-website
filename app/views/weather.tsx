import React, { useEffect, useState } from "react";
import { useIntl } from "../i18n";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import WeatherMap from "../components/weather/weather-map";
import FeatureInfo from "../components/weather/feature-info";
import * as store from "../stores/weatherMapStore";
import { useStore } from "@nanostores/react";
import WeatherMapCockpit from "../components/weather/weather-map-cockpit";
import { $router } from "../components/router";
import { redirectPage } from "@nanostores/router";
import Player from "../js/player";
import WeatherStationDialog from "../components/dialogs/weather-station-dialog";

const Weather = () => {
  const intl = useIntl();
  const router = useStore($router);
  const params = router?.params;
  const [stationId, setStationId] = useState("");

  const [headerText] = useState("");

  const domainId = useStore(store.domainId);
  const currentTime = useStore(store.currentTime);
  const stations = useStore(store.stations);
  const selectedFeature = useStore(store.selectedFeature);

  // Player tracks overlay load events (loading/load/error) for layer coordination.
  // The onTick animation is handled by timeline.tsx's internal player instead.
  const [player] = useState(() =>
    Player({ transitionTime: 1000, onTick: () => {} })
  );

  useEffect(() => {
    const footer = document.getElementById("page-footer");
    if (!footer) return;
    footer.style.display = "none";
    return () => {
      footer.style.display = "";
    };
  }, []);

  useEffect(() => {
    store.initDomain(params.domain, params.timeSpan, params.timestamp);
  }, [params.domain, params.timeSpan, params.timestamp]);

  // Sync resolved timestamp to URL when navigating without one (e.g., /weather/map/new-snow/)
  // This ensures the URL always reflects the current state for bookmarking and reload.
  useEffect(() => {
    if (currentTime && domainId && !params.timestamp) {
      redirectPage($router, "weatherMapDomainTimestamp", {
        domain: domainId,
        timestamp: currentTime.toISOString(),
        timeSpan: store.timeSpan.get()
      });
    }
  }, [currentTime, domainId, params.timestamp]);

  return (
    <>
      <WeatherStationDialog
        stationData={stations ?? []}
        stationId={stationId}
        setStationId={setStationId}
      />
      <HTMLHeader title={intl.formatMessage({ id: "weathermap:title" })} />
      <PageHeadline
        title={intl.formatMessage({ id: "weathermap:headline" })}
        marginal={headerText}
      />

      <section
        id="section-weather-map"
        className="section section-weather-map section-weather-map-cockpit"
      >
        {domainId && (
          <div className="section-map">
            <WeatherMap
              playerCB={player.onLayerEvent}
              isPlaying={false}
              onMarkerSelected={feature => setStationId(feature?.id)}
              onViewportChanged={() => {}}
            />
            {selectedFeature && <FeatureInfo feature={selectedFeature} />}
            <WeatherMapCockpit key="cockpit" />
          </div>
        )}
      </section>
      <SmShare />
    </>
  );
};
export default Weather;
