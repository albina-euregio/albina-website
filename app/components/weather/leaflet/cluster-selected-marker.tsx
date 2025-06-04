import React, { useEffect } from "react";
import L from "leaflet";
import { useLeafletContext } from "@react-leaflet/core";
import ReactDOMServer from "react-dom/server";
import CircleIcon from "./circle-icon";

const ClusterSelectedMarker = () => {
  const context = useLeafletContext();

  useEffect(() => {
    const icon = new L.DivIcon({
      iconAnchor: [12.5, 12.5],
      html: ReactDOMServer.renderToStaticMarkup(
        <CircleIcon className="station-selected-clustered" />
      )
    });

    const marker = new L.Marker(this.props.coordinates, {
      icon: icon
    });
    const container = context.layerContainer || context.map;

    container.addLayer(marker);

    return () => {
      container.removeLayer(marker);
    };
  });
};
export default ClusterSelectedMarker;
