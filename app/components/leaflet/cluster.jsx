import React from "react"; // eslint-disable-line no-unused-vars
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
    if (this.props.item.clusterOperation === "none") {
      return markers[0];
    }
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
    return L.divIcon({
      ...activeMarker.options.icon.options,
      className: "leaflet-cluster-marker tooltip"
    });
  };

  createLeafletElement() {
    const markerclusters = new L.markerClusterGroup({
      maxClusterRadius: 40,
      spiderfyDistanceSurplus: 50,
      spiderfyDistanceMultiplier: 2,
      elementsPlacementStrategy: "clock",
      helpingCircles: true,
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
      //console.log("clusterclick ggg2", e.layer.options.data.id);
      const markerId = e.layer.options.data.id;
      if (this.activeCluster) {
        const activeClusterMarker = this.activeCluster
          .getAllChildMarkers()
          .find(m => m.options.data.id == markerId);

        if (activeClusterMarker) {
          //console.log("clusterclick #2 ggg1", activeClusterMarker);
          this.setPositionForActiveMarker(activeClusterMarker);
          // this.props.onMarkerSelected(activeClusterMarker.options.data);
        } else {
          this.activeCluster.unspiderfy();
        }
      }
    });

    markerclusters.on("spiderfied", a => {
      //console.log("on spiderfied.on ggg", a, activeMarker);
      const activeMarker = this.getActiveMarker(a.cluster);
      if (activeMarker) {
        //console.log("on spiderfied.on #2 ggg", activeMarker);
        this.setPositionForActiveMarker(activeMarker);
      }
      this.activeCluster = a.cluster;
      this.props.spiderfiedMarkers(
        this.activeCluster.getAllChildMarkers().map(m => m.options.data.id)
      );
    });

    markerclusters.on("unspiderfied", () => {
      //console.log("on unspiderfied.on ggg");
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
