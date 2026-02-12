import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import StationIcon from "./station-icon";

export interface StationMarkerData {
  id: string;
  name: string;
  detail: string;
  operator?: string;
  plainName?: string;
  value: string | "" | "-";
  plot?: string;
}

interface Props {
  coordinates: L.LatLngExpression;
  data: StationMarkerData;
  stationName: string;
  tooltip?: string;
  onClick?: (data: StationMarkerData) => void;
  itemId: "any" | string;
  type: string;
  color: string;
  dataType: "forecast" | "analyse" | string;
  selected: boolean;
  value: string | "" | "-";
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
}: Props): React.ReactNode => {
  const stationIcon = useMemo(() => {
    return (
      <StationIcon
        itemId={itemId}
        type={type}
        color={color}
        dataType={dataType || "analyse"}
        selected={selected}
        value={value}
        direction={direction}
      />
    );
  }, [color, dataType, direction, itemId, selected, type, value]);

  const icon = useMemo(
    () =>
      new L.DivIcon({
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

  // Markers with values should render above markers without values
  const zIndexOffset = useMemo(() => {
    if (value === "" || value === "-") {
      return 0; // Markers without values at base level
    }
    return 1000; // Markers with values on top
  }, [value]);

  const marker = useMemo(
    () => (
      <Marker
        position={coordinates}
        title={stationName}
        icon={icon}
        zIndexOffset={zIndexOffset}
        eventHandlers={
          onClick && {
            click: e => {
              L.DomEvent.stopPropagation(e);
              onClick(data);
            }
          }
        }
      >
        {tooltip && <Tooltip>{tooltip}</Tooltip>}
        {createPortal(stationIcon, element)}
      </Marker>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      coordinates,
      data,
      element,
      icon,
      stationIcon,
      stationName,
      tooltip,
      zIndexOffset
    ]
  );

  return marker;
};

export default StationMarker;
