import React from "react";
import { observer } from "mobx-react";
import { IntlShape, injectIntl, useIntl } from "react-intl";
import { Util } from "leaflet";
import Swipe from "react-easy-swipe";
import { StationData } from "../../stores/stationDataStore";
import { Tooltip } from "../tooltips/tooltip";
import { DATE_TIME_ZONE_FORMAT } from "../../util/date";
import { currentSeasonYear } from "../../util/date-season";

const timeRanges = {
  day: "tag",
  threedays: "dreitage",
  week: "woche",
  month: "monat",
  winter: "winter"
};

export type Props = {
  stationData: StationData[];
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
  previousStation: StationData;
  next: () => void;
  nextStation: StationData;
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

class WeatherStationDiagrams extends React.Component<
  Props & { intl: IntlShape },
  { timeRange: keyof typeof timeRanges; selectedYear: null | number }
> {
  myRef: React.RefObject<HTMLDivElement>;
  constructor(props: Props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { timeRange: "threedays", selectedYear: null };
    this.keyFunction = this.keyFunction.bind(this);

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  keyFunction(event: KeyboardEvent) {
    if (event.keyCode === 37) {
      //arrow left
      this.previous();
    } else if (event.keyCode === 39) {
      //arrow right
      this.next();
    }
  }

  get stationIndex(): number {
    return this.props.stationData.findIndex(e => e.id == this.props.stationId);
  }

  get nextStation(): StationData {
    let index = this.stationIndex;
    if (index < this.props.stationData.length - 1) {
      index++;
    }
    return this.props.stationData[index];
  }

  get previousStation(): StationData {
    let index = this.stationIndex;
    if (index > 0) {
      index--;
    }
    return this.props.stationData[index];
  }

  next() {
    this.props.setStationId(this.nextStation.id);
  }

  previous() {
    this.props.setStationId(this.previousStation.id);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyFunction, false);
  }

  get cacheHash(): number {
    const currentTS = new Date();
    currentTS.setMilliseconds(0);
    currentTS.setSeconds(0);
    currentTS.setMinutes(Math.round(currentTS.getMinutes() / 5) * 5);
    return currentTS.valueOf();
  }

  regionName(microRegion: string): string {
    const pieces = microRegion.split(" ");
    const name = this.props.intl.formatMessage({
      id: "region:" + pieces[0]
    });
    return pieces[0] + " " + name;
  }

  render() {
    const stationsData = this.props.stationData;
    const rowId = this.props.stationId;
    if (!stationsData) return <div></div>;
    const stationData = stationsData.find(element => element.id == rowId);
    if (!stationData) return <div></div>;
    const isStation = stationData instanceof StationData;
    return (
      <Swipe
        onSwipeLeft={this.next}
        onSwipeRight={this.previous}
        tolerance={100}
      >
        <div className="modal-container">
          <div className="modal-weatherstation" ref={this.myRef}>
            <div className="modal-header">
              {isStation && (
                <p className="caption">
                  {this.props.intl.formatMessage({
                    id: "dialog:weather-station-diagram:header"
                  })}{" "}
                  ({this.regionName(stationData.microRegion)})
                </p>
              )}
              <h2 className="">
                <span className="weatherstation-name">{stationData.name} </span>
                {stationData.elev && (
                  <span className="weatherstation-altitude">
                    ({stationData.elev}&thinsp;m)
                  </span>
                )}
              </h2>
            </div>
            <StationFlipper
              next={this.next}
              nextStation={this.nextStation}
              previous={this.previous}
              previousStation={this.previousStation}
            >
              {!isStation && (
                <YearFlipper
                  selectedYear={this.state.selectedYear}
                  setSelectedYear={selectedYear =>
                    this.setState({ selectedYear })
                  }
                />
              )}
            </StationFlipper>
            <div className="modal-content">
              {isStation && <MeasurementValues stationData={stationData} />}
              {isStation && this.renderTimeRangeButtons()}
              {this.renderImage(stationData)}
              {isStation && this.renderOperator(stationData)}
            </div>
          </div>
        </div>
      </Swipe>
    );
  }

  renderTimeRangeButtons() {
    return (
      <ul className="list-inline filter primary">
        {Object.keys(timeRanges).map(key => {
          const classes = ["label"];
          if (key == this.state.timeRange) classes.push("js-active");
          return (
            <li key={key}>
              <a
                href="#"
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();
                  this.setState({
                    timeRange:
                      key !== "none"
                        ? (key as keyof typeof timeRanges)
                        : "threedays"
                  });
                }}
                className={classes.join(" ")}
              >
                {this.props.intl.formatMessage({
                  id: "dialog:weather-station-diagram:timerange:" + key
                })}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  renderImage(stationData: StationData) {
    const isStation = stationData instanceof StationData;
    const template = isStation
      ? window.config.apis.weather.plots
      : window.config.apis.weather.observers;
    const div = this.myRef?.current;
    const clientWidth = div?.clientWidth ?? 1;
    const width = clientWidth >= 1100 ? 1100 : 800;
    const src = Util.template(template, {
      width,
      interval: timeRanges[this.state.timeRange],
      name: stationData.plot,
      year: this.state.selectedYear ? "_" + this.state.selectedYear : "",
      t: this.cacheHash
    });
    return (
      <img
        alt={stationData.name}
        title={stationData.name}
        src={src}
        className="weatherstation-img"
      />
    );
  }

  renderOperator(stationData: StationData) {
    return (
      <p className="weatherstation-provider">
        {this.props.intl.formatMessage(
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
  }
}

export default injectIntl(observer(WeatherStationDiagrams));
