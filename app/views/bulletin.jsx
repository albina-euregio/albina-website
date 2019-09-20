import React from "react";
import { withRouter } from "react-router-dom";
import { preprocessContent } from "../util/htmlParser";
import { reaction } from "mobx";
import { observer, inject } from "mobx-react";
import { BulletinStore } from "../stores/bulletinStore";
import MapStore from "../stores/mapStore";

import { injectIntl } from "react-intl";
import BulletinHeader from "../components/bulletin/bulletin-header";
import BulletinMap from "../components/bulletin/bulletin-map";
import BulletinLegend from "../components/bulletin/bulletin-legend";
import BulletinButtonbar from "../components/bulletin/bulletin-buttonbar";
import BulletinReport from "../components/bulletin/bulletin-report";
import BulletinHowTo from "../components/bulletin/bulletin-howto";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { parseDate, dateToISODateString, dateToLongDateString } from "../util/date.js";
import Base from "./../base";
import { tooltip_init } from "../js/tooltip";

@observer
class Bulletin extends React.Component {
  constructor(props) {
    super(props);
    if (typeof window.bulletinStore === "undefined") {
      window.bulletinStore = new BulletinStore();
    }
    if(typeof window.mapStore === "undefined") {
      window.mapStore = new MapStore();
    }
    this.store = window.bulletinStore;
    this.state = {
      title: "",
      content: "",
      sharable: false,
      highlightedRegion: null
    };
  }

  componentDidMount() {
    window["staticPageStore"].loadPage("bulletin").then(response => {
      // parse content
      const responseParsed = JSON.parse(response);
      this.setState({
        title: responseParsed.data.attributes.title,
        content: responseParsed.data.attributes.body,
        sharable: responseParsed.data.attributes.sharable
      });
    });

    const onUpdateStatus = reaction(
      () => this.store.settings.status,
      status => {
        window.setTimeout(tooltip_init, 100);
      }
    );
    const onUpdateRegion = reaction(
      () => this.store.settings.region,
      region => {
        if (region) {
          window.setTimeout(tooltip_init, 100);
        }
      }
    );
    return this._fetchData(this.props);
    // this.checkRegion()
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const newDate = this.props.match.params.date;
      if (newDate && newDate != this.store.settings.date) {
        this._fetchData(this.props);
      } 
    } else if((typeof(this.props.match.params.date) === 'undefined')
      && this.store.latest
      && this.store.latest != this.store.settings.date) {
       this._fetchData(this.props);
    }
    this.checkRegion();
  }

  _fetchData(props) {
    // console.log("props.match.params.date", props.match.params.date);

    /* if it is later than 5pm, add one day */
    let startDate =
      props.match.params.date && parseDate(props.match.params.date)
        ? props.match.params.date
        : this.store.latest;

    if (!props.match.params.date || props.match.params.date == this.store.latest) {
      // update URL if necessary
      this.props.history.replace({
        pathname: "/bulletin/latest",
        search: document.location.search.substring(1)
      });
    }

    return this.store.load(startDate);
  }

  checkRegion() {
    const urlRegion = Base.searchGet("region");
    const storeRegion = this.store.settings.region;

    if (urlRegion !== storeRegion) {
      this.store.setRegion(urlRegion);
    }
  }

  handleSelectRegion = id => {
    if (id) {
      const oldRegion = Base.searchGet("region");
      if (oldRegion !== id) {
        //this.store.setRegion(id);
        //this.handleHighlightRegion(id); // also do highlighting
        Base.searchChange(this.props.history, { region: id }, false);
      }
    } else if (this.store.settings.region) {
      //this.store.setRegion("");
      //this.handleHighlightRegion(null);

      Base.searchChange(this.props.history, { region: "" }, false);
    }
  };

  handleMapViewportChanged(map) {
    window.mapStore.setMapViewport({
      zoom: map.zoom,
      center: map.center
    });
  }

  render() {
    const collection = this.store.activeBulletinCollection;
    // console.log('rendering bulletin view(0)', this.store.vectorRegions)
    // console.log('rendering bulletin ', this.store.bulletins)

    const shareDescription = (this.state.title && this.store.settings.date) ? (
      collection
        ? (this.state.title + ' | ' + dateToLongDateString(parseDate(this.store.settings.date)))
        : this.props.intl.formatMessage({id: "bulletin:header:no-bulletin-info"}).replace(/<\/?a>/g, '')
    ) : "";

    const shareImage = (collection && this.store.settings.date) ? (
      config.get('apis.geo') + this.store.settings.date + "/"
      + (collection.hasDaytimeDependency() ? this.store.settings.ampm : "fd")
      + "_albina_map.jpg"
    ) :
    "";

    return (
      <div>
        <HTMLHeader title={this.state.title} description={shareDescription} meta={{
            "og:image": shareImage,
            "og:image:width": 1890,
            "og:image:height": 1890
          }} />
        <BulletinHeader store={this.store} title={this.state.title} />

        <BulletinMap
          handleMapViewportChanged={this.handleMapViewportChanged.bind(this)}
          handleSelectRegion={this.handleSelectRegion.bind(this)}
          date={this.props.match.params.date}
          history={this.props.history}
          store={this.store}
          highlightedRegion={this.state.highlightedRegion}
          regions={this.store.vectorRegions}
        />
        <BulletinLegend
          handleSelectRegion={this.handleSelectRegion.bind(this)}
          problems={this.store.problems}
        />
        <BulletinButtonbar store={this.store} />
        <BulletinReport store={this.store} />
        {!this.store.activeBulletin && <BulletinHowTo store={this.store} />}
        {this.state.sharable && <SmShare image={shareImage} title={this.state.title} description={shareDescription} />}
        <div className="section-padding section-centered">
          {preprocessContent(this.state.content)}
        </div>
      </div>
    );
  }
}
export default inject("locale")(injectIntl(withRouter(Bulletin)));
