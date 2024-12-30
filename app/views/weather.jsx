import React, { useEffect, useState } from "react";
import $, { data } from "jquery";

import { observer } from "mobx-react";
import { useIntl } from "../i18n";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

import WeatherMap from "../components/weather/weather-map";
import FeatureInfo from "../components/weather/feature-info";
import WeatherMapStore from "../stores/weatherMapStore";

import WeatherMapCockpit from "../components/weather/weather-map-cockpit";
import { useParams } from "react-router-dom";

import Player from "../js/player";
import WeatherStationDialog from "../components/dialogs/weather-station-dialog";

const Weather = () => {
  const intl = useIntl();
  const params = useParams();
  const [stationId, setStationId] = useState("");

  const [headerText] = useState("");

  const [store] = useState(() => new WeatherMapStore(params.domain));
  const [playing, setPlaying] = useState(false);

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
    $("#page-footer").css({ display: "none" });

    return () => {
      $("#page-footer").css({ display: "" });
    };
  }, []);

  useEffect(() => {
    //console.log("weather->useeffect[params.domain]");
    store.changeDomain(params.domain);
  }, [params.domain]);

  // console.log("weather->render #i011", {
  //   domainId: store.domainId,
  //   dataOverlays: store.domainConfig.dataOverlays,
  //   overlaysEnabled: !store.domainConfig.layer.stations || store.currentTime > store.agl,
  //   agl: store.agl,
  //   currentTime: store.currentTime

  // });
  return (
    <>
      <WeatherStationDialog
        stationData={store.stations?.features ?? []}
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
        {store.domainId && (
          <div className="section-map">
            <WeatherMap
              store={store}
              playerCB={player.onLayerEvent}
              isPlaying={playing}
              onMarkerSelected={feature => setStationId(feature?.id)}
              onViewportChanged={() => {}}
            />
            {store.selectedFeature && (
              <FeatureInfo feature={store.selectedFeature} />
            )}
            <WeatherMapCockpit key="cockpit" store={store} />
          </div>
        )}
      </section>
      <SmShare />
    </>
  );
};
export default observer(Weather);
