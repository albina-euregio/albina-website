import React from "react";

const iconSVGS = {
  "directionArrow-centered":
    "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0 9 4.5z",
  "directionArrow-combined":
    "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0z",
  windArrow:
    "M13 1 L26 10 Q26 11 25 11 L20 11 L20 27 Q20 28 19 28 L7 28 Q6 28 6 27 L6 11 L1 11 Q0 11 0 10 L13 1 Z"
};

interface Props {
  type: string;
  value: string | "" | "-";
  itemId: "any" | string;
  dataType?: "forecast" | "analyse" | string;
  color: string | [number, number, number];
  direction?: number;
}

export default function StationIcon(props: Props) {
  const fill =
    typeof props.color === "string"
      ? props.color
      : Array.isArray(props.color)
        ? `rgb(${props.color[0]}, ${props.color[1]}, ${props.color[2]})`
        : "black";

  if (
    ["VW", "VW_MAX"].includes(props.itemId) &&
    typeof props.direction === "number"
  ) {
    // shouldShowWindArrow
    return (
      <div className={props.type}>
        <svg
          style={{
            position: "absolute",
            transform: `rotate(${props.direction + 180}deg)`
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
            {props.value}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={props.type}>
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
          strokeDasharray={props.dataType === "forecast" ? 1.3675 : undefined}
          fill={fill || "#fff"}
        />
        <text x={"50%"} y={"52%"} dominantBaseline="middle" textAnchor="middle">
          {props.value}
        </text>
      </svg>
    </div>
  );
}
