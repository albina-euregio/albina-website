import React, { useEffect, useState } from "react";
import $ from "jquery";

import { observer } from "mobx-react";
import { useIntl } from "../i18n";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

import WeatherMap from "../components/weather/weather-map";
import FeatureInfo from "../components/weather/feature-info";
import WeatherMapStore from "../stores/weatherMapStore";

import WeatherMapCockpit from "../components/weather/weather-map-cockpit";
import { useParams } from "wouter";

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

  const handleClickCockpitEvent = (type, value) => {
    //console.log("handleClickCockpitEvent 777", type, value);

    switch (type) {
      case "domain":
        store.changeDomain(value);
        break;
      case "timeSpan":
        store.changeTimeSpan(value);
        break;
      case "time":
        store.changeCurrentTime(value);
        break;
      case "play":
        if (value) player.start();
        else player.stop();
        break;
      default:
        break;
    }
  };

  // console.log(
  //   "weather->render",
  //   new Date(store.currentTime),
  //   store.agl,
  //   player
  // );
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
        {
          /*store.domainId*/ true && (
            <div className="section-map">
              <WeatherMap
                domainId={store.domainId}
                domain={store.domain}
                timeArray={store.availableTimes}
                currentTime={store.currentTime}
                startDate={store.startDate}
                overlay={store.overlayFileName}
                dataOverlayFilePostFix={
                  store.config.settings.dataOverlayFilePostFix
                }
                dataOverlays={store.domainConfig.dataOverlays}
                stationDataId={
                  store.domainConfig.timeSpanToDataId[store.timeSpan]
                }
                dataOverlaysEnabled={
                  !store.domainConfig.layer.stations ||
                  store.currentTime > store.agl
                }
                rgbToValue={store.valueForPixel}
                item={store.item}
                debug={store.config.settings.debugModus}
                grid={store.grid}
                stations={!playing && store.stations}
                playerCB={player.onLayerEvent}
                isPlaying={playing}
                selectedFeature={store.selectedFeature}
                onMarkerSelected={feature => setStationId(feature?.id)}
                onViewportChanged={() => {}}
              />
              {store.selectedFeature && (
                <FeatureInfo feature={store.selectedFeature} />
              )}
              <WeatherMapCockpit
                key="cockpit"
                startDate={store.startDate}
                agl={store.agl}
                timeArray={store.availableTimes}
                storeConfig={store.config}
                domainId={store.domainId}
                timeSpan={store.timeSpan}
                changeCurrentTime={store.changeCurrentTime.bind(store)}
                player={player}
                currentTime={store.currentTime}
                eventCallback={handleClickCockpitEvent.bind(this)}
                lastAnalyticTime={store.startDate}
                nextUpdateTime={store.nextUpdateTime}
                lastUpdateTime={store.lastUpdateTime}
                nextTime={() => {
                  store.changeCurrentTime(store.nextTime);
                }}
                previousTime={() => {
                  store.changeCurrentTime(store.previousTime);
                }}
              />
            </div>
          )
        }
      </section>
      <SmShare />
    </>
  );
};
export default observer(Weather);
