import React, { useEffect } from "react"; // eslint-disable-line no-unused-vars
import L from "leaflet";
import { useLeafletContext } from "@react-leaflet/core";
import ReactDOMServer from "react-dom/server";
import CircleIcon from "./circle-icon";

// eslint-disable-next-line no-unused-vars
const ClusterSelectedMarker = props => {
  const context = useLeafletContext();

  useEffect(() => {
    const icon = new L.DivIcon({
      iconAnchor: [12.5, 12.5],
      html: ReactDOMServer.renderToStaticMarkup(
        <CircleIcon className="station-selected-clustered" />
      )
    });

    const marker = L.marker(this.props.coordinates, {
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
