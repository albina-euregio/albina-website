// https://github.com/yuzhva/react-leaflet-markercluster/blob/3c0c77fa5af123b2c8014c5f26ba49b34dd26cf0/src/react-leaflet-markercluster.js
// https://github.com/yuzhva/react-leaflet-markercluster/pull/194

// https://github.com/yuzhva/react-leaflet-markercluster/blob/3c0c77fa5af123b2c8014c5f26ba49b34dd26cf0/LICENSE
// MIT License
// Copyright (c) 2017 Yevhen Uzhva
import type React from "react";
import L from "leaflet";
import {
  createPathComponent,
  extendContext,
  type EventedProps,
  type LeafletContextInterface
} from "@react-leaflet/core";
import "leaflet.markercluster";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createMarkerCluster(
  {
    children: _c,
    eventHandlers,
    ...props
  }: L.MarkerClusterGroupOptions & EventedProps & { children: React.ReactNode },
  context: LeafletContextInterface
) {
  const instance = new L.MarkerClusterGroup(props);
  instance.on(eventHandlers ?? {});
  return {
    instance,
    context: extendContext(context, { layerContainer: instance })
  };
}

const MarkerCluster = createPathComponent(createMarkerCluster);

export default MarkerCluster;
