import React from "react";
import { observer, inject } from "mobx-react";
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
    // this.state = {
    //   title,
    //   headerText: "",
    //   //selectedFeature: null
    // };

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

  componentDidUpdate() {}

  onMarkerSelected(feature) {
    //console.log("StationMap->onMarkerSelected ggg ", feature);
    if (feature && feature.id) {
      window["modalStateStore"].setData({
        stationData: window.stationDataStore.data.find(
          point => point.id == feature.id
        )
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
        itemId="any"
        item={item}
        features={window.stationDataStore.data}
      />
    ];
    return (
      <>
        {/* <HTMLHeader title={this.state.title} /> */}
        {/* <PageHeadline
          title={this.state.title}
          marginal={this.state.headerText}
        /> */}
        <section
          id="section-weather-map"
          className="section section-weather-map"
        >
          <div className="section-map">
            <LeafletMap
              loaded={this.props.domainId !== false}
              onViewportChanged={() => {}}
              overlays={overlays}
              onInit={map => {
                map.on("click", () => this.onMarkerSelected(), this);
              }}
            />
          </div>
        </section>
        {/* <SmShare /> */}
      </>
    );
  }
}
export default inject("locale")(injectIntl(observer(StationMap)));
