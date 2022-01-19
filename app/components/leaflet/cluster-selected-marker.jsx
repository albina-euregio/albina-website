import React, { useEffect } from "react"; // eslint-disable-line no-unused-vars
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import CircleIcon from "./circle-icon";

const ClusterSelectedMarker = props => {
  useEffect(() => {
    const icon = L.divIcon({
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
