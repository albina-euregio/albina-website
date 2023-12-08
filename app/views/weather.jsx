import React, { useEffect, useState } from "react";
import $ from "jquery";

import { observer } from "mobx-react";
import { modal_open_by_params } from "../js/modal";
import { useIntl } from "react-intl";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

import WeatherMap from "../components/weather/weather-map";
import FeatureInfo from "../components/weather/feature-info";
import WeatherMapStore from "../stores/weatherMapStore";
import { MAP_STORE } from "../stores/mapStore";

import WeatherMapCockpit from "../components/weather/weather-map-cockpit";
import { useParams } from "react-router-dom";

import Player from "../js/player";

const Weather = () => {
  const intl = useIntl();
  const params = useParams();

  const [headerText] = useState("");

  const [store] = useState(() => new WeatherMapStore(params.domain));

  const [player] = useState(
    () =>
      new Player({
        transitionTime: 1000,
        owner: this,
        onTick: () => {
          store.changeCurrentTime(store.nextTime);
        }
      })
  );

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

  const handleMapViewportChanged = map => {
    MAP_STORE.setMapViewport({
      zoom: map.zoom,
      center: map.center
    });
  };

  const handleMarkerSelected = feature => {
    if (!feature) return;
    // console.log(
    //   "handleMarkerSelected ggg1",
    //   feature,
    //   store.stations.features.find(
    //     point => point.id == feature.id
    //   )
    // );
    if (feature.id) {
      window["modalStateStore"].setData({
        stationData: store.stations.features.sort((f1, f2) =>
          (f1.properties["LWD-Region"] || "").localeCompare(
            f2.properties["LWD-Region"] || "",
            "de"
          )
        ),
        rowId: feature.id
      });
      modal_open_by_params(
        null,
        "inline",
        "#weatherStationDiagrams",
        "weatherStationDiagrams",
        true
      );
      //store.selectedFeature = null;
    } else {
      //store.selectedFeature = feature;
    }
  };

  //console.log("weather->render", store.domainId, store.agl, player);
  return (
    <>
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
                  store.currentTime >= store.agl
                }
                rgbToValue={store.valueForPixel}
                item={store.item}
                debug={store.config.settings.debugModus}
                grid={store.grid}
                stations={!player.playing && store.stations}
                playerCB={player.onLayerEvent.bind(player)}
                isPlaying={player.playing}
                selectedFeature={store.selectedFeature}
                onMarkerSelected={handleMarkerSelected}
                onViewportChanged={handleMapViewportChanged}
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
