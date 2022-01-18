import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import { Util } from "leaflet";
import { dateToDateTimeString } from "../../util/date";
import Swipe from "react-easy-swipe";
import { StationData } from "../../stores/stationDataStore";

class WeatherStationDiagrams extends React.Component {
  constructor(props) {
    super(props);
    this.timeRanges = {
      day: "tag",
      threedays: "dreitage",
      week: "woche",
      month: "monat",
      winter: "winter"
    };
    this.imageWidths = ["800", "1100"];
    this.state = { timeRange: "threedays", selectedYear: null };
    this.keyFunction = this.keyFunction.bind(this);

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  keyFunction(event) {
    if (window["modalStateStore"].isOpen) {
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
    let stationsData = window["modalStateStore"].data.stationData;
    let rowId = window["modalStateStore"].data.rowId;

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
    let stationsData = window["modalStateStore"].data.stationData;
    let rowId = window["modalStateStore"].data.rowId;

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

  get cacheHash() {
    let currentTS = new Date();
    currentTS.setMilliseconds(0);
    currentTS.setSeconds(0);
    currentTS.setMinutes(Math.round(currentTS.getMinutes() / 5) * 5);
    return currentTS.valueOf();
  }

  handleChangeTimeRange = (newTimeRange, event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      timeRange: newTimeRange !== "none" ? newTimeRange : "threedays"
    });
  };

  regionName(microRegion) {
    var pieces = microRegion.split(" ");
    var name = this.props.intl.formatMessage({
      id: "region:" + pieces[0]
    });
    return pieces[0] + " " + name;
  }

  yearFlipper() {
    const curYear = new Date().getFullYear();
    let nextYear = null;
    let lastYear = null;
    let selectedYear = new Date().getFullYear();
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
            <a
              href="#"
              onClick={() => {
                this.setState({ selectedYear: lastYear });
              }}
              title="Back"
              className="tooltip"
            >
              <span className="icon-arrow-left"></span>
              {lastYear}
            </a>
          </li>
        )}
        <li className="weatherstation-flipper-current">{selectedYear}</li>
        {nextYear && (
          <li className="weatherstation-flipper-forward">
            <a
              href="#"
              onClick={() => {
                this.setState({
                  selectedYear: curYear === nextYear ? null : nextYear
                });
              }}
              title="Forward"
              className="tooltip"
            >
              {nextYear}&nbsp;
              <span className="icon-arrow-right"></span>
            </a>
          </li>
        )}
        {this.state.selectedYear && (
          <li className="weatherstation-flipper-forward">
            <a
              href="#"
              onClick={() => {
                this.setState({
                  selectedYear: null
                });
              }}
              title="Latest"
              className="tooltip"
            >
              <span>
                {this.props.intl.formatMessage({
                  id: "dialog:weather-station-diagram:yearFlipper:latest"
                })}
              </span>
            </a>
          </li>
        )}
      </>
    );
  }

  stationFlipper(isStation) {
    const nextStation = this.getNextStation();
    const previousStation = this.getPreviousStation();

    let nextStationData = nextStation.stationData.find(
      element => element.id == nextStation.rowId
    );
    let previousStationData = previousStation.stationData.find(
      element => element.id == previousStation.rowId
    );

    return (
      <ul className="list-inline weatherstation-flipper">
        <li></li>
        {!isStation && this.yearFlipper()}
        <li className="weatherstation-flipper-station">
          <ul className="list-inline weatherstation-flipper">
            <li className="weatherstation-flipper-back">
              <a
                href="#"
                onClick={this.previous}
                title="Prior Station"
                className="tooltip"
              >
                <span className="icon-arrow-left"></span>
                {previousStationData.name}
              </a>
            </li>
            <li className="weatherstation-flipper-forward">
              <a
                href="#"
                onClick={this.next}
                title="Next Station"
                className="tooltip"
              >
                {nextStationData.name}&nbsp;
                <span className="icon-arrow-right"></span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    );
  }

  render() {
    let stationsData = window["modalStateStore"].data.stationData;
    let rowId = window["modalStateStore"].data.rowId;
    if (!stationsData) return <div></div>;
    var stationData = stationsData.find(element => element.id == rowId);
    if (!stationData) return <div></div>;
    const isStation = stationData instanceof StationData;
    return (
      <Swipe
        onSwipeLeft={this.next}
        onSwipeRight={this.previous}
        tolerance={100}
      >
        <div className="modal-container">
          <div className="modal-weatherstation">
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

  renderMeasurementValues(stationData) {
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
            (<time>{dateToDateTimeString(stationData.date)}</time>)
          </small>
        </li>
      </ul>
    );
  }

  renderTimeRangeButtons() {
    return (
      <ul className="list-inline filter primary">
        {Object.keys(this.timeRanges).map(key => {
          let classes = ["label"];
          if (key == this.state.timeRange) classes.push("js-active");
          return (
            <li key={key}>
              <a
                href="#"
                onClick={this.handleChangeTimeRange.bind(self, key)}
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

  renderImage(stationData) {
    const isStation = stationData instanceof StationData;
    const template = isStation
      ? window.config.apis.weather.plots
      : window.config.apis.weather.observers;
    const src = this.imageWidths.map(width =>
      Util.template(template, {
        width,
        interval: this.timeRanges[this.state.timeRange],
        name: stationData.plot,
        year: this.state.selectedYear ? "_" + this.state.selectedYear : "",
        t: this.cacheHash
      })
    );
    return (
      <img
        alt={stationData.name}
        title={stationData.name}
        src={src[0]}
        srcSet={`${src[0]} 300w, ${src[1]} 800w`}
        className="weatherstation-img"
      />
    );
  }

  renderOperator(stationData) {
    const operator = stationData.operator;
    const link = window.config.links.weatherStationOperators[operator] || "";
    return (
      <p className="weatherstation-provider">
        {this.props.intl.formatMessage(
          { id: "dialog:weather-station-diagram:operator:caption" },
          {
            operator: (
              <a href={link} rel="noopener noreferrer" target="_blank">
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
