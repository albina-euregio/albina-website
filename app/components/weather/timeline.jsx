import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import { FormattedDate } from "../../i18n";
import { isSameDay } from "../../util/date.js";
import Dragger from "./dragger.jsx";
import { Tooltip } from "../tooltips/tooltip";
import { FormattedMessage } from "../../i18n";

const Timeline = ({
  timeSpan,
  currentTime,
  timeArray,
  changeCurrentTime,
  setPreviousTime,
  setNextTime,
  showTimes,
  onDragStart,
  updateCB
}) => {
  const [lastRedraw, setLastRedraw] = useState(new Date().getTime());

  const daysContainer = useRef();
  const [nrOnlyTimespan, setNrOnlyTimespan] = useState(null);
  const [draggerCoordinates, setDraggerCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    //console.log("useEffect s04", { currentTime, timeSpan });
    const tickWidth = getTickWidth();
    if (tickWidth > 0) updateCB({ tickWidth: tickWidth });
  }, [timeArray, currentTime, timeSpan]);

  useEffect(() => {
    //console.log("Timeline->useEffect s04", {
    //   timeSpan,
    //   currentTime: new Date(currentTime),
    //   timeArray,
    //   changeCurrentTime
    // });
    const thickWidth = getTickWidth();

    setDraggerCoordinates({
      x: getLeftForTime(currentTime) - thickWidth * nrOnlyTimespan,
      y: draggerCoordinates.y
    });
  }, [currentTime]);

  useEffect(() => {
    setNrOnlyTimespan(parseInt(timeSpan.replace(/\D/g, ""), 10));
  }, [timeSpan]);

  const getTickWidth = () => {
    const posFirstTick = $(".cp-scale-hour-1").first().offset();
    const posSecondTick = $(".cp-scale-hour-2").first().offset();
    if (posFirstTick === undefined || posSecondTick === undefined) return 0;
    return posSecondTick.left - posFirstTick.left;
  };

  const getTimeStart = triggerTime => {
    let timeStart = new Date(triggerTime);
    timeStart.setHours(timeStart.getHours() - parseInt(nrOnlyTimespan, 10));
    return timeStart;
  };

  const getLeftForTime = time => {
    const theTick = $(".t" + time);
    if (theTick.offset() === undefined) return null;
    let left = Math.abs(
      theTick.offset()["left"] - $(daysContainer.current).offset()["left"]
    );
    // console.log("getLeftForTime s03", {
    //   currentTimeUtc: new Date(currentTime).toUTCString(),
    //   foundTimeUtc: new Date(time).toUTCString(),
    //   tickWidth: tickWidth(),
    //   left
    // });
    return left;
  };

  const getClosestTick = left => {
    //console.log("getClosestTick cccc", ui);

    let closestDist = 9999;
    let closestTime;
    //let nrOnlyTimespan = timeSpan.replace(/\D/g, "");

    const arrowLeft = left; // + $(".cp-scale-stamp-point-arrow").outerWidth() / 2;
    $("#whereami").css({ left: left });

    timeArray.forEach(eTime => {
      //console.log("setClosestTick eTime", eTime);
      const curItemLeft = getLeftForTime(eTime);
      // console.log("getClosestTick hhhh ITEM", {
      //   eTime,
      //   arrowLeft,
      //   curItemLeft,
      //   eTimeUtc: new Date(eTime).toUTCString(),
      //   diff: Math.floor(Math.abs(arrowLeft - curItemLeft))
      // });
      if (closestDist > Math.abs(arrowLeft - curItemLeft)) {
        closestTime = eTime;
        closestDist = Math.abs(arrowLeft - curItemLeft);
      }
    });
    //console.log("getClosestTick closestTime:", {closestTime});

    if (closestTime) return closestTime;
    return null;
  };

  const getTimeline = () => {
    let lastTime;
    let days = [];
    const startDate = getTimeStart(currentTime);

    // console.log(
    //   "getTimeline fff",
    //   {indexStart: timeArray.indexOf(startDate),
    //     startDate,
    //     nrOnlyTimespan
    //   }
    // );
    let tempTimeArray = timeArray.slice();

    if (nrOnlyTimespan > 1) {
      let extraTime = new Date(tempTimeArray[0]);
      let minTime = new Date(extraTime);
      //console.log("timeArray#1", extraTime, maxTime, nrOnlyTimespan);
      minTime.setHours(minTime.getHours() - nrOnlyTimespan);

      //console.log("timeArray#2", extraTime, maxTime, nrOnlyTimespan);
      while (extraTime > minTime) {
        extraTime.setHours(extraTime.getHours() - 12);
        tempTimeArray.unshift(extraTime.getTime());
      }
      // console.log("timeArray#3 ##55", {
      //   tempTimeArray,
      //   extraTimeUTC: extraTime.toUTCString()
      // });
    }

    tempTimeArray.forEach(aTime => {
      const weekday = new Date(aTime).getDay();

      if (lastTime !== weekday) {
        let firstAvailableTime;
        let hours = [];
        for (let i = 0; i < 25; i++) {
          let currentHour = new Date(aTime).setHours(i);
          let currentStartHour = new Date(currentHour).setHours(
            new Date(aTime).getHours() +
              (nrOnlyTimespan > 1 ? nrOnlyTimespan : 0)
          );
          let isSelectable = tempTimeArray.includes(currentStartHour);

          let spanClass = ["cp-scale-hour-" + i, "t" + currentHour];
          if (aTime < startDate) spanClass.push("cp-analyse-item");
          if (isSelectable && !firstAvailableTime)
            firstAvailableTime = currentStartHour;
          hours.push(
            <span
              key={currentHour}
              className={spanClass.join(" ")}
              data-timestamp={currentHour}
              data-selectable={isSelectable}
              data-time={currentHour}
            ></span>
          );
        }

        days.push(
          <div
            className={
              currentTime && isSameDay(new Date(currentTime), new Date(aTime))
                ? "cp-scale-day cp-scale-day-today"
                : "cp-scale-day "
            }
            key={aTime}
          >
            <span className="cp-scale-day-name">
              <a
                role="button"
                tabIndex="0"
                data-first-hour={firstAvailableTime}
                onClick={() => {
                  changeCurrentTime(firstAvailableTime);
                }}
              >
                <FormattedDate
                  date={aTime}
                  options={{
                    weekday: "short",
                    day: "numeric",
                    month: "numeric"
                  }}
                />
              </a>
            </span>
            <div key="cp-scale-hours" className="cp-scale-hours">
              {hours}
            </div>
          </div>
        );

        lastTime = weekday;
      }
    });
    let classes = ["cp-scale-days", "redraw-" + lastRedraw];
    return (
      <div ref={daysContainer} key="days" className={classes.join(" ")}>
        {days}
      </div>
    );
  };

  const setClosestTick = x => {
    let closestTime = getClosestTick(x);
    let newLeft;
    //closestTime = this.getTimeStart(closestTime).getTime();
    //debugger;
    // console.log("setClosestTick hhhh", {
    //   //draggerWidth: $('#dragger').width(),
    //   x,
    //   closest: new Date(closestTime).toUTCString(),
    //   current: new Date(this.props.currentTime).toUTCString()
    // //new Date(this.getTimeStart(closestTime)).toUTCString()
    // });
    //console.log("setClosestTick hhhh #1", {closestTime, currentTime});
    // place back to origin
    //if (closestTime === currentTime) {

    showTimes(true);
    newLeft = getLeftForTime(closestTime) - getTickWidth() * nrOnlyTimespan;
    //console.log("setClosestTick s04 #2", { x, newLeft });
    setDraggerCoordinates({ x: newLeft, y: 0 });
    //}

    try {
      //console.log("setClosestTick hhhh1 closestTime:", new Date(closestTime).toUTCString(), newLeft);

      if (closestTime) changeCurrentTime(closestTime);
    } catch (e) {
      // Anweisungen für jeden Fehler
      console.error(e); // Fehler-Objekt an die Error-Funktion geben
    }
  };

  const getDragger = () => {
    let parts = [];

    if (currentTime) {
      // console.log(
      //   "weathermapcockpit->gettimeline s03",
      //   currentTime,
      //   draggerCoordinates
      // );
      const dragSettings = {
        onDragEnd: x => {
          setClosestTick(x + $("#dragger").width());
        },
        onDrag: onDragStart,
        parent: ".cp-scale-stamp",
        coordinates: draggerCoordinates,
        classes: []
      };

      // console.log("getDragger s03", {
      //   tickWidth: tickWidth(),
      //   nrOnlyTimespan,
      //   draggerCoordinates
      // });
      parts.push(
        <div key="cp-scale-stamp" className="cp-scale-stamp">
          {nrOnlyTimespan !== 1 && (
            <Dragger {...dragSettings}>
              <div
                id="dragger"
                key="scale-stamp-range"
                style={{
                  left: 0,
                  width: getTickWidth() * nrOnlyTimespan
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
                  <FormattedDate
                    date={getTimeStart(currentTime)}
                    options={{ timeStyle: "short" }}
                  />
                </span>
                <span
                  key="cp-scale-stamp-range-end"
                  className="cp-scale-stamp-range-end"
                >
                  <FormattedDate
                    date={currentTime}
                    options={{ timeStyle: "short" }}
                  />
                </span>
              </div>
            </Dragger>
          )}
          {nrOnlyTimespan === 1 && (
            <Dragger {...dragSettings}>
              <div
                id="dragger"
                style={{ left: getTickWidth() }}
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
                  <FormattedDate
                    date={currentTime}
                    options={{ timeStyle: "short" }}
                  />
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
            label={
              <FormattedMessage id="weathermap:cockpit:flipper:previous" />
            }
          >
            <a
              role="button"
              tabIndex="0"
              href="#"
              onClick={() => setPreviousTime()}
              key="arrow-left"
              className="cp-scale-flipper-left icon-arrow-left "
            >
              <span className="is-visually-hidden">
                {<FormattedMessage id="weathermap:cockpit:flipper:previous" />}
              </span>
            </a>
          </Tooltip>
          <Tooltip
            key="cockpit-flipper-next"
            label={<FormattedMessage id="weathermap:cockpit:flipper:next" />}
          >
            <a
              role="button"
              tabIndex="0"
              href="#"
              onClick={() => setNextTime()}
              key="arrow-right"
              className="cp-scale-flipper-right icon-arrow-right "
            >
              <span className="is-visually-hidden">
                {<FormattedMessage id="weathermap:cockpit:flipper:next" />}
              </span>
            </a>
          </Tooltip>
        </div>

        {getTimeline()}

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
  };

  return getDragger();
};

export default Timeline;
