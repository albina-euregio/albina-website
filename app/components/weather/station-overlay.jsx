import React from "react";
import MarkerClusterGroup from "react-leaflet-markercluster";
import StationMarker from "./station-marker";

require('react-leaflet-markercluster/dist/styles.min.css');

export default class StationOverlay extends React.Component {
  constructor(props) {
    super(props);
  }

  getColor(value) {
    const v = parseFloat(value);
    const colors = Object.values(this.props.item.colors);

    let color = colors[0];
    this.props.item.thresholds.forEach((tr, i) => {
      if(v > tr) {
        color = colors[i + 1];
      }
    });

    return color;
  }

  renderMarker(data) {
    const value = data.properties[this.props.item.id];
    const coordinates = [data.geometry.coordinates[1], data.geometry.coordinates[0]];

    return (
      <StationMarker
        type="station"
        key={data.properties.id}
        coordinates={coordinates}
        value={value}
        selected={
          this.props.selectedFeature && (data.properties.id == this.props.selectedFeature.id)
        }
        color={this.getColor(value)}
        onClick={(e) => {
          this.props.onMarkerSelected({
            id: data.properties.id,
            name: data.properties.name,
            detail: value + " " + this.props.item.units,
            date: data.properties.date
          });
        }} />
    );
  }

  render() {
    const points = this.props.features
      .filter(point => point.properties[this.props.item.id] !== false);

    return (
      <MarkerClusterGroup
        maxClusterRadius={40}
        spiderfyDistanceSurplus={50}
        spiderfyDistanceMultiplier={2}
        elementsPlacementStrategy="clock"
        helpingCircles={true}
        spiderfyDistanceSurplus={50}
        spiderfyDistanceMultiplier={2}
        elementsMultiplier={1.4}
        firstCircleElements={8}
        showCoverageOnHover={false}
        spiderLegPolylineOptions={{weight: 0}}
        clockHelpingCircleOptions={{
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0,
          color: "rgb(50, 50, 50)",
          fill: "black",
          dashArray: "5 5"
        }}>
        { points.map((point) =>
          this.renderMarker(point)
        )}>
      </MarkerClusterGroup>
    );
  }
}
