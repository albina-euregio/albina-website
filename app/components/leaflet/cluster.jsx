import React from "react";
import PropTypes from 'prop-types';
import { MapLayer } from "react-leaflet";
import L from "leaflet";

require("leaflet.markercluster");
require("leaflet.markercluster.placementstrategies");
require("leaflet.markercluster/dist/MarkerCluster.css");

class Cluster extends MapLayer {
  constructor(props) {
    super(props);
  }

  createClusterIcon(cluster) {
    const markers = cluster.getAllChildMarkers();
    const values = markers.map((marker) =>
      marker.options.data.value
    );

    const derivedValue =
      (this.props.item.clusterOperation == 'max')
      ? Math.max(...values)
      : Math.min(...values);

    const activeMarker = markers[values.indexOf(derivedValue)];

    // reuse the marker's icon
    return activeMarker.options.icon;
  }

  createLeafletElement(props) {
    const map = this.context.map;

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
