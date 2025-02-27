import React, { useEffect, useState } from "react";
import { FormattedDate, FormattedMessage } from "../../i18n";
import { Link } from "react-router-dom";
import Timeline from "./timeline.jsx";
import { Tooltip } from "../tooltips/tooltip";
import { DATE_TIME_FORMAT } from "../../util/date";
import * as store from "../../stores/weatherMapStore";
import { useStore } from "@nanostores/react";
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

const WeatherMapCockpit = () => {
  const [lastRedraw, setLastRedraw] = useState(+new Date());
  const domainId = useStore(store.domainId);
  const timeSpan = useStore(store.timeSpan);
  const nextUpdateTime = useStore(store.nextUpdateTime);
  const lastUpdateTime = useStore(store.lastDataUpdate);

  useEffect(() => {
    window.addEventListener("resize", redraw);
    adaptVH();
    document?.querySelector("body").classList.remove("layer-selector-open");
    return () => {
      window.removeEventListener("resize", redraw);
    };
  }, []);

  const redraw = () => {
    setLastRedraw(+new Date());
    adaptVH();
  };

  const adaptVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  const handleEvent = (type, value) => {
    const body = document?.querySelector("body");
    body.classList.remove("layer-selector-open");
    switch (type) {
      case "domain":
        store.changeDomain(value);
        break;
      case "timeSpan":
        store.changeTimeSpan(value);
        break;
      case "time":
        store.changeCurrentTime(value);
        break;
      default:
        break;
    }
  };

  const getDomainButtons = () => {
    const domainButtons = store.config
      ? Object.keys(store.config.domains).map(domainId => {
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

    const buttons = [];
    domainButtons.forEach(aButton => {
      const linkClasses = ["cp-layer-selector-item"];
      const spanClasses = ["layer-select"];
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
    let allButtons;

    if (store.config?.domains?.[domainId]) {
      const domainConfig = store.config.domains[domainId].item;

      const buttons = domainConfig.timeSpans.map(aItem => {
        const nrOnlyTimespan = aItem.replace(/\D/g, "");
        return (
          <a
            role="button"
            tabIndex="0"
            key={aItem}
            onClick={() => handleEvent("timeSpan", aItem)}
            className={`cp-range-${nrOnlyTimespan} ${timeSpan === aItem ? "js-active" : ""}`}
          >
            {nrOnlyTimespan}h
          </a>
        );
      });

      if (buttons.length > 1)
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
              <span className="layer-select-text">
                <span className="layer-select-name">
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
    const items = [];
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
    const divClasses = ["cp-legend-items"];
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
          placement="right-end"
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
          placement="left-end"
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
          placement="left-end"
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

  const classes = [
    "map-cockpit",
    "weather-map-cockpit",
    "lastRedraw-" + lastRedraw
  ];

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
          <Timeline key="cp-timeline" updateCB={handleEvent} />
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
export default WeatherMapCockpit;
