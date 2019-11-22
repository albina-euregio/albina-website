import React from "react";
import { inject, observer} from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";

class WeatherStationDiagrams extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    let stationData = window["modalStateStore"].data.stationData;
    console.log('stationData', stationData);

    if(!stationData) return (<div></div>);
    return (
      <h2 className="subheader">
          Weather Station Info for {stationData.name}
          <img src={'https://lawine.tirol.gv.at/data/grafiken/540/standard/dreitage/' + stationData.plot + '.png'} />
        </h2>
    );
  }
}

export default inject("locale")(injectIntl(observer(WeatherStationDiagrams)));
