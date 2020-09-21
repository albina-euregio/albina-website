import React from "react";
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import Draggable from "react-draggable";
import { reaction } from "mobx";
import { observer } from "mobx-react";

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
    this.state = {
      redraw: null
    };
    this.redrawForPositioning = "update";
  }

  componentDidMount() {
    reaction(
      () => this.props.domainId,
      () => {
        //console.log("Domain change hhh");
        window.setTimeout(tooltip_init, 200);
        this.redrawForPositioning = "update";
      }
    );
    reaction(
      () => this.props.timeSpan,
      () => {
        //console.log("timeSpan change hhh");
        window.setTimeout(tooltip_init, 200);
        this.redrawForPositioning = "update";
      }
    );

    // console.log(
    //   "componentDidMount ggg:",
    //   this.props.currentTime,
    //   this.props.firstAnalyticTime
    // );
    window.addEventListener(
      "resize",
      this.setState({ redraw: new Date().getTime() })
    );
    //console.log("componentDidMount hhh", this.redrawForPositioning);
    if (this.redrawForPositioning === "redraw") {
      this.setState({ redraw: new Date().getTime() });
      this.redrawForPositioning = "";
    } else if (this.redrawForPositioning === "") this.placeCockpitItems();
  }

  componentDidUpdate() {
    // console.log(
    //   "componentDidUpdate ggg:",
    //   this.props.currentTime,
    //   this.props.firstAnalyticTime
    // );
    tooltip_init();
    //console.log("componentDidUpdate hhh", this.redrawForPositioning);
    if (this.redrawForPositioning === "redraw") {
      this.setState({ redraw: new Date().getTime() });
      this.redrawForPositioning = "";
    } else if (this.redrawForPositioning === "") this.placeCockpitItems();
  }

  placeCockpitItems() {
    // console.log(
    //   "placeCockpitItems: hhh",
    //   // this.props.currentTime,
    //   // this.props.firstAnalyticTime,
    //   this.redrawForPositioning
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
        left: posFirstAvailable.left - posContainer.left + this.tickWidth
      });
      $(".cp-scale-flipper-right").css({
        left:
          this.tickWidth +
          posLast.left -
          posContainer.left +
          timespan * this.tickWidth
      });

      if (this.redrawForPositioning === "redraw") {
        // this.setState({redraw: new Date().getTime()});
        // this.redrawForPositioning = "";
        // console.log(
        //   "placeCockpitItems hhh iii:",
        //   this.props.currentTime,
        //   this.state,
        //   this.redrawForPositioning,
        //   this.tickWidth
        // );
        //   $(".cp-scale-stamp-range").css({
        //     left: this.leftPosForCurrentTime
        //   });
        //   $(".cp-scale-stamp-point").css({
        //     left: this.leftPosForCurrentTime
        //   });
        //   this.redrawForPositioning = false;
        // } else {
        //   $(".cp-scale-stamp-range").css({
        //     left: ""
        //   });
        //   $(".cp-scale-stamp-point").css({
        //     left: ""
        //   });
      }

      if (this.props.firstAnalyticTime) {
        const firstAnalyticTime = $(
          ".t" + this.props.firstAnalyticTime
        ).offset();
        $(".cp-scale-analyse-bar").css({
          left: posFirstAvailable.left - posContainer.left,
          width: firstAnalyticTime.left - posFirstAvailable.left
        });
      }
    }
  }

  get tickWidth() {
    if (this.props.currentTime) {
      const posFirstTick = $(".cp-scale-hour-1")
        .first()
        .offset();
      const posSecondTick = $(".cp-scale-hour-2")
        .first()
        .offset();
      if (posFirstTick === undefined || posSecondTick === undefined) return 0;
      return posSecondTick.left - posFirstTick.left;
    }
  }

  get leftPosForCurrentTime() {
    const currentTick = $(".t" + this.props.currentTime);
    if (currentTick.offset() === undefined) return null;
    let left = Math.abs(
      currentTick.offset()["left"] -
        $(".cp-scale-days").offset()["left"] +
        this.tickWidth
    );
    // console.log(
    //   "leftPosForCurrentTime ggg",
    //   new Date(this.props.currentTime),
    //   left
    // );
    return left;
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
    //console.log("getTimeSpanOptions 777", this.props);
    if (
      this.props.storeConfig &&
      this.props.storeConfig.domains[this.props.domainId]
    ) {
      let domainConfig = this.props.storeConfig.domains[this.props.domainId]
        .item;

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
    }

    return (
      <div key="cp-container-layer-range" className="cp-container-layer-range">
        <div key="cp-player" className="cp-layer">
          <a
            className="cp-layer-selector-item cp-layer-trigger tooltip"
            title="Layer wählen"
          >
            <span className="layer-select icon-snow">
              {this.props.intl.formatMessage({
                id: "weathermap:domain:title:" + this.props.domainId
              })}
            </span>
            <span
              onClick={() => {
                $("body").toggleClass("layer-selector-open");
              }}
              className="layer-trigger"
            ></span>
          </a>
        </div>

        <div key="cp-range" className="cp-range">
          <div key="cp-range-buttons" className="cp-range-buttons 0js-inactive">
            {buttons}
          </div>
        </div>
      </div>
    );
  }

  setClosestTick(e, ui) {
    //console.log("setClosestTick cccc", ui);

    let closestDist = 9999;
    let closestTime;
    let nrOnlyTimespan = this.props.timeSpan.replace(/\D/g, "");

    const arrowLeft = ui.x; // + $(".cp-scale-stamp-point-arrow").outerWidth() / 2;
    $("#whereami").css({ left: ui.x });
    this.props.timeArray.forEach(eTime => {
      //console.log("setClosestTick eTime", eTime);
      const curItemLeft = Math.abs(
        $(".t" + eTime).offset()["left"] - $(".cp-scale-days").offset()["left"]
      );
      // console.log(
      //   "setClosestTick ccc eee ITEM",
      //   eTime,
      //   arrowLeft,
      //   curItemLeft,
      //   new Date(eTime),
      //   Math.abs(arrowLeft - curItemLeft)
      // );
      if (closestDist > Math.abs(arrowLeft - curItemLeft)) {
        closestTime = eTime;
        closestDist = Math.abs(arrowLeft - curItemLeft);
        // console.log(
        //   "setClosestTick eee SET",
        //   closestDist,
        //   new Date(eTime),
        //   arrowLeft,
        //   curItemLeft
        // );
      }
    });
    try {
      // console.log(
      //   "setClosestTick ccc  eee closestTime:",
      //   new Date(closestTime),
      //   closestDist
      // );

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
    let nrOnlyTimespan = this.props.timeSpan.replace(/\D/g, "");
    let parts = [];

    // console.log(
    //   "getTimeline fff",
    //   self.props.timeArray.indexOf(self.props.startDate),
    //   self.props.startDate,
    //   self.props.agl
    // );
    this.props.timeArray.forEach(aTime => {
      let weekday = dateToWeekdayString(aTime);

      if (lastTime !== weekday) {
        let hours = [];
        for (let i = 1; i < 26; i++) {
          let currentHour = new Date(aTime).setHours(i);
          let isSelectable = self.props.timeArray.includes(currentHour);
          let spanClass = ["cp-scale-hour-" + i, "t" + currentHour];
          if (aTime < self.props.startDate) spanClass.push("cp-analyse-item");
          hours.push(
            <span
              key={currentHour}
              className={spanClass.join(" ")}
              data-timestamp={currentHour}
              data-selectable={isSelectable}
              data-time={dateToDateTimeString(currentHour)}
            ></span>
          );
        }

        days.push(
          <div className="cp-scale-day" key={aTime}>
            <span className="cp-scale-day-name">
              {weekday.substring(0, 2)}
              <span>{weekday.substring(2, 20)}</span>{" "}
              {dateToShortDayString(aTime)}
            </span>
            <div key="cp-scale-hours" className="cp-scale-hours">
              {hours}
            </div>
          </div>
        );

        lastTime = weekday;
      }
    });

    if (this.props.currentTime) {
      const timeStart = dateToTimeString(this.props.currentTime);
      let timeEnd = new Date(this.props.currentTime);
      timeEnd.setHours(timeEnd.getHours() + parseInt(nrOnlyTimespan, 10));
      // console.log(
      //   "xxxxx",
      //   this.props.currentTime,
      //   timeEnd,
      //   timeEnd.getHours(),
      //   parseInt(nrOnlyTimespan, 10)
      // );

      // function dragging(e, ui) {
      //   console.log("dragging", e, ui);
      // }

      // function onStart() {
      //   console.log("onStart");
      //   $(".cp-scale-stamp-point").addClass("js-dragging");
      //   $(".cp-scale-stamp-range").addClass("js-dragging");
      // }

      // test if scale has been drawn already
      if (this.redrawForPositioning === "update")
        this.redrawForPositioning = "redraw";
      // console.log(
      //   "getTimeline tick hhh",
      //   this.redrawForPositioning,
      //   this.state.redraw
      // );
      const dragSettings = {
        axis: "x",
        defaultPosition: { x: this.leftPosForCurrentTime || 0, y: 0 },
        key: this.state.redraw + this.props.currentTime,
        //grid: [this.tickWidth, 0],
        bounds: "parent",
        defaultClassName: "",
        defaultClassNameDragging: "js-dragging",
        //onStart: onStart,
        onStop: self.setClosestTick.bind(self)
        //onDrag: dragging
      };
      parts.push(
        <div key="cp-scale-stamp" className="cp-scale-stamp">
          <div
            key="whereami"
            id="whereami"
            style={{
              position: "absolute",
              width: "1px",
              height: "20px",
              backgroundColor: "#f00",
              left: "20px"
            }}
          ></div>

          {nrOnlyTimespan !== "1" && (
            <Draggable {...dragSettings}>
              <div
                key="scale-stamp-range"
                style={{ left: 0, width: this.tickWidth * nrOnlyTimespan }}
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
            </Draggable>
          )}
          {nrOnlyTimespan === "1" && (
            <Draggable {...dragSettings}>
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
            </Draggable>
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

        <div key="days" className="cp-scale-days">
          {days}
        </div>

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
          03.09.2020 18:00
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
          04.01.2020 00:00
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

  render() {
    //console.log("weather-map-cockpit->render");
    return (
      <div key="map-cockpit" className="map-cockpit weather-map-cockpit">
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
