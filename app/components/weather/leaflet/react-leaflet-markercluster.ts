// https://github.com/yuzhva/react-leaflet-markercluster/blob/3c0c77fa5af123b2c8014c5f26ba49b34dd26cf0/src/react-leaflet-markercluster.js
// https://github.com/yuzhva/react-leaflet-markercluster/pull/194

// https://github.com/yuzhva/react-leaflet-markercluster/blob/3c0c77fa5af123b2c8014c5f26ba49b34dd26cf0/LICENSE
// MIT License
// Copyright (c) 2017 Yevhen Uzhva
import type React from "react";
import L from "leaflet";
import {
  createPathComponent,
  type LeafletContextInterface
} from "@react-leaflet/core";
import "leaflet.markercluster";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createMarkerCluster(
  {
    children: _c,
    ...props
  }: L.MarkerClusterGroupOptions & { children: React.ReactNode },
  context: LeafletContextInterface
) {
  const clusterProps = {};
  const clusterEvents = {};
  // Splitting props and events to different objects
  Object.entries(props).forEach(([propName, prop]) =>
    propName.startsWith("on")
      ? (clusterEvents[propName] = prop)
      : (clusterProps[propName] = prop)
  );
  const instance = new L.MarkerClusterGroup(clusterProps);

  // Initializing event listeners
  Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
    const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
    instance.on(clusterEvent, callback);
  });
  return {
    instance,
    context: {
      ...context,
      layerContainer: instance
    }
  };
}

const MarkerCluster = createPathComponent(createMarkerCluster);

export default MarkerCluster;
