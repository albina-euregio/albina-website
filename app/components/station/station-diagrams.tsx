import type { DetailedHTMLProps, HTMLAttributes } from "react";
import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { StationData } from "../../stores/stationDataStore";
import { Tooltip } from "../tooltips/tooltip";
import { DATE_TIME_ZONE_FORMAT } from "../../util/date";
import { currentSeasonYear } from "../../util/date-season";
import "@albina-euregio/linea";
import { useDialogFlipper } from "../dialogs/dialog-flipper";
import { Feature } from "@albina-euregio/linea/listing";

declare module "react/jsx-runtime" {
  // oxlint-disable-next-line typescript/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "linea-plot": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          features?: string;
          showsurfacehoarseries?: boolean;
          showexport?: boolean;
          showdatepicker?: boolean;
          showonlywinter?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

function hasInteractivePlot(station: StationData | Feature) {
  return station instanceof StationData && station.properties.dataURLs?.length;
}

type LineaPlotElement = HTMLElement & {
  view?: {
    charts: unknown[];
    select(
      startDate: Temporal.ZonedDateTime,
      endDate: Temporal.ZonedDateTime
    ): void;
  };
};

/**
 * Date range of a winter season, matching the range used by the winter view of `<linea-plot>`.
 */
function winterSeason(
  year: number
): [Temporal.ZonedDateTime, Temporal.ZonedDateTime] {
  const timeZone = Temporal.Now.timeZoneId();
  return [
    new Temporal.PlainDate(year, 10, 1).toZonedDateTime(timeZone),
    new Temporal.PlainDate(year + 1, 7, 1).toZonedDateTime(timeZone)
  ];
}

const timeRanges = {
  day: "tag",
  threedays: "dreitage",
  week: "woche",
  month: "monat",
  winter: "winter"
};

type TimeRange = keyof typeof timeRanges;

export interface Props {
  stationData: (StationData | Feature)[];
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
  previousStation: StationData | Feature | undefined;
  next: () => void;
  nextStation: StationData | Feature | undefined;
  children: React.ReactNode;
}> = ({ previous, previousStation, next, nextStation, children }) => {
  const intl = useIntl();
  if (!previousStation && !nextStation) {
    return null;
  }
  return (
    <ul className="list-inline weatherstation-flipper">
      <li></li>
      {children}
      <li className="weatherstation-flipper-station">
        <ul className="list-inline weatherstation-flipper">
          {previousStation && (
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
          )}
          {nextStation && (
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
          )}
        </ul>
      </li>
    </ul>
  );
};

const MeasurementValues: React.FC<{ stationData: StationData }> = ({
  stationData
}) => {
  const intl = useIntl();
  if (!stationData.parametersForDialog.length) {
    return (
      <ul className="list-inline weatherstation-info">
        <li>
          <StationOperator stationData={stationData} />
        </li>
      </ul>
    );
  }
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
      <li>
        {stationData instanceof StationData && (
          <StationOperator stationData={stationData} />
        )}
      </li>
    </ul>
  );
};

const TimeRangeButtons: React.FC<{
  station: StationData | Feature;
  timeRange: TimeRange;
  setTimeRange: (timeRange: TimeRange) => void;
}> = ({ station, timeRange, setTimeRange }) => {
  const intl = useIntl();
  return (
    <ul className="list-inline filter primary">
      {(Object.keys(timeRanges) as TimeRange[])
        .filter(() => station.properties.plot)
        .map(key => (
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
        ))}
    </ul>
  );
};

const ObserverPlot: React.FC<{
  station: Feature;
  selectedYear: number | null;
}> = ({ station, selectedYear }) => {
  const ref = useRef<LineaPlotElement>(null);

  useEffect(() => {
    const plot = ref.current;
    if (!plot) return;
    const [startDate, endDate] = winterSeason(
      selectedYear ?? currentSeasonYear()
    );
    // <linea-plot> fetches its data asynchronously without emitting an event,
    // therefore retry until its charts have been created.
    let timeout = 0;
    let attempts = 100;
    const select = () => {
      if (plot.view?.charts.length) {
        plot.view.select(startDate, endDate);
      } else if (attempts-- > 0) {
        timeout = window.setTimeout(select, 100);
      }
    };
    select();
    return () => window.clearTimeout(timeout);
  }, [selectedYear]);

  return (
    <linea-plot
      ref={ref}
      features={JSON.stringify([station])}
      showdatepicker
      showonlywinter
      forecast-latlon={`${station.geometry.coordinates[1]},${station.geometry.coordinates[0]}`}
    />
  );
};

const StationDiagramImage: React.FC<{
  station: StationData | Feature;
  clientWidth: number;
  selectedYear: number | null;
  timeRange: TimeRange;
}> = ({ station, clientWidth, selectedYear, timeRange }) => {
  if (hasInteractivePlot(station) && station instanceof StationData) {
    return (
      <div className="uplots">
        <linea-plot
          key={station.id}
          features={JSON.stringify([station])}
          showsurfacehoarseries
          showexport
          showdatepicker
          forecast-latlon={`${station.geometry.coordinates[1]},${station.geometry.coordinates[0]}`}
        />
      </div>
    );
  }

  if (!(station instanceof StationData)) {
    return (
      <ObserverPlot
        key={station.id}
        station={station}
        selectedYear={selectedYear}
      />
    );
  }

  let t = Temporal.Now.plainDateTimeISO();
  t = t.with({
    minute: Math.round(t.minute / 5) * 5,
    second: 0,
    millisecond: 0
  });
  const width = clientWidth >= 1100 ? 1100 : 800;
  const src = window.config.template(station.properties.plot ?? "", {
    width,
    interval: timeRanges[timeRange],
    year: selectedYear ? "_" + selectedYear : "",
    t
  });
  return (
    <img
      alt={station.properties.name}
      src={src}
      className="weatherstation-img"
    />
  );
};

const StationOperator: React.FC<{
  stationData: StationData;
}> = ({ stationData }) => {
  return (
    <>
      <FormattedMessage id="dialog:weather-station-diagram:provider" />
      {": "}
      <a
        key={stationData.properties.operatorLink}
        href={stationData.properties.operatorLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        {stationData.properties.operator}
      </a>
      {stationData.properties.operatorLicense && (
        <>
          {" ("}
          <a
            href={stationData.properties.operatorLicenseLink ?? ""}
            rel="noopener noreferrer"
            target="_blank"
          >
            {stationData.properties.operatorLicense}
          </a>
          {")"}
        </>
      )}
    </>
  );
};

const WeatherStationDiagrams: React.FC<Props> = ({
  stationData,
  stationId,
  setStationId
}) => {
  const intl = useIntl();
  const myRef = useRef<HTMLDivElement>();
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const {
    index: stationIndex,
    previousItem: previousStation,
    nextItem: nextStation,
    previous,
    next,
    swipeHandlers
  } = useDialogFlipper(stationData, stationId, setStationId);

  useEffect(() => {
    // Close the dialog if the selected station is not present in the current data snapshot.
    if (stationId && stationData.length > 0 && stationIndex < 0) {
      setStationId("");
    }
  }, [setStationId, stationData.length, stationId, stationIndex]);

  if (!stationData) return <div></div>;
  const station = stationData[stationIndex];
  if (!station) return <div></div>;
  const isStation = station instanceof StationData;
  const [microRegionId] = isStation ? station.microRegion.split(" ") : "";
  return (
    <div className="modal-container">
      <div className="modal-weatherstation" ref={myRef}>
        <div className="modal-header" {...swipeHandlers}>
          {isStation && (
            <p className="caption">
              {intl.formatMessage({
                id: "dialog:weather-station-diagram:header"
              })}{" "}
              {microRegionId && (
                <>
                  {" "}
                  ({microRegionId}{" "}
                  {intl.formatMessage({
                    id: "region:" + microRegionId
                  })}
                  )
                </>
              )}
            </p>
          )}
          <h2 className="">
            <span className="weatherstation-name">{station.name} </span>
            {isStation && station.altitude && (
              <span className="weatherstation-altitude">
                {intl.formatNumberUnit(station.altitude, "m")}
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
          {isStation && !hasInteractivePlot(station) && (
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
        </div>
      </div>
    </div>
  );
};

export default WeatherStationDiagrams;
