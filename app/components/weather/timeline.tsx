import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormattedDate, FormattedMessage, useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";
import { dateFormat } from "../../util/date";
import * as store from "../../stores/weatherMapStore";
import { useStore } from "@nanostores/react";

// function useChangedProps(props) {
//   const prev = useRef(props);
//
//   useEffect(() => {
//     Object.entries(props).forEach(([key, value]) => {
//       if (prev.current[key] !== value) {
//         // console.log(
//         //   `#j012 Prop '${key}' changed from:`,
//         //   prev.current[key],
//         //   "to:",
//         //   value
//         // );
//       }
//     });
//
//     prev.current = { ...props }; // Important: create a new object to store previous values
//   }, [props]);
// }

const Timeline = ({ updateCB }) => {
  const now = new Date();
  const domainId = useStore(store.domainId);
  const timeSpan0 = useStore(store.timeSpan);
  const timeSpanInt = useStore(store.timeSpanInt);
  const startDate = useStore(store.startDate);
  const startTime = useStore(store.startTime);
  const endTime = useStore(store.endTime);
  const initialDate = useStore(store.initialDate);
  const barDuration = timeSpanInt;
  const markerPosition = timeSpanInt > 24 ? "75%" : "50%";
  const showBar = timeSpanInt > 1;

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

  const scaleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [markerRenewed, setMarkerRenewed] = useState(null);
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
  const [indicatorOffset, setIndicatorOffset] = useState(0);
  const [barOffset, setBarOffset] = useState(0);
  const [playerIsActive, setPlayerIsActive] = useState(false);
  const [pixelsPerHour, setPixelsPerHour] = useState(5);
  const [selectableHoursOffset, setSelectableHoursOffset] =
    useState(timeSpanInt);
  const currentDateRef = useRef(currentDate);

  const hoursPerDay = 24;
  const daysBuild = 10;
  const playDelay = 1000;

  const intl = useIntl();
  const datePickerRef = useRef<HTMLInputElement>(null);

  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  // console.log("Timeline->calc start of day #i011", {
  //   now: now.toISOString(),
  //   startOfDay: startOfDay.toISOString(),
  //   day: now.getUTCDate()
  // });

  useEffect(() => scaleRef.current?.focus?.(), []);

  useEffect(() => {
    const handleWindowResize = () => {
      let newPixelsPerHour = 5;

      if (window.innerWidth < 768) newPixelsPerHour = 4;
      if (window.innerWidth < 450) newPixelsPerHour = 3;

      setPixelsPerHour(newPixelsPerHour);
    };

    // Add event listener
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();
    // Clean up
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    if (initialDate && +initialDate > 0) {
      //console.log("Timeline->useEffect->initialDate #k0113", {initialDate: new Date(initialDate)?.toISOString(), currentDate});

      const newInitialDate = new Date(initialDate);
      const now = new Date();
      // if current time is in the future, set it to the next available time
      if (+newInitialDate < +now && +now < +endTime) {
        while (+newInitialDate < +now) {
          newInitialDate.setUTCHours(
            newInitialDate.getUTCHours() + timeSpanInt
          );
        }
      }
      if (
        !targetDate ||
        newInitialDate?.toISOString() != currentDate?.toISOString()
      ) {
        setTargetDate(new Date(initialDate));
        if (!currentDate) {
          //console.log("Timeline->useEffect->initialDate #2 #k0113", {initialDate: new Date(initialDate)?.toISOString(), currentDate});
          setCurrentDate(new Date(initialDate));
        }
      }
      // console.log("Timeline->useEffect->initialDate #k01", {
      //   initialDate,
      //   targetDate,
      //   currentDate
      // });
    }
  }, [initialDate]);

  useEffect(() => {
    let intervalId: number;

    if (playerIsActive) {
      // Start the interval when isActive is true
      intervalId = setInterval(() => {
        //console.log('Function called at: #i02', {currentDate: currentDate.toISOString(), endTime: endTime.toISOString()});
        if (currentDateRef.current >= endTime) setPlayerIsActive(false);
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
    currentDateRef.current = currentDate;
  }, [currentDate]);

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
    // console.log("Timeline->useEffect->targetDate #k01", {
    //   targetDate,
    //   containerWidth: containerRef?.current?.clientWidth,
    // });
    if (targetDate && containerRef?.current?.clientWidth) {
      setSelectableHoursOffset(timeSpanInt >= 24 ? 24 : timeSpanInt);

      calcIndicatorOffset();

      const timeDifferenceInHours = differenceInHours(targetDate, startOfDay);
      const targetDay = Math.floor(timeDifferenceInHours / 24);
      const rulerPadding = Math.ceil(barDuration / 24) + 2;
      setRulerStartDay(
        Math.max(maxStartDay - rulerPadding, targetDay - daysBuild)
      );
      setRulerEndDay(Math.min(maxEndDay + rulerPadding, targetDay + daysBuild));
    }
  }, [timeSpanInt, targetDate, showBar]);

  useEffect(() => {
    if (markerRenewed) {
      calcIndicatorOffset();
    }
  }, [markerPosition]);

  useEffect(() => {
    // console.log("Timeline->useEffect->markerRenewed #k011", {
    //   markerRenewed,
    //   targetDate
    // });
    if (markerRenewed && targetDate) snapToDate(targetDate);
  }, [markerRenewed]);

  useEffect(() => {
    setPlayerIsActive(false);
  }, [timeSpanInt, domainId]);

  useEffect(() => {
    if (indicatorOffset) {
      const newOffset = indicatorOffset - currentTranslateX;
      rulerRef.current.style.transform = `translateX(${newOffset}px)`;

      // console.log("Timeline->useEffect->currentTranslateX #k0112", {
      //   newOffset,
      //   currentTranslateX,
      //   indicatorOffset,
      // });
    }
  }, [currentTranslateX, indicatorOffset]);

  useEffect(() => {
    if (+currentDate > 0) {
      // console.log("Timeline->useEffect-> #k011", {
      //   currentDate: currentDate.toISOString(),
      //   currentDateTime: currentDate.getTime()
      // });
      if (updateCB) {
        //console.log("Timeline->useEffect->currentDate #k0113", {currentDate: currentDate.toISOString()});
        updateCB(currentDate);
      }
    }
  }, [currentDate]);

  // ###### functions ######

  const calcIndicatorOffset = () => {
    //console.log("calcIndicatorOffset #k01", {showBar});
    const newIndicatorOffset =
      (containerRef.current.clientWidth * parseFloat(markerPosition)) / 100;
    if (showBar) {
      setBarOffset(newIndicatorOffset - barDuration * pixelsPerHour);
    }

    setIndicatorOffset(newIndicatorOffset);
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  };

  const addHours = (date, hours) => {
    return new Date(+date + Math.round(hours) * 60 * 60 * 1000);
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

  const handleKeyDown = (event: KeyboardEvent) => {
    const factor = event.ctrlKey
      ? timeSpanInt > 24
        ? 24
        : 24 / timeSpanInt
      : 1;
    switch (event.key) {
      case "ArrowLeft":
        return jumpStep(-1 * factor);
      case "ArrowRight":
        return jumpStep(1 * factor);
      case "ArrowUp":
        return jumpTimeSpan(1);
      case "ArrowDown":
        return jumpTimeSpan(-1);
      case "n": // next domain
        return jumpDomain(1);
      case "p": // previous domain
        return jumpDomain(-1);
    }
  };

  const jumpStep = (direction: 1 | -1 | number) => {
    const newDate = new Date(currentDateRef.current);
    newDate.setHours(newDate.getHours() + direction * selectableHoursOffset);
    // console.log("jumpStep #i01", {
    //   direction,
    //   selectableHoursOffset,
    //   targetDate: targetDate.toISOString(),
    //   newDate: newDate.toISOString(),
    //   endTime: endTime.toISOString()
    // });
    if (newDate <= endTime && newDate >= startTime) setTargetDate(newDate);
  };

  const jumpTimeSpan = (direction: 1 | -1 | number) => {
    if (!timeSpan0) return;
    const timeSpans = store.domainConfig.get().timeSpans;
    if (timeSpans.length < 2) return;
    let index = timeSpans.indexOf(timeSpan0);
    if (index < 0) return;
    index = (index + direction + timeSpans.length) % timeSpans.length;
    const timeSpan = timeSpans[index];
    store.timeSpan.set(timeSpan);
  };

  const jumpDomain = (direction: 1 | -1 | number) => {
    if (!domainId) return;
    const domains = Object.keys(store.config.domains);
    let index = domains.indexOf(domainId);
    if (index < 0) return;
    index = (index + direction + domains.length) % domains.length;
    store.changeDomain(domains[index]);
  };

  const rulerMarkings = useMemo(() => {
    if (!targetDate) return [];
    const markingsAnalysis = [];
    const markingsForecast = [];
    //console.log("rulerMarkings #k011", {rulerStartDay, rulerEndDay, targetDate: targetDate.toISOString(), endTime, selectableHoursOffset});

    for (let day = rulerStartDay; day <= rulerEndDay; day++) {
      for (let hour = 0; hour < hoursPerDay; hour++) {
        const markDate = addHours(addDays(startOfDay, day), hour);
        const totalHours = day * hoursPerDay + hour;

        const localDate = new Date(markDate);
        const localHour = localDate.getHours();
        const markClass = [localHour === 0 ? "day-mark" : ""];

        const isSelectable = hour % selectableHoursOffset === 0 && hour >= 0;

        if (isSelectable && +markDate >= +startTime && +markDate <= +endTime)
          markClass.push("selectable-hour-mark");
        else markClass.push("hour-mark");
        if (isSelectable) {
          const nextSelectableDate = new Date(markDate);
          nextSelectableDate.setUTCHours(
            nextSelectableDate.getUTCHours() + selectableHoursOffset
          );
          if (+endTime >= +markDate && +nextSelectableDate > +endTime) {
            // console.log("rulerMarkings #k0111", {
            //   markDate: markDate.toISOString(),
            //   nextSelectableDate: nextSelectableDate.toISOString(),
            //   endTime: endTime?.toISOString()
            // });
            markClass.push("selectable-hours-end");
          }
        }
        if (+markDate === +startTime) markClass.push("selectable-hours-start");
        // console.log("rulerMarkingsi0111", {
        //   markDate: markDate.toISOString(),
        //   endTime: endTime.toISOString(),
        //   markClass
        // });

        const marking = (
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
            <div
              className="ruler-mark-bg"
              style={{
                width: `${pixelsPerHour}px`
              }}
            ></div>
          </div>
        );
        if (+markDate < +startDate) markingsAnalysis.push(marking);
        else markingsForecast.push(marking);
      }
    }
    setMarkerRenewed(new Date());
    return (
      <div>
        <span className="cp-scale-analyse">{markingsAnalysis}</span>
        <span className="cp-scale-forecast">{markingsForecast}</span>
      </div>
    );
  }, [rulerStartDay, rulerEndDay, endTime, targetDate, selectableHoursOffset]);

  const updateTimelinePosition = (newTranslateX, snap) => {
    let usedTranslateX = newTranslateX;
    if (snap) {
      const snapToHours = selectableHoursOffset * pixelsPerHour;
      usedTranslateX = Math.round(usedTranslateX / snapToHours) * snapToHours;
    }
    // console.log("updateTimelinePosition #k0112", {
    //   newTranslateX,
    //   snap,
    //   currentTranslateX,
    //   rulerWidth: rulerRef.current.clientWidth
    // });

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
      const nearestMarker = getNearestMarker();
      if (nearestMarker) setTargetDate(new Date(nearestMarker?.dataset?.date));
    }
  };

  const snapToDate = newTargetDate => {
    // Adjust newTargetDate to the nearest valid hour based on firstHour and timeSpan
    const hours = newTargetDate.getUTCHours();
    const adjustedHours =
      Math.round(hours / selectableHoursOffset) * selectableHoursOffset;
    newTargetDate.setUTCHours(adjustedHours, 0, 0, 0);
    //console.log("snapToDate #k011", { newTargetDate });
    const { targetMarker } = getMarkerCenterX(newTargetDate);
    //const distanceToMove = markerCenterX - indicatorCenterX;
    const distanceToMove = Number(targetMarker?.style.left?.replace("px", ""));

    const newTranslateX = distanceToMove;
    updateTimelinePosition(newTranslateX, true);
    //console.log("snapToDate #k0112 #k0113", {selectableHoursOffset, newTargetDate: newTargetDate.toISOString(), initialDate: initialDate.toISOString(), currentDate: currentDate.toISOString()});
    setCurrentDate(newTargetDate);
  };

  const getNearestMarker = () => {
    const markers = rulerRef.current.querySelectorAll(".selectable-hour-mark");
    const indicatorRect = indicatorRef.current.getBoundingClientRect();
    const targetCenterX = indicatorRect.right;

    let nearestMarker = null;
    let minDistance = Infinity;

    markers.forEach(marker => {
      const markerRect = marker.getBoundingClientRect();
      const markerCenterX = markerRect.left + markerRect.width / 2;
      const distance = Math.abs(markerCenterX - targetCenterX);

      if (distance < minDistance) {
        // console.log("getNearestMarker #k0111", {
        //   date: marker?.dataset?.date,
        //   distance,
        //   minDistance
        // });
        minDistance = distance;
        nearestMarker = marker;
      }
    });
    // console.log("getNearestMarker #k011", {
    //   markers,
    //   targetCenterX,
    //   nearestMarkerDate: nearestMarker?.dataset?.date,
    //   minDistance
    // });
    return nearestMarker;
  };

  const getMarkerCenterX = newTargetDate => {
    // console.log("getMarkerCenterX #k011", {
    //   newTargetDate: newTargetDate?.toISOString()
    // });
    const targetMarker = document.querySelectorAll(
      `[data-date*="${newTargetDate.toISOString()}"]`
    );
    const markerRect = targetMarker?.[0]?.getBoundingClientRect();
    const markerCenterX = markerRect?.left;
    return { markerCenterX, targetMarker: targetMarker?.[0] };
  };

  const handleOpenDateDialogClick = () => {
    datePickerRef.current.showPicker();
  };

  const formatDateToLocalDateTime = date => {
    return dateFormat(date, "%Y-%m-%dT%H:%M:%S");
  };

  const handleSelectDateClick = e => {
    let newTargetDate = new Date(e.target.value);
    //console.log("handleSelectDateClick #k011 #1", {newTargetDate: newTargetDate, timeSpan});
    newTargetDate.setUTCHours(newTargetDate.getUTCHours() + timeSpanInt);
    //console.log("handleSelectDateClick #k011 #2", {newTargetDate: newTargetDate});
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

    const linkClassesPlay = ["cp-movie-play", "icon-play"];
    const linkClassesStop = ["cp-movie-stop", "icon-pause"];
    const divClasses = ["cp-movie"];
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

  // console.info("Timeline->render #k0112", {
  //   targetDate: targetDate?.toISOString(),
  //   currentDate: currentDate?.toISOString(),
  //   currentDateRef: currentDateRef.current?.toISOString(),
  //   //startTime: startTime?.toISOString(),
  //   endTime: endTime?.toISOString(),
  //   initialDate: initialDate?.toISOString(),
  //   // currentTranslateX,
  //   //indicatorOffset,
  //   //showBar
  //   // markerPosition
  //   // params: {
  //   //   initialDate,
  //   //   indicatorOffset,
  //   //   firstHour,
  //   //   timeSpan,
  //   //   startTime,
  //   //   endTime,
  //   //   markerPosition,
  //   //   showBar,
  //   //   barDuration,
  //   //   updateCB,
  //   //   domainId
  //   // }
  // });
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
        {currentDate && (
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
        )}
      </div>
      <div
        className="cp-scale"
        tabIndex="0"
        onKeyDown={handleKeyDown}
        ref={scaleRef}
      >
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
          <div className="cp-scale-stamp">
            {timeSpanInt > 1 && (
              <div
                ref={indicatorRef}
                className="cp-scale-stamp-range js-active"
                style={{
                  left: barOffset,
                  width: timeSpanInt * pixelsPerHour
                }}
              >
                <span className="cp-scale-stamp-range-bar"></span>
                <span className="cp-scale-stamp-range-begin">
                  <FormattedDate
                    date={new Date(currentDate)?.setHours(
                      currentDate?.getHours() - timeSpanInt
                    )}
                    options={{ timeStyle: "short" }}
                  />
                </span>
                <span className="cp-scale-stamp-range-end">
                  <FormattedDate
                    date={currentDate}
                    options={{ timeStyle: "short" }}
                  />
                </span>
              </div>
            )}

            {timeSpanInt === 1 && (
              <div
                ref={indicatorRef}
                className="cp-scale-stamp-point js-active"
                style={{
                  left: indicatorOffset
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
