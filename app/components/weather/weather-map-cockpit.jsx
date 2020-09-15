import React from "react";
import { withRouter, matchPath } from "react-router";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { dateToDateTimeString } from "../../util/date.js";

const DOMAIN_ICON_CLASSES = {
  temp: "icon-temperature",
  "snow-height": "icon-snow",
  "new-snow": "icon-snow-new",
  "diff-snow": "icon-snow-diff",
  wind: "icon-wind",
  gust: "icon-gust"
};

class WeatherMapCockpit extends React.Component {
  constructor(props) {
    super(props);
  }

  handleEvent(type, value) {
    if (typeof this.props.eventCallback === "function") {
      this.props.eventCallback(type, value);
    }
  }

  getDomainButtons() {
    const domainButtons = this.props.storeConfig
      ? Object.keys(this.props.storeConfig.domains).map(domainId => {
          return {
            id: domainId,
            title: this.props.intl.formatMessage({
              id: "weathermap:domain:description:" + domainId
            }),
            url: "/weather/map/" + domainId,
            isExternal: false
          };
        })
      : [];

    let buttons = [];
    domainButtons.forEach(aButton => {
      let linkClasses = ["cp-layer-selector-item"];
      let spanClasses = ["layer-select"];
      spanClasses.push(DOMAIN_ICON_CLASSES[aButton.id]);
      if (aButton.id === this.props.domainId) linkClasses.push("js-active");
      buttons.push(
        <Link
          to={aButton.url}
          onClick={this.handleEvent.bind(this, "domain", aButton.id)}
          className={linkClasses.join(" ")}
        >
          <span className={spanClasses.join(" ")}>{aButton.title}</span>
        </Link>
      );
    });
    return buttons;
  }
  getTickButtons() {
    let buttons = [];

    if (this.props.timeArray)
      this.props.timeArray.forEach(aTime => {
        let buttonClass = "leaflet-bar-part leaflet-bar-part-single";
        if (aTime < this.props.startDate) buttonClass = "future";
        buttons.push(
          <a
            key={aTime}
            href="javascript: void(0)"
            onClick={this.handleEvent.bind(this, "time", aTime)}
            role="button"
          >
            {dateToDateTimeString(aTime)}
          </a>
        );
      });
    return buttons;
  }

  getTimeSpanOptions() {
    let buttons = [];
    //console.log("getTimeSpanOptions 777", this.props.storeConfig.domains[this.props.domainId].item);
    if (
      this.props.storeConfig &&
      this.props.storeConfig.domains[this.props.domainId]
    ) {
      let domainConfig = this.props.storeConfig.domains[this.props.domainId]
        .item;

      domainConfig.timeSpans.forEach(aItem => {
        let buttonClass = "leaflet-bar-part leaflet-bar-part-single";

        buttons.push(
          <a
            key={aItem}
            href="javascript: void(0)"
            onClick={this.handleEvent.bind(this, "timeSpan", aItem)}
            role="button"
          >
            {this.props.intl.formatMessage({
              id:
                "weathermap:domain:" +
                this.props.domainId +
                ":timespan:" +
                aItem
            })}
          </a>
        );
      });
    }

    return buttons;
  }

  getPlayerButtons() {
    console.log("getPlayerButtons", this.props.player.playing);
    const label =
      "weathermap:player:" + (this.props.player.playing ? "stop" : "play");
    return (
      <a
        key="playerButton"
        href="javascript: void(0)"
        onClick={() => {
          this.props.player.toggle();
        }}
        role="button"
      >
        {this.props.intl.formatMessage({
          id: label
        })}
      </a>
    );
  }

  render() {
    return (
      <div class="map-cockpit weather-map-cockpit">
        <div class="cp-container-1">
          <div class="cp-layer-selector">{this.getDomainButtons()}</div>
        </div>

        {this.getTickButtons()}
        {this.getTimeSpanOptions()}
        {this.getPlayerButtons()}
      </div>
    );
  }
}
export default injectIntl(withRouter(WeatherMapCockpit));
