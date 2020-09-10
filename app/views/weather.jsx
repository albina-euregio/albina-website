import React from "react";
import { withRouter } from "react-router-dom";
import { observer, inject, action } from "mobx-react";
import { autorun } from "mobx";
import { modal_open_by_params } from "../js/modal";
import { injectIntl } from "react-intl";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

import Menu from "../components/menu";
import WeatherMap from "../components/weather/weather-map";
import FeatureInfo from "../components/weather/feature-info";
import WeatherMapStore from "../stores/weatherMapStore";
import WeatherMapStoreNew from "../stores/WeatherMapStore_new";

import ItemFlipper from "../components/weather/item-flipper";
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
    const domainButtons = this.store.config
      ? Object.keys(this.store.config).map(domainId => {
          const domain = this.store.config[domainId];
          return {
            id: domainId,
            title: domain.description[appStore.language],
            url: "/weather/map/" + domainId,
            isExternal: false
          };
        })
      : [];
    console.log("Weather->render xxxx1", config.newWM.overlayFileName);

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
            <div className="section-padding-width flipper-controls">
              <Menu
                intl={this.props.intl}
                className="list-inline list-buttongroup-dense flipper-buttongroup flipper-centered"
                entries={domainButtons}
                childClassName="list-plain subnavigation"
                menuItemClassName="secondary pure-button"
                activeClassName="js-active"
                onSelect={this.handleClickDomainButton.bind(this)}
                onActiveMenuItem={e => {
                  if (e.title != this.state.mapTitle) {
                    const that = this;
                    window.setTimeout(
                      () => that.setState({ mapTitle: e.title }),
                      100
                    );
                  }
                }}
              />
              <ItemFlipper
                store={this.store}
                handleChange={this.handleChangeItem.bind(this)}
              />
            </div>

            <div className="section-centered">
              <div className="section-padding-width flipper-header">
                {this.store.item && <WeatherMapTitle store={config.newWM} />}
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
                domainId={config.newWM.domainId}
                domain={config.newWM.domain}
                timeArray={config.newWM.timeIndices}
                startDate={config.newWM.startDate}
                overlay={config.newWM.overlayFileName}
                dataOverlays={config.newWM.domainConfig.dataOverlays}
                dataOverlaysEnabled={!config.player.playing}
                rgbToValue={config.newWM.valueForPixel}
                eventCallback={id => {
                  console.log("Timeselector clicked", id);
                  config.newWM.changeTimeIndex(id);
                }}
                item={config.newWM.item}
                grid={config.newWM.grid}
                stations={config.newWM.stations}
                playerCB={config.player.onEvent.bind(config.player)}
                selectedFeature={config.newWM.selectedFeature}
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
