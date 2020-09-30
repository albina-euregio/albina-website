import React from "react";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import Timeline from "./timeline.jsx";
import Dragger from "./dragger.jsx";

import {
  dateToDateTimeString,
  dateToShortDayString,
  dateToWeekdayString,
  dateToTimeString
} from "../../util/date.js";
import { tooltip_init } from "../../js/tooltip";

const DOMAIN_ICON_CLASSES = {
  temp: "icon-temperature",
  "snow-height": "icon-snow",
  "new-snow": "icon-snow-new",
  "diff-snow": "icon-snow-diff",
  wind: "icon-wind",
  gust: "icon-wind-gust"
};

const DOMAIN_LEGEND_CLASSES = {
  temp: "cp-legend-temperature",
  "snow-height": "cp-legend-snow",
  "new-snow": "cp-legend-snownew",
  "diff-snow": "cp-legend-snowdiff",
  wind: "cp-legend-wind",
  gust: "cp-legend-windgust"
};

@observer
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
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.redraw);
  }

  redraw() {
    this.setState({ lastRedraw: new Date().getTime() });
  }

  componentDidUpdate() {
    window.setTimeout(tooltip_init, 200);
    $("body").removeClass("layer-selector-open");
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
      const posFirstAvailable = $(".t" + this.props.timeArray[0]).offset();
      const posLast = $(
        ".t" + this.props.timeArray[this.props.timeArray.length - 1]
      ).offset();
      //const flipperWidth = $(".cp-scale-flipper-right").outerWidth();
      $(".cp-scale-flipper-left").css({
        left: this.tickWidth + posFirstAvailable.left - posContainer.left
      });
      $(".cp-scale-flipper-right").css({
        left: posLast.left - posContainer.left + timespan * this.tickWidth
      });

      if (this.props.lastAnalyticTime) {
        // console.log(
        //   "xxx",
        //   this.props.lastAnalyticTime,
        //   new Date(this.props.lastAnalyticTime),
        //   $(".t" + this.props.lastAnalyticTime)
        // );
        const lastAnalyticTime = $(".t" + this.props.lastAnalyticTime).offset();
        $(".cp-scale-analyse-bar").css({
          left: posFirstAvailable.left - posContainer.left + this.tickWidth,
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
    this.getLeftForTime = getLeftForTime;
    this.placeCockpitItems();
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
              id: "weathermap:domain:title:" + domainId
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
      let domainConfig = this.props.storeConfig.domains[this.props.domainId]
        .item;

      let firstNrOnlyTimespan = domainConfig.timeSpans[0].replace(/\D/g, "");

      domainConfig.timeSpans.forEach(aItem => {
        let nrOnlyTimespan = aItem.replace(/\D/g, "");
        let linkClasses = ["tooltip", "cp-range-" + nrOnlyTimespan];
        if (self.props.timeSpan === aItem) linkClasses.push("js-active");

        buttons.push(
          <a
            key={aItem}
            onClick={this.handleEvent.bind(this, "timeSpan", aItem)}
            className={linkClasses.join(" ")}
            title={this.props.intl.formatMessage({
              id: "weathermap:domain:timespan:description:" + nrOnlyTimespan
            })}
          >
            {nrOnlyTimespan}h
          </a>
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
            {this.props.intl.formatMessage({
              id: "weathermap:domain:timespan:description:1"
            })}
          </span>
        );
    }

    return (
      <div key="cp-container-layer-range" className="cp-container-layer-range">
        <div key="cp-player" className="cp-layer">
          <a
            className="cp-layer-selector-item cp-layer-trigger tooltip"
            title="Layer wählen"
            onClick={() => {
              $("body").toggleClass("layer-selector-open");
            }}
          >
            <span className="layer-select icon-snow">
              {this.props.intl.formatMessage({
                id: "weathermap:domain:title:" + this.props.domainId
              })}
            </span>
            <span className="layer-trigger"></span>
          </a>
        </div>

        <div key="cp-range" className="cp-range">
          {allButtons}
        </div>
      </div>
    );
  }

  setClosestTick(x, y) {
    //console.log("setClosestTick hhhh", x, y);

    let closestTime = this.getClosestTick(x);

    // place back to origin
    if (closestTime === this.props.currentTime)
      this.rePostionsStamp(this.getLeftForTime(this.props.currentTime));

    try {
      //console.log("setClosestTick hhhh closestTime:", new Date(closestTime));

      if (closestTime) this.props.changeCurrentTime(closestTime);
    } catch (e) {
      // Anweisungen für jeden Fehler
      console.log(e, this.props); // Fehler-Objekt an die Error-Funktion geben
    }
  }

  getTimeline() {
    let self = this;
    let lastTime;
    let days = [];
    let nrOnlyTimespan = parseInt(this.props.timeSpan.replace(/\D/g, ""), 10);
    let parts = [];

    if (this.props.currentTime) {
      const timeStart = dateToTimeString(this.props.currentTime);
      let timeEnd = new Date(this.props.currentTime);
      timeEnd.setHours(timeEnd.getHours() + parseInt(nrOnlyTimespan, 10));

      const dragSettings = {
        left: this.getLeftForTime
          ? this.getLeftForTime(this.props.currentTime)
          : 0,
        onDragEnd: self.setClosestTick.bind(self),
        parent: ".cp-scale-stamp",
        rePosition: f => {
          this.rePostionsStamp = f;
        },
        classes: []
      };

      parts.push(
        <div key="cp-scale-stamp" className="cp-scale-stamp">
          {/* <div
            key="whereami"
            id="whereami"
            style={{
              position: "absolute",
              width: "1px",
              height: "20px",
              backgroundColor: "#f00",
              left: "20px"
            }}
          ></div> */}

          {nrOnlyTimespan !== 1 && (
            <Dragger {...dragSettings}>
              <div
                key="scale-stamp-range"
                style={{
                  left: 0,
                  width: this.tickWidth * nrOnlyTimespan - this.tickWidth
                }}
                className="cp-scale-stamp-range js-active"
              >
                <span
                  key="cp-scale-stamp-range-bar"
                  className="cp-scale-stamp-range-bar"
                ></span>
                <span
                  key="cp-scale-stamp-range-begin"
                  className="cp-scale-stamp-range-begin"
                >
                  {timeStart}
                </span>
                <span
                  key="cp-scale-stamp-range-end"
                  className="cp-scale-stamp-range-end"
                >
                  {dateToTimeString(timeEnd)}
                </span>
              </div>
            </Dragger>
          )}
          {nrOnlyTimespan === 1 && (
            <Dragger {...dragSettings}>
              <div
                style={{ left: 0 }}
                key="scale-stamp-point"
                className="cp-scale-stamp-point js-active"
              >
                <span
                  key="cp-scale-stamp-point-arrow"
                  className="cp-scale-stamp-point-arrow"
                ></span>
                <span
                  key="cp-scale-stamp-point-exact"
                  className="cp-scale-stamp-point-exact"
                >
                  {timeStart}
                </span>
              </div>
            </Dragger>
          )}
        </div>
      );
    }

    return (
      <div key="cp-scale" className="cp-scale">
        {parts}
        <div key="flipper" className="cp-scale-flipper">
          <a
            href="#"
            onClick={self.props.previousTime}
            key="arrow-left"
            className="cp-scale-flipper-left icon-arrow-left tooltip"
            title={this.props.intl.formatMessage({
              id: "weathermap:cockpit:flipper:previous"
            })}
          ></a>
          <a
            href="#"
            onClick={self.props.nextTime}
            key="arrow-right"
            className="cp-scale-flipper-right icon-arrow-right tooltip"
            title={this.props.intl.formatMessage({
              id: "weathermap:cockpit:flipper:next"
            })}
          ></a>
        </div>

        <Timeline
          timeArray={this.props.timeArray}
          timeSpan={this.props.timeSpan}
          updateCB={this.onTimelineUpdate.bind(this)}
        />

        <div key="analyse-forcast" className="cp-scale-analyse-forecast">
          <span
            key="cp-scale-analyse-bar"
            className="cp-scale-analyse-bar"
          ></span>
          <span
            key="cp-scale-forecast-bar"
            className="cp-scale-forecast-bar"
          ></span>
        </div>
      </div>
    );
  }

  getPlayerButtons() {
    //console.log("getPlayerButtons", this.props.player.playing);
    // const label =
    //   "weathermap:player:" + (this.props.player.playing ? "stop" : "play");

    let linkClassesPlay = ["cp-movie-play", "icon-play", "tooltip"];
    let linkClassesStop = ["cp-movie-stop", "icon-pause", "tooltip"];
    let divClasses = ["cp-movie"];
    if (this.props.player.playing) divClasses.push("js-playing");
    return (
      <div key="cp-movie" className={divClasses.join(" ")}>
        <a
          key="playerButton"
          className={linkClassesPlay.join(" ")}
          href="#"
          title="Play"
          onClick={() => {
            this.props.player.toggle();
          }}
        ></a>
        <a
          key="stopButton"
          className={linkClassesStop.join(" ")}
          href="#"
          title="Stop"
          onClick={() => {
            this.props.player.toggle();
          }}
        ></a>
      </div>
    );
  }

  getLegend() {
    let divClasses = ["cp-legend-items"];
    if (DOMAIN_LEGEND_CLASSES[this.props.domainId])
      divClasses.push(DOMAIN_LEGEND_CLASSES[this.props.domainId]);
    return (
      <div key="cp-legend" className="cp-legend">
        <div key="cp-legend-items" className={divClasses.join(" ")}>
          <span key="cp-legend-item-1" className="cp-legend-item-1"></span>
          <span key="cp-legend-item-2" className="cp-legend-item-2"></span>
          <span key="cp-legend-item-3" className="cp-legend-item-3"></span>
          <span key="cp-legend-item-4" className="cp-legend-item-4"></span>
          <span key="cp-legend-item-5" className="cp-legend-item-5"></span>
          <span key="cp-legend-item-6" className="cp-legend-item-6"></span>
          <span key="cp-legend-item-7" className="cp-legend-item-7"></span>
          <span key="cp-legend-item-8" className="cp-legend-item-8"></span>
          <span key="cp-legend-item-9" className="cp-legend-item-9"></span>
          <span key="cp-legend-item-10" className="cp-legend-item-10"></span>
          <span key="cp-legend-item-11" className="cp-legend-item-11"></span>
          <span key="cp-legend-item-12" className="cp-legend-item-12"></span>
          <span key="cp-legend-item-13" className="cp-legend-item-13"></span>
        </div>
      </div>
    );
  }
  getReleaseInfo() {
    //console.log("getReleaseInfo: kkk", this.props, dateToDateTimeString(this.props.lastUpdateTime));

    return (
      <div key="cp-release" className="cp-release">
        <span
          key="cp-release-released"
          className="cp-release-released tooltip"
          title={this.props.intl.formatMessage({
            id: "weathermap:cockpit:maps-creation-date:title"
          })}
        >
          {this.props.intl.formatMessage({
            id: "weathermap:cockpit:maps-creation-date:prefix"
          })}{" "}
          {dateToDateTimeString(this.props.lastUpdateTime)}
        </span>
        <span
          key="cp-release-update"
          className="cp-release-update tooltip"
          title={this.props.intl.formatMessage({
            id: "weathermap:cockpit:maps-update-date:title"
          })}
        >
          <span>
            {this.props.intl.formatMessage({
              id: "weathermap:cockpit:maps-update-date:prefix"
            })}{" "}
          </span>{" "}
          {dateToDateTimeString(this.props.nextUpdateTime)}
        </span>
        <span key="cp-release-copyright" className="cp-release-copyright">
          <a
            href="#"
            className="icon-copyright icon-margin-no tooltip"
            title="Copyright"
          ></a>
        </span>
      </div>
    );
  }

  onKeyPressed(e) {
    //console.log(e.keyCode);
    switch (e.keyCode) {
      case 37:
        this.props.previousTime();
        break;
      case 39:
        this.props.nextTime();
        break;
      case 32:
        this.props.player.toggle();
        break;
      default:
        this.props.previousTime();
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
    return (
      <div
        key="map-cockpit"
        className={classes.join(" ")}
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
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
            {this.getTimeline()}
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
            <a
              href="https://www.zamg.ac.at"
              className="tooltip"
              title="ZAMG"
            ></a>
          </div>
        </div>
      </div>
    );
  }
}
export default injectIntl(WeatherMapCockpit);
