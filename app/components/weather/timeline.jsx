import React, { useEffect, useState, useRef, useMemo } from "react";
import { FormattedDate } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";
import { FormattedMessage, useIntl } from "../../i18n";
import { init } from "@sentry/browser";

function useChangedProps(props) {
  const prev = useRef(props);

  useEffect(() => {
    Object.entries(props).forEach(([key, value]) => {
      if (prev.current[key] !== value) {
        console.log(
          `#j012 Prop '${key}' changed from:`,
          prev.current[key],
          "to:",
          value
        );
      }
    });

    prev.current = { ...props }; // Important: create a new object to store previous values
  }, [props]);
}

const Timeline = ({
  initialDateTs,
  firstHour = 0,
  domainId,
  timeSpan = 6,
  startTimeTs,
  endTimeTs,
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

  useChangedProps({
    initialDateTs,
    firstHour,
    domainId,
    timeSpan,
    startTimeTs,
    endTimeTs,
    markerPosition,
    showBar, // Toggle the bar visibility
    barDuration // Bar duration in hours
  });
  // console.log("Timeline->init #j01", {
  //   initialDateTs,
  //   firstHour,
  //   domainId,
  //   timeSpan,
  //   startTimeTs,
  //   endTimeTs,
  //   markerPosition,
  //   showBar, // Toggle the bar visibility
  //   barDuration, // Bar duration in hours
  //   updateCB
  // });

  const containerRef = useRef(null);
  const rulerRef = useRef(null);
  const indicatorRef = useRef(null);
  const [markerInitialized, setMarkerInitialized] = useState(false);
  const initialDate = useMemo(() => new Date(initialDateTs), [initialDateTs]);
  const startTime = useMemo(() => new Date(startTimeTs), [startTimeTs]);
  const endTime = useMemo(() => new Date(endTimeTs), [endTimeTs]);
  const [targetDate, setTargetDate] = useState();
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
  const [selectableHoursOffset, setSelectableHoursOffset] = useState(timeSpan);

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
    if (initialDate && initialDate?.getTime() > 0) {
      const newInitialDate = new Date(initialDate);
      if (newInitialDate?.toISOString() != currentDate?.toISOString()) {
        setTargetDate(new Date(initialDate));
        if (!currentDate) setCurrentDate(new Date(initialDate));
      }
      console.log("Timeline->useEffect->initialDate #k01", {
        initialDate,
        targetDate,
        currentDate
      });
    }
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
  }, [playerIsActive]);

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
    if (targetDate && containerRef?.current?.clientWidth) {
      console.log("Timeline->useEffect->targetDate #k01", {
        targetDate,
        currentDate,
        currentTranslateX,
        containerWidth: containerRef?.current?.clientWidth
      });
      let newRulerOffset =
        (containerRef.current.clientWidth * parseFloat(markerPosition)) / 100;
      if (showBar) newRulerOffset -= barDuration * pixelsPerHour;
      setSelectableHoursOffset(timeSpan >= 24 ? 24 : timeSpan);
      //updateTimelinePosition(newTranslateX, true);
      setRulerOffset(newRulerOffset);
      snapToNearestMarker(targetDate);
    }
  }, [markerPosition, timeSpan, targetDate, showBar]);

  // useEffect(() => {

  //   if(markerInitialized && targetDate) {

  //     console.log("Timeline->useEffect->snapToNearestMarker #k01", {targetDate});
  //     setTimeout(()=>snapToNearestMarker(targetDate),10);
  //   }
  // }, [markerInitialized, targetDate]);

  useEffect(() => {
    setPlayerIsActive(false);
  }, [timeSpan, domainId]);

  useEffect(() => {
    console.log("Timeline->useEffect->currentTranslateX #k01", {
      currentTranslateX,
      rulerOffset
    });
    if (currentTranslateX && rulerOffset) {
      const newOffset = -currentTranslateX + rulerOffset;
      rulerRef.current.style.transform = `translateX(${newOffset}px)`;
    }
  }, [currentTranslateX, rulerOffset]);

  useEffect(() => {
    if (currentDate) {
      const timeDifferenceInHours = differenceInHours(currentDate, startOfDay);
      const targetDay = Math.floor(timeDifferenceInHours / 24);
      const rulerPadding = Math.ceil(barDuration / 24) + 2;
      setRulerStartDay(
        Math.max(maxStartDay - rulerPadding, targetDay - daysBuild)
      );
      setRulerEndDay(Math.min(maxEndDay + rulerPadding, targetDay + daysBuild));
      if (updateCB) {
        updateCB(currentDate);
      }
    }
  }, [currentDate]);

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  };

  const addHours = (date, hours) => {
    return new Date(date.getTime() + Math.round(hours) * 60 * 60 * 1000);
  };

  // const getDisplayDate = () => {
  //   return currentDate ? formatDateTime(currentDate) : "";
  // };

  // const getSelectedTime = () => {
  //   return currentDate ? formatTime(currentDate) : "";
  // };

  // const getCurrentTime = () => {
  //   const offsetHours = differenceInHours(currentDate, now);
  //   const offsetDays = Math.floor(Math.abs(offsetHours) / 24);
  //   const remainingHours = Math.abs(offsetHours) % 24;
  //   const timeDirection = offsetHours <= 0 ? "Past" : "Future";
  //   return `${timeDirection}: ${offsetDays}d ${Math.floor(remainingHours)}h`;
  // };

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
    const newDate = new Date(currentDate);
    newDate.setHours(newDate.getHours() + direction * selectableHoursOffset);
    //console.log("jumpStep #i01", {direction, selectableHoursOffset, newDate: newDate.toISOString()});
    if (newDate <= endTime && newDate >= startTime) jumpToDate(newDate);
  };

  const rulerMarkings = useMemo(() => {
    const markings = [];
    let usedEndTime = new Date(endTime);
    usedEndTime.setUTCHours(usedEndTime.getUTCHours() + barDuration);

    console.log("rulerMarkings #i011", { rulerStartDay, rulerEndDay });

    for (let day = rulerStartDay; day <= rulerEndDay; day++) {
      for (let hour = 0; hour < hoursPerDay; hour++) {
        const markDate = addHours(addDays(startOfDay, day), hour);
        const totalHours = day * hoursPerDay + hour;

        const isSelectable =
          (hour - firstHour) % selectableHoursOffset === 0 && hour >= firstHour;

        const localDate = new Date(markDate);
        const localHour = localDate.getHours();
        let markClass = [localHour === 0 ? "day-mark" : ""];
        if (isSelectable) markClass.push("selectable-hour-mark");
        else markClass.push("hour-mark");

        if (markDate.getTime() === usedEndTime?.getTime())
          markClass.push("selectable-hours-end");
        if (markDate.getTime() === startTime?.getTime())
          markClass.push("selectable-hours-start");
        // console.log("rulerMarkingsi0111", {
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
    setMarkerInitialized(true);
    return markings;
  }, [rulerStartDay, rulerEndDay, endTime, selectableHoursOffset]);

  const updateTimelinePosition = (newTranslateX, snap) => {
    console.log("updateTimelinePosition #k01", {
      newTranslateX,
      snap,
      currentTranslateX
    });
    let usedTranslateX = newTranslateX;
    if (snap) {
      const snapToHours = selectableHoursOffset * pixelsPerHour;
      usedTranslateX = Math.round(usedTranslateX / snapToHours) * snapToHours;
    }

    setCurrentTranslateX(usedTranslateX);
  };

  const handleDragStart = e => {
    setIsDragging(true);
    const clientX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
    setStartX(clientX);
    setStartTranslateX(currentTranslateX);
    rulerRef.current.style.transition = "none";
  };

  const handleDragMove = e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.type === "mousemove" ? e.clientX : e.touches[0].clientX;
    const walk = startX - x;
    const newTranslateX = startTranslateX + walk;
    updateTimelinePosition(newTranslateX, false);
  };

  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      rulerRef.current.style.transition = "transform 0.3s ease";
      snapToNearestMarker();
    }
  };

  const snapToDate = newTargetDate => {
    // Adjust newTargetDate to the nearest valid hour based on firstHour and timeSpan
    const hours = newTargetDate.getUTCHours();
    const adjustedHours =
      Math.round((hours - firstHour) / selectableHoursOffset) *
        selectableHoursOffset +
      firstHour;
    newTargetDate.setUTCHours(adjustedHours, 0, 0, 0);

    const indicatorRect = indicatorRef.current.getBoundingClientRect();
    const indicatorCenterX = indicatorRect.left + indicatorRect.width / 2;
    const { markerCenterX } = getMarkerCenterX(newTargetDate);
    const distanceToMove = markerCenterX - indicatorCenterX;

    const newTranslateX = currentTranslateX + Math.round(distanceToMove);
    updateTimelinePosition(newTranslateX, true);

    setCurrentDate(newTargetDate);
  };

  const snapToNearestMarker = markerDate => {
    console.log("snapToNearestMarker #k01", { markerDate });
    //if(!indicatorRef.current) return;
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

  const getMarkerCenterX = newTargetDate => {
    const targetMarker = document.querySelectorAll(
      `[data-date*="${newTargetDate.toISOString()}"]`
    );
    const markerRect = targetMarker?.[0]?.getBoundingClientRect();
    const markerCenterX = markerRect?.left;
    return { markerCenterX, targetMarker: targetMarker?.[0] };
  };

  const jumpToDate = newTargetDate => {
    // Adjust newTargetDate to the nearest valid hour based on firstHour and timeSpan
    const hours = newTargetDate.getUTCHours();
    const adjustedHours =
      Math.round((hours - firstHour) / selectableHoursOffset) *
        selectableHoursOffset +
      firstHour;
    newTargetDate.setUTCHours(adjustedHours, 0, 0, 0);

    rulerRef.current.style.transition = "transform 0.5s ease";
    // console.log("jumpToDate #i031", {
    //   newTargetDate: new Date(newTargetDate).toISOString(),
    //   maxStartDay,
    //   maxEndDay
    // });

    snapToDate(newTargetDate);
  };

  const handleOpenDateDialogClick = () => {
    datePickerRef.current.showPicker();
  };

  const formatDateToLocalDateTime = date => {
    return date.toISOString().slice(0, 16);
  };

  const handleSelectDateClick = e => {
    let newTargetDate = new Date(e.target.value);
    newTargetDate = new Date(
      Date.UTC(
        newTargetDate.getUTCFullYear(),
        newTargetDate.getUTCMonth(),
        newTargetDate.getUTCDate(),
        newTargetDate.getUTCHours(),
        0,
        0
      )
    );

    setTargetDate(newTargetDate);
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

  console.log("Timeline->render #k01", {
    targetDate: targetDate?.toISOString(),
    currentDate: currentDate?.toISOString(),
    startTime: startTime?.toISOString(),
    initialDate: initialDate?.toISOString(),
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
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onTouchCancel={handleDragEnd}
          className="cp-scale-days-2024"
        >
          <div className="cp-scale-days-outer">
            <div ref={rulerRef} id="ruler" className="cp-scale-days-inner">
              {rulerMarkings}
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
