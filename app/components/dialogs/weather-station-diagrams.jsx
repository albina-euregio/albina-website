import React from "react";
import { inject, observer } from "mobx-react";
import { injectIntl, FormattedHTMLMessage, FormattedNumber } from "react-intl";
import Selectric from "../selectric";

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

  handleChangeTimeRange = newTimeRange => {
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

  assambleStationInfo(stationData) {
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
      console.log("assambleStationInfo", stationData, stationInfo);
    return stationInfo;
  }

  render() {
    let stationData = window["modalStateStore"].data.stationData;
    let self = this;

    if (!stationData) return <div></div>;
    let stationInfo = this.assambleStationInfo(stationData);
    return (
      <div className="modal-weatherstation">
        <div class="modal-flipper">
          <div class="flipper-controls">
            <div class="grid flipper-left-right">
              <div class="all-6 grid-item">
                <a
                  href="#"
                  title="Previous Station"
                  class="icon-link icon-arrow-left tooltip flipper-left"
                ></a>
              </div>
              <div class="all-6 grid-item">
                <a
                  href="#"
                  title="Next Station"
                  class="icon-link icon-arrow-right tooltip flipper-right"
                ></a>
              </div>
            </div>
          </div>
        </div>

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

          {/* old: replace this ...  */}
          <form className="pure-form pure-form-stacked">
            <label htmlFor="timerange">
              <FormattedHTMLMessage id="dialog:weather-station-diagram:timerange:header" />
            </label>
            <ul className="list-inline list-buttongroup">
              <li>
                <Selectric
                  onChange={this.handleChangeTimeRange}
                  value={this.state.timeRange}
                >
                  {Object.keys(self.timeRanges).map(key => (
                    <option key={key} value={key}>
                      {self.props.intl.formatMessage({
                        id: "dialog:weather-station-diagram:timerange:" + key
                      })}
                    </option>
                  ))}
                </Selectric>
              </li>
            </ul>
          </form>
          {/* ... new: with this */}
          <ul class="list-inline filter primary">
            <li>
              <a href="#" class="label" title="Select Time Range">
                Day
              </a>
            </li>
            <li>
              <a href="#" class="label" title="Select Time Range">
                Three Days
              </a>
            </li>
            <li>
              <a href="#" class="label js-active" title="Select Time Range">
                Week
              </a>
            </li>
            <li>
              <a href="#" class="label" title="Select Time Range">
                Month
              </a>
            </li>
            <li>
              <a href="#" class="label" title="Select Time Range">
                Winter
              </a>
            </li>
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
            <FormattedHTMLMessage id="dialog:weather-station-diagram:operator.caption" />{" "}
            {stationData.operator}
          </p>
        </div>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(observer(WeatherStationDiagrams)));
