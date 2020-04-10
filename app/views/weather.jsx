import React from "react";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import { modal_open_by_params } from "../js/modal";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

import Menu from "../components/menu";
import WeatherMap from "../components/weather/weather-map";
import FeatureInfo from "../components/weather/feature-info";
import WeatherMapStore from "../stores/weatherMapStore";

import ItemFlipper from "../components/weather/item-flipper";
import WeatherMapTitle from "../components/weather/weather-map-title";
import MapStore from "../stores/mapStore";

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.store = new WeatherMapStore(this.props.match.params.domain);

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

  componentDidMount() {
    window["staticPageStore"].loadPage("weather/map").then(responseParsed => {
      this.setState({
        title: responseParsed.data.attributes.title,
        headerText: responseParsed.data.attributes.header_text,
        content: responseParsed.data.attributes.body,
        sharable: responseParsed.data.attributes.sharable
      });
    });
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
    return (
      <>
        <HTMLHeader title={this.state.title} />
        <PageHeadline
          title={this.state.title}
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
                {this.store.item && <WeatherMapTitle store={this.store} />}
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
                domainId={this.store.domainId}
                domain={this.store.domain}
                itemId={this.store.itemId}
                item={this.store.item}
                grid={this.store.grid}
                stations={this.store.stations}
                selectedFeature={this.store.selectedFeature}
                onMarkerSelected={this.handleMarkerSelected}
                onViewportChanged={this.handleMapViewportChanged}
              />
              {this.store.selectedFeature && (
                <FeatureInfo feature={this.store.selectedFeature} />
              )}
            </div>
          )}
        </section>
        {this.state.sharable ? (
          <SmShare />
        ) : (
          <div className="section-padding" />
        )}
      </>
    );
  }
}
export default withRouter(observer(Weather));
