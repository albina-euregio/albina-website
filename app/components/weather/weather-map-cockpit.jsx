import React from "react";
import { withRouter, matchPath } from "react-router";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import Draggable from "react-draggable";
import { reaction } from "mobx";

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
  "new-snow": "cp-legend-snow",
  "diff-snow": "cp-legend-snow",
  wind: "cp-legend-wind",
  gust: "cp-legend-wind"
};

class WeatherMapCockpit extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    reaction(
      () => this.props.domainId,
      () => {
        console.log("update tooltip #1");
        window.setTimeout(tooltip_init, 100);
      }
    );
    reaction(
      () => this.props.timeSpan,
      () => {
        console.log("update tooltip #2");
        window.setTimeout(tooltip_init, 100);
      }
    );
    window.setTimeout(tooltip_init, 100);
  }

  componentDidUpdate() {
    if (this.props.currentTimeIndex) {
      const timespan = parseInt(this.props.timeSpan.replace(/\D/g, ""), 10);
      const currentTick = $(".t" + this.props.currentTimeIndex);
      const posContainer = $(".cp-scale-days").offset();
      const pos = currentTick.offset();
      const posFirst = $(".t" + this.props.timeArray[0]).offset();
      const posLast = $(
        ".t" + this.props.timeArray[this.props.timeArray.length - 1]
      ).offset();
      console.log("componentDidUpdate xyxx:", this.props.currentTimeIndex);
      let posNext = currentTick.next().offset();
      if (!posNext) posNext = currentTick.prev().position();
      const tickWidth = Math.abs(pos.left - posNext.left);
      $(".cp-scale-stamp-point").css(
        "left",
        tickWidth + pos.left - posContainer.left
      );
      $(".cp-scale-flipper-left").css(
        "left",
        tickWidth + posFirst.left - posContainer.left
      );
      $(".cp-scale-flipper-right").css(
        "left",
        tickWidth + posLast.left - posContainer.left
      );
      $(".cp-scale-stamp-range").css(
        "left",
        tickWidth + pos.left - posContainer.left
      );
      $(".cp-scale-stamp-range").css("width", tickWidth * timespan);
    }
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
    console.log("getTimeSpanOptions 777", this.props);
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
            href="javascript: void(0)"
            onClick={this.handleEvent.bind(this, "timeSpan", aItem)}
            className={linkClasses.join(" ")}
            data-tippy=""
            data-original-title={this.props.intl.formatMessage({
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
            href="#"
            className="cp-layer-selector-item cp-layer-trigger tooltip"
            data-tippy=""
            data-original-title="Layer wählen"
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
          <div key="cp-range-buttons" className="cp-range-buttons 0js-inactive">
            {buttons}
          </div>
        </div>
      </div>
    );
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

  setClosestTick(draggable) {
    // console.log("setClosestTick", draggable);

    let closestDist = 9999;
    let closestTime;
    this.props.timeArray.forEach(eTime => {
      //console.log("setClosestTick eTime", eTime);
      const arrowLeft =
        $(".cp-scale-stamp-point-arrow").offset()["left"] +
        $(".cp-scale-stamp-point-arrow").width() / 2;
      const curItemLeft = $(".t" + eTime).offset()["left"];
      console.log(
        "setClosestTick ccc ITEM",
        eTime,
        arrowLeft,
        curItemLeft,
        Math.abs(arrowLeft - curItemLeft)
      );
      if (closestDist > Math.abs(arrowLeft - curItemLeft)) {
        closestTime = eTime;
        closestDist = Math.abs(arrowLeft - curItemLeft);
        console.log(
          "setClosestTick ccc SET",
          closestDist,
          new Date(eTime),
          arrowLeft
        );
      }
    });
    try {
      console.log(
        "setClosestTick ccc closestTime:",
        new Date(closestTime),
        closestDist
      );
      if (closestTime) this.props.changeTimeIndex(closestTime);
    } catch (e) {
      // Anweisungen für jeden Fehler
      console.log(e, this.props); // Fehler-Objekt an die Error-Funktion geben
    }
    $(".scale-stamp-point").css("transition", "");
  }

  getTimeline() {
    let self = this;
    let lastTime;
    let days = [];
    let nrOnlyTimespan = this.props.timeSpan.replace(/\D/g, "");
    let parts = [];

    this.props.timeArray.forEach(aTime => {
      let weekday = dateToWeekdayString(aTime);
      if (lastTime !== weekday) {
        let hours = [];
        for (let i = 1; i < 25; i++) {
          let currentHour = new Date(aTime).setHours(i);
          let isSelectable = self.props.timeArray.includes(currentHour);
          let spanClass = ["cp-scale-hour-" + (i - 1), "t" + currentHour];
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
          <div className="cp-scale-day" key={weekday}>
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

    if (this.props.currentTimeIndex) {
      const timeStart = dateToTimeString(this.props.currentTimeIndex);
      let timeEnd = new Date(this.props.currentTimeIndex);
      //timeEnd.setHours(timeEnd.getHours() + parseInt(nrOnlyTimespan, 10));
      console.log(
        "xxx",
        this.props.currentTimeIndex,
        timeEnd,
        timeEnd.getHours(),
        parseInt(nrOnlyTimespan, 10)
      );

      function dragging(e, ui) {
        console.log("dragging", e, ui);
      }

      function onStart() {
        console.log("onStart");
        $(".cp-scale-stamp-point").css("transition", "none !important");
      }

      const dragHandlers = {
        onStart: onStart,
        onStop: self.setClosestTick.bind(self),
        onDrag: dragging
      };
      parts.push(
        <div key="cp-scale-stamp" className="cp-scale-stamp">
          {nrOnlyTimespan !== "1" && (
            <Draggable axis="x" onDrag={this.dragging}>
              <div
                key="scale-stamp-range"
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
            <Draggable axis="x" {...dragHandlers}>
              <div
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
            key="arrow-left"
            className="cp-scale-flipper-left icon-arrow-left tooltip"
            data-tippy=""
            data-original-title="Früher"
          ></a>
          <a
            href="#"
            key="arrow-right"
            className="cp-scale-flipper-right icon-arrow-right tooltip"
            data-tippy=""
            data-original-title="Später"
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
    console.log("getPlayerButtons", this.props.player.playing);
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
          href="javascript: void(0)"
          data-tippy=""
          data-original-title="Play"
          onClick={() => {
            this.props.player.toggle();
          }}
        ></a>
        <a
          key="stopButton"
          className={linkClassesStop.join(" ")}
          href="javascript: void(0)"
          data-tippy=""
          data-original-title="Stop"
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
          data-tippy=""
          data-original-title="Zeitpunkt der Erstellung"
        >
          Erstellt 03.09.2020 18:00
        </span>
        <span
          key="cp-release-update"
          className="cp-release-update tooltip"
          data-tippy=""
          data-original-title="Voraussichtlicher Zeitpunkt des nächsten Updates"
        >
          <span>Update</span> 04.01.2020 00:00
        </span>
        <span key="cp-release-copyright" className="cp-release-copyright">
          <a
            href="#"
            className="icon-copyright icon-margin-no tooltip"
            data-tippy=""
            data-original-title="Copyright"
          ></a>
        </span>
      </div>
    );
  }

  render() {
    console.log("weather-map-cockpit->render");
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
              data-tippy=""
              data-original-title="ZAMG"
            ></a>
          </div>
        </div>
      </div>
    );
  }
}
export default injectIntl(withRouter(WeatherMapCockpit));
