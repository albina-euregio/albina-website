import React from "react";
import { inject, observer } from "mobx-react";
import { injectIntl, FormattedMessage, FormattedNumber } from "react-intl";

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
    this.state = { timeRange: "day" };
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
      timeRange: newTimeRange !== "none" ? newTimeRange : "day"
    });
  };

  imageUrl(res, range, name) {
    return (
      "https://lawine.tirol.gv.at/data/grafiken/" +
      res +
      "/standard/" +
      range +
      "/" +
      name +
      ".png?" +
      this.cacheHash
    );
  }

  assembleStationInfo(stationData) {
    let stationInfo = [];
    stationData.parametersForDialog.forEach(infoType => {
      stationInfo.push({
        ...infoType,
        caption: this.props.intl.formatMessage({
          id: "measurements:table:header:" + infoType.type
        })
      });
    });
    if (APP_DEV_MODE)
      console.log("assembleStationInfo", stationData, stationInfo);
    return stationInfo;
  }

  render() {
    let stationData = window["modalStateStore"].data.stationData;
    let self = this;

    if (!stationData) return <div></div>;
    let stationInfo = this.assembleStationInfo(stationData);
    return (
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
            ({stationData.microRegion})
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
            {stationInfo.map(aInfo => (
              <li key={aInfo.type} className={aInfo.type}>
                <span className="weatherstation-info-caption">
                  {aInfo.caption}:{" "}
                </span>
                <span className="weatherstation-info-value">
                  <FormattedNumber
                    value={aInfo.value}
                    minimumFractionDigits={aInfo.digits}
                    maximumFractionDigits={aInfo.digits}
                  ></FormattedNumber>
                  &thinsp;{aInfo.unit}
                </span>
              </li>
            ))}
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
            <FormattedMessage
              id="dialog:weather-station-diagram:operator.caption"
              values={{ operator: stationData.operator }}
            />
          </p>
        </div>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(observer(WeatherStationDiagrams)));