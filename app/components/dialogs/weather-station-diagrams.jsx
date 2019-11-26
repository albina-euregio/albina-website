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

    if (!stationData) return <div>No Information available</div>;
    return (
      <h2 className="subheader">
        Weather Station Info for {stationData.name}
        <img
          src={
            "https://lawine.tirol.gv.at/data/grafiken/540/standard/dreitage/" +
            stationData.plot +
            ".png?" +
            this.cacheHash
          }
        />
      </h2>
    );
  }
}

export default inject("locale")(injectIntl(observer(WeatherStationDiagrams)));
