import React from "react";
import { FeatureGroup } from "react-leaflet";
import StationMarker from "../leaflet/station-marker";

class GridOverlay extends React.Component {
  constructor(props) {
    super(props);
    if (props.onLoading) props.onLoading();
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

  renderMarker(data) {
    const value = Math.round(data.properties[this.props.item.id]);
    const coordinates = [
      data.geometry.coordinates[1],
      data.geometry.coordinates[0]
    ];
    const markerData = {
      id: data.properties.id,
      name: data.properties.name,
      detail: value + " " + this.props.item.units
    };

    return (
      <StationMarker
        type="gridpoint"
        key={data.properties.id}
        coordinates={coordinates}
        data={markerData}
        value={value}
        color={this.getColor(value)}
        direction={
          this.props.item.direction && value >= 3.5
            ? data.properties[this.props.item.direction]
            : false
        }
        onClick={() => {}}
      />
    );
  }
  componentDidUpdate() {
    if (this.props.onLoad) this.props.onLoad();
  }
  render() {
    const gridPoints = this.props.grid.features
      .filter(point => point.properties[this.props.item.id] !== false)
      .filter(point => point.properties.zoom <= this.props.zoom);

    return (
      <div>
        <FeatureGroup key={this.props.item.id + "-" + this.props.zoom}>
          {gridPoints.map(point => this.renderMarker(point))}
        </FeatureGroup>
      </div>
    );
  }
}

export default GridOverlay;
