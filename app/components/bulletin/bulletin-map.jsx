import React from "react";
import { Link } from "react-router-dom";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { GeoJSON, ImageOverlay } from "react-leaflet";
import InfoBar from "../organisms/info-bar";
import { dateToISODateString, parseDate } from "../../util/date";

import LeafletMap from "../leaflet/leaflet-map";
import { Util } from "leaflet";
import BulletinMapDetails from "./bulletin-map-details";
import BulletinVectorLayer from "./bulletin-vector-layer";
import { isBlendingSupported } from "../../util/blendMode";
import { preprocessContent } from "../../util/htmlParser";

import { getPublicationTimeString } from "../../util/date.js";
import { observer } from "mobx-react";

/**
 * @typedef {object} Props
 * @prop {import("../../stores/bulletinStore").BulletinStore} store
 * @prop {*} date
 * @prop {*} intl
 * ... props
 *
 * @extends {React.Component<Props>}
 */
class BulletinMap extends React.Component {
  constructor(props) {
    super(props);
    /**
     * @type L.Map
     */
    this.map = false;
    this.lastDate;
    this.infoMessageLevels = {
      init: {
        message: "",
        iconOn: true
      },
      ok: { message: "", keep: true }
    };
    this.setInfoMessages();
  }

  componentDidUpdate() {
    this.setInfoMessages();
  }

  setInfoMessages() {
    const simple = Util.template(window.config.links.simple, {
      date: this.props.date
        ? dateToISODateString(parseDate(this.props.date))
        : "",
      lang: window["appStore"].language
    });
    this.infoMessageLevels.pending = {
      message: this.props.intl.formatMessage(
        { id: "bulletin:header:info-loading-data-slow" },
        { a: msg => <a href={simple}>{msg}</a> }
      ),
      iconOn: true,
      delay: 5000
    };

    this.infoMessageLevels.empty = {
      message: (
        <>
          <p>
            <FormattedHTMLMessage id="bulletin:header:info-no-data" />
          </p>
          <p>
            <Link to="/blog" className="secondary pure-button tooltip">
              BLOG
            </Link>
          </p>
        </>
      )
    };
  }

  handleMapInit = map => {
    this.map = map;

    this.map.on("click", this._click, this);
    this.map.on("unload", () => map.off("click", this._click, this));

    if (typeof this.props.onMapInit === "function") {
      this.props.onMapInit(map);
    }
  };

  _click() {
    this.props.handleSelectRegion(null);
  }

  styleOverMap() {
    return {
      zIndex: 1000
    };
  }

  getMapOverlays() {
    const overlays = [];

    if (this.props.store.neighborRegions) {
      overlays.push(
        <BulletinVectorLayer
          key="neighbor-regions"
          problems={this.props.store.problems}
          date={this.props.store.settings.date}
          activeRegion={this.props.store.settings.region}
          regions={this.props.store.neighborRegions}
          bulletin={this.props.store.activeBulletin}
          handleSelectRegion={this.props.handleSelectRegion}
          handleCenterToRegion={center => this.map.panTo(center)}
        />
      );
    }

    const { activeNeighborBulletins } = this.props.store;
    if (this.props.store.settings.neighbors && activeNeighborBulletins) {
      overlays.push(
        <GeoJSON
          // only a different key triggers layer update, see https://github.com/PaulLeCam/react-leaflet/issues/332
          key={`neighbor-bulletins-${activeNeighborBulletins.name}`}
          data={activeNeighborBulletins}
          pane="mapPane"
          style={feature => feature.properties.style}
        />
      );
    }

    const b = this.props.store.activeBulletinCollection;
    if (b) {
      const daytime = b.hasDaytimeDependency() ? this.props.ampm : "fd";
      const imgFormat =
        window.config.webp && this.props.store.settings.date > "2020-12-01"
          ? ".webp"
          : ".png";

      const publicationTime =
        this.props.store.settings.date > "2019-05-06"
          ? getPublicationTimeString(b.publicationDateSeconds) + "/"
          : "";

      const url =
        config.apis.geo +
        this.props.store.settings.date +
        "/" +
        publicationTime +
        daytime +
        "_overlay" +
        imgFormat +
        "?" +
        b.publicationDate.getTime();

      const params = config.map.overlay;

      overlays.push(
        <ImageOverlay
          key="bulletin-overlay"
          url={url}
          {...params}
          opacity={isBlendingSupported() ? 1 : 0.5}
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

  getBulletinMapDetails() {
    let res = [];
    let detailsClasses = ["bulletin-map-details", "top-right"];
    const { activeBulletin, activeNeighbor, activeRegionName } =
      this.props.store;
    if (activeBulletin) {
      detailsClasses.push("js-active");
      res.push(
        <BulletinMapDetails
          key="details"
          bulletin={activeBulletin}
          region={this.props.intl.formatMessage({
            id: "region:" + activeRegionName
          })}
          ampm={this.props.ampm}
        />
      );
      res.push(
        activeBulletin?.id && (
          <a
            tabIndex="-1"
            key="link"
            href={"#" + activeBulletin?.id}
            className="pure-button tooltip"
            title={this.props.intl.formatMessage({
              id: "bulletin:map:info:details:hover"
            })}
            data-scroll=""
          >
            {preprocessContent(
              this.props.intl.formatHTMLMessage({
                id: "bulletin:map:info:details"
              })
            )}
            <span className="icon-arrow-down" />
          </a>
        )
      );
    } else if (activeNeighbor) {
      detailsClasses.push("js-active");
      const language = window["appStore"].language;
      const country = activeNeighbor.id.replace(/-.*/, "");
      const region = activeNeighbor.id;
      // res.push(
      //   <p>{this.props.intl.formatMessage({ id: "region:" + country })}</p>
      // );
      // res.push(
      //   <p>{this.props.intl.formatMessage({ id: "region:" + region })}</p>
      // );
      res.push(
        <p
          key={`neighbor-name-${country}`}
          className="bulletin-report-region-name"
        >
          <span className="bulletin-report-region-name-country">
            {this.props.intl.formatMessage({ id: "region:" + country })}
          </span>
          <span>&nbsp;/ </span>
          <span className="bulletin-report-region-name-region">
            {this.props.intl.formatMessage({ id: "region:" + region })}
          </span>
        </p>
      );
      (activeNeighbor.properties.aws || []).forEach((aws, index) => {
        const href =
          aws.url.find(url => url[language])?.[language] ||
          Object.values(aws.url[0])[0];
        res.push(
          <a
            tabIndex="-1"
            key={`neighbor-link-${index}`}
            href={href}
            rel="noopener noreferrer"
            target="_blank"
            className="pure-button tooltip"
            title={this.props.intl.formatMessage({
              id: "bulletin:map:info:details:hover"
            })}
          >
            {aws.name} <span className="icon-arrow-right" />
          </a>
        );
      });
    }

    return (
      <div style={this.styleOverMap()} className={detailsClasses.join(" ")}>
        {res}
      </div>
    );
  }

  render() {
    //console.log("bulletin-map->render", this.props.store.settings.status);

    let newLevel = this.props.store.settings.status;
    // if (this.lastDate != this.props.date) {
    //   console.log("bulletin-map->render:SET TO INIT #aaa",  this.props.store.settings.status, this.lastDate, this.props.date);
    //   newLevel = "init";
    //   this.lastDate = this.props.date;
    // }

    return (
      <section
        id="section-bulletin-map"
        className="section section-bulletin-map"
        aria-hidden
      >
        {this.props.administrateLoadingBar && (
          <InfoBar level={newLevel} levels={this.infoMessageLevels} />
        )}
        <div
          className={
            "section-map" +
            (config.map.useWindowWidth ? "" : " section-centered")
          }
        >
          <LeafletMap
            loaded={this.props.regions}
            onViewportChanged={this.props.handleMapViewportChanged}
            overlays={this.getMapOverlays()}
            mapConfigOverride={{}}
            tileLayerConfigOverride={{}}
            gestureHandling={true}
            onInit={this.handleMapInit}
          />
          {false /* hide map search */ && (
            <div style={this.styleOverMap()} className="bulletin-map-search">
              <div className="pure-form pure-form-search">
                <input
                  tabIndex="-1"
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
                  tabIndex="-1"
                  href="#"
                  title={this.props.intl.formatMessage({
                    id: "bulletin:map:search:label"
                  })}
                  className="pure-button pure-button-icon icon-search"
                >
                  <span>&nbsp;</span>
                </button>
              </div>
            </div>
          )}
          {this.getBulletinMapDetails()}

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

export default injectIntl(observer(BulletinMap));
