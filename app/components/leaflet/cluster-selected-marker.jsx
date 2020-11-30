import React from "react"; // eslint-disable-line no-unused-vars
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
      iconAnchor: [12.5, 12.5],
      html: ReactDOMServer.renderToStaticMarkup(
        <CircleIcon className="station-selected-clustered" />
      )
    });

    return L.marker(this.props.coordinates, {
      icon: icon
    });
  }
}