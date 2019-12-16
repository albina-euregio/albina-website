import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";
import { Parser } from "html-to-react";
import { ImageOverlay } from "react-leaflet";
import { renderLinkedMessage } from "../intlHelper";
import InfoBar from "../organisms/info-bar";

import LeafletMap from "../leaflet/leaflet-map";
import BulletinMapDetails from "./bulletin-map-details";
import BulletinVectorLayer from "./bulletin-vector-layer";
import MapStore from "../../stores/mapStore";
import Base from "../../base";

class BulletinMap extends React.Component {
  constructor(props) {
    super(props);
    this.map = false;
    this.lastDate;

    this.infoMessageLevels = {
      init: {
        message: "",
        iconOn: true
      },
      pending: {
        message: renderLinkedMessage(
          props.intl,
          "bulletin:header:info-loading-data-slow",
          "http://transporter.at"
        ),
        iconOn: true,
        delay: 5000
      },
      empty: {
        message: renderLinkedMessage(
          props.intl,
          "bulletin:header:info-no-data",
          "/blog"
        )
      },
      ok: { message: "", keep: true }
    };

    if (!window.mapStore) {
      window.mapStore = new MapStore();
    }
  }

  handleMapInit = map => {
    this.map = map;

    map.on("click", () => {
      this.props.handleSelectRegion(null);
    });

    if (typeof this.props.onMapInit === "function") {
      this.props.onMapInit(map);
    }
  };

  styleOverMap() {
    return {
      zIndex: 1000
    };
  }

  getMapOverlays() {
    const overlays = [];

    const b = this.props.store.activeBulletinCollection;
    if (b) {
      const daytime = b.hasDaytimeDependency() ? this.props.ampm : "fd";

      const url =
        config.get("apis.geo") +
        this.props.store.settings.date +
        "/" +
        daytime +
        "_overlay.png?" +
        b.publicationDate.getTime();
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

    if (this.props.regions) {
      overlays.push(
        <BulletinVectorLayer
          key="bulletin-regions"
          problems={this.props.store.problems}
          date={this.props.store.settings.date}
          activeRegion={this.props.store.settings.region}
          regions={this.props.regions}
          bulletin={this.props.store.activeBulletin}
          handleSelectRegion={this.props.handleSelectRegion}
          handleCenterToRegion={center => this.map.panTo(center)}
        />
      );
    }

    return overlays;
  }

  render() {
    const hlBulletin = this.props.store.activeBulletin;

    let newLevel = this.props.store.settings.status;
    if (this.lastDate != this.props.date) {
      newLevel = "init";
      this.lastDate = this.props.date;
    }

    return (
      <section
        id="section-bulletin-map"
        className="section section-bulletin section-bulletin-map"
      >
        <InfoBar level={newLevel} levels={this.infoMessageLevels} />
        <div
          className={
            "section-map" +
            (config.get("map.useWindowWidth") ? "" : " section-centered")
          }
        >
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
                  href={"#" + this.props.store.settings.region}
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
          {this.props.ampm && (
            <p className="bulletin-map-daytime">
              <span className="primary label">
                {this.props.intl.formatMessage({
                  id: "bulletin:header:" + this.props.ampm
                })}
              </span>
            </p>
          )}
        </div>
      </section>
    );
  }
}

export default inject("locale")(injectIntl(BulletinMap));
