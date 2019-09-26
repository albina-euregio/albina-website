import React from "react";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { Parser } from "html-to-react";
import { ImageOverlay } from "react-leaflet";
import { centroid, polygon } from "@turf/turf";
import { Link } from "react-router-dom";

import LeafletMap from "../leaflet/leaflet-map";
import BulletinMapDetails from "./bulletin-map-details";
import BulletinVectorLayer from "./bulletin-vector-layer";
import MapStore from "../../stores/mapStore";
import Base from "../../base";

class BulletinMap extends React.Component {
  constructor(props) {
    super(props);
    this.map = false;

    if(!window.mapStore) {
      window.mapStore = new MapStore();
    }
  }

  handleMapInit = (map) => {
    this.map = map;
    if(typeof this.props.onMapInit === 'function') {
      this.props.onMapInit(map);
    }
  }

  styleOverMap() {
    return {
      zIndex: 1000
    };
  }

  getMapOverlays() {
    const overlays = [];

    const b = this.props.store.activeBulletinCollection;
    if (b) {
      const daytime = b.hasDaytimeDependency()
        ? this.props.ampm
        : "fd";

      const url =
        config.get("apis.geo") +
        this.props.store.settings.date +
        "/" +
        daytime +
        "_overlay.png";
      const params = config.get("map.overlay");

      overlays.push(
        <ImageOverlay
          key="bulletin-overlay"
          url={url}
          {...params}
          opacity={Base.checkBlendingSupport() ? 1 : 0.5}
        />
      );
    }

    if(this.props.regions) {
      overlays.push(
        <BulletinVectorLayer
          key="bulletin-regions"
          store={bulletinStore}
          regions={this.props.regions}
          handleSelectRegion={this.props.handleSelectRegion}
          handleCenterToRegion={this.centerToRegion.bind(this)}
        />
      );
    }

    return overlays;
  }

  centerToRegion(bid) {
    if (bid && this.props.regions && this.props.regions.length > 0) {
      const region = this.props.regions.find(r => r.properties.bid === bid);
      if (region) {
        const regionCentroid = centroid(region);
        if (
          this.map &&
          regionCentroid.geometry &&
          regionCentroid.geometry.coordinates
        ) {
          this.map.panTo(regionCentroid.geometry.coordinates);
        }
      }
    }
  }

  renderNoBulletinMessage() {
    const msg = this.props.intl.formatHTMLMessage({
      id: 'bulletin:header:no-bulletin-info'
    });

    // split the string at <a> and </a>
    const parts = msg.match(/^(.*)<a[^>]*>([^<]*)<\/a>(.*)$/)

    return (
      <p>
        {parts.length > 1 && new Parser().parse(parts[1])}
        {parts.length > 2 &&
        <Link
          to='/blog'
          className='tooltip'
          title={parts[2]}>
          <strong>{parts[2]}</strong>
        </Link>}
        {parts.length > 3 && new Parser().parse(parts[3])}
      </p>
    );
  }

  render() {
    const hlBulletin = this.props.store.activeBulletin;


    return (
      <section
        id="section-bulletin-map"
        className="section section-bulletin section-bulletin-map"
      >
        <div
          className={
            "bulletin-map-container section-map" +
            (config.get("map.useWindowWidth") ? "" : " section-centered")
          }
        >
          {/*
              no-bulletin banner
            */
          ["", "empty"].includes(this.props.store.settings.status) &&
            config.get("bulletin.noBulletinBanner") && (
              <section className="bulletinbar section controlbar">
                <div className="bar section-centered">
                  { this.renderNoBulletinMessage() }
                </div>
              </section>
            )}
          <LeafletMap
            loaded={this.props.regions && this.props.regions.length > 0}
            onViewportChanged={this.props.handleMapViewportChanged}
            overlays={this.getMapOverlays()}
            onInit={this.handleMapInit}
          />
          {false /* hide map search */ && (
            <div style={this.styleOverMap()} className="bulletin-map-search">
              <div className="pure-form pure-form-search">
                <input
                  type="text"
                  id="input"
                  className="tooltip"
                  placeholder={this.props.intl.formatMessage({
                    id: "bulletin:map:search"
                  })}
                  title={this.props.intl.formatMessage({
                    id: "bulletin:map:search:hover"
                  })}
                />
                <button
                  href="#"
                  title="The Button"
                  className="pure-button pure-button-icon icon-search"
                >
                  <span>&nbsp;</span>
                </button>
              </div>
            </div>
          )}
          {hlBulletin && (
            <div
              style={this.styleOverMap()}
              className="bulletin-map-details js-active top-right"
            >
              <BulletinMapDetails
                store={this.props.store}
                bulletin={hlBulletin}
                ampm={this.props.ampm}
              />
              {this.props.store.settings.region && (
                <a
                  href="#section-bulletin-buttonbar"
                  className="pure-button tooltip"
                  title={this.props.intl.formatMessage({
                    id: "bulletin:map:info:details:hover"
                  })}
                  data-scroll=""
                >
                  {new Parser().parse(
                    this.props.intl.formatHTMLMessage({
                      id: "bulletin:map:info:details"
                    })
                  )}
                  <span className="icon-arrow-down" />
                </a>
              )}
            </div>
          )}
          {this.props.ampm && 
            <div className="bulletin-map-daytime">{this.props.ampm}</div>
          }
        </div>
      </section>
    );
  }
}

export default inject("locale")(injectIntl(BulletinMap));
