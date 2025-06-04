import { useStore } from "@nanostores/react";
import React, {
  ChangeEventHandler,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormattedDate, FormattedMessage, useIntl } from "../../i18n";
import * as store from "../../stores/weatherMapStore";
import { dateFormat } from "../../util/date";
import { Tooltip } from "../tooltips/tooltip";

const Timeline = ({ updateCB }) => {
  const params = useParams();
  const navigate = useNavigate();
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

  const containerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [markerRenewed, setMarkerRenewed] = useState(null);
  const [targetDate, setTargetDate] = useState<Date>();
  const [currentDate, setCurrentDate] = useState<Date>();
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

  const now = useMemo(() => new Date(), []);
  const startOfDay = useMemo(
    () =>
      new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      ),
    [now]
  );

  const navigateToWeatermapWithParams = (
    timestamp: string,
    timeSpan: string | null
  ) => {
    // Preserve the domain parameter while updating timestamp
    const newUrl =
      `../weather/map/${store.domainId.get() || "new-snow"}` +
      (timestamp ? `/${timestamp}` : "") +
      (timeSpan ? `/${timeSpan}` : "");
    navigate(newUrl, { replace: true, state: { preventNav: true } });
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => document.removeEventListener("keydown", handleKeyDown, false);
  });

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

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    if (initialDate && +initialDate > 0) {
      const usedInitialDate = new Date(params?.timestamp || initialDate);
      const newInitialDate = new Date(usedInitialDate);
      const now = new Date();
      if (!params?.timestamp && +newInitialDate < +now && +now < +endTime) {
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
        setTargetDate(new Date(usedInitialDate));
        if (!currentDate) {
          setCurrentDate(new Date(usedInitialDate));
        }
      }
    }
  }, [initialDate, params.timestamp]);

  useEffect(() => {
    let intervalId: number;

    if (playerIsActive) {
      // Start the interval when isActive is true
      intervalId = setInterval(() => {
        if (currentDateRef.current >= endTime) setPlayerIsActive(false);
        else jumpStep(1);
      }, playDelay); // Runs every 2 seconds
    }

    // Cleanup function to clear interval when component unmounts
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
  }, [timeSpanInt, targetDate, showBar, maxEndDay]);

  useEffect(() => {
    if (markerRenewed) {
      calcIndicatorOffset();
    }
  }, [markerPosition]);

  useEffect(() => {
    if (markerRenewed && targetDate) snapToDate(targetDate);
  }, [markerRenewed]);

  useEffect(() => {
    setPlayerIsActive(false);
  }, [timeSpanInt, domainId]);

  useEffect(() => {
    if (indicatorOffset) {
      const newOffset = indicatorOffset - currentTranslateX;
      rulerRef.current.style.transform = `translateX(${newOffset}px)`;
    }
  }, [currentTranslateX, indicatorOffset]);

  useEffect(() => {
    if (+currentDate > 0) {
      navigateToWeatermapWithParams(
        new Date(currentDate).toISOString(),
        store.timeSpan.get()
      );
    }
  }, [currentDate]);

  useEffect(() => {
    if (+currentDate > 0) {
      navigateToWeatermapWithParams(
        new Date(currentDate).toISOString(),
        store.timeSpan.get()
      );
    }
  }, [store.timeSpan.get()]);

  useEffect(() => {
    if (+new Date(params.timestamp) > 0) {
      if (updateCB) {
        updateCB("time", params.timestamp);
      }
    }
  }, [params.timestamp]);

  const calcIndicatorOffset = () => {
    const newIndicatorOffset =
      (containerRef.current.clientWidth * parseFloat(markerPosition)) / 100;
    if (showBar) {
      setBarOffset(newIndicatorOffset - barDuration * pixelsPerHour);
    }

    setIndicatorOffset(newIndicatorOffset);
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  };

  const addHours = (date: Date, hours: number) => {
    return new Date(+date + Math.round(hours) * 60 * 60 * 1000);
  };

  const differenceInHours = (dateLeft: Date, dateRight: Date) => {
    const res = (+dateLeft - +dateRight) / (1000 * 60 * 60);

    return res;
  };

  const formatDate = (date: Date) => {
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
            markClass.push("selectable-hours-end");
          }
        }
        if (+markDate === +startTime) markClass.push("selectable-hours-start");

        const marking = (
          <div
            key={`${day}-${hour}`}
            className={`ruler-mark ${markClass.join(" ")}`}
            style={{
              left: `${totalHours * pixelsPerHour}px`
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

  const updateTimelinePosition = (newTranslateX: number, snap: boolean) => {
    let usedTranslateX = newTranslateX;
    if (snap) {
      const snapToHours = selectableHoursOffset * pixelsPerHour;
      usedTranslateX = Math.round(usedTranslateX / snapToHours) * snapToHours;
    }

    setCurrentTranslateX(usedTranslateX);
  };

  const handleDragStart: MouseEventHandler<HTMLDivElement> = e => {
    setIsDragging(true);
    const clientX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
    setStartX(clientX);
    setStartTranslateX(currentTranslateX);
    rulerRef.current.style.transition = "none";
  };

  const handleDragMove: MouseEventHandler<HTMLDivElement> = e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.type === "mousemove" ? e.clientX : e.touches[0].clientX;
    const walk = startX - x;
    const newTranslateX = startTranslateX + walk;
    updateTimelinePosition(newTranslateX, false);
  };

  const handleDragEnd: MouseEventHandler<HTMLDivElement> = () => {
    if (isDragging) {
      setIsDragging(false);
      rulerRef.current.style.transition = "transform 0.3s ease";
      const nearestMarker = getNearestMarker();
      if (nearestMarker) setTargetDate(new Date(nearestMarker?.dataset?.date));
    }
  };

  const snapToDate = (newTargetDate: SetStateAction<Date | undefined>) => {
    // Adjust newTargetDate to the nearest valid hour based on firstHour and timeSpan
    const hours = newTargetDate.getUTCHours();
    const adjustedHours =
      Math.round(hours / selectableHoursOffset) * selectableHoursOffset;
    newTargetDate.setUTCHours(adjustedHours, 0, 0, 0);

    const { targetMarker } = getMarkerCenterX(newTargetDate);

    const distanceToMove = Number(targetMarker?.style.left?.replace("px", ""));

    const newTranslateX = distanceToMove;
    updateTimelinePosition(newTranslateX, true);

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
        minDistance = distance;
        nearestMarker = marker;
      }
    });

    return nearestMarker;
  };

  const getMarkerCenterX = (newTargetDate: { toISOString: () => unknown }) => {
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

  const formatDateToLocalDateTime = (date: Date) => {
    return dateFormat(date, "%Y-%m-%dT%H:%M:%S");
  };

  const handleSelectDateClick: ChangeEventHandler<HTMLInputElement> = e => {
    let newTargetDate = new Date(e.target.value);

    newTargetDate.setUTCHours(newTargetDate.getUTCHours() + timeSpanInt);

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

              width: 0,
              height: 0
            }}
            min={formatDateToLocalDateTime(startTime)}
            max={formatDateToLocalDateTime(endTime)}
          />
        )}
      </div>
      <div className="cp-scale" tabIndex="0">
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
