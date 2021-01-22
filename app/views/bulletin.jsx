import React from "react";
import { withRouter } from "react-router-dom";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import { BulletinStore } from "../stores/bulletinStore";
import MapStore from "../stores/mapStore";

import { injectIntl } from "react-intl";
import BulletinHeader from "../components/bulletin/bulletin-header";
import BulletinMap from "../components/bulletin/bulletin-map";
import BulletinLegend from "../components/bulletin/bulletin-legend";
import BulletinButtonbar from "../components/bulletin/bulletin-buttonbar";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { parseDate, dateToLongDateString } from "../util/date.js";
import { tooltip_init } from "../js/tooltip";
import BulletinList from "../components/bulletin/bulletin-list";
import { parseSearchParams } from "../util/searchParams";

require("leaflet.sync");

@observer
class Bulletin extends React.Component {
  constructor(props) {
    super(props);
    if (typeof window.bulletinStore === "undefined") {
      window.bulletinStore = new BulletinStore();
    }
    if (typeof window.mapStore === "undefined") {
      window.mapStore = new MapStore();
    }
    /**
     * @type {import("../stores/bulletinStore").BulletinStore}
     */
    this.store = window.bulletinStore;
    this.state = {
      title: "",
      content: "",
      sharable: false,
      highlightedRegion: null
    };

    this.mapRefs = [];
  }

  componentDidMount() {
    reaction(
      () => this.store.settings.status,
      () => {
        window.setTimeout(tooltip_init, 100);
      }
    );
    reaction(
      () => this.store.settings.region,
      region => {
        if (region) {
          window.setTimeout(tooltip_init, 100);
        }
      }
    );

    reaction(
      () => this.store.latest,
      () => this.componentDidUpdate({})
    );
    return this._fetchData(this.props);
    // this.checkRegion()
  }

  componentDidUpdate(prevProps) {
    const updateConditions = [
      // update when date changes to YEAR-MONTH-DAY format
      this.props.location !== prevProps.location &&
        this.props.match.params.date &&
        this.props.match.params.date != this.store.settings.date,

      // update when date changes to "latest"
      typeof this.props.match.params.date === "undefined" &&
        this.store.latest &&
        this.store.latest != this.store.settings.date
    ];

    if (updateConditions.reduce((acc, cond) => acc || cond, false)) {
      // if any update condition holds
      this._fetchData(this.props);
    }
    this.checkRegion();
  }

  _fetchData(props) {
    let startDate =
      props.match.params.date && parseDate(props.match.params.date)
        ? props.match.params.date
        : this.store.latest;

    if (
      !props.match.params.date ||
      props.match.params.date == this.store.latest
    ) {
      // update URL if necessary
      this.props.history.replace({
        pathname: "/bulletin/latest",
        search: document.location.search.substring(1)
      });
    }

    return this.store.load(startDate);
  }

  checkRegion() {
    let urlRegion = parseSearchParams().get("region");
    const storeRegion = this.store.settings.region;
    if (urlRegion !== storeRegion) {
      this.store.setRegion(urlRegion);
    }
  }

  handleSelectRegion = id => {
    if (id) {
      const oldRegion = parseSearchParams().get("region");
      if (oldRegion !== id) {
        const search = "region=" + encodeURIComponent(id);
        if (oldRegion) {
          // replace history when a (different) region was selected previously to avoid polluting browser history
          this.props.history.replace({ search });
        } else {
          this.props.history.push({ search });
        }
      }
    } else if (this.store.settings.region) {
      this.props.history.push({ search: "" });
    }
  };

  handleMapViewportChanged(map) {
    window.mapStore.setMapViewport({
      zoom: map.zoom,
      center: map.center
    });
  }

  handleMapInit(map) {
    if (this.mapRefs.length > 0) {
      this.mapRefs.forEach(otherMap => {
        map.sync(otherMap);
        otherMap.sync(map);
      });
    }

    this.mapRefs.push(map);
  }

  render() {
    this.mapRefs = [];

    const collection = this.store.activeBulletinCollection;
    // console.log("rendering bulletin ", this.store.bulletins);

    const shareDescription =
      this.state.title && this.store.settings.date
        ? collection
          ? this.state.title +
            " | " +
            dateToLongDateString(parseDate(this.store.settings.date))
          : this.props.intl
              .formatMessage({ id: "bulletin:header:info-no-data" })
              .replace(/<\/?a>/g, "")
        : "";

    const shareImage =
      collection && this.store.settings.date
        ? config.apis.geo +
          this.store.settings.date +
          "/" +
          (collection.hasDaytimeDependency() ? "am" : "fd") + // FIXME: there should be a way to share "am" AND "pm" map
          "_albina_map.jpg"
        : "";

    return (
      <>
        <HTMLHeader
          title={this.props.intl.formatMessage({ id: "bulletin:title" })}
          description={shareDescription}
          meta={{
            "og:image": shareImage,
            "og:image:width": 1890,
            "og:image:height": 1890
          }}
        />
        <BulletinHeader store={this.store} title={this.state.title} />

        {this.store.activeBulletinCollection &&
        this.store.activeBulletinCollection.hasDaytimeDependency() ? (
          <div className="bulletin-parallel-view">
            {["am", "pm"].map(daytime => (
              <BulletinMap
                key={daytime}
                handleMapViewportChanged={this.handleMapViewportChanged.bind(
                  this
                )}
                handleSelectRegion={this.handleSelectRegion.bind(this)}
                date={this.props.match.params.date}
                history={this.props.history}
                store={this.store}
                highlightedRegion={this.state.highlightedRegion}
                regions={this.store.getVectorRegions(daytime)}
                onMapInit={this.handleMapInit.bind(this)}
                ampm={daytime}
              />
            ))}
          </div>
        ) : (
          <BulletinMap
            handleMapViewportChanged={this.handleMapViewportChanged.bind(this)}
            handleSelectRegion={this.handleSelectRegion.bind(this)}
            date={this.props.match.params.date}
            history={this.props.history}
            store={this.store}
            highlightedRegion={this.state.highlightedRegion}
            regions={this.store.getVectorRegions()}
          />
        )}
        <BulletinLegend
          handleSelectRegion={this.handleSelectRegion.bind(this)}
          problems={this.store.problems}
        />
        <BulletinButtonbar store={this.store} />
        {this.store.activeBulletinCollection && (
          <BulletinList
            store={this.store}
            daytimeBulletins={
              this.store.activeBulletinCollection.daytimeBulletins
            }
          />
        )}
        <SmShare
          image={shareImage}
          title={this.state.title}
          description={shareDescription}
        />
        <section className="section-centered section-context">
          <div className="panel">
            <h2 className="subheader">
              {this.props.intl.formatMessage({ id: "button:weather:headline" })}
            </h2>

            <ul className="list-inline list-buttongroup-dense">
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:weather:AT-07:link"
                  })}
                  rel="noopener noreferrer"
                  target="_blank"
                  title={this.props.intl.formatMessage({
                    id: "button:weather:AT-07:text"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "button:weather:AT-07:text"
                  })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:weather:IT-32-BZ:link"
                  })}
                  rel="noopener noreferrer"
                  target="_blank"
                  title={this.props.intl.formatMessage({
                    id: "button:weather:IT-32-BZ:text"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "button:weather:IT-32-BZ:text"
                  })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:weather:IT-32-TN:link"
                  })}
                  rel="noopener noreferrer"
                  target="_blank"
                  title={this.props.intl.formatMessage({
                    id: "button:weather:IT-32-TN:text"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "button:weather:IT-32-TN:text"
                  })}
                </a>
              </li>
            </ul>

            <h2 className="subheader">
              {this.props.intl.formatMessage({ id: "button:blog:headline" })}
            </h2>

            <ul className="list-inline list-buttongroup-dense">
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:blog:AT-07:link"
                  })}
                  title={this.props.intl.formatMessage({
                    id: "button:blog:AT-07:text"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "button:blog:AT-07:text"
                  })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:blog:IT-32-BZ:link"
                  })}
                  title={this.props.intl.formatMessage({
                    id: "button:blog:IT-32-BZ:text"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "button:blog:IT-32-BZ:text"
                  })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:blog:IT-32-TN:link"
                  })}
                  title={this.props.intl.formatMessage({
                    id: "button:blog:IT-32-TN:text"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "button:blog:IT-32-TN:text"
                  })}
                </a>
              </li>
            </ul>

            <h2 className="subheader">
              {this.props.intl.formatMessage({ id: "button:snow:headline" })}
            </h2>

            <ul className="list-inline list-buttongroup-dense">
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:snow:hn:link"
                  })}
                  title={this.props.intl.formatMessage({
                    id: "button:snow:hn:text"
                  })}
                >
                  {this.props.intl.formatMessage({ id: "button:snow:hn:text" })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:snow:hs:link"
                  })}
                  title={this.props.intl.formatMessage({
                    id: "button:snow:hs:text"
                  })}
                >
                  {this.props.intl.formatMessage({ id: "button:snow:hs:text" })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:snow:ff:link"
                  })}
                  title={this.props.intl.formatMessage({
                    id: "button:snow:ff:text"
                  })}
                >
                  {this.props.intl.formatMessage({ id: "button:snow:ff:text" })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:snow:stations:link"
                  })}
                  title={this.props.intl.formatMessage({
                    id: "button:snow:stations:text"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "button:snow:stations:text"
                  })}
                </a>
              </li>
            </ul>

            <h2 className="subheader">
              {this.props.intl.formatMessage({
                id: "button:education:headline"
              })}
            </h2>

            <ul className="list-inline list-buttongroup-dense">
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:education:danger-scale:link"
                  })}
                  title={this.props.intl.formatMessage({
                    id: "button:education:danger-scale:text"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "button:education:danger-scale:text"
                  })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:education:avalanche-problems:link"
                  })}
                  title={this.props.intl.formatMessage({
                    id: "button:education:avalanche-problems:text"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "button:education:avalanche-problems:text"
                  })}
                </a>
              </li>
              <li>
                <a
                  className="secondary pure-button"
                  href={this.props.intl.formatMessage({
                    id: "button:education:danger-patterns:link"
                  })}
                  title={this.props.intl.formatMessage({
                    id: "button:education:danger-patterns:text"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "button:education:danger-patterns:text"
                  })}
                </a>
              </li>
            </ul>
          </div>
        </section>
      </>
    );
  }
}

export default injectIntl(withRouter(Bulletin));
