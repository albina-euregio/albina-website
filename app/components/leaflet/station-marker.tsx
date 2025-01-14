import React, { useMemo } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import StationIcon from "./station-icon";

interface Props<T = unknown> {
  coordinates: L.LatLngExpression;
  data: T;
  stationName: string;
  tooltip?: string;
  onClick: (data: T) => void;
  itemId: "any" | string;
  type: string;
  color: string;
  dataType: "forcast" | "analyse" | string;
  selected: boolean;
  value: number | "";
  direction?: number;
  iconAnchor?: L.PointExpression;
  className: string;
}

const StationMarker = (props: Props<unknown>): React.ReactNode => {
  const stationIcon = useMemo(() => {
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
    return divIcon;
  }, [
    props.className,
    props.color,
    props.dataType,
    props.direction,
    props.iconAnchor,
    props.itemId,
    props.selected,
    props.type,
    props.value
  ]);

  return (
    <Marker
      position={props.coordinates}
      title={props.stationName}
      icon={stationIcon}
      eventHandlers={
        props.onClick && {
          click: e => {
            L.DomEvent.stopPropagation(e);
            props.onClick(e.target.options.data);
          }
        }
      }
    >
      {props.tooltip && <Tooltip>{props.tooltip}</Tooltip>}
    </Marker>
  );
};

export default StationMarker;
