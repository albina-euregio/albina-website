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
import Player from "../js/player";
import WeatherStationDialog from "../components/dialogs/weather-station-dialog";

const Weather = () => {
  const intl = useIntl();
  const router = useStore($router);
  const params = router?.params;
  const [stationId, setStationId] = useState("");

  const [headerText] = useState("");

  const [playing, setPlaying] = useState(false);

  const domainId = useStore(store.domainId);
  const stations = useStore(store.stations);
  const selectedFeature = useStore(store.selectedFeature);

  const [player] = useState(() => {
    //console.log("player->new Player s05");
    return Player({
      transitionTime: 1000,
      onTick: () => {
        //console.log("player->onTick s05");
        store.changeCurrentTime(store.nextTime);
      },
      onStop: () => {
        setPlaying(false);
      },
      onStart: () => {
        setPlaying(true);
      }
    });
  });

  useEffect(() => {
    const footer = document.getElementById("page-footer");
    if (!footer) return;
    footer.style.display = "none";
    return () => {
      footer.style.display = "";
    };
  }, []);

  useEffect(() => {
    //console.log("weather->useeffect[params.domain]", {params});
    store.changeDomain(params.domain, params.timeSpan);
  }, [params.domain, params.timeSpan]);

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
              isPlaying={playing}
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
