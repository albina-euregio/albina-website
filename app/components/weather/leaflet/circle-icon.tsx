import React from "react";

export default class CircleIcon extends React.Component {
  render() {
    const s = 5;
    const svgS = 23;
    const b = 6.5;

    return (
      <svg className={this.props.className} width={svgS} height={svgS}>
        <g transform={"translate(" + b + "," + b + ")"}>
          <circle className="inner" cx={s} cy={s} r={s}></circle>
        </g>
      </svg>
    );
  }
}
