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

import WeatherMapTitle from "../components/weather/weather-map-title";
import MapStore from "../stores/mapStore";
import Player from "../js/player";
import { observe } from "../../node_modules/mobx/lib/mobx";

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.store = new WeatherMapStore(this.props.match.params.domain);
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
    } else config.newWM.changeDomain(this.props.match.params.domain);

    //config.player.start();

    console.log("Weather: Store:", this.store);
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
      this.store.domainId &&
      this.store.domainId !== this.props.match.params.domain
    ) {
      this.props.history.replace("/weather/map/" + this.store.domainId);
    }
  }

  handleClickDomainButton(menuItem) {
    const newDomainId = menuItem.id;
    if (newDomainId !== this.store.domainId) {
      this.store.changeDomain(newDomainId);
    }
  }

  handleChangeItem(newItemId) {
    this.store.changeItem(newItemId);
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
    //   ,this.store.stations.features.find(point => point.id == feature.id)
    // );
    if (feature.id) {
      window["modalStateStore"].setData({
        stationData: this.store.stations.features.find(
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
      this.store.selectedFeature = null;
    } else {
      this.store.selectedFeature = feature;
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
                {this.store.item && <WeatherMapTitle store={wmStore} />}
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
          {/*this.store.domainId*/ true && (
            <div className="weather-map-container section-map">
              <WeatherMap
                domainId={wmStore.domainId}
                domain={wmStore.domain}
                domainConfig={wmStore.config}
                timeArray={wmStore.timeIndices}
                startDate={wmStore.startDate}
                overlay={wmStore.overlayFileName}
                dataOverlays={wmStore.domainConfig.dataOverlays}
                dataOverlaysEnabled={!config.player.playing}
                rgbToValue={wmStore.valueForPixel}
                eventCallback={id => {
                  console.log("Timeselector clicked", id);
                  wmStore.changeTimeIndex(id);
                }}
                item={wmStore.item}
                grid={wmStore.grid}
                stations={wmStore.stations}
                playerCB={config.player.onEvent.bind(config.player)}
                selectedFeature={wmStore.selectedFeature}
                onMarkerSelected={this.handleMarkerSelected}
                onViewportChanged={this.handleMapViewportChanged}
              />
              {this.store.selectedFeature && (
                <FeatureInfo feature={this.store.selectedFeature} />
              )}
            </div>
          )}
        </section>
        <SmShare />
      </>
    );
  }
}
export default inject("locale")(injectIntl(withRouter(observer(Weather))));
