import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";
import { Parser } from "html-to-react";
import { ImageOverlay } from "react-leaflet";
import { Link } from "react-router-dom";
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
    this.messageIntervall;

    this.infoMessages = {
      loading: {
        intlId: "bulletin:header:info-loading-data-slow",
        link: "http://transporter.at"
      },
      noBulletin: { intlId: "bulletin:header:info-no-data", link: "/blog" }
    };

    if (!window.mapStore) {
      window.mapStore = new MapStore();
    }

    this.state = { currentInfoMessage: "" };
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

  renderLinkedMessage(intlId, link) {
    const msg = this.props.intl.formatHTMLMessage({
      id: intlId
    });

    // split the string at <a> and </a>
    const parts = msg.match(/^(.*)<a[^>]*>([^<]*)<\/a>(.*)$/);

    return (
      <span>
        {parts.length > 1 && new Parser().parse(parts[1])}
        {parts.length > 2 && (
          <Link to={link} className="tooltip" title={parts[2]}>
            <strong>{parts[2]}</strong>
          </Link>
        )}
        {parts.length > 3 && new Parser().parse(parts[3])}
      </span>
    );
  }

  setInfoMessage() {
    let self = this;
    let infoMessage = this.state.currentInfoMessage;
    let delay;

    if (this.props.date != this.lastDate) {
      infoMessage = "";
      this.lastDate = this.props.date;
    } else {
      if (["pending", "canceled"].includes(this.props.store.settings.status)) {
        delay = 4000;
        infoMessage = "loading";
      }
      if (["empty"].includes(this.props.store.settings.status)) {
        infoMessage = "noBulletin";
      }
      if (["ok"].includes(this.props.store.settings.status)) {
        if (this.messageIntervall) infoMessage = "ok";
      }
    }

    //console.log("setInfoMessage", this.props.store.settings.status, this.messageIntervall, this.state.currentInfoMessage, infoMessage);

    if (this.state.currentInfoMessage != infoMessage) {
      if (delay) {
        this.messageIntervall = setTimeout(() => {
          self.messageIntervall = undefined;
          self.setState({ currentInfoMessage: infoMessage });
        }, delay);
      } else {
        if (self.messageIntervall) {
          clearTimeout(self.messageIntervall);
          this.messageIntervall = undefined;
        }
        this.setState({ currentInfoMessage: infoMessage });
      }
    }
  }

  setLoadingIndicator() {
    //show hide loading image
    if (["", "pending"].includes(this.props.store.settings.status)) {
      $("html").addClass("page-loading");
      $("html").removeClass("page-loaded");
    } else {
      $("html").removeClass("page-loading");
      setTimeout(() => {
        $("html").addClass("page-loaded");
      }, 1000);
    }
  }

  componentDidUpdate() {
    this.setInfoMessage();
    this.setLoadingIndicator();
  }

  render() {
    const hlBulletin = this.props.store.activeBulletin;
    const infoMessage = ["", "ok"].includes(this.state.currentInfoMessage)
      ? ""
      : this.renderLinkedMessage(
          this.infoMessages[this.state.currentInfoMessage].intlId,
          this.infoMessages[this.state.currentInfoMessage].link
        );

    return (
      <section
        id="section-bulletin-map"
        className="section section-bulletin section-bulletin-map"
      >
        <InfoBar message={infoMessage} />
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
