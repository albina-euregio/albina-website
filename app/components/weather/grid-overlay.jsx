import React from "react";
import { FeatureGroup } from "react-leaflet";
import StationMarker from "../leaflet/station-marker";

class GridOverlay extends React.Component {
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

  renderMarker(data, key) {
    const value = data.properties[this.props.item.id];
    const coordinates = [data.geometry.coordinates[1], data.geometry.coordinates[0]];

    return (
      <StationMarker
        type="gridpoint"
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
            detail: value + " " + this.props.item.units
          });
        }} />
    );
  }

  render() {
    const gridPoints = this.props.grid.features
      .filter(point => point.properties.zoom <= this.props.zoom);

    return (
      <FeatureGroup>
        { gridPoints.map((point, i) =>
          this.renderMarker(point, i)
        )}>
      </FeatureGroup>
    );
  }
}

export default GridOverlay;
