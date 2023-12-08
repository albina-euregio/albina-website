import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useIntl } from "../../i18n";
import Swipe from "react-easy-swipe";
import { StationData } from "../../stores/stationDataStore";
import { Tooltip } from "../tooltips/tooltip";
import { DATE_TIME_ZONE_FORMAT } from "../../util/date";
import { currentSeasonYear } from "../../util/date-season";
import { FormattedNumberUnit } from "../stationTable/formattedNumberUnit";
import WeatherStationUplot from "./weather-station-uplot";

export type ObserverData = {
  geometry: {
    coordinates: number[];
  };
  name: string;
  id: string;
  plot: string;
};

const timeRanges = {
  day: "tag",
  threedays: "dreitage",
  week: "woche",
  month: "monat",
  winter: "winter"
};

type TimeRange = keyof typeof timeRanges;

const timeRangesMilli: Record<TimeRange, number> = {
  day: 24 * 3600e3,
  threedays: 3 * 24 * 3600e3,
  week: 7 * 24 * 3600e3,
  month: 31 * 24 * 3600e3,
  winter: 183 * 24 * 3600e3
};

export type Props = {
  stationData: StationData[] | ObserverData[];
  stationId: string;
  setStationId: (rowId: string) => void;
};

const YearFlipper: React.FC<{
  selectedYear: number;
  setSelectedYear: (selectedYear: number) => void;
}> = ({ selectedYear, setSelectedYear }) => {
  const intl = useIntl();
  const curYear = currentSeasonYear();
  let nextYear: null | number = null;
  let lastYear: null | number = null;
  if (selectedYear) {
    if (selectedYear > 1960) lastYear = selectedYear - 1;
    if (selectedYear < curYear) nextYear = selectedYear + 1;
  } else {
    selectedYear = curYear;
    lastYear = curYear - 1;
  }
  return (
    <>
      {lastYear && (
        <li className="weatherstation-flipper-back">
          <Tooltip
            label={intl.formatMessage({
              id: "weatherstation-diagrams:back"
            })}
          >
            <a href="#" onClick={() => setSelectedYear(lastYear)}>
              <span className="icon-arrow-left"></span>
              {lastYear}/{lastYear + 1}
            </a>
          </Tooltip>
        </li>
      )}
      <li className="weatherstation-flipper-current">
        {selectedYear}/{selectedYear + 1}
      </li>
      {nextYear && (
        <li className="weatherstation-flipper-forward">
          <Tooltip
            label={intl.formatMessage({
              id: "weatherstation-diagrams:forward"
            })}
          >
            <a
              href="#"
              onClick={() =>
                setSelectedYear(curYear === nextYear ? null : nextYear)
              }
            >
              {nextYear}/{nextYear + 1}&nbsp;
              <span className="icon-arrow-right"></span>
            </a>
          </Tooltip>
        </li>
      )}
      {selectedYear && (
        <li className="weatherstation-flipper-forward">
          <Tooltip
            label={intl.formatMessage({
              id: "weatherstation-diagrams:latest"
            })}
          >
            <a href="#" onClick={() => setSelectedYear(null)}>
              <span>
                {intl.formatMessage({
                  id: "dialog:weather-station-diagram:yearFlipper:latest"
                })}
              </span>
            </a>
          </Tooltip>
        </li>
      )}
    </>
  );
};

const StationFlipper: React.FC<{
  previous: () => void;
  previousStation: StationData | ObserverData;
  next: () => void;
  nextStation: StationData | ObserverData;
  children: React.ReactNode;
}> = ({ previous, previousStation, next, nextStation, children }) => {
  const intl = useIntl();
  return (
    <ul className="list-inline weatherstation-flipper">
      <li></li>
      {children}
      <li className="weatherstation-flipper-station">
        <ul className="list-inline weatherstation-flipper">
          <li className="weatherstation-flipper-back">
            <Tooltip
              label={intl.formatMessage({
                id: "weatherstation-diagrams:priorstation"
              })}
            >
              <a href="#" onClick={previous}>
                <span className="icon-arrow-left"></span>
                {previousStation.name}
              </a>
            </Tooltip>
          </li>
          <li className="weatherstation-flipper-forward">
            <Tooltip
              label={intl.formatMessage({
                id: "weatherstation-diagrams:nextstation"
              })}
            >
              <a href="#" onClick={next}>
                {nextStation.name}&nbsp;
                <span className="icon-arrow-right"></span>
              </a>
            </Tooltip>
          </li>
        </ul>
      </li>
    </ul>
  );
};

const MeasurementValues: React.FC<{ stationData: StationData }> = ({
  stationData
}) => {
  const intl = useIntl();
  return (
    <ul className="list-inline weatherstation-info">
      {stationData.parametersForDialog.map(aInfo => (
        <li key={aInfo.type} className={aInfo.type}>
          <span className="weatherstation-info-caption">
            {intl.formatMessage({
              id: "measurements:table:header:" + aInfo.type
            })}
            :{" "}
          </span>
          <span className="weatherstation-info-value">
            {intl.formatNumber(aInfo.value, {
              minimumFractionDigits: aInfo.digits,
              maximumFractionDigits: aInfo.digits
            })}
            &thinsp;{aInfo.unit}
          </span>
        </li>
      ))}
      <li>
        <small>
          (
          <time dateTime={stationData.date}>
            {intl.formatDate(stationData.date, DATE_TIME_ZONE_FORMAT)}
          </time>
          )
        </small>
      </li>
    </ul>
  );
};

const TimeRangeButtons: React.FC<{
  timeRange: TimeRange;
  setTimeRange: (timeRange: TimeRange) => void;
}> = ({ timeRange, setTimeRange }) => {
  const intl = useIntl();
  return (
    <ul className="list-inline filter primary">
      {Object.keys(timeRanges).map(key => {
        const classes = ["label"];
        if (key == timeRange) classes.push("js-active");
        return (
          <li key={key}>
            <a
              href="#"
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                setTimeRange(key !== "none" ? (key as TimeRange) : "threedays");
              }}
              className={classes.join(" ")}
            >
              {intl.formatMessage({
                id: "dialog:weather-station-diagram:timerange:" + key
              })}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

const StationDiagramImage: React.FC<{
  station: StationData | ObserverData;
  clientWidth: number;
  selectedYear: number;
  timeRange: TimeRange;
}> = ({ station, clientWidth, selectedYear, timeRange }) => {
  const intl = useIntl();
  if (stationData.operator?.startsWith?.("LWD Tirol")) {
    const timeRangeMilli = timeRangesMilli[timeRange];
    const width = document.body.clientWidth * 0.9;
    const height = 240;
    // https://colorbrewer2.org/?type=qualitative&scheme=Set1&n=7#type=qualitative&scheme=Set1&n=7
    return (
      <>
        <WeatherStationUplot
          stationData={stationData}
          parameter="HS"
          parameterLabel={intl.formatMessage({
            id: "measurements:table:header:snow"
          })}
          timeRangeMilli={timeRangeMilli}
          stroke="#984ea3"
          width={width}
          height={height}
        />
        <WeatherStationUplot
          stationData={stationData}
          parameter="LT"
          parameterLabel={intl.formatMessage({
            id: "measurements:table:header:temp"
          })}
          timeRangeMilli={timeRangeMilli}
          stroke="#e41a1c"
          width={width}
          height={height}
        />
        <WeatherStationUplot
          stationData={stationData}
          parameter="WG"
          parameterLabel={intl.formatMessage({
            id: "measurements:table:header:wspd"
          })}
          timeRangeMilli={timeRangeMilli}
          stroke="#4daf4a"
          width={width}
          height={height}
        />
      </>
    );
  }
  const currentTS = new Date();
  currentTS.setMinutes(Math.round(currentTS.getMinutes() / 5) * 5, 0, 0);
  const cacheHash = currentTS.valueOf();
  const isStation = station instanceof StationData;
  const template = isStation
    ? window.config.apis.weather.plots
    : window.config.apis.weather.observers;
  const width = clientWidth >= 1100 ? 1100 : 800;
  const src = window.config.template(template, {
    width,
    interval: timeRanges[timeRange],
    name: station.plot,
    year: selectedYear ? "_" + selectedYear : "",
    t: cacheHash
  });
  return (
    <img
      alt={station.name}
      title={station.name}
      src={src}
      className="weatherstation-img"
    />
  );
};

const StationOperator: React.FC<{
  stationData: StationData;
}> = ({ stationData }) => {
  const intl = useIntl();
  return (
    <p className="weatherstation-provider">
      {intl.formatMessage(
        { id: "dialog:weather-station-diagram:operator:caption" },
        {
          operator: (
            <a
              href={stationData.operatorLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              {stationData.operator}
            </a>
          )
        }
      )}
    </p>
  );
};

const WeatherStationDiagrams: React.FC<Props> = ({
  stationData,
  stationId,
  setStationId
}) => {
  const intl = useIntl();
  const myRef = useRef();
  const [timeRange, setTimeRange] = useState<TimeRange>("threedays");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const stationIndex = useMemo((): number => {
    return stationData.findIndex(e => e.id == stationId);
  }, [stationData, stationId]);

  const nextStation = useMemo((): StationData | ObserverData => {
    let index = stationIndex;
    if (index < stationData.length - 1) {
      index++;
    }
    return stationData[index];
  }, [stationData, stationIndex]);

  const previousStation = useMemo((): StationData | ObserverData => {
    let index = stationIndex;
    if (index > 0) {
      index--;
    }
    return stationData[index];
  }, [stationData, stationIndex]);

  const next = useCallback(
    () => setStationId(nextStation.id),
    [nextStation.id, setStationId]
  );

  const previous = useCallback(
    () => setStationId(previousStation.id),
    [previousStation.id, setStationId]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyFunction, false);
    return () => document.removeEventListener("keydown", keyFunction, false);

    function keyFunction(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        previous();
      } else if (event.key === "ArrowRight") {
        next();
      }
    }
  }, [next, previous]);

  if (!stationData) return <div></div>;
  const station = stationData[stationIndex];
  if (!station) return <div></div>;
  const isStation = station instanceof StationData;
  const [microRegionId] =
    station instanceof StationData ? station.microRegion.split(" ") : "";

  return (
    <Swipe onSwipeLeft={next} onSwipeRight={previous} tolerance={100}>
      <div className="modal-container">
        <div className="modal-weatherstation" ref={myRef}>
          <div className="modal-header">
            {isStation && (
              <p className="caption">
                {intl.formatMessage({
                  id: "dialog:weather-station-diagram:header"
                })}{" "}
                ({microRegionId}{" "}
                {intl.formatMessage({
                  id: "region:" + microRegionId
                })}
                )
              </p>
            )}
            <h2 className="">
              <span className="weatherstation-name">{station.name} </span>
              {isStation && station.elev && (
                <span className="weatherstation-altitude">
                  (<FormattedNumberUnit value={station.elev} unit="m" />)
                </span>
              )}
            </h2>
          </div>
          <StationFlipper
            next={next}
            nextStation={nextStation}
            previous={previous}
            previousStation={previousStation}
          >
            {!isStation && (
              <YearFlipper
                selectedYear={selectedYear}
                setSelectedYear={selectedYear => setSelectedYear(selectedYear)}
              />
            )}
          </StationFlipper>
          <div className="modal-content">
            {isStation && <MeasurementValues stationData={station} />}
            {isStation && (
              <TimeRangeButtons
                timeRange={timeRange}
                setTimeRange={timeRange => setTimeRange(timeRange)}
              />
            )}
            <StationDiagramImage
              clientWidth={myRef?.current?.clientWidth ?? 1}
              selectedYear={selectedYear}
              station={station}
              timeRange={timeRange}
            />
            {isStation && <StationOperator stationData={station} />}
          </div>
        </div>
      </div>
    </Swipe>
  );
};

export default WeatherStationDiagrams;
