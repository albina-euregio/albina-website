import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import StationIcon from "./station-icon";

interface Props<T = unknown> {
  coordinates: L.LatLngExpression;
  data: T;
  stationName: string;
  tooltip?: string;
  onClick?: (data: T) => void;
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

const StationMarker = ({
  className,
  color,
  coordinates,
  data,
  dataType,
  direction,
  iconAnchor,
  itemId,
  onClick,
  selected,
  stationName,
  tooltip,
  type,
  value
}: Props<unknown>): React.ReactNode => {
  const stationIcon = useMemo(() => {
    return (
      <StationIcon
        itemId={itemId}
        type={type}
        color={color}
        dataType={dataType || "analyse"}
        selected={selected}
        value={isFinite(value) ? value : ""}
        direction={direction}
      />
    );
  }, [color, dataType, direction, itemId, selected, type, value]);

  const icon = useMemo(
    () =>
      L.divIcon({
        iconAnchor: iconAnchor || [12.5, 12.5],
        className: className
      }),
    [className, iconAnchor]
  );

  const element = useMemo(() => {
    const element = icon.createIcon();
    icon.createIcon = () => element;
    return element;
  }, [icon]);

  return (
    <Marker
      data={data}
      position={coordinates}
      title={stationName}
      icon={icon}
      eventHandlers={
        onClick && {
          click: e => {
            L.DomEvent.stopPropagation(e);
            onClick(e.target.options.data);
          }
        }
      }
    >
      {tooltip && <Tooltip>{tooltip}</Tooltip>}
      {createPortal(stationIcon, element)}
    </Marker>
  );
};

export default StationMarker;
