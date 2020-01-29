import React from "react";

export default class StationIcon extends React.Component {
  renderDirection(s) {
    const cMargin = 2;
    const frontH = 11;
    const frontW = 11;
    const backH = 4;
    const backW = 4;

    const frontArc1 = frontW / 2;
    const frontArc2 = (
      (Math.sqrt(Math.pow(s + cMargin, 2) + Math.pow(frontW / 2, 2), 2) -
        cMargin -
        s) *
      2
    ).toPrecision(2);

    const backArc1 = backW / 2;
    const backArc2 = (
      (Math.sqrt(Math.pow(s + cMargin, 2) + Math.pow(backW / 2, 2), 2) -
        cMargin -
        s) *
      2
    ).toPrecision(2);

    const rotation = parseInt(this.props.direction, 10) + 180;

    return (
      <g className="direction" transform={"rotate(" + rotation + ")"}>
        <path
          className="front"
          d={
            "M 0 -" +
            (s + frontH) +
            " l " +
            frontW / 2 +
            " " +
            (frontH - cMargin) +
            " q -" +
            frontArc1 +
            ", -" +
            frontArc2 +
            " " +
            -frontW +
            " 0 Z"
          }
        />
        <path
          className="back"
          d={
            "M -" +
            backW / 2 +
            " " +
            (backH + s + cMargin) +
            " h " +
            backW +
            " v -" +
            backH +
            " q -" +
            backArc1 +
            " " +
            backArc2 +
            ", -" +
            backW +
            " 0Z"
          }
        />
      </g>
    );
  }

  render() {
    const s = 10;
    const svgS = 25;
    const fill =
      typeof this.props.color === "string"
        ? this.props.color
        : "rgb(" + this.props.color + ")";
    return (
      <svg
        className={
          this.props.type +
          (this.props.selected ? " " + this.props.type + "-selected" : "")
        }
        width={svgS}
        height={svgS}
      >
        <g transform={"translate(" + svgS / 2 + "," + svgS / 2 + ")"}>
          {this.props.direction && this.renderDirection(s)}
          <circle className="inner" r={s} fill={fill}></circle>
          {this.props.selected && (
            <circle className="outer" r={s}>
              <animate
                attributeType="xml"
                attributeName="r"
                from={s}
                to={svgS / 2}
                dur="1.5s"
                begin="0s"
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeType="xml"
                attributeName="opacity"
                from="0.8"
                to="0"
                dur="1.5s"
                begin="0s"
                repeatCount="indefinite"
              ></animate>
            </circle>
          )}
          <text y={s * 0.25 + 1} textAnchor="middle">
            {this.props.value}
          </text>
        </g>
      </svg>
    );
  }
}
