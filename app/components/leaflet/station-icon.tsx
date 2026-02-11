import React from "react";
const iconSVGS = {
  "directionArrow-centered":
    "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0 9 4.5z",
  "directionArrow-combined":
    "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0z",
  windArrow:
    "M13 1 L26 10 Q26 11 25 11 L20 11 L20 27 Q20 28 19 28 L7 28 Q6 28 6 27 L6 11 L1 11 Q0 11 0 10 L13 1 Z",
  weatherStation:
    "M12 1.5 Q12.5 1 13 1.5 Q13 2 12.5 2.5 Q12 2.5 12 2 Q12 1.5 12 1.5 M12 2 v14 M6 7 q0-2 6-2 q6 0 6 2 M6 8 q0 3 -1.5 3 a1.5 1.5 0 0 1 0 -3 a1.5 1.5 0 0 0 1.5 0 M18 8 q0 3 1.5 3 a1.5 1.5 0 0 0 0 -3 a1.5 1.5 0 0 1 -1.5 0 M10 19 h4 v3.5 h-4 z"
};

interface Props {
  type: string;
  value: number | "" | "-";
  itemId: "any" | string;
  dataType?: "forcast" | "analyse" | string;
  color: string | [number, number, number];
  selected?: boolean;
  direction?: number;
  useWeatherStationIcon?: boolean;
}

export default class StationIcon extends React.Component<Props> {
  RGBToHex(color: [number, number, number]) {
    //console.log("RGBToHex", color);
    let r = color[0].toString(16);
    let g = color[1].toString(16);
    let b = color[2].toString(16);

    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;

    return "#" + r + g + b;
  }

  getCircle(type: Props["dataType"], color: "string") {
    const analyseStrokeColor = type === "forcast" ? color : "#000";
    if (["forcast", "analyse"].includes(type))
      return (
        <svg
          style={{ position: "absolute", left: "0px", top: "0px" }}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="11"
            cy="11"
            r="10.5"
            style={{
              stroke: analyseStrokeColor,
              strokeWidth: 1,
              fill: color || "#fff"
            }}
          />
          {this.props.type === "station" && (
            <circle
              className="station-icon-cluster-circle"
              cx="11"
              cy="11"
              r="8"
              style={{
                stroke: analyseStrokeColor,
                strokeWidth: 1,
                strokeDasharray: 1.3675,
                fill: color || "#fff"
              }}
            />
          )}
          {type === "forcast" && (
            <circle
              cx="11"
              cy="11"
              r="10.5"
              style={{
                stroke: "#000000",
                strokeWidth: 1,
                strokeDasharray: 1.3675,
                fill: "none"
              }}
            />
          )}
        </svg>
      );
  }

  getWeatherStationIcon(color: string) {
    return (
      <svg
        style={{ position: "absolute", left: "0px", top: "0px" }}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="6"
          fill={color}
          stroke="#000000"
          strokeWidth="1"
        />
      </svg>
    );
  }

  getWindArrow(direction: Props["direction"], color: string) {
    const style = {
      position: "absolute",
      transform: "rotate(" + direction + "deg)"
    };

    return (
      <svg
        style={style}
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

  getText(text: string, showCircle: boolean) {
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

  render() {
    const fill =
      typeof this.props.color === "string"
        ? this.props.color
        : Array.isArray(this.props.color)
          ? this.RGBToHex(this.props.color)
          : "black";

    const isWindParameter = ["VW", "VW_MAX"].includes(this.props.itemId);
    const shouldShowWindArrow =
      isWindParameter && typeof this.props.direction === "number";

    // Use weather station icon only when explicitly requested
    const shouldShowWeatherStationIcon =
      this.props.useWeatherStationIcon &&
      this.props.type === "station" &&
      !shouldShowWindArrow;

    //console.log("StationIcon->render kkk", this.showCircle(), this.props);
    return (
      <div
        className={
          this.props.type +
          (this.props.selected ? " " + this.props.type + "-selected" : "")
        }
      >
        {!shouldShowWeatherStationIcon &&
          !shouldShowWindArrow &&
          this.getCircle(this.props.dataType, fill)}

        {shouldShowWeatherStationIcon && this.getWeatherStationIcon(fill)}

        {shouldShowWindArrow &&
          this.getWindArrow(this.props.direction + 180, fill)}

        {this.getText(
          (this.props.value ?? "").toString(),
          !shouldShowWeatherStationIcon
        )}
      </div>
    );
  }
}
