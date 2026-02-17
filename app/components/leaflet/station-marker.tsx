import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";

const iconSVGS = {
  "directionArrow-centered":
    "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0 9 4.5z",
  "directionArrow-combined":
    "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0z",
  windArrow:
    "M13 1 L26 10 Q26 11 25 11 L20 11 L20 27 Q20 28 19 28 L7 28 Q6 28 6 27 L6 11 L1 11 Q0 11 0 10 L13 1 Z"
};

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
  tooltip?: string;
  onClick?: (data: StationMarkerData) => void;
  itemId: "any" | string;
  type: string;
  color: string | [number, number, number] | unknown;
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
  tooltip,
  type,
  value
}: Props): React.ReactNode => {
  const stationIcon = useMemo(() => {
    const fill =
      typeof color === "string"
        ? color
        : Array.isArray(color)
          ? `rgb(${color[0]}, ${color[1]}, ${color[2]})`
          : "black";

    if (["VW", "VW_MAX"].includes(itemId) && typeof direction === "number") {
      // shouldShowWindArrow
      return (
        <div className={type}>
          <svg
            style={{
              position: "absolute",
              transform: `rotate(${direction + 180}deg)`
            }}
            height="28"
            viewBox="0 0 28 28"
            width="28"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={iconSVGS["windArrow"]}
              fill={fill}
              stroke="#000"
              strokeWidth="1.0"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            style={{ position: "absolute" }}
            width="22"
            height="22"
            viewBox="0 0 22 22"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x={"60%"}
              y={"62%"}
              dominantBaseline="middle"
              textAnchor="middle"
            >
              {value}
            </text>
          </svg>
        </div>
      );
    }

    return (
      <div className={type}>
        <svg
          style={{ position: "absolute" }}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={11}
            cy={11}
            r={10.5}
            stroke={"#000"}
            strokeWidth={1}
            strokeDasharray={dataType === "forecast" ? 1.3675 : undefined}
            fill={fill || "#fff"}
          />
          <text
            x={"50%"}
            y={"52%"}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {value}
          </text>
        </svg>
      </div>
    );
  }, [color, dataType, direction, itemId, type, value]);

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
    [coordinates, data, element, icon, stationIcon, tooltip, zIndexOffset]
  );

  return marker;
};

export default StationMarker;
