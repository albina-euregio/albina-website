import React from "react";
import { inject, observer } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";

class WeatherStationDiagrams extends React.Component {
  constructor(props) {
    super(props);
  }

  get cacheHash() {
    let currentTS = new Date();
    currentTS.setMilliseconds(0);
    currentTS.setSeconds(0);
    currentTS.setMinutes(Math.round(currentTS.getMinutes() / 5) * 5);
    return currentTS.valueOf();
  }

  render() {
    let stationData = window["modalStateStore"].data.stationData;
    // console.log('stationData', stationData);

    if (!stationData) return <div></div>;
    return (
      <div class="modal-weatherstation">
        <div class="modal-header">
          <h2 className="subheader">Weather Station</h2>
          <h2>{stationData.name}</h2>
        </div>

        <div class="modal-content">
          <form class="pure-form pure-form-stacked">
            <label htmlFor="timerange">
              Select<span class="normal"> Time Range</span>
            </label>
            <ul className="list-inline list-buttongroup">
              <li>
                <select class="dropdown" name="timerange">
                  <option value="Day" selected="selected">
                    Day
                  </option>
                  <option value="3 Days">3 Days</option>
                  <option value="Week">Week</option>
                  <option value="Month">Month</option>
                  <option value="Winter">Winter</option>
                </select>
              </li>
            </ul>
          </form>

          <img
            src={
              "https://lawine.tirol.gv.at/data/grafiken/540/standard/woche/" +
              stationData.plot +
              ".png?" +
              this.cacheHash
            }
            className="weather-station-img"
          />
        </div>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(observer(WeatherStationDiagrams)));
