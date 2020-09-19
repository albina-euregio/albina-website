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
    console.log("StationMarker->createStationIcon jjj", this.props);
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

  updateLeafletElement() {
    //console.log("StationMarker->updateLeafletElement qqq !!!!", this.props.stationName,  this.props.value);
    this.layerContainer.removeLayer(this.leafletElement);
    this.leafletElement = this.createElement();
    this.layerContainer.addLayer(this.leafletElement);
  }

  createLeafletElement() {
    this.leafletElement = this.createElement();
    return this.leafletElement;
  }

  createElement() {
    console.log(
      "StationMarker->createElement jjj",
      this.props.stationName,
      this.props.value
    );
    const marker = L.marker(this.props.coordinates, {
      data: this.props.data,
      title: this.props.stationName,
      icon: this.createStationIcon()
    });

    marker.on("click", e => {
      L.DomEvent.stopPropagation(e);
      this.props.onClick(e.target.options.data);
    });

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
