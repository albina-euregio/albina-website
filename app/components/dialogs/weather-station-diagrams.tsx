import React from "react";
import { observer } from "mobx-react";
import { IntlShape, injectIntl } from "react-intl";
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

class WeatherStationDiagrams extends React.Component<
  { intl: IntlShape; isOpen?: () => boolean },
  { timeRange: keyof typeof timeRanges; selectedYear: null | number }
> {
  myRef: React.RefObject<HTMLDivElement>;
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { timeRange: "threedays", selectedYear: null };
    this.keyFunction = this.keyFunction.bind(this);

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  keyFunction(event: KeyboardEvent) {
    if (this.props.isOpen?.() ?? window["modalStateStore"].isOpen) {
      if (event.keyCode === 37) {
        //arrow left
        this.previous();
      } else if (event.keyCode === 39) {
        //arrow right
        this.next();
      }
    }
  }

  getNextStation() {
    const stationsData = window["modalStateStore"].data.stationData;
    const rowId = window["modalStateStore"].data.rowId;

    let index = stationsData.findIndex(element => element.id == rowId);
    if (index < stationsData.length - 1) {
      index++;
    }
    return {
      stationData: stationsData,
      rowId: stationsData[index].id
    };
  }

  getPreviousStation() {
    const stationsData = window["modalStateStore"].data.stationData;
    const rowId = window["modalStateStore"].data.rowId;

    let index = stationsData.findIndex(element => element.id == rowId);
    if (index > 0) {
      index--;
    }
    return {
      stationData: stationsData,
      rowId: stationsData[index].id
    };
  }

  next() {
    window["modalStateStore"].setData(this.getNextStation());
  }

  previous() {
    window["modalStateStore"].setData(this.getPreviousStation());
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

  yearFlipper() {
    const curYear = currentSeasonYear();
    let nextYear: null | number = null;
    let lastYear: null | number = null;
    let selectedYear = curYear;
    if (this.state.selectedYear) {
      selectedYear = this.state.selectedYear;
      if (selectedYear > 1960) lastYear = selectedYear - 1;
      if (selectedYear < curYear) nextYear = selectedYear + 1;
    } else {
      lastYear = curYear - 1;
    }
    return (
      <>
        {lastYear && (
          <li className="weatherstation-flipper-back">
            <Tooltip
              label={this.props.intl.formatMessage({
                id: "weatherstation-diagrams:back"
              })}
            >
              <a
                href="#"
                onClick={() => {
                  this.setState({ selectedYear: lastYear });
                }}
              >
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
              label={this.props.intl.formatMessage({
                id: "weatherstation-diagrams:forward"
              })}
            >
              <a
                href="#"
                onClick={() => {
                  this.setState({
                    selectedYear: curYear === nextYear ? null : nextYear
                  });
                }}
              >
                {nextYear}/{nextYear + 1}&nbsp;
                <span className="icon-arrow-right"></span>
              </a>
            </Tooltip>
          </li>
        )}
        {this.state.selectedYear && (
          <li className="weatherstation-flipper-forward">
            <Tooltip
              label={this.props.intl.formatMessage({
                id: "weatherstation-diagrams:latest"
              })}
            >
              <a
                href="#"
                onClick={() => {
                  this.setState({
                    selectedYear: null
                  });
                }}
              >
                <span>
                  {this.props.intl.formatMessage({
                    id: "dialog:weather-station-diagram:yearFlipper:latest"
                  })}
                </span>
              </a>
            </Tooltip>
          </li>
        )}
      </>
    );
  }

  stationFlipper(isStation: boolean) {
    const nextStation = this.getNextStation();
    const previousStation = this.getPreviousStation();

    const nextStationData = nextStation.stationData.find(
      element => element.id == nextStation.rowId
    );
    const previousStationData = previousStation.stationData.find(
      element => element.id == previousStation.rowId
    );

    return (
      <ul className="list-inline weatherstation-flipper">
        <li></li>
        {!isStation && this.yearFlipper()}
        <li className="weatherstation-flipper-station">
          <ul className="list-inline weatherstation-flipper">
            <li className="weatherstation-flipper-back">
              <Tooltip
                label={this.props.intl.formatMessage({
                  id: "weatherstation-diagrams:priorstation"
                })}
              >
                <a href="#" onClick={this.previous}>
                  <span className="icon-arrow-left"></span>
                  {previousStationData.name}
                </a>
              </Tooltip>
            </li>
            <li className="weatherstation-flipper-forward">
              <Tooltip
                label={this.props.intl.formatMessage({
                  id: "weatherstation-diagrams:nextstation"
                })}
              >
                <a href="#" onClick={this.next}>
                  {nextStationData.name}&nbsp;
                  <span className="icon-arrow-right"></span>
                </a>
              </Tooltip>
            </li>
          </ul>
        </li>
      </ul>
    );
  }

  render() {
    const stationsData = window["modalStateStore"].data.stationData;
    const rowId = window["modalStateStore"].data.rowId;
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
            {this.stationFlipper(isStation)}
            <div className="modal-content">
              {isStation && this.renderMeasurementValues(stationData)}
              {isStation && this.renderTimeRangeButtons()}
              {this.renderImage(stationData)}
              {isStation && this.renderOperator(stationData)}
            </div>
          </div>
        </div>
      </Swipe>
    );
  }

  renderMeasurementValues(stationData: StationData) {
    return (
      <ul className="list-inline weatherstation-info">
        {stationData.parametersForDialog.map(aInfo => (
          <li key={aInfo.type} className={aInfo.type}>
            <span className="weatherstation-info-caption">
              {this.props.intl.formatMessage({
                id: "measurements:table:header:" + aInfo.type
              })}
              :{" "}
            </span>
            <span className="weatherstation-info-value">
              {this.props.intl.formatNumber(aInfo.value, {
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
              {this.props.intl.formatDate(
                stationData.date,
                DATE_TIME_ZONE_FORMAT
              )}
            </time>
            )
          </small>
        </li>
      </ul>
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
