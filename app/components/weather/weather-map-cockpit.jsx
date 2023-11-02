import React from "react";
import $ from "jquery";
import { injectIntl } from "react-intl";
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
      const posFirstAvailable = $(".t" + this.props.timeArray[0]).offset();
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
          left: posLast.left - posContainer.left + timespan * this.tickWidth,
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
            label={this.props.intl.formatMessage(
              { id: "weathermap:domain:timespan:description" },
              { range: nrOnlyTimespan }
            )}
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
            {this.props.intl.formatMessage({
              id: "weathermap:domain:timespan:description:1"
            })}
          </span>
        );
    }

    return (
      <div key="cp-container-layer-range" className="cp-container-layer-range">
        <div key="cp-player" className="cp-layer">
          <Tooltip
            key="cp-select-parameter"
            label={this.props.intl.formatMessage({
              id: "weathermap:cockpit:select-parameter"
            })}
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
                {this.props.intl.formatMessage({
                  id: "weathermap:domain:title:" + this.props.domainId
                })}
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

  setClosestTick(x) {
    //console.log("setClosestTick hhhh", x, y);

    let closestTime = this.getClosestTick(x);

    // place back to origin
    if (closestTime === this.props.currentTime) {
      this.showTimes(true);
      this.rePostionsStamp(this.getLeftForTime(this.props.currentTime));
    }

    try {
      //console.log("setClosestTick hhhh closestTime:", new Date(closestTime));

      if (closestTime) this.props.changeCurrentTime(closestTime);
    } catch (e) {
      // Anweisungen für jeden Fehler
      console.error(e, this.props); // Fehler-Objekt an die Error-Funktion geben
    }
  }

  getTimeline() {
    let self = this;
    let nrOnlyTimespan = parseInt(this.props.timeSpan.replace(/\D/g, ""), 10);
    let parts = [];

    if (this.props.currentTime) {
      const timeStart = this.props.intl.formatTime(this.props.currentTime);
      let timeEnd = new Date(this.props.currentTime);
      timeEnd.setHours(timeEnd.getHours() + parseInt(nrOnlyTimespan, 10));
      //console.log("weathermapcockpit->gettimeline hhh", this.getLeftForTime, this.props.currentTime);
      const dragSettings = {
        left: this.getLeftForTime
          ? this.getLeftForTime(this.props.currentTime)
          : 0,
        onDragEnd: self.setClosestTick.bind(self),
        onDragStart: self.onDragStart.bind(this),
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
                  width: this.tickWidth * nrOnlyTimespan
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
                  {this.props.intl.formatTime(timeEnd)}
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
          <Tooltip
            key="cockpit-flipper-prev"
            label={this.props.intl.formatMessage({
              id: "weathermap:cockpit:flipper:previous"
            })}
          >
            <a
              role="button"
              tabIndex="0"
              href="#"
              onClick={self.setPreviousTime.bind(self)}
              key="arrow-left"
              className="cp-scale-flipper-left icon-arrow-left "
            >
              <span className="is-visually-hidden">
                {this.props.intl.formatMessage({
                  id: "weathermap:cockpit:flipper:previous"
                })}
              </span>
            </a>
          </Tooltip>
          <Tooltip
            key="cockpit-flipper-next"
            label={this.props.intl.formatMessage({
              id: "weathermap:cockpit:flipper:next"
            })}
          >
            <a
              role="button"
              tabIndex="0"
              href="#"
              onClick={self.setNextTime.bind(self)}
              key="arrow-right"
              className="cp-scale-flipper-right icon-arrow-right "
            >
              <span className="is-visually-hidden">
                {this.props.intl.formatMessage({
                  id: "weathermap:cockpit:flipper:next"
                })}
              </span>
            </a>
          </Tooltip>
        </div>

        <Timeline
          timeArray={this.props.timeArray}
          timeSpan={this.props.timeSpan}
          currentTime={this.props.currentTime}
          changeCurrentTime={this.props.changeCurrentTime}
          updateCB={this.onTimelineUpdate.bind(this)}
        />

        <div key="analyse-forecast" className="cp-scale-analyse-forecast">
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

    let linkClassesPlay = ["cp-movie-play", "icon-play"];
    let linkClassesStop = ["cp-movie-stop", "icon-pause"];
    let divClasses = ["cp-movie"];
    if (this.props.player.playing) divClasses.push("js-playing");
    return (
      <div key="cp-movie" className={divClasses.join(" ")}>
        <Tooltip
          key="cp-movie-play"
          label={this.props.intl.formatMessage({
            id: "weathermap:cockpit:play"
          })}
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
              {this.props.intl.formatMessage({
                id: "weathermap:cockpit:play"
              })}
            </span>
          </a>
        </Tooltip>
        <Tooltip
          key="cp-movie-stop"
          label={this.props.intl.formatMessage({
            id: "weathermap:cockpit:stop"
          })}
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
              {this.props.intl.formatMessage({
                id: "weathermap:cockpit:stop"
              })}
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
          label={this.props.intl.formatMessage({
            id: "weathermap:cockpit:maps-creation-date:title"
          })}
        >
          <span className="cp-release-released">
            <span>
              {this.props.intl.formatMessage({
                id: "weathermap:cockpit:maps-creation-date:prefix"
              })}{" "}
            </span>
            {this.props.intl.formatDate(
              this.props.lastUpdateTime,
              DATE_TIME_FORMAT
            )}
          </span>
        </Tooltip>
        <Tooltip
          key="cp-realse-date"
          label={this.props.intl.formatMessage({
            id: "weathermap:cockpit:maps-update-date:title"
          })}
        >
          <span key="cp-release-update" className="cp-release-update">
            <span>
              {this.props.intl.formatMessage({
                id: "weathermap:cockpit:maps-update-date:prefix"
              })}{" "}
            </span>{" "}
            {this.props.intl.formatDate(
              this.props.nextUpdateTime,
              DATE_TIME_FORMAT
            )}
          </span>
        </Tooltip>
        <Tooltip
          key="cockpit-title-tp"
          label={this.props.intl.formatMessage({
            id: "weathermap:cockpit:unit:title"
          })}
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
    if (LOOP || this.props.currentTime != this.props.timeArray[0])
      this.props.previousTime();
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
            <Tooltip
              key="cp-copyright-tp"
              label={this.props.intl.formatMessage({
                id: "weathermap:cockpit:zamg:hover"
              })}
            >
              <a
                href="https://www.zamg.ac.at"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="is-visually-hidden">ZAMG</span>
              </a>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}
export default injectIntl(observer(WeatherMapCockpit));
