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
  value?: number;
  plot?: string;
}

declare module "leaflet" {
  interface DivIconOptions {
    data: StationMarkerData;
  }
  interface MarkerOptions {
    data: StationMarkerData;
    $tooltip: string | undefined;
    $stationIcon: React.ReactElement<unknown, typeof StationIcon>;
  }
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
}: Props): React.ReactNode => {
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
      new L.DivIcon({
        data,
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

  const marker = useMemo(
    () => (
      <Marker
        data={data}
        $tooltip={tooltip}
        $stationIcon={stationIcon}
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
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coordinates, data, element, icon, stationIcon, stationName, tooltip]
  );

  return marker;
};

export default StationMarker;
