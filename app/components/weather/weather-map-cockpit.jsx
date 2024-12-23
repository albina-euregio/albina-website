import React, { useState, useEffect } from "react";
import { FormattedDate, FormattedMessage } from "../../i18n";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import Timeline from "./timeline.jsx";
import { Tooltip } from "../tooltips/tooltip";
import { DATE_TIME_FORMAT } from "../../util/date";
//import { tooltip_init } from "../tooltips/tooltip-dom";

const DOMAIN_ICON_CLASSES = {
  temp: "icon-temperature",
  "snow-height": "icon-snow",
  "new-snow": "icon-snow-new",
  "diff-snow": "icon-snow-diff",
  "snow-line": "icon-snow-drop",
  wind: "icon-wind",
  gust: "icon-wind-gust",
  wind700hpa: "icon-wind-high"
};

const DOMAIN_LEGEND_CLASSES = {
  temp: "cp-legend-temperature",
  "snow-height": "cp-legend-snow",
  "new-snow": "cp-legend-snownew",
  "diff-snow": "cp-legend-snowdiff",
  "snow-line": "cp-legend-snowline",
  wind: "cp-legend-wind",
  gust: "cp-legend-windgust",
  wind700hpa: "cp-legend-windhigh"
};

const DOMAIN_UNITS = {
  "snow-height": "cm",
  "new-snow": "cm",
  "diff-snow": "cm",
  "snow-line": "m",
  temp: "°C",
  wind: "km/h",
  gust: "km/h",
  wind700hpa: "km/h"
};

const LOOP = false;

const WeatherMapCockpit = ({
  timeSpan,
  startDate,
  currentTime,
  domainId,
  timeRange,
  eventCallback,
  changeCurrentTime,
  storeConfig,
  nextUpdateTime,
  lastUpdateTime
}) => {
  const [lastRedraw, setLastRedraw] = useState(new Date().getTime());

  useEffect(() => {
    window.addEventListener("resize", redraw);
    adaptVH();
    document?.querySelector("body").classList.remove("layer-selector-open");
    return () => {
      window.removeEventListener("resize", redraw);
    };
  }, []);

  const redraw = () => {
    setLastRedraw(new Date().getTime());
    adaptVH();
  };

  const adaptVH = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  const onTimelineUpdate = newTime => {
    //console.log("weather-map-cockpit->onTimelineUpdate #k0113", newTime);
    changeCurrentTime(newTime);
  };

  const handleEvent = (type, value) => {
    if (typeof eventCallback === "function") {
      const body = document?.querySelector("body");
      if (body?.classList?.contains("layer-selector-open"))
        body.classList.remove("layer-selector-open");
      eventCallback(type, value);
    }
  };

  const getDomainButtons = () => {
    const domainButtons = storeConfig
      ? Object.keys(storeConfig.domains).map(domainId => {
          return {
            id: domainId,
            title: (
              <FormattedMessage id={"weathermap:domain:title:" + domainId} />
            ),
            description: (
              <FormattedMessage
                id={"weathermap:domain:description:" + domainId}
              />
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
      if (aButton.id === domainId) linkClasses.push("js-active");
      buttons.push(
        <Link
          key={aButton.id}
          to={aButton.url}
          onClick={() => handleEvent("domain", aButton.id)}
          className={linkClasses.join(" ")}
        >
          {/* <span className={spanClasses.join(" ")}>{aButton.title}</span> */}
          <div className={spanClasses.join(" ")}>
            <span className="layer-select-text">
              <span className="layer-select-name">{aButton.title}</span>
              <span className="layer-select-info">{aButton.description}</span>
            </span>
          </div>
        </Link>
      );
    });
    return buttons;
  };

  const getTimeSpanOptions = () => {
    let buttons = [];
    let allButtons;
    //console.log("getTimeSpanOptions 777", props);
    if (storeConfig?.domains?.[domainId]) {
      let domainConfig = storeConfig.domains[domainId].item;

      let firstNrOnlyTimespan = domainConfig.timeSpans[0].replace(/\D/g, "");

      domainConfig.timeSpans.forEach(aItem => {
        let nrOnlyTimespan = aItem.replace(/\D/g, "");
        let linkClasses = ["cp-range-" + nrOnlyTimespan];
        if (timeSpan === aItem) linkClasses.push("js-active");

        buttons.push(
          <a
            role="button"
            tabIndex="0"
            key={aItem}
            onClick={() => handleEvent("timeSpan", aItem)}
            className={linkClasses.join(" ")}
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
            <FormattedMessage id="weathermap:domain:timespan:description:1" />
          </span>
        );
    }

    return (
      <div key="cp-container-layer-range" className="cp-container-layer-range">
        <div key="cp-player" className="cp-layer">
          <a
            href="#"
            role="button"
            tabIndex="0"
            className="cp-layer-selector-item cp-layer-trigger "
            onClick={() => {
              document
                ?.querySelector("body")
                .classList.toggle("layer-selector-open");
            }}
          >
            <div className={"layer-select " + DOMAIN_ICON_CLASSES[domainId]}>
              <span class="layer-select-text">
                <span class="layer-select-name">
                  {
                    <FormattedMessage
                      id={"weathermap:domain:title:" + domainId}
                    />
                  }
                </span>
                <span className="layer-select-info">
                  {
                    <FormattedMessage
                      id={"weathermap:domain:description:" + domainId}
                    />
                  }
                </span>
              </span>
            </div>
            <span className="layer-trigger"></span>
          </a>
        </div>

        <div key="cp-range" className="cp-range">
          {allButtons}
        </div>
      </div>
    );
  };

  const legendItems = amount => {
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
  };

  const getLegend = () => {
    let divClasses = ["cp-legend-items"];
    if (DOMAIN_LEGEND_CLASSES[domainId])
      divClasses.push(DOMAIN_LEGEND_CLASSES[domainId]);
    return (
      <div key="cp-legend" className="cp-legend">
        <div key="cp-legend-items" className={divClasses.join(" ")}>
          {legendItems(35)}
        </div>
      </div>
    );
  };
  const getReleaseInfo = () => {
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
            <FormattedDate date={lastUpdateTime} options={DATE_TIME_FORMAT} />
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
            <FormattedDate date={nextUpdateTime} options={DATE_TIME_FORMAT} />
          </span>
        </Tooltip>
        <Tooltip
          key="cockpit-title-tp"
          label={<FormattedMessage id="weathermap:cockpit:unit:title" />}
        >
          <span className="cp-legend-unit">{DOMAIN_UNITS[domainId]}</span>
        </Tooltip>
        <span key="cp-release-copyright" className="cp-release-copyright">
          <a
            href="#"
            className="icon-copyright icon-margin-no"
            title="Copyright"
          ></a>
        </span>
      </div>
    );
  };

  //console.log("weather-map-cockpit->render hhhh", {currentTime, timeRange, startDate, timeSpan, lastRedraw});
  let classes = [
    "map-cockpit",
    "weather-map-cockpit",
    "lastRedraw-" + lastRedraw
  ];

  const absSpan = Number(timeSpan.replace(/\D/g, ""), 10);
  // const firstHour = new Date(startDate);
  // firstHour.setUTCHours(firstHour.getUTCHours() - 24 * 365);

  const imgRoot = `${window.config.projectRoot}images/pro/`;

  let fixedStartTime = new Date(startDate); // usedStartDate - 730 days from startDate

  // fix startdate hours after possible timespan change
  const currentHoursFixedStartTime = fixedStartTime.getUTCHours();
  if (absSpan === 12 && [6, 18].includes(currentHoursFixedStartTime)) {
    fixedStartTime.setUTCHours(usedStartTime.getUTCHours() - 6);
  }
  if (absSpan % 24 === 0 && [12].includes(currentHoursFixedStartTime)) {
    fixedStartTime.setUTCHours(fixedStartTime.getUTCHours() - 12);
  }
  let usedStartTime = new Date(fixedStartTime) || null;
  usedStartTime.setDate(usedStartTime.getDate() - 730);
  let usedEndTime = new Date(fixedStartTime) || null;
  usedEndTime.setDate(usedEndTime.getDate() + (timeSpan.includes("+") ? 3 : 0));

  let analysesEndTs = new Date(startDate);

  // fix initdate hours after possible timespan change
  let usedInitialDate = new Date(currentTime);
  if (
    usedEndTime &&
    new Date(currentTime).getTime() > new Date(usedEndTime).getTime()
  )
    usedInitialDate = new Date(usedEndTime);

  const initialDateHours = usedInitialDate.getUTCHours();
  if (absSpan === 12 && [6, 18].includes(initialDateHours)) {
    usedInitialDate.setUTCHours(usedInitialDate.getUTCHours() - 6);
  }
  if (absSpan % 24 === 0 && [6, 12, 18].includes(initialDateHours)) {
    usedInitialDate.setUTCHours(
      usedInitialDate.getUTCHours() - initialDateHours
    );
  }
  // console.log("weather-map-cockpit->render #j01", {
  //   //absSpan,
  //   //timeSpan: Number(timeSpan.replace(/\D/g, ""), 10),
  //   //startDate: new Date(startDate).toUTCString(),
  //   currentTime: currentTime?.toUTCString(),
  //   //fixedStartTime: fixedStartTime?.toUTCString(),
  //   usedStartTime: usedStartTime?.toUTCString(),
  //   usedInitialDate: usedInitialDate?.toUTCString(),
  //   usedEndTime: usedEndTime?.toUTCString()
  //   // firstHour
  // });

  return (
    <div role="button" key="map-cockpit" className={classes.join(" ")}>
      <div key="cp-container-1" className="cp-container-1">
        <div key="cp-layer-selector" className="cp-layer-selector">
          {getDomainButtons()}
        </div>
      </div>

      <div key="cp-container-2" className="cp-container-2">
        {/* {getTickButtons()}
         */}

        <div key="cp-container-timeline" className="cp-container-timeline">
          {startDate && (
            <Timeline
              key="cp-timeline"
              domainId={domainId}
              timeSpan={absSpan}
              barDuration={absSpan}
              markerPosition={absSpan > 24 ? "75%" : "50%"}
              showBar={absSpan > 1}
              analysesEndTs={analysesEndTs?.toISOString()}
              initialDateTs={usedInitialDate.toISOString()}
              startTimeTs={usedStartTime.toISOString()}
              endTimeTs={usedEndTime.toISOString()}
              //firstHour={firstHour?.getUTCHours()}
              updateCB={onTimelineUpdate}
            />
          )}
        </div>

        {getTimeSpanOptions()}

        <div
          key="cp-containerl-legend-release"
          className="cp-container-legend-release"
        >
          {getLegend()}
          {getReleaseInfo()}
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
};
export default observer(WeatherMapCockpit);
