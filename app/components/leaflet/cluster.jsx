import PropTypes from "prop-types";
import { MapLayer } from "react-leaflet";
import L from "leaflet";

import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";

class Cluster extends MapLayer {
  constructor(props) {
    super(props);
    this.activeCluster = null;
  }

  getActiveMarker(cluster) {
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
  }

  createClusterIcon(cluster) {
    const activeMarker = this.getActiveMarker(cluster);
    // reuse the marker's icon
    if (this.props.tooltip) {
      cluster.bindTooltip(
        cluster
          .getAllChildMarkers()
          .map(marker => marker?.getTooltip?.()?.getContent?.())
          .join("<br>")
      );
    }
    return L.divIcon({
      ...activeMarker.options.icon.options,
      className: "leaflet-cluster-marker"
    });
  }

  createLeafletElement() {
    const markerclusters = new L.markerClusterGroup({
      maxClusterRadius: 11,
      showCoverageOnHover: false,
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
          // this.props.onMarkerSelected(activeClusterMarker.options.data);
        } else {
          this.activeCluster.unspiderfy();
        }
      }
    });

    markerclusters.on("spiderfied", a => {
      const activeMarker = this.getActiveMarker(a.cluster);
      if (activeMarker) {
        this.setPositionForActiveMarker(activeMarker);
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
