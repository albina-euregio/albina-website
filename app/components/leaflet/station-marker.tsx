import React, { useMemo } from "react";
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

function getContrastTextColor(
  color: string | [number, number, number] | unknown
): string {
  let r = 0,
    g = 0,
    b = 0;

  if (typeof color === "string") {
    // Parse hex color
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else if (color.startsWith("rgb")) {
      // Parse rgb color
      const match = color.match(/\d+/g);
      if (match) {
        r = parseInt(match[0]);
        g = parseInt(match[1]);
        b = parseInt(match[2]);
      }
    }
  } else if (Array.isArray(color)) {
    r = color[0];
    g = color[1];
    b = color[2];
  }

  // Calculate relative luminance using sRGB
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Use white text on dark backgrounds, black text on light backgrounds
  return luminance > 0.435 ? "#000" : "#fff";
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
  const icon = useMemo(() => {
    const fill =
      typeof color === "string"
        ? color
        : Array.isArray(color)
          ? `rgb(${color[0]}, ${color[1]}, ${color[2]})`
          : "black";

    // Calculate text color based on background brightness
    const textColor = getContrastTextColor(color);

    if (type === "grid") {
      if (direction === null || direction === undefined) {
        return new L.DivIcon({
          iconAnchor: iconAnchor || [12, 12],
          className: className,
          html: ``
        });
      }
      return new L.DivIcon({
        iconAnchor: iconAnchor || [12, 12],
        className: className,
        html: `
        <div class="${type}">
          <svg
            style="position: absolute; left: 6px; top: 6; transform: rotate(${direction + 180}deg)"
            height="12"
            viewBox="0 0 9 12"
            width="9"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="${iconSVGS["directionArrow-centered"]}"
              fill-rule="evenodd"
              stroke="#000"
              stroke-width="0.6"
              stroke-linejoin="round"
              stroke-linecap="round"
            />
          </svg>
        </div>
        `
      });
    }

    if (["VW", "VW_MAX"].includes(itemId) && typeof direction === "number") {
      return new L.DivIcon({
        iconAnchor: iconAnchor || [12.5, 12.5],
        className: className,
        html: `
        <div class="${type}">
          <svg
            style="position: absolute; transform: rotate(${direction + 180}deg)"
            height="28"
            viewBox="0 0 28 28"
            width="28"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="${iconSVGS["windArrow"]}"
              fill="${fill}"
              stroke="#000"
              stroke-width="1.0"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            style="position: absolute"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="60%"
              y="62%"
              dominant-baseline="middle"
              text-anchor="middle"
              fill="${textColor}"
            >
              ${value}
            </text>
          </svg>
        </div>
       
        `
      });
    }

    return new L.DivIcon({
      iconAnchor: iconAnchor || [12.5, 12.5],
      className: className,
      html: `
      <div class=${type}>
        <svg
          style="position: absolute"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="11"
            cy="11"
            r="10.5"
            stroke="#000"
            stroke-width="1"
            stroke-dasharray="${dataType === "forecast" ? 1.3675 : undefined}"
            fill="${fill || "#fff"}"
          />
          <text
            x="50%"
            y="52%"
            dominant-baseline="middle"
            text-anchor="middle"
            fill="${textColor}"
          >
            ${value}
          </text>
        </svg>
      </div>`
    });
  }, [className, iconAnchor, color, dataType, direction, itemId, type, value]);

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
      </Marker>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coordinates, data, icon, tooltip, zIndexOffset]
  );

  return marker;
};

export default StationMarker;
