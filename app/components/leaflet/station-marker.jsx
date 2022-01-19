import React, { useEffect } from "react"; // eslint-disable-line no-unused-vars
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import StationIcon from "./station-icon";

const StationMarker = props => {
  const context = useLeafletContext();

  useEffect(() => {
    const marker = L.marker(props.coordinates, {
      data: props.data,
      title: props.stationName,
      icon: createStationIcon(),
      bubblingMouseEvents: false
    });

    if (props.tooltip) {
      marker.bindTooltip(props.tooltip);
    }

    if (props.onClick)
      marker.on("click", e => {
        // console.log(
        //   "marker.on(click) ggg",
        //   props.onClick,
        //   e.target.options.data
        // );
        L.DomEvent.stopPropagation(e);

        props.onClick(e.target.options.data);
      });

    const container = context.layerContainer || context.map;

    container.addLayer(marker);

    return () => {
      container.removeLayer(marker);
    };
  });

  const createStationIcon = () => {
    //console.log("StationMarker->createStationIcon jjj", props);
    const icon = (
      <StationIcon
        itemId={props.itemId}
        type={props.type}
        color={props.color}
        dataType={props.dataType || "analyse"}
        selected={props.selected}
        value={isFinite(props.value) ? props.value : ""}
        direction={props.direction}
      />
    );
    const divIcon = L.divIcon({
      iconAnchor: props.iconAnchor || [12.5, 12.5],
      html: ReactDOMServer.renderToStaticMarkup(icon),
      className: props.className
    });
    //console.log("StationMarker->createStationIcon eee", divIcon);
    return divIcon;
  };

  return null;
};

export default StationMarker;
