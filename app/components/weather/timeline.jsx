import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import { FormattedDate } from "../../i18n";
import { isSameDay } from "../../util/date.js";

const Timeline = ({
  timeSpan,
  currentTime,
  timeArray,
  startDate,
  changeCurrentTime,
  updateCB
}) => {
  const [lastRedraw, setLastRedraw] = useState(new Date().getTime());

  const daysContainer = useRef();

  useEffect(() => {
    console.log("Timeline->useEffect", {
      timeSpan,
      currentTime: new Date(currentTime),
      timeArray,
      startDate: new Date(startDate),
      changeCurrentTime
    });
    const thickWidth = tickWidth();
    if (currentTime && thickWidth > 0)
      updateCB({
        tickWidth: thickWidth,
        getClosestTick: getClosestTick,
        getLeftForTime: getLeftForTime
      });
  }, [currentTime]);

  const tickWidth = () => {
    const posFirstTick = $(".cp-scale-hour-1").first().offset();
    const posSecondTick = $(".cp-scale-hour-2").first().offset();
    if (posFirstTick === undefined || posSecondTick === undefined) return 0;
    return posSecondTick.left - posFirstTick.left;
  };

  const getLeftForTime = time => {
    const theTick = $(".t" + time);
    if (theTick.offset() === undefined) return null;
    let left = Math.abs(
      theTick.offset()["left"] - $(daysContainer.current).offset()["left"]
    );
    console.log("leftPosForCurrentTime hhhh1", {
      currentTimeUtc: new Date(currentTime).toUTCString(),
      tickWidth: tickWidth(),
      left
    });
    return left;
  };

  const getClosestTick = left => {
    console.log("getClosestTick cccc", ui);

    let closestDist = 9999;
    let closestTime;
    //let nrOnlyTimespan = props.timeSpan.replace(/\D/g, "");

    const arrowLeft = left; // + $(".cp-scale-stamp-point-arrow").outerWidth() / 2;
    $("#whereami").css({ left: left });

    timeArray.forEach(eTime => {
      //console.log("setClosestTick eTime", eTime);
      const curItemLeft = getLeftForTime(eTime);
      console.log("getClosestTick hhhh ITEM", {
        eTime,
        arrowLeft,
        curItemLeft,
        eTimeUtc: new Date(eTime).toUTCString(),
        diff: Math.floor(Math.abs(arrowLeft - curItemLeft))
      });
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

    if (closestTime) return closestTime;
    return null;
  };

  const getTimeline = () => {
    let lastTime;
    let days = [];
    let nrOnlyTimespan = parseInt(timeSpan.replace(/\D/g, ""), 10);

    // console.log(
    //   "getTimeline fff",
    //   timeArray.indexOf(startDate),
    //   startDate,
    //   self.props.agl
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

    return days;
  };

  let classes = ["cp-scale-days", "redraw-" + lastRedraw];
  return (
    <div ref={daysContainer} key="days" className={classes.join(" ")}>
      {getTimeline()}
    </div>
  );
};

export default Timeline;
