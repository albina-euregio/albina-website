import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import StationOverlay from "../components/weather/station-overlay";
import LeafletMap from "../components/leaflet/leaflet-map";
import HTMLHeader from "../components/organisms/html-header";
import StationDataStore from "../stores/stationDataStore";

import BeobachterAT from "../stores/Beobachter-AT.json";
import BeobachterIT from "../stores/Beobachter-IT.json";
import WeatherStationDialog from "../components/dialogs/weather-station-dialog";

const longitudeOffset = /Beobachter (Boden|Obertilliach|Nordkette|Kühtai)/;

const observers = [...BeobachterAT, ...BeobachterIT].map(observer => ({
  geometry: {
    coordinates: [
      +observer.longitude + (longitudeOffset.test(observer.name) ? 0.005 : 0),
      +observer.latitude
    ]
  },
  name: observer.name,
  id: "observer-" + observer["plot.id"],
  plot: observer["plot.id"]
}));

class StationMap extends React.Component {
  constructor(props) {
    super(props);
    this.store = new StationDataStore().sortBy("microRegion", "asc");
    this.dialogRef = React.createRef();
  }

  componentDidMount() {
    this.store.load();
  }

  get stationOverlay() {
    const item = {
      id: "name",
      colors: [[25, 171, 255]],
      thresholds: [],
      clusterOperation: "none"
    };
    return (
      <StationOverlay
        key={"stations"}
        onMarkerSelected={feature =>
          this.setState({
            stationData: this.store.data,
            stationId: feature.id
          })
        }
        itemId="any"
        item={item}
        features={this.store.data}
      />
    );
  }

  get observerOverlay() {
    const observerItem = {
      id: "name",
      colors: [[0xca, 0x00, 0x20]],
      thresholds: [],
      clusterOperation: "none"
    };
    return (
      <StationOverlay
        key={"observers"}
        onMarkerSelected={feature =>
          this.setState({
            stationData: observers,
            stationId: feature.id
          })
        }
        itemId="any"
        item={observerItem}
        features={observers}
      />
    );
  }

  render() {
    const overlays = [this.stationOverlay, this.observerOverlay];
    return (
      <>
        <WeatherStationDialog
          stationData={this.state?.stationData}
          stationId={this.state?.stationId}
          setStationId={stationId => this.setState({ stationId })}
        />
        <HTMLHeader
          title={this.props.intl.formatMessage({ id: "menu:lawis:station" })}
        />
        <section
          id="section-weather-map"
          className="section section-weather-map"
        >
          <div className="section-map">
            <LeafletMap
              loaded={this.props.domainId !== false}
              onViewportChanged={() => {}}
              mapConfigOverride={config.weathermaps.settings.mapOptionsOverride}
              tileLayerConfigOverride={
                config.weathermaps.settings.mapOptionsOverride
              }
              overlays={overlays}
            />
          </div>
        </section>
      </>
    );
  }
}
export default injectIntl(observer(StationMap));
