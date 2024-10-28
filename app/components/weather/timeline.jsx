import React, { useEffect, useState, useRef } from "react";
import { FormattedDate } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";
import { FormattedMessage } from "../../i18n";

const Timeline = ({
  initialDate,
  firstHour = 0,
  timeSpan = 6,
  startTime,
  endTime,
  markerPosition = "center",
  showBar = true, // Toggle the bar visibility
  barDuration = 24, // Bar duration in hours
  barDirection = "past", // New prop: 'past' or 'future'
  updateCB
}) => {
  const containerRef = useRef(null);
  const rulerRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date(initialDate));
  const [currentTranslateX, setCurrentTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startTranslateX, setStartTranslateX] = useState(0);
  const [rulerStartDay, setRulerStartDay] = useState(-10);
  const [rulerEndDay, setRulerEndDay] = useState(10);
  const [maxStartDay, setMaxStartDay] = useState(-30);
  const [maxEndDay, setMaxEndDay] = useState(30);
  const [indicatorPosition, setIndicatorPosition] = useState("50%");
  const [barWidth, setBarWidth] = useState(0);
  const [barOffset, setBarOffset] = useState(0); // New state for bar offset

  const hoursPerDay = 24;
  const pixelsPerHour = 5;
  const daysBuild = 10;

  const now = new Date();
  const startOfDay = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

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
    console.log("Timeline->useEffect #01", {
      initialDate,
      firstHour,
      timeSpan,
      markerPosition
    });
    if (containerRef.current) {
      const initial = new Date(initialDate);
      const initialFullHour = new Date(
        initial.getUTCFullYear(),
        initial.getUTCMonth(),
        initial.getUTCDate(),
        initial.getUTCHours()
      );
      const initialOffsetHours = differenceInHours(initialFullHour, startOfDay);

      let initialTranslateX;
      let newIndicatorPosition;

      switch (markerPosition) {
        case "left":
          initialTranslateX =
            -initialOffsetHours * pixelsPerHour +
            containerRef.current.clientWidth * 0.25;
          newIndicatorPosition = "25%";
          break;
        case "right":
          initialTranslateX =
            -initialOffsetHours * pixelsPerHour +
            containerRef.current.clientWidth * 0.75;
          newIndicatorPosition = "75%";
          break;
        case "center":
        default:
          initialTranslateX =
            -initialOffsetHours * pixelsPerHour +
            containerRef.current.clientWidth * 0.5;
          newIndicatorPosition = "50%";
      }

      updateTimelinePosition(initialTranslateX, true);
      setCurrentDate(initialFullHour);
      setIndicatorPosition(newIndicatorPosition);
    }
  }, [initialDate, firstHour, timeSpan, markerPosition]);

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

  useEffect(() => {
    if (showBar) {
      updateBarDimensions();
    }
  }, [showBar, barDuration, barDirection, containerRef.current]);

  const jumpStep = direction => {
    //console.log("jumpStep #01", { currentDate });
    const newDate = new Date(currentDate);
    newDate.setHours(newDate.getHours() + direction * timeSpan);
    jumpToDate(newDate);
  };

  const createRulerMarkings = () => {
    const markings = [];
    console.log("createRulerMarkings #01", { rulerStartDay, rulerEndDay });

    for (let day = rulerStartDay; day <= rulerEndDay; day++) {
      for (let hour = 0; hour < hoursPerDay; hour++) {
        const markDate = addHours(addDays(startOfDay, day), hour);
        const totalHours = day * hoursPerDay + hour;
        const isSelectable =
          (hour - firstHour) % timeSpan === 0 && hour >= firstHour;
        const markClass =
          hour === 0
            ? "day-mark"
            : isSelectable
              ? "selectable-hour-mark"
              : "hour-mark";

        markings.push(
          <div
            key={`${day}-${hour}`}
            className={`ruler-mark ${markClass}`}
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
            {hour === 0 && (
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
    return markings;
  };

  const updateTimelinePosition = (newTranslateX, snap) => {
    if (snap) {
      const snapToHours = timeSpan * pixelsPerHour;
      newTranslateX = Math.round(newTranslateX / snapToHours) * snapToHours;
    }
    setCurrentTranslateX(newTranslateX);

    const rulerOffset =
      -newTranslateX +
      (containerRef.current.clientWidth * parseFloat(indicatorPosition)) / 100;
    rulerRef.current.style.transform = `translateX(${rulerOffset}px)`;

    const newVisibleMiddledDay = Math.ceil(
      (-rulerOffset +
        (containerRef.current.clientWidth * parseFloat(indicatorPosition)) /
          100) /
        (pixelsPerHour * hoursPerDay)
    );

    setRulerStartDay(Math.max(maxStartDay, newVisibleMiddledDay - daysBuild));
    setRulerEndDay(Math.min(maxEndDay, newVisibleMiddledDay + daysBuild));
  };

  const updateBarDimensions = () => {
    const barWidthPixels = barDuration * pixelsPerHour;
    setBarWidth(barWidthPixels);

    if (barDirection === "past") {
      setBarOffset(-barWidthPixels);
    } else {
      setBarOffset(0);
    }
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

  const snapToNearestMarker = () => {
    const indicatorRect = document
      .getElementById("indicator")
      .getBoundingClientRect();
    const indicatorCenterX = indicatorRect.left + indicatorRect.width / 2;

    const markers = rulerRef.current.querySelectorAll(
      ".selectable-hour-mark, .day-mark"
    );
    let nearestMarker = null;
    let minDistance = Infinity;

    markers.forEach(marker => {
      const markerRect = marker.getBoundingClientRect();
      const markerCenterX = markerRect.left + markerRect.width / 2;
      const distance = Math.abs(markerCenterX - indicatorCenterX);

      if (distance < minDistance) {
        minDistance = distance;
        nearestMarker = marker;
      }
    });

    if (nearestMarker) {
      const markerDate = new Date(nearestMarker.dataset.date);
      snapToDate(markerDate);
    }
  };

  const snapToDate = targetDate => {
    // Adjust targetDate to the nearest valid hour based on firstHour and timeSpan
    const hours = targetDate.getUTCHours();
    const adjustedHours =
      Math.round((hours - firstHour) / timeSpan) * timeSpan + firstHour;
    targetDate.setUTCHours(adjustedHours, 0, 0, 0);

    const targetMarker = document.querySelectorAll(
      `[data-date*="${targetDate.toISOString()}"]`
    );
    const indicatorRect = document
      .getElementById("indicator")
      .getBoundingClientRect();
    const indicatorCenterX = indicatorRect.left + indicatorRect.width / 2;
    const markerRect = targetMarker?.[0]?.getBoundingClientRect();
    const markerCenterX = markerRect.left;
    const distanceToMove = markerCenterX - indicatorCenterX;

    const newTranslateX = currentTranslateX + Math.round(distanceToMove);

    updateTimelinePosition(newTranslateX, true);
    setCurrentDate(targetDate);
    if (updateCB) updateCB(targetDate);
  };

  const jumpToDate = targetDate => {
    // Adjust targetDate to the nearest valid hour based on firstHour and timeSpan
    const hours = targetDate.getUTCHours();
    const adjustedHours =
      Math.round((hours - firstHour) / timeSpan) * timeSpan + firstHour;
    targetDate.setUTCHours(adjustedHours, 0, 0, 0);

    const timeDifferenceInHours = differenceInHours(targetDate, startOfDay);
    const targetTranslateX =
      -(timeDifferenceInHours * pixelsPerHour) +
      containerRef.current.clientWidth / 2;

    const targetDay = Math.floor(timeDifferenceInHours / 24);
    if (targetDay < rulerStartDay) {
      setRulerStartDay(Math.min(rulerStartDay, targetDay - 7));
    }
    if (targetDay > rulerEndDay) {
      setRulerEndDay(Math.max(rulerEndDay, targetDay + 7));
    }
    rulerRef.current.style.transition = "transform 0.5s ease";

    setTimeout(() => {
      snapToDate(targetDate);
    }, 100);
  };

  const getDisplayDate = () => {
    return formatDateTime(currentDate);
  };

  const getSelectedTime = () => {
    return formatTime(currentDate);
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
    return (dateLeft - dateRight) / (1000 * 60 * 60);
  };

  const formatDate = date => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatHour = date => {
    return date.getHours().toString().padStart(2, "0");
  };

  const formatTime = date => {
    return date.toLocaleTimeString();
  };

  const formatDateTime = date => {
    return date.toLocaleString();
  };

  console.log("Timeline->render ##aa1", {
    currentDate,
    initialDate,
    startTime,
    endTime,
    firstHour,
    timeSpan,
    maxStartDay,
    maxEndDay,
    rulerStartDay,
    rulerEndDay
  });

  return (
    <div
      className="cp-scale"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      /*
        style={{
        width: "100%",
        maxWidth: "56rem",
        margin: "0 auto"
      }}
      */
    >
      {/* <div style={{marginBottom: '1rem'}}>
        <input
          type="datetime-local"
          onChange={(e) => jumpToDate(new Date(e.target.value))}
          style={{
            border: '1px solid #ccc',
            borderRadius: '0.25rem',
            padding: '0.25rem 0.5rem'
          }}
          min={startTime || "2022-10-01T00:00"}
          max={endTime || "2025-10-01T00:00"}
        />
        <button
          onClick={() => jumpToDate(new Date())}
          style={{
            marginLeft: '0.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.25rem'
          }}
        >
          Jump to Now
        </button>
      </div> */}

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cp-scale-days-2024"

        // style={{
        //   height: "100%",
        //   userSelect: "none",
        //   overflow: "hidden"
        // }}
      >
        <div
          className="cp-scale-days-outer"
          // style={{ width: "100%", height: "2em", position: "relative" }}
        >
          <div
            ref={rulerRef}
            id="ruler"
            className="cp-scale-days-inner"
            // style={{
            //   height: "100%",
            //   position: "absolute",
            //   left: "0",
            //   top: "0",
            //   transition: "transform 0.3s ease-in-out"
            // }}
          >
            {createRulerMarkings()}
          </div>

          {/* {showBar && (
            <div
              className=""
              style={{
                position: "absolute",
                top: "0",
                height: "50%",
                backgroundColor: "rgba(253, 230, 138, 0.5)",
                zIndex: "5",
                left: `calc(${indicatorPosition} + ${barOffset}px)`,
                width: `${barWidth}px`,
                transform: "translateX(-1px)"
              }}
            ></div>
          )} */}
        </div>

        {/* <div
          id="indicator"
          className="oooo"
          style={{
            position: "absolute",
            top: "0",
            width: "0.125rem",
            height: "100%",
            backgroundColor: "#3b82f6",
            pointerEvents: "none",
            zIndex: "10",
            left: indicatorPosition,
            transform: "translateX(-50%)"
          }}
        >{getSelectedTime()}</div>  */}
      </div>

      <div id="indicator" className="cp-scale-stamp">
        <div
          className="cp-scale-stamp-range 0js-active"
          style={{
            left: indicatorPosition
          }}
        >
          <span className="cp-scale-stamp-range-bar"></span>
          <span className="cp-scale-stamp-range-begin">
            {getSelectedTime()}
          </span>
          <span className="cp-scale-stamp-range-end">{getSelectedTime()}</span>
        </div>

        <div
          className="cp-scale-stamp-point js-active"
          style={{
            left: indicatorPosition
          }}
        >
          <span className="cp-scale-stamp-point-arrow"></span>
          <span className="cp-scale-stamp-point-exact">
            {getSelectedTime()}
          </span>
        </div>
      </div>

      <div className="cp-scale-flipper">
        <a
          className="cp-scale-flipper-left icon-arrow-left"
          href="#"
          onClick={() => jumpStep(-1)}
        ></a>
        {/* {" "}
        {getDisplayDate()} */}
        <a
          className="cp-scale-flipper-right icon-arrow-right"
          href="#"
          onClick={() => jumpStep(1)}
        ></a>
      </div>

      {showBar && (
        <div className="cp-scale-analyse-forecast">
          {barDirection === "past" && (
            <span
              className="cp-scale-analyse-bar"
              style={{
                left: `calc(${indicatorPosition} + ${barOffset}px)`,
                width: `${barWidth}px`,
                transform: "translateX(-1px)"
              }}
            ></span>
          )}
          {barDirection === "future" && (
            <span
              className="cp-scale-forecast-bar"
              style={{
                left: `calc(${indicatorPosition} + ${barOffset}px)`,
                width: `${barWidth}px`,
                transform: "translateX(-1px)"
              }}
            ></span>
          )}
        </div>
      )}
    </div>
  );
};

export default Timeline;
