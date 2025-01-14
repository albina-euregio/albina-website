import React, { useMemo } from "react";
import { Tooltip } from "react-leaflet";
import L from "leaflet";
import StationIcon from "./station-icon";
import { Marker } from "@adamscybot/react-leaflet-component-marker";

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
    return (
      <StationIcon
        itemId={props.itemId}
        type={props.type}
        color={props.color}
        dataType={props.dataType || "analyse"}
        selected={props.selected}
        value={isFinite(props.value) ? props.value : ""}
        direction={props.direction}
        iconAnchor={props.iconAnchor || [12.5, 12.5]}
        className={props.className}
      />
    );
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
