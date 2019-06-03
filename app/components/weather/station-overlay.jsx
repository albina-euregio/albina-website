import React from "react";
import Cluster from "../leaflet/cluster";
import StationMarker from "../leaflet/station-marker";

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
        direction={(this.props.item.direction && value >= 3.5) ? data.properties[this.props.item.direction] : false}
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
      <div>
        <Cluster
          item={this.props.item}
          >
          { points.map((point) =>
            this.renderMarker(point)
          )}>
        </Cluster>
        {this.props.selectedFeature &&
          this.renderMarker(points.find((point) => point.properties.id == this.props.selectedFeature.id))
        }
      </div>
    );
  }
}
