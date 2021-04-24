import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import { modal_open_by_params } from "../js/modal";
import StationOverlay from "../components/weather/station-overlay";
import LeafletMap from "../components/leaflet/leaflet-map";
import StationDataStore from "../stores/stationDataStore";
import MapStore from "../stores/mapStore";

class StationMap extends React.Component {
  constructor(props) {
    super(props);
    this.onMarkerSelected = this.onMarkerSelected.bind(this);
    // const title = this.props.intl.formatMessage({
    //   id: "menu:lawis:station"
    // });
    this.state = {
      selectedFeature: null
    };

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

  onMarkerSelected(feature) {
    //console.log("StationMap->onMarkerSelected ggg2 ", feature);
    if (feature && feature.id) {
      window["modalStateStore"].setData({
        stationData: window.stationDataStore.data.sort((f1, f2) =>
          f1.properties["LWD-Region"].localeCompare(
            f2.properties["LWD-Region"],
            "de"
          )
        ),

        rowId: feature.id
      });
      modal_open_by_params(
        null,
        "inline",
        "#weatherStationDiagrams",
        "weatherStationDiagrams",
        true
      );
      //this.setState({ selectedFeature: null });
    } else {
      //this.setState({ selectedFeature: feature });
    }
  }

  render() {
    const item = {
      id: "name",
      colors: [[25, 171, 255]],
      thresholds: [],
      clusterOperation: "none"
    };
    const overlays = [
      <StationOverlay
        key={"stations"}
        onMarkerSelected={this.onMarkerSelected}
        selectedFeature={this.props.selectedFeature}
        itemId="any"
        item={item}
        features={window.stationDataStore.data}
      />
    ];
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
