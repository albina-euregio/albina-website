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
import WeatherStationUplot from "./weather-station-uplot";
import { Temporal } from "temporal-polyfill";

const ENABLE_UPLOT =
  import.meta.env.DEV || import.meta.env.BASE_URL === "/beta/";

function hasInteractivePlot(station: StationData | ObserverData) {
  return (
    ENABLE_UPLOT &&
    station instanceof StationData &&
    /LWD Tirol|Südtirol - Alto Adige/.test(station.operator)
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
          return <></>;
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
  const intl = useIntl();
  if (
    timeRange.startsWith("interactive") &&
    hasInteractivePlot(station) &&
    station instanceof StationData
  ) {
    const timeRangeMilli =
      timeRangesMilli[timeRange] ?? timeRangesMilli["week"];
    const width = document.body.clientWidth * 0.85; // 1000
    const height = 300;
    // https://colorbrewer2.org/?type=qualitative&scheme=Set1&n=7#type=qualitative&scheme=Set1&n=7
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <WeatherStationUplot
          title={`Schneehöhe [cm] & Niederschlag 24h [mm] – ${station.name}`}
          stationData={station}
          scales={{
            y: {
              range: (_u, _dataMin, dataMax) => {
                const max = dataMax > 250 ? Math.ceil(dataMax / 10) * 10 : 250;
                return [0, max];
              }
            },
            y2: {
              range: [0, 100]
            }
          }}
          axes={[
            {
              label: "Schneehöhe [cm]",
              scale: "y",
              splits: [0, 50, 100, 150, 200, 250]
            },
            {
              scale: "y2",
              label: "Niederschlag 24h [mm]",
              splits: [0, 20, 40, 60, 80, 100],
              side: 1,
              grid: {
                show: false
              }
            }
          ]}
          parameters={[
            {
              id: "HS",
              label: "Schneehöhe",
              unit: "cm",
              stroke: "#08519C",
              scale: "y",
              width: 2
            },
            {
              id: "PSUM",
              label: "Niederschlag 24h",
              unit: "mm",
              digits: 1,
              stroke: "#6aafd5",
              fill: "rgba(106, 175, 213, 0.3)",
              scale: "y2",
              width: 1
            }
          ]}
          timeRangeMilli={timeRangeMilli}
          width={width}
          height={height}
        />
        <WeatherStationUplot
          title={`Luft-Temperatur, Taupunkt & Temperatur der Schneeoberfläche [˚C] – ${station.name}`}
          stationData={station}
          axes={[
            {
              label: "Temperatur [°C]",
              scale: "y",
              splits: [-30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30]
            }
          ]}
          scales={{
            y: {
              range: [-30, 30]
            }
          }}
          parameters={[
            {
              id: "TA",
              label: "Luft-Temperatur",
              unit: "°C",
              digits: 1,
              stroke: "#DE2D26",
              scale: "y",
              width: 2
            },
            {
              id: "TD",
              label: "Taupunkt",
              unit: "°C",
              digits: 1,
              stroke: "#6aafd5",
              scale: "y",
              width: 2
            },
            {
              id: "TSS",
              label: "Temperatur der Schneeoberfläche",
              unit: "°C",
              digits: 1,
              stroke: "#FC9272",
              scale: "y",
              width: 2
            }
          ]}
          timeRangeMilli={timeRangeMilli}
          width={width}
          height={height}
          hooks={{
            drawAxes: [
              u => {
                const ctx = u.ctx;
                const width = 1;
                const offset = (width % 2) / 2;
                const x0 = u.bbox.left;
                const y0 = u.valToPos(0, "y", true);
                const x1 = u.bbox.left + u.bbox.width;
                const y1 = u.valToPos(0, "y", true);

                // draw reference line at 0

                ctx.save();
                ctx.translate(offset, offset);
                ctx.beginPath();
                ctx.strokeStyle = "#000";
                ctx.setLineDash([5, 5]);
                ctx.lineWidth = width;
                ctx.moveTo(x0, y0);
                ctx.lineTo(x1, y1);
                ctx.stroke();
                ctx.translate(-offset, -offset);
                ctx.restore();

                // draw regions where TD < 0 && TSS < TD
                ctx.save();
                ctx.rect(u.bbox.left, u.bbox.top, u.bbox.width, u.bbox.height);
                ctx.clip();

                // current region
                let from = 0;
                let to = 0;

                for (let i = 0; i < u.data[0].length; i++) {
                  const td = u.data[2][i] ?? NaN;
                  const tss = u.data[3][i] ?? NaN;

                  if (td < 0 && tss < td) {
                    const xVal = u.data[0][i];

                    if (from === 0) {
                      from = xVal;
                    }

                    to = xVal;
                  } else {
                    if (from !== 0) {
                      const x0 = u.valToPos(from, "x", true);
                      const x1 = u.valToPos(to, "x", true);

                      ctx.fillRect(x0, u.bbox.top, x1 - x0, u.bbox.height);

                      from = 0;
                      to = 0;
                    }
                  }
                }

                // if region extends to end of data
                if (from !== 0) {
                  const x0 = u.valToPos(from, "x", true);
                  const x1 = u.valToPos(to, "x", true);

                  ctx.fillRect(x0, u.bbox.top, x1 - x0, u.bbox.height);
                }

                ctx.restore();
              }
            ]
          }}
        />
        <WeatherStationUplot
          title={`Relative Luftfeuchtigkeit [%] & Globalstrahlung [W/m²] – ${station.name}`}
          stationData={station}
          scales={{
            y: {
              range: [0, 100]
            },
            y2: {
              range: [0, 1200]
            }
          }}
          axes={[
            {
              label: "Relative Luftfeuchtigkeit [%]",
              scale: "y",
              splits: [0, 25, 50, 75, 100],
              grid: {
                show: false
              }
            },
            {
              scale: "y2",
              label: "Globalstrahlung [W/m²]",
              splits: [0, 300, 600, 900, 1200],
              side: 1,
              grid: {
                show: true
              }
            }
          ]}
          parameters={[
            {
              id: "RH",
              label: "Relative Luftfeuchtigkeit",
              unit: "%",
              stroke: "#6aafd5",
              scale: "y",
              width: 2
            },
            {
              id: "ISWR",
              label: "Globalstrahlung",
              unit: "W/m²",
              stroke: "#DE2D26",
              fill: "rgba(255,0,0,0.1)",
              scale: "y2",
              width: 1
            }
          ]}
          timeRangeMilli={timeRangeMilli}
          width={width}
          height={height}
        />
        <WeatherStationUplot
          title={`Windgeschwindigkeit [km/h] & Windrichtung [˚] – ${station.name}`}
          stationData={station}
          hooks={{
            drawAxes: [
              u => {
                const ctx = u.ctx;
                const width = 1;
                const offset = (width % 2) / 2;
                const x0 = u.bbox.left;
                const y0 = u.valToPos(25, "y", true);
                const x1 = u.bbox.left + u.bbox.width;
                const y1 = u.valToPos(25, "y", true);

                //draw reference line at 25 km/h (working group decision)

                ctx.save();
                ctx.translate(offset, offset);
                ctx.beginPath();
                ctx.strokeStyle = "#000";
                ctx.setLineDash([5, 5]);
                ctx.lineWidth = width;
                ctx.moveTo(x0, y0);
                ctx.lineTo(x1, y1);
                ctx.stroke();
                ctx.translate(-offset, -offset);
                ctx.restore();
              }
            ]
          }}
          scales={{
            y: {
              range: (_u, _dataMin, dataMax) => {
                const max = dataMax > 100 ? Math.ceil(dataMax / 10) * 10 : 100;
                return [0, max];
              }
            },
            y2: {
              range: [0, 360]
            }
          }}
          axes={[
            {
              label: "Geschwindigkeit [km/h]",
              splits: [0, 25, 50, 75, 100],
              scale: "y"
            },
            {
              label: "Richtung [°]",
              splits: [0, 90, 180, 270, 360],
              values: [
                intl.formatMessage({
                  id: "bulletin:report:problem:aspect:n"
                }) + " ↑",
                intl.formatMessage({
                  id: "bulletin:report:problem:aspect:e"
                }) + " ←",
                intl.formatMessage({
                  id: "bulletin:report:problem:aspect:s"
                }) + " ↑",
                intl.formatMessage({
                  id: "bulletin:report:problem:aspect:w"
                }) + " →",
                intl.formatMessage({
                  id: "bulletin:report:problem:aspect:n"
                }) + " ↑"
              ],
              scale: "y2",
              side: 1,
              grid: {
                show: false
              }
            }
          ]}
          parameters={[
            {
              id: "VW",
              label: "Wind",
              unit: "km/h",
              stroke: "#00E2B6",
              scale: "y",
              width: 2
            },
            {
              id: "VW_MAX",
              label: "Böen",
              unit: "km/h",
              stroke: "#00A484",
              scale: "y",
              width: 2
            },
            {
              id: "DW",
              label: "Richtung",
              unit: "°",
              stroke: "#084D40",
              paths: () => null,
              points: {
                space: 0,
                fill: "#084D40",
                size: 4
              },
              scale: "y2"
            }
          ]}
          timeRangeMilli={timeRangeMilli}
          width={width}
          height={height}
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
    </Swipe>
  );
};

export default WeatherStationDiagrams;
