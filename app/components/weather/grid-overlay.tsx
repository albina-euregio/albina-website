import React from "react";
import { FeatureGroup } from "react-leaflet";
import StationMarker from "./station-marker";
import { Domain } from "../../stores/weatherMapStore";

interface Props {
  item: Domain["item"];
  grid: GeoJSON.FeatureCollection<GeoJSON.Point>;
  zoom?: number;
}

class GridOverlay extends React.Component<Props> {
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

  renderMarker(data: GeoJSON.Feature<GeoJSON.Point>) {
    const value = Math.round(data.properties[this.props.item.id]);
    const coordinates: [number, number] = [
      data.geometry.coordinates[1],
      data.geometry.coordinates[0]
    ];

    return (
      <StationMarker
        type="gridpoint"
        key={data.properties.id}
        coordinates={coordinates}
        id={data.properties.id}
        value={value}
        color={this.getColor(value)}
        direction={
          this.props.item.direction && value >= 3.5
            ? data.properties[this.props.item.direction]
            : false
        }
      />
    );
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
