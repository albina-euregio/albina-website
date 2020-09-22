import React from "react";
const iconSVGS = {
  directionArrow: "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0z"
};
export default class StationIcon extends React.Component {
  RGBToHex(color) {
    let r = color[0].toString(16);
    let g = color[1].toString(16);
    let b = color[2].toString(16);

    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;

    return "#" + r + g + b;
  }

  getCircle(type, color) {
    let analyseStrokeColor = type === "forcast" ? color : "#000";
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

  getdirection(name, direction) {
    return (
      <svg
        transform={"rotate(" + direction + ")"}
        style={{ position: "absolute", left: "6.5px", top: "-11px" }}
        height="42"
        viewBox="0 0 9 42"
        width="9"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={iconSVGS[name]} fillRule="evenodd" />
      </svg>
    );
  }

  getText(text, size) {
    return (
      <svg
        style={{ position: "absolute", left: "0px", top: "0px" }}
        width="22"
        height="22"
        viewBox="0 0 22 22"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          fontSize="12"
          x="50%"
          y="52%"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {text}
        </text>
      </svg>
    );
  }

  render() {
    const s = 12;

    const fill =
      typeof this.props.color === "string"
        ? this.props.color
        : "rgb(" + this.props.color + ")";

    return (
      <div
        className={
          this.props.type +
          (this.props.selected ? " " + this.props.type + "-selected" : "")
        }
      >
        {this.getCircle(this.props.dataType, this.RGBToHex(this.props.color))}
        {this.props.direction &&
          this.getdirection("directionArrow", this.props.direction)}
        {this.getText(this.props.value, s)}
      </div>
    );
  }
}
