import React from "react"; // eslint-disable-line no-unused-vars
import PropTypes from "prop-types";
import { MapLayer } from "react-leaflet";
import L from "leaflet";

require("leaflet.markercluster");
require("leaflet.markercluster/dist/MarkerCluster.css");

class Cluster extends MapLayer {
  constructor(props) {
    super(props);
    this.activeCluster = null;
  }

  /**
   * @param {L.MarkerCluster} cluster
   * @returns {L.Marker}
   */
  getActiveMarker = cluster => {
    const markers = cluster.getAllChildMarkers();
    if (this.props.item.clusterOperation === "none") {
      return markers[0];
    }
    const values = markers.map(marker => marker.options.data.value);

    const derivedValue = this.props.item.clusterOperation == "max" ? Math.max(...values) : Math.min(...values);

    return markers[values.indexOf(derivedValue)];
  };

  createClusterIcon = cluster => {
    const activeMarker = this.getActiveMarker(cluster);
    // reuse the marker's icon
    return L.divIcon({
      ...activeMarker.options.icon.options,
      className: "leaflet-cluster-marker tooltip"
    });
  };

  createLeafletElement() {
    const markerclusters = new L.markerClusterGroup({
      maxClusterRadius: 40,
      elementsMultiplier: 1.4,
      firstCircleElements: 8,
      showCoverageOnHover: false,
      spiderLegPolylineOptions: { weight: 0 },
      iconCreateFunction: this.createClusterIcon.bind(this)
    });

    markerclusters.on("spiderfied", () => this.props.spiderfiedMarkers());

    this.leafletElement = markerclusters;

    return markerclusters;
  }

  setPositionForActiveMarker(marker) {
    const activePos = this.leafletElement.getVisibleParent(marker);
    if (activePos) {
      this.props.onActiveMarkerPositionUpdate(activePos.getLatLng());
    }
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

Cluster.childContextTypes = {
  layerContainer: PropTypes.object
};

Cluster.propTypes = {
  children: PropTypes.node
};

export default Cluster;
