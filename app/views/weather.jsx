import React from "react";
import { withRouter, Switch } from "react-router-dom";
import { observer, inject, action } from "mobx-react";
import { modal_open_by_params } from "../js/modal";
import { injectIntl } from "react-intl";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

import WeatherMap from "../components/weather/weather-map";
import FeatureInfo from "../components/weather/feature-info";
import WeatherMapStoreNew from "../stores/WeatherMapStore_new";

import WeatherMapCockpit from "../components/weather/weather-map-cockpit";

import MapStore from "../stores/mapStore";
import Player from "../js/player";
import { observe } from "../../node_modules/mobx/lib/mobx";

class Weather extends React.Component {
  constructor(props) {
    super(props);

    if (!config.player) {
      config.player = new Player({
        transitionTime: 1000,
        owner: this,
        onTick: this.onTick
      });
    }

    if (!config.newWM) {
      config.newWM = new WeatherMapStoreNew(this.props.match.params.domain);
    } else {
      console.log(
        "rechange domain 777",
        this.props.match.params.domain,
        this.props.match.params
      );
      config.newWM.changeDomain(this.props.match.params.domain);
    }
    //config.player.start();

    //console.log("Weather: Store:", config.newWM);
    this.state = {
      title: "",
      headerText: "",
      content: "",
      mapTitle: "",
      sharable: false,
      mapZoom: false,
      mapCenter: false
    };

    if (!window.mapStore) {
      window.mapStore = new MapStore();
    }
    this.handleMarkerSelected = this.handleMarkerSelected.bind(this);
  }

  onTick() {
    //console.log("onTick xxx1", config.newWM.nextTime);
    config.newWM.changeCurrentTime(config.newWM.nextTime);
  }

  componentDidUpdate() {
    if (
      config.newWM.domainId &&
      config.newWM.domainId !== this.props.match.params.domain
    ) {
      this.props.history.replace("/weather/map/" + config.newWM.domainId);
    }
  }

  handleClickCockpitEvent(type, value) {
    console.log("handleClickCockpitEvent 777", type, value);
    const wmStore = config.newWM;
    const player = config.player;

    switch (type) {
      case "domain":
        wmStore.changeDomain(value);
        break;
      case "timeSpan":
        wmStore.changeTimeSpan(value);
        break;
      case "time":
        wmStore.changeCurrentTime(value);
        break;
      case "play":
        if (value) player.start();
        else player.stop();
        break;
      default:
        break;
    }
  }

  handleMapViewportChanged = map => {
    mapStore.setMapViewport({
      zoom: map.zoom,
      center: map.center
    });
  };

  handleMarkerSelected = feature => {
    if (!feature) return;
    // console.log(
    //   "handleMarkerSelected", feature
    //   ,config.newWM.stations.features.find(point => point.id == feature.id)
    // );
    if (feature.id) {
      window["modalStateStore"].setData({
        stationData: config.newWM.stations.features.find(
          point => point.id == feature.id
        )
      });
      modal_open_by_params(
        null,
        "inline",
        "#weatherStationDiagrams",
        "weatherStationDiagrams",
        true
      );
      config.newWM.selectedFeature = null;
    } else {
      config.newWM.selectedFeature = feature;
    }
  };

  render() {
    const wmStore = config.newWM;
    const wmPlayer = config.player;

    console.log("Weather->render xxxx1", wmStore.domainConfig);

    return (
      <>
        <HTMLHeader
          title={this.props.intl.formatMessage({ id: "weathermap:title" })}
        />
        <PageHeadline
          title={this.props.intl.formatMessage({ id: "weathermap:headline" })}
          marginal={this.state.headerText}
        />

        <section
          id="section-weather-map"
          className="section section-weather-map"
        >
          {/*this.store.domainId*/ true && (
            <div className="section-map">
              <WeatherMap
                domainId={wmStore.domainId}
                domain={wmStore.domain}
                timeArray={wmStore.availableTimes}
                startDate={wmStore.startDate}
                overlay={wmStore.overlayFileName}
                dataOverlays={wmStore.domainConfig.dataOverlays}
                stationDataId={wmStore.domainConfig.stationDataId}
                dataOverlaysEnabled={
                  !config.player.playing && wmStore.currentTime >= wmStore.agl
                }
                rgbToValue={wmStore.valueForPixel}
                item={wmStore.item}
                grid={wmStore.grid}
                stations={!wmPlayer.playing && wmStore.stations}
                playerCB={config.player.onLayerEvent.bind(config.player)}
                selectedFeature={wmStore.selectedFeature}
                onMarkerSelected={this.handleMarkerSelected}
                onViewportChanged={this.handleMapViewportChanged}
              />
              {wmStore.selectedFeature && (
                <FeatureInfo feature={wmStore.selectedFeature} />
              )}
              <WeatherMapCockpit
                key="cockpit"
                startDate={wmStore.startDate}
                agl={wmStore.agl}
                timeArray={wmStore.availableTimes}
                storeConfig={wmStore.config}
                domainId={wmStore.domainId}
                timeSpan={wmStore.timeSpan}
                changeCurrentTime={wmStore.changeCurrentTime.bind(wmStore)}
                player={wmPlayer}
                currentTime={wmStore.currentTime}
                eventCallback={this.handleClickCockpitEvent.bind(this)}
                firstAnalyticTime={wmStore.firstAnalyticTime}
                nextTime={() => {
                  wmStore.changeCurrentTime(wmStore.nextTime);
                }}
                previousTime={() => {
                  wmStore.changeCurrentTime(wmStore.previousTime);
                }}
              />
            </div>
          )}
        </section>
        <SmShare />
      </>
    );
  }
}
export default inject("locale")(injectIntl(withRouter(observer(Weather))));
