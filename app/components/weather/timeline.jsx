import React, { useEffect, useState, useRef } from "react";
import { FormattedDate } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";
import { FormattedMessage, useIntl } from "../../i18n";

const Timeline = ({
  initialDate,
  firstHour = 0,
  domainId,
  timeSpan = 6,
  startTime,
  endTime,
  markerPosition = "50%",
  showBar = true, // Toggle the bar visibility
  barDuration = 24, // Bar duration in hours
  updateCB
}) => {
  const now = new Date();
  const nowFullHour = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      0,
      0
    )
  );
  //console.log("Timeline->init #j01");
  const containerRef = useRef(null);
  const rulerRef = useRef(null);
  const indicatorRef = useRef(null);
  let markerInitialized = false;
  const [currentDate, setCurrentDate] = useState();
  const [currentTranslateX, setCurrentTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startTranslateX, setStartTranslateX] = useState(0);
  const [rulerStartDay, setRulerStartDay] = useState(-10);
  const [rulerEndDay, setRulerEndDay] = useState(10);
  const [maxStartDay, setMaxStartDay] = useState(-30);
  const [maxEndDay, setMaxEndDay] = useState(30);
  const [rulerOffset, setRulerOffset] = useState(0);
  const [playerIsActive, setPlayerIsActive] = useState(false);
  const [pixelsPerHour, setPixelsPerHour] = useState(5);

  const hoursPerDay = 24;
  const daysBuild = 10;
  const playDelay = 1000;

  const intl = useIntl();
  const datePickerRef = useRef(null);

  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  // console.log("Timeline->calc start of day #i011", {
  //   now: now.toISOString(),
  //   startOfDay: startOfDay.toISOString(),
  //   day: now.getUTCDate()
  // });
  useEffect(() => {
    const handleWindowResize = () => {
      let newPixelsPerHour = 5;

      if (window.innerWidth < 768) newPixelsPerHour = 3;
      if (window.innerWidth < 450) newPixelsPerHour = 2;

      setPixelsPerHour(newPixelsPerHour);
    };

    // Add event listener
    window.addEventListener("resize", handleWindowResize);

    // Clean up
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    setCurrentDate(initialDate);
  }, [initialDate]);

  useEffect(() => {
    let intervalId;

    if (playerIsActive) {
      // Start the interval when isActive is true
      intervalId = setInterval(() => {
        //console.log('Function called at: #i02', {currentDate: currentDate.toISOString(), endTime: endTime.toISOString()});
        if (currentDate >= endTime) setPlayerIsActive(false);
        else jumpStep(1);
      }, playDelay); // Runs every 2 seconds
    }

    // Cleanup function to clear interval when component unmounts
    // or when isActive changes to false
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [playerIsActive, currentDate]);

  useEffect(() => {
    setMaxStartDay(
      startTime
        ? Math.floor(differenceInHours(startTime, now) / hoursPerDay)
        : -30
    );
    setMaxEndDay(
      endTime ? Math.floor(differenceInHours(endTime, now) / hoursPerDay) : 30
    );
  }, [startTime, endTime, now]);

  useEffect(() => {
    if (containerRef?.current?.clientWidth) {
      const initialOffsetHours = differenceInHours(startOfDay, initialDate);

      let newRulerOffset =
        (containerRef.current.clientWidth * parseFloat(markerPosition)) / 100;
      if (showBar) newRulerOffset -= (barDuration / 2) * pixelsPerHour;
      const newTranslateX = -initialOffsetHours * pixelsPerHour;

      setRulerOffset(newRulerOffset);
      updateTimelinePosition(newTranslateX, true);

      // console.log("Timeline->useEffect #i01", {
      //   initialDate: new Date(initialDate).toISOString(),
      //   startOfDay: new Date(startOfDay).toISOString(),
      //   firstHour,
      //   timeSpan,
      //   markerPosition,
      //   initialOffsetHours,
      //   initialTranslateX
      // });
    }
  }, [firstHour, timeSpan, markerPosition, initialDate, showBar, barDuration]);

  useEffect(() => {
    setPlayerIsActive(false);
  }, [timeSpan, domainId]);

  const handleKeyDown = event => {
    const factor = timeSpan > 24 ? 24 : 24 / timeSpan;
    //console.log('handleKeyDown', {key: event.ctrlKey, timeSpan, factor});
    switch (event.keyCode) {
      case 37:
        if (event.ctrlKey) jumpStep(-1 * factor);
        else jumpStep(-1);
        break;
      case 39:
        if (event.ctrlKey) {
          jumpStep(1 * factor);
        } else jumpStep(1);
        break;
      case 32:
        //player.toggle();
        break;
      default:
        break;
    }
  };

  const jumpStep = direction => {
    console.log("jumpStep #i031", { currentDate, direction });
    const newDate = new Date(currentDate);
    newDate.setHours(newDate.getHours() + direction * timeSpan);
    if (newDate <= endTime && newDate >= startTime) jumpToDate(newDate);
  };

  const createRulerMarkings = () => {
    const markings = [];
    console.log("createRulerMarkings #i031", {
      rulerStartDay,
      rulerEndDay,
      startOfDay
    });

    for (let day = rulerStartDay; day <= rulerEndDay; day++) {
      for (let hour = 0; hour < hoursPerDay; hour++) {
        const markDate = addHours(addDays(startOfDay, day), hour);
        const totalHours = day * hoursPerDay + hour;
        const isSelectable =
          (hour - firstHour) % timeSpan === 0 && hour >= firstHour;

        const localDate = new Date(markDate);
        const localHour = localDate.getHours();
        let markClass = [
          localHour === 0
            ? "day-mark"
            : isSelectable
              ? "selectable-hour-mark"
              : "hour-mark"
        ];
        if (markDate.getTime() === endTime?.getTime())
          markClass.push("selectable-hours-end");
        if (markDate.getTime() === startTime?.getTime())
          markClass.push("selectable-hours-start");
        // console.log("createRulerMarkings #i0111", {
        //   markDate: markDate.toISOString(),
        //   endTime: endTime.toISOString(),
        //   markClass
        // });

        markings.push(
          <div
            key={`${day}-${hour}`}
            className={`ruler-mark ${markClass.join(" ")}`}
            style={{
              left: `${totalHours * pixelsPerHour}px`
              // position: "absolute",
              // height: hour === 0 ? "100%" : isSelectable ? "75%" : "50%",
              // width: hour === 0 ? "2px" : "1px",
              // backgroundColor:
              //   hour === 0 ? "#333" : isSelectable ? "#666" : "#888"
            }}
            data-date={markDate.toISOString()}
            data-hours={totalHours}
          >
            {localHour === 0 && (
              <span
                className="day-name"
                style={{
                  left: `${12 * pixelsPerHour}px`
                }}
              >
                {formatDate(markDate)}
              </span>
            )}
            {/* {isSelectable && (
              <span className="hour-name">
                {formatHour(markDate)}
              </span>
            )} */}
          </div>
        );
      }
    }
    markerInitialized = true;
    return markings;
  };

  const updateTimelinePosition = (newTranslateX, snap) => {
    // console.log("updateTimelinePosition #i011", {
    //   newTranslateX,
    //   snap,
    //   currentTranslateX
    // });
    let usedTranslateX = newTranslateX;
    if (snap) {
      const snapToHours = timeSpan * pixelsPerHour;
      usedTranslateX = Math.round(usedTranslateX / snapToHours) * snapToHours;
    }

    const newOffset = -usedTranslateX + rulerOffset;
    rulerRef.current.style.transform = `translateX(${newOffset}px)`;
    setCurrentTranslateX(usedTranslateX);

    // const newVisibleMiddledDay = Math.ceil(
    //   (-rulerOffset +
    //     (containerRef.current.clientWidth * parseFloat(indicatorPosition)) /
    //       100) /
    //     (pixelsPerHour * hoursPerDay)
    // );

    //setRulerStartDay(Math.max(maxStartDay, newVisibleMiddledDay - daysBuild));
    //setRulerEndDay(Math.min(maxEndDay, newVisibleMiddledDay + daysBuild));
  };

  const handleMouseDown = e => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartTranslateX(currentTranslateX);
    rulerRef.current.style.transition = "none";
  };

  const handleMouseMove = e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.clientX;
    const walk = startX - x;
    const newTranslateX = startTranslateX + walk;
    updateTimelinePosition(newTranslateX, false);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      rulerRef.current.style.transition = "transform 0.3s ease";
      snapToNearestMarker();
    }
  };

  const snapToNearestMarker = markerDate => {
    //if(!indicatorRef.current) return;
    console.log("snapToNearestMarker #i031");
    let searchedMaker;
    const indicatorRect = indicatorRef.current.getBoundingClientRect();
    let targetCenterX = indicatorRect.left + indicatorRect.width / 2;
    if (markerDate) {
      const { markerCenterX, targetMarker } = getMarkerCenterX(markerDate);
      searchedMaker = targetMarker;
      targetCenterX = markerCenterX;
    }

    const markers = rulerRef.current.querySelectorAll(
      ".selectable-hour-mark, .day-mark"
    );
    let nearestMarker = null;
    let minDistance = Infinity;

    markers.forEach(marker => {
      const markerRect = marker.getBoundingClientRect();
      const markerCenterX = markerRect.left + markerRect.width / 2;
      const distance = Math.abs(markerCenterX - targetCenterX);

      if (distance < minDistance) {
        minDistance = distance;
        nearestMarker = marker;
      }
    });

    if (nearestMarker) {
      let markerDate = new Date(nearestMarker.dataset.date);
      //console.log("snapToNearestMarker #i0111", { markerDate, searchedMaker });
      if (markerDate > endTime) markerDate = endTime;
      if (markerDate < startTime) markerDate = startTime;
      snapToDate(markerDate);
    }
  };

  const getMarkerCenterX = targetDate => {
    const targetMarker = document.querySelectorAll(
      `[data-date*="${targetDate.toISOString()}"]`
    );
    const markerRect = targetMarker?.[0]?.getBoundingClientRect();
    const markerCenterX = markerRect.left;
    return { markerCenterX, targetMarker: targetMarker?.[0] };
  };

  const setRulerDimensions = targetDate => {
    // console.log("setRulerDimensions #i011", {
    //   targetDate: targetDate.toISOString(),
    //   startOfDay: startOfDay.toISOString(),
    //   maxStartDay,
    //   maxEndDay,
    //   rulerStartDay,
    //   rulerEndDay
    // });
    const timeDifferenceInHours = differenceInHours(targetDate, startOfDay);
    const targetDay = Math.floor(timeDifferenceInHours / 24);
    setRulerStartDay(Math.max(maxStartDay - 3, targetDay - daysBuild));
    setRulerEndDay(Math.min(maxEndDay + 3, targetDay + daysBuild));
  };

  const snapToDate = targetDate => {
    // Adjust targetDate to the nearest valid hour based on firstHour and timeSpan
    const hours = targetDate.getUTCHours();
    const adjustedHours =
      Math.round((hours - firstHour) / timeSpan) * timeSpan + firstHour;
    targetDate.setUTCHours(adjustedHours, 0, 0, 0);

    const indicatorRect = indicatorRef.current.getBoundingClientRect();
    const indicatorCenterX = indicatorRect.left + indicatorRect.width / 2;
    const { markerCenterX } = getMarkerCenterX(targetDate);
    const distanceToMove = markerCenterX - indicatorCenterX;

    console.log("snapToDate #i031", {
      targetDate: new Date(targetDate).toISOString(),
      distanceToMove: Math.round(distanceToMove),
      currentTranslateX
    });

    const newTranslateX = currentTranslateX + Math.round(distanceToMove);
    console.log("snapToDate #i031", { currentDate });
    updateTimelinePosition(newTranslateX, true);
    setCurrentDate(targetDate);

    setRulerDimensions(targetDate);

    if (updateCB) {
      updateCB(targetDate);
    }
  };

  const jumpToDate = targetDate => {
    // Adjust targetDate to the nearest valid hour based on firstHour and timeSpan
    const hours = targetDate.getUTCHours();
    const adjustedHours =
      Math.round((hours - firstHour) / timeSpan) * timeSpan + firstHour;
    targetDate.setUTCHours(adjustedHours, 0, 0, 0);

    rulerRef.current.style.transition = "transform 0.5s ease";
    // console.log("jumpToDate #i031", {
    //   targetDate: new Date(targetDate).toISOString(),
    //   maxStartDay,
    //   maxEndDay
    // });

    snapToDate(targetDate);
  };

  const getDisplayDate = () => {
    return currentDate ? formatDateTime(currentDate) : "";
  };

  const getSelectedTime = () => {
    return currentDate ? formatTime(currentDate) : "";
  };

  const getCurrentTime = () => {
    const offsetHours = differenceInHours(currentDate, now);
    const offsetDays = Math.floor(Math.abs(offsetHours) / 24);
    const remainingHours = Math.abs(offsetHours) % 24;
    const timeDirection = offsetHours <= 0 ? "Past" : "Future";
    return `${timeDirection}: ${offsetDays}d ${Math.floor(remainingHours)}h`;
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  };

  const addHours = (date, hours) => {
    return new Date(date.getTime() + Math.round(hours) * 60 * 60 * 1000);
  };

  const differenceInHours = (dateLeft, dateRight) => {
    const res = (dateLeft - dateRight) / (1000 * 60 * 60);
    //console.log("differenceInHours #i01", { res, dateLeft: new Date(dateLeft).toISOString(), dateRight: new Date(dateRight).toISOString() });
    return res;
  };

  const formatDate = date => {
    if (pixelsPerHour < 3)
      return intl.formatDate(date, {
        day: "numeric",
        month: "numeric"
      });
    else
      return intl.formatDate(date, {
        weekday: "short",
        day: "numeric",
        month: "numeric"
      });
  };

  const formatHour = date => {
    return date.getHours().toString().padStart(2, "0");
  };

  const formatTime = date => {
    //console.log("formatTime #i01", { date: new Date(date).toISOString() });
    return date.toLocaleTimeString();
  };

  const formatDateTime = date => {
    return date.toLocaleString();
  };

  const handleOpenDateDialogClick = () => {
    datePickerRef.current.showPicker();
  };

  const formatDateToLocalDateTime = date => {
    return date.toISOString().slice(0, 16);
  };

  const handleSelectDateClick = e => {
    console.log("handleSelectDateClick #j01", e.target.value);
    let targetDate = new Date(e.target.value);
    targetDate = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        targetDate.getUTCHours(),
        0,
        0
      )
    );

    setRulerDimensions(targetDate);
    setCurrentDate(targetDate);
    setTimeout(() => {
      snapToNearestMarker(targetDate);
    }, 500);
  };

  const getPlayerButtons = () => {
    //console.log("getPlayerButtons", player.playing);
    // const label =
    //   "weathermap:player:" + (player.playing ? "stop" : "play");

    let linkClassesPlay = ["cp-movie-play", "icon-play"];
    let linkClassesStop = ["cp-movie-stop", "icon-pause"];
    let divClasses = ["cp-movie"];
    if (playerIsActive) divClasses.push("js-playing");
    return (
      <div key="cp-movie" className={divClasses.join(" ")}>
        <Tooltip
          key="cp-movie-play"
          label={<FormattedMessage id="weathermap:cockpit:play" />}
          placement="left"
        >
          <a
            key="playerButton"
            className={linkClassesPlay.join(" ")}
            href="#"
            onClick={() => {
              jumpStep(1);
              setPlayerIsActive(!playerIsActive);
            }}
          >
            <span className="is-visually-hidden">
              {<FormattedMessage id="weathermap:cockpit:play" />}
            </span>
          </a>
        </Tooltip>
        <Tooltip
          key="cp-movie-stop"
          label={<FormattedMessage id="weathermap:cockpit:stop" />}
        >
          <a
            key="stopButton"
            className={linkClassesStop.join(" ")}
            href="#"
            onClick={() => {
              setPlayerIsActive(!playerIsActive);
            }}
          >
            <span className="is-visually-hidden">
              {<FormattedMessage id="weathermap:cockpit:stop" />}
            </span>
          </a>
        </Tooltip>
      </div>
    );
  };

  console.log("Timeline->render #j01", {
    currentDate,
    startTime,
    initialDate,
    currentTranslateX,
    rulerOffset,
    markerPosition
    // params: {
    //   initialDate,
    //   rulerOffset,
    //   firstHour,
    //   timeSpan,
    //   startTime,
    //   endTime,
    //   markerPosition,
    //   showBar,
    //   barDuration,
    //   updateCB,
    //   domainId
    // }
  });
  if (!currentDate) return <div></div>;
  return (
    <>
      <div className="cp-calendar">
        <Tooltip
          key="cp-select-date"
          label={<FormattedMessage id="weathermap:cockpit:select-date" />}
          placement="right"
        >
          <a
            onClick={() => handleOpenDateDialogClick()}
            className="cp-calendar-select icon-calendar-big tooltip"
            title="Select Date"
          ></a>
        </Tooltip>
        <input
          type="datetime-local"
          ref={datePickerRef}
          onChange={handleSelectDateClick}
          defaultValue={formatDateToLocalDateTime(currentDate)}
          style={{
            position: "absolute",
            opacity: 0,
            //zIndex: 1000,
            width: 0,
            height: 0
          }}
          min={formatDateToLocalDateTime(startTime)}
          max={formatDateToLocalDateTime(endTime)}
        />
      </div>
      <div className="cp-scale" tabIndex="0" onKeyDown={handleKeyDown}>
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cp-scale-days-2024"
        >
          <div className="cp-scale-days-outer">
            <div ref={rulerRef} id="ruler" className="cp-scale-days-inner">
              {createRulerMarkings()}
            </div>
          </div>
        </div>

        {
          <div ref={indicatorRef} className="cp-scale-stamp">
            {timeSpan > 1 && (
              <div
                className="cp-scale-stamp-range js-active"
                style={{
                  left: rulerOffset,
                  width: timeSpan * pixelsPerHour
                }}
              >
                <span className="cp-scale-stamp-range-bar"></span>
                <span className="cp-scale-stamp-range-begin">
                  <FormattedDate
                    date={currentDate}
                    options={{ timeStyle: "short" }}
                  />
                </span>
                <span className="cp-scale-stamp-range-end">
                  <FormattedDate
                    date={new Date(currentDate)?.setHours(
                      currentDate?.getHours() + timeSpan
                    )}
                    options={{ timeStyle: "short" }}
                  />
                </span>
              </div>
            )}

            {timeSpan === 1 && (
              <div
                className="cp-scale-stamp-point js-active"
                style={{
                  left: rulerOffset
                }}
              >
                <span className="cp-scale-stamp-point-arrow"></span>
                <span className="cp-scale-stamp-point-exact">
                  <FormattedDate
                    date={currentDate}
                    options={{ timeStyle: "short" }}
                  />
                </span>
              </div>
            )}
          </div>
        }

        {
          <div className="cp-scale-flipper">
            <Tooltip
              key="cockpit-flipper-prev"
              label={
                <FormattedMessage id="weathermap:cockpit:flipper:previous" />
              }
            >
              <a
                className="cp-scale-flipper-left icon-arrow-left"
                href="#"
                onClick={() => jumpStep(-1)}
              ></a>
            </Tooltip>
            <Tooltip
              key="cockpit-flipper-next"
              label={<FormattedMessage id="weathermap:cockpit:flipper:next" />}
            >
              <a
                className="cp-scale-flipper-right icon-arrow-right"
                href="#"
                onClick={() => jumpStep(1)}
              ></a>
            </Tooltip>
          </div>
        }
      </div>
      {getPlayerButtons()}
    </>
  );
};

export default Timeline;
