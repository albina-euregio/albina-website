import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import { modal_open_by_params } from "../js/modal";
import StationOverlay from "../components/weather/station-overlay";
import LeafletMap from "../components/leaflet/leaflet-map";
import StationDataStore from "../stores/stationDataStore";
import MapStore from "../stores/mapStore";

import BeobachterAT from "../stores/Beobachter-AT.json";
import BeobachterIT from "../stores/Beobachter-IT.json";
const observers = [...BeobachterAT, ...BeobachterIT].map(observer => ({
  geometry: {
    coordinates: [+observer.longitude, +observer.latitude]
  },
  name: observer.name,
  id: "observer-" + observer["plot.id"],
  plot: observer["plot.id"]
}));

class StationMap extends React.Component {
  constructor(props) {
    super(props);
    if (!window.mapStore) {
      window.mapStore = new MapStore();
    }
    if (!window.stationDataStore) {
      window.stationDataStore = new StationDataStore();
    }
  }

  componentDidMount() {
    window.stationDataStore.load("");
  }

  onMarkerSelected(stationData, feature) {
    if (feature && feature.id) {
      window["modalStateStore"].setData({
        stationData,
        rowId: feature.id
      });
      modal_open_by_params(
        null,
        "inline",
        "#weatherStationDiagrams",
        "weatherStationDiagrams",
        true
      );
    }
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
        onMarkerSelected={this.onMarkerSelected.bind(
          this,
          window.stationDataStore.data.sort((f1, f2) =>
            (f1.properties["LWD-Region"] || "").localeCompare(
              (f2.properties["LWD-Region"] || ""),
              "de"
            )
          )
        )}
        itemId="any"
        item={item}
        features={window.stationDataStore.data}
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
        onMarkerSelected={this.onMarkerSelected.bind(this, observers)}
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
              onInit={map => {
                map.on("click", () => this.onMarkerSelected(), this);
              }}
            />
          </div>
        </section>
      </>
    );
  }
}
export default injectIntl(observer(StationMap));
