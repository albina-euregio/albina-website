import React from "react"; // eslint-disable-line no-unused-vars
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";
import StationIcon from "./station-icon";
import { MapLayer } from "react-leaflet";
import L from "leaflet";

class StationMarker extends MapLayer {
  constructor(props) {
    super(props);
  }

  createStationIcon() {
    const icon = (
      <StationIcon
        itemId={this.props.itemId}
        type={this.props.type}
        color={this.props.color}
        selected={this.props.selected}
        value={isFinite(this.props.value) ? this.props.value : ""}
        direction={this.props.direction}
      />
    );

    return L.divIcon({
      iconAnchor: [25, 25],
      html: ReactDOMServer.renderToStaticMarkup(icon)
    });
  }

  createLeafletElement() {
    const marker = L.marker(this.props.coordinates, {
      data: this.props.data,
      icon: this.createStationIcon()
    });

    marker.on("click", e => {
      L.DomEvent.stopPropagation(e);
      this.props.onClick(e.target.options.data);
    });

    this.leafletElement = marker;
    return marker;
  }

  getLeafletElement() {
    return this.leafletElement;
  }

  // react-leaflet custom-component methods
  // https://react-leaflet.js.org/docs/en/custom-components.html
  getChildContext() {
    return {
      layerContainer: this.leafletElement
    };
  }
}

StationMarker.childContextTypes = {
  layerContainer: PropTypes.object
};

export default StationMarker;
