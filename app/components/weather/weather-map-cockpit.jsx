import React, { useState, useEffect } from "react";
import $ from "jquery";
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

const WeatherMapCockpit = ({
  timeSpan,
  startDate,
  currentTime,
  lastUpdateTime,
  nextUpdateTime,
  domainId,
  eventCallback,
  changeCurrentTime,
  player,
  storeConfig
}) => {
  const [lastRedraw, setLastRedraw] = useState(new Date().getTime());

  useEffect(() => {
    window.addEventListener("resize", redraw);
    adaptVH();
    $("body").removeClass("layer-selector-open");
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

  // const placeCockpitItems = tickWidth => {
  //   // console.log(
  //   //   "placeCockpitItems: s04",
  //   //   currentTime,
  //   //   tickWidth
  //   // );
  //   const timespan = parseInt(timeSpan.replace(/\D/g, ""), 10);
  //   const startDateTime = new Date(timeArray[0]);
  //   startDateTime.setUTCHours(
  //     startDateTime.getUTCHours() - (timespan > 1 ? timespan : 0)
  //   );
  //   if (currentTime && startDateTime) {
  //     const posContainerEl = document.querySelector(".cp-scale-days");
  //     const posContainer = posContainerEl.getBoundingClientRect();

  //     // console.log("cockpit #33", {
  //     //   currTime: new Date(currentTime),
  //     //   firstTimeStamp: timeArray[0],
  //     //   firstTime: new Date(timeArray[0]),
  //     //   firstTimeMinusTimeSpan: startDateTime,
  //     //   timespan,
  //     //   posContainerL: posContainer.left,
  //     //   scrollx: window.scrollX
  //     // });
  //     const posFirstAvailableEl = document.querySelector(
  //       ".t" + startDateTime.getTime()
  //     );
  //     if (!posFirstAvailableEl) {
  //       // console.log("cockpit s044 ERROR", {
  //       //   currTime: new Date(currentTime),
  //       //   startDateTime: startDateTime.getTime(),
  //       //   timespan
  //       // });

  //       return;
  //     }
  //     // console.log("cockpit s044 OK", {
  //     //   currTime: new Date(currentTime),
  //     //   startDateTime: startDateTime.getTime(),
  //     //   timespan
  //     // });
  //     const posFirstAvailable = posFirstAvailableEl.getBoundingClientRect();

  //     const posLastEl = document.querySelector(
  //       ".t" + timeArray[timeArray.length - 1]
  //     );
  //     const posLast = posLastEl.getBoundingClientRect();

  //     //const flipperWidth = $(".cp-scale-flipper-right").outerWidth();
  //     showTimes(true);
  //     if (timeArray.length < 2) {
  //       $(".cp-scale-flipper-left").css({
  //         display: "none"
  //       });
  //       $(".cp-scale-flipper-right").css({
  //         display: "none"
  //       });
  //       $(".cp-movie").css({
  //         display: "none"
  //       });
  //     } else {
  //       $(".cp-scale-flipper-left").css({
  //         left: posFirstAvailable?.left - posContainer.left,
  //         display: ""
  //       });
  //       $(".cp-scale-flipper-right").css({
  //         left: posLast.left - posContainer.left,
  //         display: ""
  //       });
  //       $(".cp-movie").css({
  //         display: ""
  //       });
  //     }

  //     if (lastAnalyticTime) {
  //       const lastAnalyticTimeCompEl = document.querySelector(
  //         ".t" + lastAnalyticTime
  //       );
  //       const lastAnalyticTimeComp =
  //         lastAnalyticTimeCompEl.getBoundingClientRect();
  //       $(".cp-scale-analyse-bar").css({
  //         left: posFirstAvailable?.left - posContainer.left,
  //         width:
  //           lastAnalyticTimeComp?.left - posFirstAvailable?.left - tickWidth,
  //         display: ""
  //       });
  //     } else
  //       $(".cp-scale-analyse-bar").css({
  //         display: "none"
  //       });
  //   }
  // };

  // const onTimelineUpdate = ({ tickWidth }) => {
  //   //console.log("onTimelineUpdate s04", tickWidth);

  //   placeCockpitItems(tickWidth);
  // };

  const onTimelineUpdate = newTime => {
    changeCurrentTime(newTime);
  };

  const handleEvent = (type, value) => {
    if (typeof eventCallback === "function") {
      player.stop();
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
              <span className="layer-select-info">
                Possibility to add supporting information
              </span>
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
              onClick={() => handleEvent("timeSpan", aItem)}
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
              href="#"
              role="button"
              tabIndex="0"
              className="cp-layer-selector-item cp-layer-trigger "
              onClick={() => {
                $("body").toggleClass("layer-selector-open");
              }}
            >
              <div className="layer-select icon-snow">
                <span class="layer-select-text">
                  <span class="layer-select-name">
                    {
                      <FormattedMessage
                        id={"weathermap:domain:title:" + domainId}
                      />
                    }
                  </span>
                  <span class="layer-select-info">
                    Possibility to add supporting information
                  </span>
                </span>
              </div>
              <span className="layer-trigger"></span>
            </a>
          </Tooltip>
        </div>

        <div key="cp-range" className="cp-range">
          {allButtons}
        </div>
      </div>
    );
  };

  // const getPlayerButtons = () => {
  //   //console.log("getPlayerButtons", player.playing);
  //   // const label =
  //   //   "weathermap:player:" + (player.playing ? "stop" : "play");

  //   let linkClassesPlay = ["cp-movie-play", "icon-play"];
  //   let linkClassesStop = ["cp-movie-stop", "icon-pause"];
  //   let divClasses = ["cp-movie"];
  //   if (player.playing()) divClasses.push("js-playing");
  //   return (
  //     <div key="cp-movie" className={divClasses.join(" ")}>
  //       <Tooltip
  //         key="cp-movie-play"
  //         label={<FormattedMessage id="weathermap:cockpit:play" />}
  //       >
  //         <a
  //           key="playerButton"
  //           className={linkClassesPlay.join(" ")}
  //           href="#"
  //           onClick={() => {
  //             player.toggle();
  //           }}
  //         >
  //           <span className="is-visually-hidden">
  //             {<FormattedMessage id="weathermap:cockpit:play" />}
  //           </span>
  //         </a>
  //       </Tooltip>
  //       <Tooltip
  //         key="cp-movie-stop"
  //         label={<FormattedMessage id="weathermap:cockpit:stop" />}
  //       >
  //         <a
  //           key="stopButton"
  //           className={linkClassesStop.join(" ")}
  //           href="#"
  //           onClick={() => {
  //             player.toggle();
  //           }}
  //         >
  //           <span className="is-visually-hidden">
  //             {<FormattedMessage id="weathermap:cockpit:stop" />}
  //           </span>
  //         </a>
  //       </Tooltip>
  //     </div>
  //   );
  // };

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
            {/* <span>
              <FormattedMessage id="weathermap:cockpit:maps-creation-date:prefix" />
            </span>{" "}
            <FormattedDate date={lastUpdateTime} options={DATE_TIME_FORMAT} /> */}
          </span>
        </Tooltip>
        <Tooltip
          key="cp-realse-date"
          label={
            <FormattedMessage id="weathermap:cockpit:maps-update-date:title" />
          }
        >
          <span key="cp-release-update" className="cp-release-update">
            {/* <span>
              <FormattedMessage id="weathermap:cockpit:maps-update-date:prefix" />
            </span>{" "}
            <FormattedDate date={nextUpdateTime} options={DATE_TIME_FORMAT} /> */}
          </span>
        </Tooltip>
        <Tooltip
          key="cockpit-title-tp"
          label={<FormattedMessage id="weathermap:cockpit:unit:title" />}
        >
          <span className="cp-legend-unit">{DOMAIN_UNITS[domainId]}</span>
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
  };

  //console.log("weather-map-cockpit->render hhhh", currentTime);
  let classes = [
    "map-cockpit",
    "weather-map-cockpit",
    "lastRedraw-" + lastRedraw
  ];

  const firstHour = new Date(startDate);
  firstHour.setUTCHours(firstHour.getUTCHours() - 24 * 365);

  const imgRoot = `${window.config.projectRoot}images/pro/`;

  let usedStartTime = new Date(startDate); // usedStartDate - 100 days from startDate
  usedStartTime.setDate(usedStartTime.getDate() - 100);
  let usedEndTime = new Date(startDate) || null;
  usedEndTime.setDate(usedEndTime.getDate() + (timeSpan.includes("+") ? 3 : 0));

  let usedInitialDate = new Date(currentTime);
  if (
    usedEndTime &&
    new Date(currentTime).getTime() > new Date(usedEndTime).getTime()
  )
    usedInitialDate = new Date(startDate);

  // console.log("weather-map-cockpit->render #i41", {
  //   timeSpan: Number(timeSpan.replace(/\D/g, ""), 10),
  //   startDate,
  //   currentTime,
  //   usedStartTime,
  //   usedInitialDate,
  //   usedEndTime,
  //   firstHour
  // });

  const absSpan = Number(timeSpan.replace(/\D/g, ""), 10);

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
          {firstHour && startDate && currentTime && (
            <Timeline
              key="cp-timeline"
              domainId={domainId}
              timeSpan={absSpan}
              barDuration={absSpan}
              showBar={absSpan > 1}
              initialDate={usedInitialDate}
              startTime={usedStartTime}
              endTime={usedEndTime}
              //firstHour={firstHour?.getUTCHours()}
              updateCB={onTimelineUpdate}
            />
          )}

          {/* {getPlayerButtons()} */}
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
