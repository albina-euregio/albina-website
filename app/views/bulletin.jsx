import React from "react";
import { withRouter } from "react-router-dom";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import { BULLETIN_STORE } from "../stores/bulletinStore";
import { MAP_STORE } from "../stores/mapStore";

import { injectIntl, FormattedHTMLMessage } from "react-intl";
import BulletinHeader from "../components/bulletin/bulletin-header";
import BulletinFooter from "../components/bulletin/bulletin-footer";
const BulletinMap = React.lazy(() =>
  import("../components/bulletin/bulletin-map")
);
import BulletinLegend from "../components/bulletin/bulletin-legend";
import BulletinButtonbar from "../components/bulletin/bulletin-buttonbar";
import ControlBar from "../components/organisms/control-bar.jsx";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { parseDate, dateToLongDateString } from "../util/date.js";
import { tooltip_init } from "../js/tooltip";
import BulletinList from "../components/bulletin/bulletin-list";
import { parseSearchParams } from "../util/searchParams";
import { Suspense } from "react";

import "leaflet.sync";
import { Util } from "leaflet";

class Bulletin extends React.Component {
  constructor(props) {
    super(props);
    BULLETIN_STORE.init();
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
      () => BULLETIN_STORE.settings.status,
      () => {
        window.setTimeout(tooltip_init, 100);
      }
    );
    reaction(
      () => BULLETIN_STORE.settings.region,
      region => {
        if (region) {
          window.setTimeout(tooltip_init, 100);
        }
      }
    );

    reaction(
      () => BULLETIN_STORE.latest,
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
        this.props.match.params.date != BULLETIN_STORE.settings.date,

      // update when date changes to "latest"
      typeof this.props.match.params.date === "undefined" &&
        BULLETIN_STORE.latest &&
        BULLETIN_STORE.latest != BULLETIN_STORE.settings.date
    ];

    if (updateConditions.reduce((acc, cond) => acc || cond, false)) {
      // if any update condition holds
      this._fetchData(this.props);
    }
    this.checkRegion();
  }

  async _fetchData(props) {
    let startDate =
      props.match.params.date && parseDate(props.match.params.date)
        ? props.match.params.date
        : BULLETIN_STORE.latest;

    if (
      !props.match.params.date ||
      props.match.params.date == BULLETIN_STORE.latest
    ) {
      // update URL if necessary
      this.props.history.replace({
        pathname: "/bulletin/latest",
        search: document.location.search.substring(1)
      });
    }

    try {
      await BULLETIN_STORE.load(startDate);
    } finally {
      await BULLETIN_STORE.loadNeighbors(startDate);
    }
  }

  checkRegion() {
    let urlRegion = parseSearchParams().get("region");
    const storeRegion = BULLETIN_STORE.settings.region;
    if (urlRegion !== storeRegion) {
      BULLETIN_STORE.setRegion(urlRegion);
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
    } else if (BULLETIN_STORE.settings.region) {
      this.props.history.push({ search: "" });
    }
  };

  handleMapViewportChanged(map) {
    MAP_STORE.setMapViewport({
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

    const collection = BULLETIN_STORE.activeBulletinCollection;
    // console.log("rendering bulletin ", BULLETIN_STORE.bulletins);

    const shareDescription =
      this.state.title && BULLETIN_STORE.settings.date
        ? collection
          ? this.state.title +
            " | " +
            dateToLongDateString(parseDate(BULLETIN_STORE.settings.date))
          : this.props.intl.formatMessage({
              id: "bulletin:header:info-no-data"
            })
        : "";

    const shareImage =
      collection && BULLETIN_STORE.settings.date
        ? Util.template(config.apis.bulletin.map, {
            date: BULLETIN_STORE.settings.date,
            publication: ".",
            file:
              (collection.hasDaytimeDependency() ? "am" : "fd") + "_albina_map",
            format: ".jpg"
          })
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
        <ControlBar
          style="light"
          backgroundImage="/content_files/ava_size5-2560.jpg"
          message={
            <>
              <FormattedHTMLMessage id="bulletin:control-bar:community:text" />
              <FormattedHTMLMessage id="bulletin:control-bar:community:link" />
            </>
          }
        />
        <BulletinHeader title={this.state.title} />

        <Suspense fallback={<div>...</div>}>
          {BULLETIN_STORE.activeBulletinCollection &&
          BULLETIN_STORE.activeBulletinCollection.hasDaytimeDependency() ? (
            <div className="bulletin-parallel-view">
              {["am", "pm"].map((daytime, index) => (
                <BulletinMap
                  key={daytime}
                  handleMapViewportChanged={this.handleMapViewportChanged.bind(
                    this
                  )}
                  administrateLoadingBar={index === 0}
                  handleSelectRegion={this.handleSelectRegion.bind(this)}
                  date={this.props.match.params.date}
                  highlightedRegion={this.state.highlightedRegion}
                  regions={BULLETIN_STORE.getVectorRegions(daytime)}
                  onMapInit={this.handleMapInit.bind(this)}
                  ampm={daytime}
                />
              ))}
            </div>
          ) : (
            <BulletinMap
              administrateLoadingBar={true}
              handleMapViewportChanged={this.handleMapViewportChanged.bind(
                this
              )}
              handleSelectRegion={this.handleSelectRegion.bind(this)}
              date={this.props.match.params.date}
              highlightedRegion={this.state.highlightedRegion}
              regions={BULLETIN_STORE.getVectorRegions()}
            />
          )}
          <BulletinLegend
            handleSelectRegion={this.handleSelectRegion.bind(this)}
            problems={BULLETIN_STORE.problems}
          />
        </Suspense>
        <BulletinButtonbar />
        {BULLETIN_STORE.activeBulletinCollection && (
          <BulletinList
            daytimeBulletins={
              BULLETIN_STORE.activeBulletinCollection.daytimeBulletins
            }
          />
        )}
        <SmShare
          image={shareImage}
          title={this.state.title}
          description={shareDescription}
        />
        <BulletinFooter />
      </>
    );
  }
}

export default injectIntl(withRouter(observer(Bulletin)));
