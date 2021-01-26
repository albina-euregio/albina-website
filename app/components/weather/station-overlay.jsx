import React from "react";
import { Pane } from "react-leaflet";
import StationMarker from "../leaflet/station-marker";
import { tooltip_init } from "../../js/tooltip";

class StationOverlay extends React.Component {
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

  renderMarker(data, pos = null) {
    if (
      (data.date === undefined || data[this.props.itemId] === undefined) &&
      this.props.itemId !== "any"
    )
      return;

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
    if (this.props.onLoad) this.props.onLoad();
    this.init_tooltip();
  }

  componentDidUpdate() {
    if (this.props.onLoad) this.props.onLoad();
    this.init_tooltip();
  }

  render() {
    const points = this.props.features.filter(
      point => this.props.itemId === "any" || point[this.props.itemId] !== false
    );

    return <Pane>{points.map(point => this.renderMarker(point))}</Pane>;
  }
}

export default StationOverlay;
