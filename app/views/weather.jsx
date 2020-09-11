import React from "react";
import { withRouter } from "react-router-dom";
import { observer, inject, action } from "mobx-react";
import { autorun } from "mobx";
import { modal_open_by_params } from "../js/modal";
import { injectIntl } from "react-intl";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

import WeatherMap from "../components/weather/weather-map";
import FeatureInfo from "../components/weather/feature-info";
import WeatherMapStore from "../stores/weatherMapStore";
import WeatherMapStoreNew from "../stores/WeatherMapStore_new";

import WeatherMapCockpit from "../components/weather/weather-map-cockpit";

import WeatherMapTitle from "../components/weather/weather-map-title";
import MapStore from "../stores/mapStore";
import Player from "../js/player";
import { observe } from "../../node_modules/mobx/lib/mobx";

class Weather extends React.Component {
  constructor(props) {
    super(props);

    if (!config.player) {
      config.player = new Player({
        transitionTime: 1000,
        avalailableTimes: null,
        owner: this,
        onTick: this.onTick
      });
    }

    if (!config.newWM) {
      config.newWM = new WeatherMapStoreNew(this.props.match.params.domain);
      autorun(() => {
        console.log(
          "weatherMapStore_new->autorun: yyyy",
          config.newWM.timeIndices.length
        );
        if (config.newWM.timeIndices.length > 0)
          config.player.setAvailableTimes(config.newWM.timeIndices);
      });
    } else {
      console.log(
        "rechange domain 777",
        this.props.match.params.domain,
        this.props.match.params
      );
      config.newWM.changeDomain(this.props.match.params.domain);
    }
    //config.player.start();

    console.log("Weather: Store:", config.newWM);
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

  onTick(newTime) {
    console.log("onTick xxx1", newTime, new Date(newTime));
    config.newWM.changeTimeIndex(newTime);
  }

  componentDidUpdate() {
    if (
      config.newWM.domainId &&
      config.newWM.domainId !== this.props.match.params.domain
    ) {
      this.props.history.replace("/weather/map/" + config.newWM.domainId);
    }
  }

  handleClickDomainButton(menuItem) {
    console.log("handleClickDomainButton 777", menuItem);
    const newDomainId = menuItem.id;
    if (newDomainId !== config.newWM.domainId) {
      config.newWM.changeDomain(newDomainId);
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

    console.log("Weather->render xxxx1", wmStore.overlayFileName);

    return (
      <>
        <HTMLHeader
          title={this.props.intl.formatMessage({ id: "weathermap:title" })}
        />
        <PageHeadline
          title={this.props.intl.formatMessage({ id: "weathermap:headline" })}
          marginal={this.state.headerText}
        />
        <section className="section-flipper">
          <div id="flipper">
            {/* <div className="section-centered"> */}
            <div className="section-centered">
              <div className="section-padding-width flipper-header">
                {wmStore.item && <WeatherMapTitle store={wmStore} />}
              </div>
            </div>
          </div>
        </section>
        <section
          className={
            "section-map" +
            (config.map.useWindowWidth ? "" : " section-centered")
          }
        >
          {/*config.newWM.domainId*/ true && (
            <div className="weather-map-container section-map">
              <WeatherMap
                domainId={wmStore.domainId}
                domain={wmStore.domain}
                timeArray={wmStore.timeIndices}
                startDate={wmStore.startDate}
                overlay={wmStore.overlayFileName}
                dataOverlays={wmStore.domainConfig.dataOverlays}
                dataOverlaysEnabled={!config.player.playing}
                rgbToValue={wmStore.valueForPixel}
                item={wmStore.item}
                grid={wmStore.grid}
                stations={wmStore.stations}
                playerCB={config.player.onEvent.bind(config.player)}
                selectedFeature={wmStore.selectedFeature}
                onMarkerSelected={this.handleMarkerSelected}
                onViewportChanged={this.handleMapViewportChanged}
              />
              {wmStore.selectedFeature && (
                <FeatureInfo feature={wmStore.selectedFeature} />
              )}
            </div>
          )}
        </section>
        <section>
          <WeatherMapCockpit
            key="cockpit"
            startDate={wmStore.startDate}
            timeArray={wmStore.timeIndices}
            eventCallback={id => {
              console.log("Timeselector clicked", id);
              wmStore.changeTimeIndex(id);
            }}
            domainConfig={wmStore.config}
            onChangeDomain={this.handleClickDomainButton.bind(this)}
          />
        </section>
        <SmShare />
      </>
    );
  }
}
export default inject("locale")(injectIntl(withRouter(observer(Weather))));
