import React from "react";
import { inject, observer } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import Selectric from "../selectric";

class WeatherStationDiagrams extends React.Component {
  constructor(props) {
    super(props);
    this.timeRanges = ["tag", "dreitage", "woche", "monat", "winter"];
    this.imageWidths = ["540", "800", "1100"];
    this.state = { timeRange: this.timeRanges[0] };
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
      timeRange: newTimeRange !== "none" ? newTimeRange : this.timePeriods[0]
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

  render() {
    let stationData = window["modalStateStore"].data.stationData;
    // console.log('stationData', stationData);

    if (!stationData) return <div></div>;
    return (
      <div className="modal-weatherstation">
        <div className="modal-header">
          <h2 className="subheader">Weather Station</h2>
          <h2>{stationData.name}</h2>
        </div>

        <div className="modal-content">
          <form className="pure-form pure-form-stacked">
            <label htmlFor="timerange">
              Select<span className="normal"> Time Range</span>
            </label>
            <ul className="list-inline list-buttongroup">
              <li>
                <Selectric
                  onChange={this.handleChangeTimeRange}
                  value={this.state.timeRange}
                >
                  {this.timeRanges.map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Selectric>
              </li>
            </ul>
          </form>

          {stationData && (
            <img
              src={this.imageUrl(
                this.imageWidths[0],
                this.state.timeRange,
                stationData.plot
              )}
              srcSet={`${this.imageUrl(
                this.imageWidths[0],
                this.state.timeRange,
                stationData.plot
              )} 300w,
              ${this.imageUrl(
                this.imageWidths[1],
                this.state.timeRange,
                stationData.plot
              )} 500w,
              ${this.imageUrl(
                this.imageWidths[2],
                this.state.timeRange,
                stationData.plot
              )} 800w`}
              className="weather-station-img"
            />
          )}
        </div>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(observer(WeatherStationDiagrams)));
