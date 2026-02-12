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
  selected?: boolean;
  direction?: number;
}

export default function StationIcon(props: Props) {
  function RGBToHex(color: [number, number, number]) {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  }

  function getCircle(type: Props["dataType"], color: string) {
    const analyseStrokeColor = type === "forecast" ? color : "#000";
    if (["forecast", "analyse"].includes(type))
      return (
        <svg
          style={{ position: "absolute", left: "0px", top: "0px" }}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={11}
            cy={11}
            r={10.5}
            stroke={analyseStrokeColor}
            strokeWidth={1}
            fill={color || "#fff"}
          />
          {props.type === "station" && (
            <circle
              className="station-icon-cluster-circle"
              cx={11}
              cy={11}
              r={8}
              stroke={analyseStrokeColor}
              strokeWidth={1}
              strokeDasharray={1.3675}
              fill={color || "#fff"}
            />
          )}
          {type === "forecast" && (
            <circle
              cx={11}
              cy={11}
              r={10.5}
              stroke={"#000000"}
              strokeWidth={1}
              strokeDasharray={1.3675}
              fill="none"
            />
          )}
        </svg>
      );
  }

  function getWindArrow(direction: Props["direction"], color: string) {
    return (
      <svg
        style={{
          position: "absolute",
          transform: `rotate(${direction}deg)`
        }}
        height="28"
        viewBox="0 0 28 28"
        width="28"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={iconSVGS["windArrow"]}
          fill={color}
          stroke="#000"
          strokeWidth="1.0"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  function getText(text: string, showCircle: boolean) {
    return (
      <svg
        style={{ position: "absolute", left: "0px", top: "0px" }}
        width="22"
        height="22"
        viewBox="0 0 22 22"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x={!showCircle ? "60%" : "50%"}
          y={!showCircle ? "62%" : "52%"}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {text}
        </text>
      </svg>
    );
  }

  const fill =
    typeof props.color === "string"
      ? props.color
      : Array.isArray(props.color)
        ? RGBToHex(props.color)
        : "black";

  const isWindParameter = ["VW", "VW_MAX"].includes(props.itemId);
  const shouldShowWindArrow =
    isWindParameter && typeof props.direction === "number";
  const shouldShowCircle = !shouldShowWindArrow;

  //console.log("StationIcon->render kkk", showCircle(), props);
  return (
    <div
      className={
        props.type + (props.selected ? " " + props.type + "-selected" : "")
      }
    >
      {shouldShowCircle && getCircle(props.dataType, fill)}

      {shouldShowWindArrow && getWindArrow(props.direction + 180, fill)}

      {getText(props.value, shouldShowCircle)}
    </div>
  );
}
