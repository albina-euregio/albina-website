import React from "react";
import $ from "jquery";
import { FormattedDate, FormattedMessage } from "../../i18n";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import Timeline from "./timeline.jsx";
import Dragger from "./dragger.jsx";
import { Tooltip } from "../tooltips/tooltip";
import { DATE_TIME_FORMAT } from "../../util/date.js";
//import { tooltip_init } from "../tooltips/tooltip-dom";

const DOMAIN_ICON_CLASSES = {
  temp: "icon-temperature",
  "snow-height": "icon-snow",
  "new-snow": "icon-snow-new",
  "diff-snow": "icon-snow-diff",
  "snow-line": "icon-snow-drop",
  wind: "icon-wind"
  //gust: "icon-wind-gust"
};

const DOMAIN_LEGEND_CLASSES = {
  temp: "cp-legend-temperature",
  "snow-height": "cp-legend-snow",
  "new-snow": "cp-legend-snownew",
  "diff-snow": "cp-legend-snowdiff",
  "snow-line": "cp-legend-snowline",
  wind: "cp-legend-wind"
  //gust: "cp-legend-windgust"
};

const DOMAIN_UNITS = {
  "snow-height": "cm",
  "new-snow": "cm",
  "diff-snow": "cm",
  "snow-line": "m",
  temp: "°C",
  wind: "km/h"
  //gust: "km/h"
};

const LOOP = false;

class WeatherMapCockpit extends React.Component {
  constructor(props) {
    super(props);
    this.getClosestTick;
    this.getLeftForTime;
    this.tickWidth = 0;
    this.redraw = this.redraw.bind(this);
    this.state = {
      lastRedraw: new Date().getTime()
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.redraw);
    this.adaptVH();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.redraw);
  }

  redraw() {
    this.setState({ lastRedraw: new Date().getTime() });
    this.adaptVH();
  }

  adaptVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  componentDidUpdate() {
    //window.setTimeout(tooltip_init, 200);
    $("body").removeClass("layer-selector-open");
  }

  onDragStart() {
    //console.log("onDragging");
    this.showTimes(false);
  }

  showTimes(show) {
    $(".cp-scale-stamp-range-end").css({
      display: show ? "" : "none"
    });
    $(".cp-scale-stamp-range-begin").css({
      display: show ? "" : "none"
    });
    $(".cp-scale-stamp-point-exact").css({
      display: show ? "" : "none"
    });
  }

  placeCockpitItems() {
    // console.log(
    //   "placeCockpitItems: hhh",
    //   this.props.currentTime,
    //   this.props.firstAnalyticTime,
    //   this.tickWidth
    // );
    if (this.props.currentTime) {
      const timespan = parseInt(this.props.timeSpan.replace(/\D/g, ""), 10);
      const posContainer = $(".cp-scale-days").offset();
      const startDateTime = new Date(this.props.timeArray[0]);
      startDateTime.setUTCHours(
        startDateTime.getUTCHours() - (timespan > 1 ? timespan : 0)
      );
      console.log("cockpit #33", {
        currTime: new Date(this.props.currentTime),
        firstTimeStamp: this.props.timeArray[0],
        firstTime: new Date(this.props.timeArray[0]),
        firstTimeMinusTimeSpan: startDateTime,
        timespan
      });
      const posFirstAvailable = $(".t" + startDateTime.getTime()).offset();
      const posLast = $(
        ".t" + this.props.timeArray[this.props.timeArray.length - 1]
      ).offset();
      //const flipperWidth = $(".cp-scale-flipper-right").outerWidth();
      this.showTimes(true);
      if (this.props.timeArray.length < 2) {
        $(".cp-scale-flipper-left").css({
          display: "none"
        });
        $(".cp-scale-flipper-right").css({
          display: "none"
        });
        $(".cp-movie").css({
          display: "none"
        });
      } else {
        $(".cp-scale-flipper-left").css({
          left: posFirstAvailable.left - posContainer.left,
          display: ""
        });
        $(".cp-scale-flipper-right").css({
          left: posLast.left - posContainer.left,
          display: ""
        });
        $(".cp-movie").css({
          display: ""
        });
      }

      if (this.props.lastAnalyticTime) {
        // console.log("placeCockpitItems", {
        //   lastAnalyticTime: (this.props.lastAnalyticTime * 10) / 10,
        //   posFirstAvailable
        // });
        const lastAnalyticTime = $(".t" + this.props.lastAnalyticTime).offset();
        $(".cp-scale-analyse-bar").css({
          left: posFirstAvailable.left - posContainer.left,
          width:
            lastAnalyticTime.left - posFirstAvailable.left - this.tickWidth,
          display: ""
        });
      } else
        $(".cp-scale-analyse-bar").css({
          display: "none"
        });
    }
  }

  onTimelineUpdate({ tickWidth, getClosestTick, getLeftForTime }) {
    //console.log("onTimelineUpdate hhh", tickWidth);
    this.tickWidth = tickWidth;
    this.getClosestTick = getClosestTick;
    const lastGetLeftForTime = this.getLeftForTime;
    this.getLeftForTime = getLeftForTime;
    this.placeCockpitItems();
    if (!lastGetLeftForTime) this.redraw();
  }

  handleEvent(type, value) {
    if (typeof this.props.eventCallback === "function") {
      this.props.player.stop();
      this.props.eventCallback(type, value);
    }
  }

  getDomainButtons() {
    const domainButtons = this.props.storeConfig
      ? Object.keys(this.props.storeConfig.domains).map(domainId => {
          return {
            id: domainId,
            title: (
              <FormattedMessage id={"weathermap:domain:title:" + domainId} />
            ),
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
          key={aButton.id}
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

  getTimeSpanOptions() {
    let self = this;
    let buttons = [];
    let allButtons;
    //console.log("getTimeSpanOptions 777", this.props);
    if (
      this.props.storeConfig &&
      this.props.storeConfig.domains[this.props.domainId]
    ) {
      let domainConfig =
        this.props.storeConfig.domains[this.props.domainId].item;

      let firstNrOnlyTimespan = domainConfig.timeSpans[0].replace(/\D/g, "");

      domainConfig.timeSpans.forEach(aItem => {
        let nrOnlyTimespan = aItem.replace(/\D/g, "");
        let linkClasses = ["cp-range-" + nrOnlyTimespan];
        if (self.props.timeSpan === aItem) linkClasses.push("js-active");

        buttons.push(
          <Tooltip
            key={"domain-timespan-desc-" + nrOnlyTimespan}
            label={
              <FormattedMessage
                id="weathermap:domain:timespan:description"
                values={{ range: nrOnlyTimespan }}
              />
            }
          >
            <a
              role="button"
              tabIndex="0"
              key={aItem}
              onClick={this.handleEvent.bind(this, "timeSpan", aItem)}
              className={linkClasses.join(" ")}
            >
              {nrOnlyTimespan}h
            </a>
          </Tooltip>
        );
      });

      if (firstNrOnlyTimespan != "1")
        allButtons = (
          <div key="cp-range-buttons" className="cp-range-buttons 0js-inactive">
            {buttons}
          </div>
        );
      else
        allButtons = (
          <span className="cp-range-hourly js-active">
            <FormattedMessage id="weathermap:domain:timespan:description:1" />
          </span>
        );
    }

    return (
      <div key="cp-container-layer-range" className="cp-container-layer-range">
        <div key="cp-player" className="cp-layer">
          <Tooltip
            key="cp-select-parameter"
            label={
              <FormattedMessage id="weathermap:cockpit:select-parameter" />
            }
          >
            <a
              role="button"
              tabIndex="0"
              className="cp-layer-selector-item cp-layer-trigger "
              onClick={() => {
                $("body").toggleClass("layer-selector-open");
              }}
            >
              <span className="layer-select icon-snow">
                {
                  <FormattedMessage
                    id={"weathermap:domain:title:" + this.props.domainId}
                  />
                }
              </span>
              <span className="layer-trigger"></span>
            </a>
          </Tooltip>
        </div>

        <div key="cp-range" className="cp-range">
          {allButtons}
        </div>
      </div>
    );
  }

  getPlayerButtons() {
    //console.log("getPlayerButtons", this.props.player.playing);
    // const label =
    //   "weathermap:player:" + (this.props.player.playing ? "stop" : "play");

    let linkClassesPlay = ["cp-movie-play", "icon-play"];
    let linkClassesStop = ["cp-movie-stop", "icon-pause"];
    let divClasses = ["cp-movie"];
    if (this.props.player.playing) divClasses.push("js-playing");
    return (
      <div key="cp-movie" className={divClasses.join(" ")}>
        <Tooltip
          key="cp-movie-play"
          label={<FormattedMessage id="weathermap:cockpit:play" />}
        >
          <a
            key="playerButton"
            className={linkClassesPlay.join(" ")}
            href="#"
            onClick={() => {
              this.props.player.toggle();
            }}
          >
            <span className="is-visually-hidden">
              {<FormattedMessage id="weathermap:cockpit:play" />}
            </span>
          </a>
        </Tooltip>
        <Tooltip
          key="cp-movie-stop"
          label={<FormattedMessage id="weathermap:cockpit:stop" />}
        >
          <a
            key="stopButton"
            className={linkClassesStop.join(" ")}
            href="#"
            onClick={() => {
              this.props.player.toggle();
            }}
          >
            <span className="is-visually-hidden">
              {<FormattedMessage id="weathermap:cockpit:stop" />}
            </span>
          </a>
        </Tooltip>
      </div>
    );
  }

  legendItems(amount) {
    let items = [];
    for (let i = 1; i <= amount; i++) {
      items.push(
        <span
          key={"cp-legend-item-" + i}
          className={"cp-legend-item-" + i}
        ></span>
      );
    }
    return items;
  }

  getLegend() {
    let divClasses = ["cp-legend-items"];
    if (DOMAIN_LEGEND_CLASSES[this.props.domainId])
      divClasses.push(DOMAIN_LEGEND_CLASSES[this.props.domainId]);
    return (
      <div key="cp-legend" className="cp-legend">
        <div key="cp-legend-items" className={divClasses.join(" ")}>
          {this.legendItems(35)}
        </div>
      </div>
    );
  }
  getReleaseInfo() {
    return (
      <div key="cp-release" className="cp-release">
        <Tooltip
          key="cp-release-released"
          label={
            <FormattedMessage id="weathermap:cockpit:maps-creation-date:title" />
          }
        >
          <span className="cp-release-released">
            <span>
              <FormattedMessage id="weathermap:cockpit:maps-creation-date:prefix" />
            </span>{" "}
            <FormattedDate
              date={this.props.lastUpdateTime}
              options={DATE_TIME_FORMAT}
            />
          </span>
        </Tooltip>
        <Tooltip
          key="cp-realse-date"
          label={
            <FormattedMessage id="weathermap:cockpit:maps-update-date:title" />
          }
        >
          <span key="cp-release-update" className="cp-release-update">
            <span>
              <FormattedMessage id="weathermap:cockpit:maps-update-date:prefix" />
            </span>{" "}
            <FormattedDate
              date={this.props.nextUpdateTime}
              options={DATE_TIME_FORMAT}
            />
          </span>
        </Tooltip>
        <Tooltip
          key="cockpit-title-tp"
          label={<FormattedMessage id="weathermap:cockpit:unit:title" />}
        >
          <span className="cp-legend-unit">
            {DOMAIN_UNITS[this.props.domainId]}
          </span>
        </Tooltip>
        {/* <span key="cp-release-copyright" className="cp-release-copyright">
          <a
            href="#"
            className="icon-copyright icon-margin-no"
            title="Copyright"
          ></a>
        </span> */}
      </div>
    );
  }

  setPreviousTime() {
    if (LOOP || this.props.currentTime != this.props.timeArray[0]) {
      //console.log("setPreviousTime s03", this.props.currentTime);
      this.props.previousTime();
    }
  }

  setNextTime() {
    if (
      LOOP ||
      this.props.currentTime !=
        this.props.timeArray[this.props.timeArray.length - 1]
    )
      this.props.nextTime();
  }

  setOffsetTime(offset) {
    const currentKey = this.props.timeArray.findIndex(
      element => element === this.props.currentTime
    );
    //console.log('setOffsetTime', offset, currentKey, this.props.timeSpan, this.props.currentTime, this.props.timeArray);
    if (currentKey > -1) {
      if (offset < 0) {
        if (currentKey + offset >= 0)
          this.props.changeCurrentTime(
            this.props.timeArray[currentKey + offset]
          );
      } else {
        if (currentKey + offset < this.props.timeArray.length)
          this.props.changeCurrentTime(
            this.props.timeArray[currentKey + offset]
          );
      }
    }
  }

  onKeyPressed(e) {
    //console.log('ctrl', e.ctrlKey, this.props.timeSpan);
    switch (e.keyCode) {
      case 37:
        if (Number(this.props.timeSpan.replace("-", "")) === 1 && e.ctrlKey)
          this.setOffsetTime(-24);
        else this.setPreviousTime();
        break;
      case 39:
        if (Number(this.props.timeSpan.replace("-", "")) === 1 && e.ctrlKey)
          this.setOffsetTime(24);
        else this.setNextTime();
        break;
      case 32:
        this.props.player.toggle();
        break;
      default:
        break;
    }
  }

  render() {
    //console.log("weather-map-cockpit->render hhhh", this.props.currentTime);
    let classes = [
      "map-cockpit",
      "weather-map-cockpit",
      "lastRedraw-" + this.state.lastRedraw
    ];

    const imgRoot = `${window.config.projectRoot}images/pro/`;
    return (
      <div
        role="button"
        tabIndex="0"
        key="map-cockpit"
        className={classes.join(" ")}
        onKeyDown={this.onKeyPressed}
      >
        <div key="cp-container-1" className="cp-container-1">
          <div key="cp-layer-selector" className="cp-layer-selector">
            {this.getDomainButtons()}
          </div>
        </div>
        <div key="cp-container-2" className="cp-container-2">
          {/* {this.getTickButtons()}
           */}
          <div key="cp-container-timeline" className="cp-container-timeline">
            <Timeline
              timeArray={this.props.timeArray}
              timeSpan={this.props.timeSpan}
              currentTime={this.props.currentTime}
              changeCurrentTime={this.props.changeCurrentTime}
              updateCB={this.onTimelineUpdate.bind(this)}
              showTimes={this.showTimes.bind(this)}
              setPreviousTime={this.setPreviousTime.bind(this)}
              setNextTime={this.setNextTime.bind(this)}
              onDragStart={this.onDragStart.bind(this)}
            />
            {this.getPlayerButtons()}
          </div>
          {this.getTimeSpanOptions()}
          <div
            key="cp-containerl-legend-release"
            className="cp-container-legend-release"
          >
            {this.getLegend()}
            {this.getReleaseInfo()}
          </div>
          <div key="cp-copyright" className="cp-copyright">
            <Tooltip
              key="cp-copyright-tp"
              label={<FormattedMessage id="weathermap:cockpit:zamg:hover" />}
            >
              <a
                href="https://www.geosphere.at/"
                rel="noopener noreferrer"
                target="_blank"
                className="avoid-external-icon"
              >
                <span className="is-visually-hidden">GeoSphere Austria</span>
              </a>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}
export default observer(WeatherMapCockpit);
