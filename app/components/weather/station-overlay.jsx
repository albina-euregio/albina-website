import React from "react";
import Cluster from "../leaflet/cluster";
import StationMarker from "../leaflet/station-marker";
import ClusterSelectedMarker from "../leaflet/cluster-selected-marker";

export default class StationOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spiderfiedMarkers: null, // id's of spiderfied markers
      activeMarkerPos: null // position of highlighted marker within a cluster
    };
  }

  getColor(value) {
    const v = parseFloat(value);
    const colors = Object.values(this.props.item.colors);

    let color = colors[0];
    this.props.item.thresholds.forEach((tr, i) => {
      if (v > tr) {
        color = colors[i + 1];
      }
    });

    return color;
  }

  handleActiveMarkerPositionUpdate = pos => {
    this.setState({ activeMarkerPos: pos });
  };

  handleSpiderfiedMarkers = list => {
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
    const value = Math.round(data[this.props.item.id]);
    const coordinates = pos
      ? [pos.lat, pos.lng]
      : [data.geometry.coordinates[1], data.geometry.coordinates[0]];
    const markerData = {
      id: data.id,
      name:
        data.name +
        " (" +
        data.region +
        ") " +
        data.geometry.coordinates[2] +
        "m",
      detail: value + " " + this.props.item.units,
      date: data.date,
      value: value
    };

    return (
      <StationMarker
        type="station"
        key={this.props.item.id + "-" + data.id}
        itemId={this.props.item.id}
        data={markerData}
        stationId={data.id}
        coordinates={coordinates}
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
          if (data && data.id) {
            if (
              !this.state.spiderfiedMarkers ||
              this.state.spiderfiedMarkers.indexOf(data.id) < 0
            ) {
              // only handle click events for markers outside of cluster -
              // other markers will be handled by cluster's click-event-handler
              this.handleSpiderfiedMarkers(null);
              this.props.onMarkerSelected(data);
            }
          } else {
            this.props.onMarkerSelected(null);
          }
        }}
      />
    );
  }

  render() {
    const points = this.props.features.filter(
      point => point[this.props.item.id] !== false
    );

    const selectedFeature = this.props.selectedFeature
      ? points.find(point => point.id == this.props.selectedFeature.id)
      : null;

    return (
      <div>
        <Cluster
          item={this.props.item}
          spiderfiedMarkers={this.handleSpiderfiedMarkers}
          onActiveMarkerPositionUpdate={this.handleActiveMarkerPositionUpdate}
          onMarkerSelected={this.props.onMarkerSelected}
        >
          {points.map(point => this.renderMarker(point))}>
        </Cluster>
        {selectedFeature &&
          this.renderMarker(selectedFeature, this.state.activeMarkerPos)}
        {selectedFeature &&
          this.state.spiderfiedMarkers &&
          this.renderPositionMarker(selectedFeature)}
      </div>
    );
  }
}
