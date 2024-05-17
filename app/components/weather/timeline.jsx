import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import { FormattedDate } from "../../i18n";
import { isSameDay } from "../../util/date";
import Dragger from "./dragger.jsx";
import { Tooltip } from "../tooltips/tooltip";
import { FormattedMessage } from "../../i18n";

const offsetHours = 24 * 14;

const Timeline = ({
  timeSpan,
  currentTime, // set time for now
  firstHour, // from when is data available
  forecastTime, // from when is forecast available
  finalTime, // last available time
  setPreviousTime,
  setNextTime,
  changeCurrentTime,
  showTimes,
  onDragStart,
  updateCB
}) => {
  console.log("Timeline ##77", {
    timeSpan,
    finalTime,
    currentTime,
    firstHour,
    forecastTime,
    setPreviousTime,
    changeCurrentTime,
    setNextTime,
    showTimes,
    onDragStart,
    updateCB
  });
  //const [lastRedraw, setLastRedraw] = useState(new Date().getTime());

  const daysContainer = useRef();
  const [nrOnlyTimespan, setNrOnlyTimespan] = useState(null);
  const [draggerCoordinates, setDraggerCoordinates] = useState({ x: 0, y: 0 });
  const [firstTime, setFirstTime] = useState(null);
  const [lastTime, setLastTime] = useState(null);

  useEffect(() => {
    setNrOnlyTimespan(parseInt(timeSpan.replace(/\D/g, ""), 10));
  }, [timeSpan]);

  useEffect(() => {
    const startTime = new Date();
    startTime.setUTCHours(0, 0, 0, 0);
    const lastTime = new Date(finalTime);
    lastTime.setUTCHours(0, 0, 0, 0);
    startTime.setUTCHours(startTime.getUTCHours() - offsetHours);
    lastTime.setUTCHours(startTime.getUTCHours() + nrOnlyTimespan);

    setFirstTime(startTime);
    setLastTime(lastTime);
  }, [firstHour, timeSpan]);

  const getDay = (firstHourOfDay, hours) => {
    //console.log("getDay ##78", {firstHourOfDay, first: hours?.[0]});
    return (
      <div
        className={
          currentTime &&
          isSameDay(new Date(hours?.[hours?.length - 1]), new Date())
            ? "cp-scale-day cp-scale-day-today"
            : "cp-scale-day "
        }
        key={firstHourOfDay.getTime()}
      >
        <span className="cp-scale-day-name">
          <a
            role="button"
            tabIndex="0"
            data-first-hour={firstHourOfDay}
            onClick={() => {
              changeCurrentTime(firstHourOfDay);
            }}
          >
            <FormattedDate
              date={firstHourOfDay}
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
  };

  const getTimeline = () => {
    const lastTime = new Date(finalTime);
    let days = [];
    let hours = [];
    const currentHour = new Date(firstTime);

    console.log("getTimeline ##78", { currentHour });
    let weekday = currentHour.getDay();
    while (currentHour < lastTime) {
      //console.log("getTimeline ##78-1", {weekday, currWeekday: currentHour.getDay()});
      if (weekday != currentHour.getDay()) {
        const firstHourOfDay = new Date(currentHour);
        firstHourOfDay.setUTCHours(0, 0, 0, 0);
        firstHourOfDay.setUTCHours(firstHourOfDay.getUTCHours() - 24);
        days.push(getDay(firstHourOfDay, hours));
        hours = [];
      }
      weekday = currentHour.getDay();
      let isSelectable = true; // todo: fix

      let spanClass = [
        "cp-scale-hour-" + currentHour.getUTCHours(),
        "t" + currentHour
      ];
      if (currentHour < forecastTime) spanClass.push("cp-analyse-item");
      // console.log("getTimeline ##78-1", {currentHour});
      hours.push(
        <span
          key={currentHour}
          className={spanClass.join(" ")}
          data-timestamp={currentHour}
          data-selectable={isSelectable}
          data-time={currentHour}
        ></span>
      );
      currentHour.setUTCHours(currentHour.getUTCHours() + 1);
    }

    let classes = ["cp-scale-days"];
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
    newLeft = getLeftForTime(closestTime) - tickWidth * nrOnlyTimespan;
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
        // onDragEnd: x => { // todo: fix
        //   setClosestTick(x + $("#dragger").width());
        // },
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
                  width: 1 * nrOnlyTimespan // todo: fix
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
                    date={currentTime} // todo: fix
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
                style={{ left: tickWidth }}
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

        {firstTime && lastTime && getTimeline()}

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
