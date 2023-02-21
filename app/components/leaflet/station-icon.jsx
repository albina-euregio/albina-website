import React from "react";
const iconSVGS = {
  "directionArrow-centered":
    "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0 9 4.5z",
  "directionArrow-combined":
    "M9 4.5v1.414L5.002 1.917V10.5h-1V1.911L0 5.914V4.5L4.5 0z"
};
export default class StationIcon extends React.Component {
  RGBToHex(color) {
    //console.log("RGBToHex", color);
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

  getdirection(type, direction) {
    let style = {
      position: "absolute",
      left: "6px",
      top: "6",
      transform: "rotate(" + direction + "deg)"
    };
    let svg = iconSVGS["directionArrow-centered"];
    let height = "12";
    let viewBox = "0 0 9 12";

    if (type === "combined") {
      style = {
        position: "absolute",
        left: "6.5px",
        top: "-11px",
        transform: "rotate(" + direction + "deg)"
      };
      svg = iconSVGS["directionArrow-combined"];
      height = "42";
      viewBox = "0 0 9 42";
    }

    return (
      <svg
        style={style}
        height={height}
        viewBox={viewBox}
        width="9"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={svg} fillRule="evenodd" />
      </svg>
    );
  }

  getText(text) {
    return (
      <svg
        style={{ position: "absolute", left: "0px", top: "0px" }}
        width="22"
        height="22"
        viewBox="0 0 22 22"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle">
          {text}
        </text>
      </svg>
    );
  }

  get hasValue() {
    return typeof this.props.value === "number" && isFinite(this.props.value);
  }

  showCircle() {
    return (
      ["any"].includes(this.props.itemId) ||
      (["forcast", "analyse"].includes(this.props.dataType) && this.hasValue)
    );
  }

  render() {
    const s = 12;

    const fill =
      typeof this.props.color === "string"
        ? this.props.color
        : this.RGBToHex(this.props.color);
    //console.log("StationIcon->render kkk", this.showCircle(), this.props);
    return (
      <div
        className={
          this.props.type +
          (this.props.selected ? " " + this.props.type + "-selected" : "")
        }
      >
        {this.showCircle() && this.getCircle(this.props.dataType, fill)}
        {typeof this.props.direction == "number" &&
          this.getdirection(
            this.hasValue ? "combined" : "only",
            this.props.direction + 180
          )}
        {this.hasValue && this.getText(this.props.value, s)}
      </div>
    );
  }
}
