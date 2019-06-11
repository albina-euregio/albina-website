import React from "react";
import { MapLayer } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import CircleIcon from "./circle-icon";

export default class ClusterSelectedMarker extends MapLayer {
  constructor(props) {
    super(props);
  }

  createLeafletElement() {
    const icon = L.divIcon({
      iconAnchor: [11.5, 11.5],
      html: ReactDOMServer.renderToStaticMarkup(<CircleIcon className="station-selected-clustered"/>)
    });

    return L.marker(this.props.coordinates, {
      icon: icon
    });
  }
}
