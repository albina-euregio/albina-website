import React from "react";
import L from "leaflet";
import MarkerClusterGroup from "./react-leaflet-markercluster";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { Domain } from "../../../stores/weatherMapStore";

type Props = {
  spiderfiedMarkers: (markers: L.Marker[] | null) => void;
  tooltip?: boolean;
  item: Domain["item"];
  children: React.ReactNode;
};

const Cluster = (props: Props) => {
  let activeCluster: L.MarkerCluster | null = null;

  const onClick = (e: L.LeafletMouseEvent) => {
    if (e.layer.options?.data?.id) {
      const markerId = e.layer.options.data.id;
      if (activeCluster) {
        const activeClusterMarker = activeCluster
          .getAllChildMarkers()
          .find(m => m.options.data.id == markerId);

        if (activeClusterMarker) {
          setPositionForActiveMarker(activeClusterMarker);
        } else {
          activeCluster.unspiderfy();
        }
      }
    }
  };

  const onSpiderfied: L.SpiderfyEventHandlerFn = a => {
    const activeMarker = getActiveMarker(a.cluster);
    if (activeMarker) {
      setPositionForActiveMarker(activeMarker);
    }
    activeCluster = a.cluster;
    props.spiderfiedMarkers(
      activeCluster.getAllChildMarkers().map(m => m.options.data.id)
    );
  };

  const onUnspiderfied: L.SpiderfyEventHandlerFn = () => {
    activeCluster = null;
    props.spiderfiedMarkers(null);
  };

  const createClusterIcon: L.MarkerClusterGroupOptions["iconCreateFunction"] =
    cluster => {
      const activeMarker = getActiveMarker(cluster);

      if (props.tooltip) {
        cluster.bindTooltip(
          cluster
            .getAllChildMarkers()
            .map(marker => marker?.getTooltip?.()?.getContent?.())
            .join("<br>")
        );
      }
      return new L.DivIcon({
        ...activeMarker.options.icon.options,
        className: "leaflet-cluster-marker"
      });
    };

  const getActiveMarker = (cluster: L.MarkerCluster) => {
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

  const setPositionForActiveMarker = (marker: L.Marker) => {
    const activePos = this.leafletElement.getVisibleParent(marker);
    if (activePos) {
      this.props.onActiveMarkerPositionUpdate(activePos.getLatLng());
    }
  };

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
