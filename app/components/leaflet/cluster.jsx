import React from "react";
import ReactDOMServer from "react-dom/server";
import PropTypes from 'prop-types';
import { MapLayer, withLeaflet } from "react-leaflet";
import DivIcon from "react-leaflet-div-icon";
import L from "leaflet";
import StationIcon from "./station-icon";

require("leaflet.markercluster");
require("leaflet.markercluster.placementstrategies");
require("leaflet.markercluster/dist/MarkerCluster.css");

class Cluster extends MapLayer {
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

  createClusterIcon(cluster) {
    const markers = cluster.getAllChildMarkers();
    const values = markers.filter((marker) =>
      (typeof marker.options.icon.options.children === 'object')
    ).map((marker) =>
      marker.options.icon.options.children.props.value
    ).filter((v) =>
      (typeof v === 'number' && isFinite(v))
    );

    const derivedValue =
      (this.props.item.clusterOperation == 'max')
      ? Math.max(...values)
      : Math.min(...values);

    return L.divIcon({
      iconAnchor: [25,25],
      html:
        ReactDOMServer.renderToStaticMarkup(
          <StationIcon
            type="station"
            value={derivedValue}
            color={this.getColor(derivedValue)}
            selected={false}
            />
         )
    });
  }

  createLeafletElement() {
    const markerclusters = new L.markerClusterGroup({
          maxClusterRadius: 40,
          spiderfyDistanceSurplus: 50,
          spiderfyDistanceMultiplier: 2,
          elementsPlacementStrategy: "clock",
          helpingCircles: true,
          spiderfyDistanceSurplus: 50,
          spiderfyDistanceMultiplier: 2,
          elementsMultiplier: 1.4,
          firstCircleElements: 8,
          showCoverageOnHover: false,
          spiderLegPolylineOptions: { weight: 0 },
          clockHelpingCircleOptions: {
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0,
            color: "rgb(50, 50, 50)",
            fill: "black",
            dashArray: "5 5"
          },
          iconCreateFunction: this.createClusterIcon.bind(this)
    });

    this.leafletElement = markerclusters;

    return markerclusters;
  }

  getLeafletElement() {
    return this.leafletElement;
  }

  // react-leaflet custom-component methods
  // https://react-leaflet.js.org/docs/en/custom-components.html
  getChildContext() {
    return {
      layerContainer: this.leafletElement,
    };
  }
}

Cluster.childContextTypes = {
  layerContainer: PropTypes.object
};

Cluster.propTypes = {
  // List of react-leaflet markers
  children: PropTypes.node,
  // // All available options for Leaflet.markercluster
  // options: PropTypes.object,
  // // All available options for Leaflet.Marker
  // markerOptions: PropTypes.object,
  // // Options that are supporting by react-leaflet-markercluster wrapper
  // wrapperOptions: PropTypes.object,
  // // Events
  // onMarkerClick: PropTypes.func,
  // onClusterClick: PropTypes.func,
  // onPopupClose: PropTypes.func,
};


export default Cluster;
