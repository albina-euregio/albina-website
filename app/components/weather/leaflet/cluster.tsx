import React from "react"; // eslint-disable-line no-unused-vars
//import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import MarkerClusterGroup from "./react-leaflet-markercluster";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";

const Cluster = props => {
  //const context = useLeafletContext();
  let activeCluster = null;

  const onClick = e => {
    //console.log("ClusterItem->onclick", e);
    if (e.layer.options?.data?.id) {
      const markerId = e.layer.options.data.id;
      if (activeCluster) {
        const activeClusterMarker = activeCluster
          .getAllChildMarkers()
          .find(m => m.options.data.id == markerId);

        if (activeClusterMarker) {
          setPositionForActiveMarker(activeClusterMarker);
          // props.onMarkerSelected(activeClusterMarker.options.data);
        } else {
          activeCluster.unspiderfy();
        }
      }
    }
  };

  const onSpiderfied = a => {
    const activeMarker = getActiveMarker(a.cluster);
    if (activeMarker) {
      setPositionForActiveMarker(activeMarker);
    }
    activeCluster = a.cluster;
    props.spiderfiedMarkers(
      activeCluster.getAllChildMarkers().map(m => m.options.data.id)
    );
  };

  const onUnspiderfied = () => {
    activeCluster = null;
    props.spiderfiedMarkers(null);
  };

  const createClusterIcon = cluster => {
    const activeMarker = getActiveMarker(cluster);
    // reuse the marker's icon
    if (props.tooltip) {
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
  };

  const getActiveMarker = cluster => {
    const markers = cluster.getAllChildMarkers();
    if (props.item.clusterOperation === "none") {
      return markers[0];
    }
    const values = markers.map(marker => marker.options.data.value);

    const derivedValue =
      props.item.clusterOperation == "max"
        ? Math.max(...values)
        : Math.min(...values);

    return markers[values.indexOf(derivedValue)];
  };

  const setPositionForActiveMarker = marker => {
    const activePos = this.leafletElement.getVisibleParent(marker);
    if (activePos) {
      this.props.onActiveMarkerPositionUpdate(activePos.getLatLng());
    }
  };

  //console.log("cluster->render");
  return (
    <MarkerClusterGroup
      maxClusterRadius="11"
      showCoverageOnHover={true}
      iconCreateFunction={createClusterIcon}
      onClick={onClick}
      onSpiderfied={onSpiderfied}
      onUnspiderfied={onUnspiderfied}
    >
      {props.children}
    </MarkerClusterGroup>
  );
};

export default Cluster;
