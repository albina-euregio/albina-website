import React from "react"; // eslint-disable-line no-unused-vars
import PropTypes from "prop-types";
import { MapLayer, TileLayer } from "react-leaflet";
import L from "leaflet";

require("./timeDimension/L.TimeDimension.Layer.ImageLayer.js");

class TimeDimensionLayerImageLayer extends MapLayer {
  constructor(props) {
    console.log("TimeDimensionLayerImageLayer->constructor", props);

    super(props);
  }

  createLeafletElement() {
    console.log(
      "TimeDimensionLayerImageLayer->createLeafletElement",
      this.getOptions(this.props)
    );
    const imageLayer = new TileLayer(this.props.options);

    this.leafletElement = imageLayer;

    return imageLayer;
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

TimeDimensionLayerImageLayer.childContextTypes = {
  layerContainer: PropTypes.object
};

TimeDimensionLayerImageLayer.propTypes = {
  children: PropTypes.node
};

export default TimeDimensionLayerImageLayer;
