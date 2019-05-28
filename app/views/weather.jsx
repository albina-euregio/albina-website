import React from "react";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import { Parser } from "html-to-react";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import { preprocessContent } from "../util/htmlParser";

import Base from "../base";
import { dateToLongDateString, dateToTimeString } from "../util/date";
import Menu from "../components/menu";
import WeatherMap from "../components/weather/weather-map";
import FeatureInfo from "../components/weather/feature-info";
import WeatherMapStore from "../stores/weatherMapStore";

import ItemFlipper from "../components/weather/item-flipper";
import WeatherMapTitle from "../components/weather/weather-map-title";
import MapStore from "../stores/mapStore";
import AppStore from "../appStore";

@observer
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

    if(!window.mapStore) {
      window.mapStore = new MapStore();
    }
  }

  componentDidMount() {
    window["staticPageStore"].loadPage("weather/map").then(response => {
      if (this.store.domainId !== this.props.match.params.domain) {
        this.props.history.replace("/weather/map/" + this.store.domainId);
      }
      // parse content
      const responseParsed = JSON.parse(response);
      this.setState({
        title: responseParsed.data.attributes.title,
        headerText: responseParsed.data.attributes.header_text,
        content: responseParsed.data.attributes.body,
        sharable: responseParsed.data.attributes.sharable
      });
    });
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

  handleMapViewportChanged = (data) => {
    console.log('VIEWPORT: ' + JSON.stringify(data));
    mapStore.mapZoom.set(data.zoom);
    mapStore.mapCenter.set(data.center);
  };

  handleMarkerSelected = (feature) => {
    this.store.selectedFeature = feature;
  }

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
      <div>
        <PageHeadline
          title={this.state.title}
          marginal={this.state.headerText}
        />
        <section className="section-flipper">
          <div id="flipper">
            <div className="section-padding-width flipper-controls">
              <div className="section-centered">
                <Menu
                  className="list-inline flipper-buttongroup"
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
            (config.get("map.useWindowWidth") ? "" : " section-centered")
          }
        >
          {this.store.domain && (
            <div className="bulletin-map-container weather-map-container section-map"
              onClick={(e) => { this.handleMarkerSelected(null); }}
              >
              <WeatherMap
                domain={this.store.domain}
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
        <div>{preprocessContent(this.state.content)}</div>
        {this.state.sharable ? (
          <SmShare />
        ) : (
          <div className="section-padding" />
        )}
      </div>
    );
  }
}
export default withRouter(observer(Weather));