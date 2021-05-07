import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import { Util } from "leaflet";
import { dateToDateTimeString } from "../../util/date";
import Swipe from "react-easy-swipe";

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
    this.imageWidths = ["540", "800", "1100"];
    this.state = { timeRange: "threedays" };
    this.keyFunction = this.keyFunction.bind(this);
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

  previous() {
    let stationsData = window["modalStateStore"].data.stationData;
    let rowId = window["modalStateStore"].data.rowId;

    let index = stationsData.findIndex(element => element.id == rowId);
    if (index > 0) {
      index--;
    }
    window["modalStateStore"].setData({
      stationData: stationsData,
      rowId: stationsData[index].id
    });
  }

  next() {
    let stationsData = window["modalStateStore"].data.stationData;
    let rowId = window["modalStateStore"].data.rowId;

    let index = stationsData.findIndex(element => element.id == rowId);
    if (index < stationsData.length - 1) {
      index++;
    }
    window["modalStateStore"].setData({
      stationData: stationsData,
      rowId: stationsData[index].id
    });
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

  imageUrl(width, interval, name) {
    return Util.template(window.config.apis.weather.plots, {
      width,
      interval,
      name,
      t: this.cacheHash
    });
  }

  regionName(microRegion) {
    var pieces = microRegion.split(" ");
    var name = this.props.intl.formatMessage({
      id: "region:" + pieces[0]
    });
    return pieces[0] + " " + name;
  }

  render() {
    let stationsData = window["modalStateStore"].data.stationData;
    let rowId = window["modalStateStore"].data.rowId;
    let self = this;
    if (!stationsData) return <div></div>;
    var stationData = stationsData.find(element => element.id == rowId);
    if (!stationData) return <div></div>;
    return (
      <Swipe
        onSwipeLeft={this.next}
        onSwipeRight={this.previous}
        tolerance={100}
      >
        <div className="modal-container">
          <div className="modal-weatherstation">
            {/* <div className="modal-flipper">
              <div className="flipper-controls">
                <div className="grid flipper-left-right">
                  <div className="all-6 grid-item">
                    <a
                      href="#"
                      title="Previous Station"
                      className="icon-link icon-arrow-left tooltip flipper-left"
                    ></a>
                  </div>
                  <div className="all-6 grid-item">
                    <a
                      href="#"
                      title="Next Station"
                      className="icon-link icon-arrow-right tooltip flipper-right"
                    ></a>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="modal-header">
              <p className="caption">
                {this.props.intl.formatMessage({
                  id: "dialog:weather-station-diagram:header"
                })}{" "}
                ({this.regionName(stationData.microRegion)})
              </p>
              <h2 className="">
                <span className="weatherstation-name">{stationData.name} </span>
                <span className="weatherstation-altitude">
                  ({stationData.elev}&thinsp;m)
                </span>
              </h2>
            </div>

            <div className="modal-content">
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

              <ul className="list-inline filter primary">
                {Object.keys(self.timeRanges).map(key => {
                  let classes = ["label"];
                  if (key == self.state.timeRange) classes.push("js-active");
                  return (
                    <li key={key}>
                      <a
                        href="#"
                        onClick={self.handleChangeTimeRange.bind(self, key)}
                        className={classes.join(" ")}
                      >
                        {self.props.intl.formatMessage({
                          id: "dialog:weather-station-diagram:timerange:" + key
                        })}
                      </a>
                    </li>
                  );
                })}
              </ul>

              {stationData && (
                <img
                  alt={stationData.name}
                  src={this.imageUrl(
                    this.imageWidths[0],
                    this.timeRanges[this.state.timeRange],
                    stationData.plot
                  )}
                  srcSet={`${this.imageUrl(
                    this.imageWidths[0],
                    this.timeRanges[this.state.timeRange],
                    stationData.plot
                  )} 300w,
                  ${this.imageUrl(
                    this.imageWidths[1],
                    this.timeRanges[this.state.timeRange],
                    stationData.plot
                  )} 500w,
                  ${this.imageUrl(
                    this.imageWidths[2],
                    this.timeRanges[this.state.timeRange],
                    stationData.plot
                  )} 800w`}
                  className="weatherstation-img"
                />
              )}

              <p className="weatherstation-provider">
                {self.props.intl.formatMessage(
                  { id: "dialog:weather-station-diagram:operator:caption" },
                  { operator: stationData.operator }
                )}
              </p>
            </div>
          </div>
        </div>
      </Swipe>
    );
  }
}

export default injectIntl(observer(WeatherStationDiagrams));
