import React from "react";
import Cluster from "../leaflet/cluster";
import StationMarker from "../leaflet/station-marker";
import ClusterSelectedMarker from "../leaflet/cluster-selected-marker";
import { tooltip_init } from "../../js/tooltip";

class StationOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spiderfiedMarkers: null, // id's of spiderfied markers
      activeMarkerPos: null // position of highlighted marker within a cluster
    };
    if (props.onLoading) props.onLoading();
  }

  getColor(value) {
    const v = parseFloat(value);
    const colors = Object.values(this.props.item.colors);
    //console.log("StationOverlay->getColor#1", value, this.props.item.colors);
    let color = colors[0];
    this.props.item.thresholds.forEach((tr, i) => {
      if (v > tr) {
        color = colors[i + 1];
      }
    });
    return color;
  }

  handleActiveMarkerPositionUpdate = pos => {
    //console.log("handleActiveMarkerPositionUpdate qqq3", pos);
    this.setState({ activeMarkerPos: pos });
  };

  handleSpiderfiedMarkers = list => {
    //console.log("handleSpiderfiedMarkers ggg3", list);
    if (Array.isArray(list) && list.length > 0) {
      this.setState({ spiderfiedMarkers: list });
    } else {
      this.setState({
        spiderfiedMarkers: null,
        activeMarkerPos: null
      });
    }
  };

  renderPositionMarker(data) {
    const coordinates = [
      data.geometry.coordinates[1],
      data.geometry.coordinates[0]
    ];
    return <ClusterSelectedMarker coordinates={coordinates} />;
  }

  renderMarker(data, pos = null) {
    if (
      (data.date === undefined || data[this.props.itemId] === undefined) &&
      this.props.itemId !== "any"
    )
      return;

    // console.log(
    //   "station-overlay->renderMarker aaa",
    //   this.props.itemId
    //   this.props.item.colors ||
    //     this.getColor(Math.round(data[this.props.itemId])),
    //   data,
    //   data[this.props.itemId]
    // );

    const value = Math.round(data[this.props.itemId]);
    const coordinates = pos
      ? [pos.lat, pos.lng]
      : [data.geometry.coordinates[1], data.geometry.coordinates[0]];
    const markerData = {
      id: data.id,
      name:
        data.name +
        " " +
        (data.region ? `(${data.region}) ` : "") +
        data.geometry.coordinates[2] +
        "m",
      detail: value + " " + this.props.item.units,
      operator: data.operator,
      plainName: data.name,
      value: value,
      plot: data.plot
    };
    // console.log(
    //   "station-overlay->renderMarker qqq",
    //   this.props.itemId + "-" + data.id
    // );
    return (
      <StationMarker
        type="station"
        key={this.props.itemId + "-" + data.id}
        itemId={this.props.itemId}
        data={markerData}
        stationId={data.id}
        stationName={data.name}
        className="tooltip"
        coordinates={coordinates}
        iconAnchor={[12.5, 12.5]}
        value={value}
        selected={
          this.props.selectedFeature && data.id == this.props.selectedFeature.id
        }
        color={this.getColor(value)}
        direction={
          this.props.item.direction && value >= 3.5
            ? data[this.props.item.direction]
            : false
        }
        onClick={data => {
          //console.log("onClick ggg2 #1", data.id, this.state.spiderfiedMarkers);
          if (data && data.id) {
            if (
              !this.state.spiderfiedMarkers ||
              this.state.spiderfiedMarkers.indexOf(data.id) < 0
            ) {
              // only handle click events for markers outside of cluster -
              // other markers will be handled by cluster's click-event-handler
              //console.log("onClick ggg2 #2", this.state.spiderfiedMarkers);
              this.handleSpiderfiedMarkers(null);
              //this.props.onMarkerSelected(data);
            }
          }
          if (data.id) this.props.onMarkerSelected(data);
        }}
      />
    );
  }

  init_tooltip() {
    window.setTimeout(() => {
      tooltip_init();
    }, 100);
  }

  componentDidMount() {
    //console.log("StationOverlay->componentDidMount ddd", this.props.onLoad);
    if (this.props.onLoad) this.props.onLoad();
    this.init_tooltip();
  }

  componentDidUpdate() {
    //console.log("StationOverlay->componentDidUpdate ggg", this.props.onLoad);
    if (this.props.onLoad) this.props.onLoad();
    this.init_tooltip();
  }

  render() {
    //let sPl = this.props.features ? this.props.features.find(feature => feature?.name == "Tannheim") : null;
    //console.log("station-overlay->render qq", this.props.selectedFeature?.id, sPl?.name, sPl?.properties.LT);
    //console.log("station-overlay->render aaa", this.props.selectedFeature, this.props.features);
    const points = this.props.features.filter(
      point => this.props.itemId === "any" || point[this.props.itemId] !== false
    );

    // const selectedFeature = this.props.selectedFeature
    //   ? points.find(point => point.id == this.props.selectedFeature.id)
    //   : null;

    //console.log("render qqq3", this.props, points);

    return (
      <div>
        <Cluster
          item={this.props.item}
          spiderfiedMarkers={this.handleSpiderfiedMarkers}
          onActiveMarkerPositionUpdate={this.handleActiveMarkerPositionUpdate}
          // onMarkerSelected={this.props.onMarkerSelected}
        >
          {points.map(point => this.renderMarker(point))}
        </Cluster>
        {/* {selectedFeature &&
          this.renderMarker(selectedFeature, this.state.activeMarkerPos)} */}
        {/* {selectedFeature &&
          this.state.spiderfiedMarkers &&
          this.renderPositionMarker(selectedFeature)} */}
      </div>
    );
  }
}

export default StationOverlay;
