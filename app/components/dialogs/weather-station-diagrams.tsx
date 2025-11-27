import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useIntl } from "../../i18n";
import { StationData } from "../../stores/stationDataStore";
import { Tooltip } from "../tooltips/tooltip";
import { DATE_TIME_ZONE_FORMAT } from "../../util/date";
import { currentSeasonYear } from "../../util/date-season";
import { Temporal } from "temporal-polyfill";
import "@albina-euregio/linea/src/linea-plot";
import { useSwipeable } from "react-swipeable";

const ENABLE_UPLOT = true;

function hasInteractivePlot(station: StationData | ObserverData) {
  return (
    ENABLE_UPLOT &&
    station instanceof StationData &&
    /LWD Tirol|HD Tirol|Südtirol - Alto Adige|Trentino|LWD Kärnten|Tiroler Wasserkraft|Verbund|GeoSphere Austria/.test(
      station.operator
    )
  );
}

export interface ObserverData {
  geometry: {
    coordinates: number[];
  };
  name: string;
  id: string;
  plot: string;
}

const timeRanges = {
  interactive: "interactive",
  interactive_month: "interactive_month",
  interactive_winter: "interactive_winter",
  day: "tag",
  threedays: "dreitage",
  week: "woche",
  month: "monat",
  winter: "winter"
};

type TimeRange = keyof typeof timeRanges;

const timeRangesMilli: Record<TimeRange, number> = {
  interactive: 7 * 24 * 3600e3,
  interactive_month: 31 * 24 * 3600e3,
  interactive_winter: 183 * 24 * 3600e3,
  day: 24 * 3600e3,
  threedays: 3 * 24 * 3600e3,
  week: 7 * 24 * 3600e3,
  month: 31 * 24 * 3600e3,
  winter: 183 * 24 * 3600e3
};

export interface Props {
  stationData: StationData[] | ObserverData[];
  stationId: string;
  setStationId: (rowId: string) => void;
}

const YearFlipper: React.FC<{
  selectedYear: number | null;
  setSelectedYear: (selectedYear: number | null) => void;
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
              id: `measurements:table:header:${aInfo.type}`
            })}
            :{" "}
          </span>
          <span className="weatherstation-info-value">
            {intl.formatNumberUnit(aInfo.value, aInfo.unit, aInfo.digits)}
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
  station: StationData | ObserverData;
  timeRange: TimeRange;
  setTimeRange: (timeRange: TimeRange) => void;
}> = ({ station, timeRange, setTimeRange }) => {
  const intl = useIntl();
  return (
    <ul className="list-inline filter primary">
      {(Object.keys(timeRanges) as TimeRange[]).map(key => {
        if (key.startsWith("interactive") && !hasInteractivePlot(station))
          // eslint-disable-next-line react/jsx-key
          return;
        return (
          <li key={key}>
            <a
              href="#"
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                setTimeRange(key !== "none" ? (key as TimeRange) : "threedays");
              }}
              className={key === timeRange ? "label js-active" : "label"}
            >
              {intl.formatMessage({
                id: `dialog:weather-station-diagram:timerange:${key}`
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
  selectedYear: number | null;
  timeRange: TimeRange;
}> = ({ station, clientWidth, selectedYear, timeRange }) => {
  if (
    timeRange.startsWith("interactive") &&
    hasInteractivePlot(station) &&
    station instanceof StationData
  ) {
    const timeRangeMilli =
      timeRangesMilli[timeRange] ?? timeRangesMilli["week"];
    const timeRangePath = timeRangeMilli > 7 * 24 * 3600e3 ? "winter" : "woche";
    const id = station.properties?.["LWD-Nummer"] || station.id;
    const url = window.config.template(station.properties.$smet, {
      timeRangePath,
      id
    });
    return (
      <div className="uplots">
        <linea-plot
          key={url + timeRangeMilli}
          src={url}
          showSurfaceHoarButton
          timeRangeMilli={timeRangeMilli}
        />
      </div>
    );
  } else if (timeRange === "interactive") {
    timeRange = "week";
  } else if (timeRange === "interactive_month") {
    timeRange = "month";
  } else if (timeRange === "interactive_winter") {
    timeRange = "winter";
  }

  let t = Temporal.Now.plainDateTimeISO();
  t = t.with({
    minute: Math.round(t.minute / 5) * 5,
    second: 0,
    millisecond: 0
  });
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
    t
  });
  return <img alt={station.name} src={src} className="weatherstation-img" />;
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
              key={stationData.operatorLink}
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
  const myRef = useRef<HTMLDivElement>();
  const [timeRange, setTimeRange] = useState<TimeRange>(
    ENABLE_UPLOT ? "interactive" : "threedays"
  );
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

  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => previous(),
    delta: 100
  });

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
  if (timeRange === "interactive" && !hasInteractivePlot(station)) {
    setTimeRange("threedays");
  }
  if (!station) return <div></div>;
  const isStation = station instanceof StationData;
  const [microRegionId] =
    station instanceof StationData ? station.microRegion.split(" ") : "";

  return (
    <div className="modal-container">
      <div className="modal-weatherstation" ref={myRef}>
        <div className="modal-header" {...handlers}>
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
                {intl.formatNumberUnit(station.elev, "m")}
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
              station={station}
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
  );
};

export default WeatherStationDiagrams;
