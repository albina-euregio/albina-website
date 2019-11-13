import React from "react";
import PropTypes from "prop-types";
import { MapLayer } from "react-leaflet";
import L from "leaflet";

require("leaflet.markercluster");
require("leaflet.markercluster/dist/MarkerCluster.css");
require("../../util/placementstrategies");

class Cluster extends MapLayer {
  constructor(props) {
    super(props);
    this.activeCluster = null;
  }

  getActiveMarker = cluster => {
    const markers = cluster.getAllChildMarkers();
    const values = markers.map(marker => marker.options.data.value);

    const derivedValue =
      this.props.item.clusterOperation == "max"
        ? Math.max(...values)
        : Math.min(...values);

    return markers[values.indexOf(derivedValue)];
  };

  createClusterIcon = cluster => {
    const activeMarker = this.getActiveMarker(cluster);
    // reuse the marker's icon
    return activeMarker.options.icon;
  };

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

    markerclusters.on("click", e => {
      const markerId = e.layer.options.data.id;
      if (this.activeCluster) {
        const activeClusterMarker = this.activeCluster
          .getAllChildMarkers()
          .find(m => m.options.data.id == markerId);

        if (activeClusterMarker) {
          this.setPositionForActiveMarker(activeClusterMarker);
          this.props.onMarkerSelected(activeClusterMarker.options.data);
        } else {
          this.activeCluster.unspiderfy();
        }
      }
    });

    markerclusters.on("spiderfied", a => {
      const activeMarker = this.getActiveMarker(a.cluster);
      if (activeMarker) {
        this.setPositionForActiveMarker(activeMarker);
        this.props.onMarkerSelected(activeMarker.options.data);
      }
      this.activeCluster = a.cluster;
      this.props.spiderfiedMarkers(
        this.activeCluster.getAllChildMarkers().map(m => m.options.data.id)
      );
    });

    markerclusters.on("unspiderfied", () => {
      this.activeCluster = null;
      this.props.spiderfiedMarkers(null);
    });

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
