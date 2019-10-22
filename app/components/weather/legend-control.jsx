import React from "react";
import Control from "react-leaflet-control";

export default class LegendControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false
    };
  }

  get colors() {
    return Object.values(this.props.item.colors)
      .slice()
      .reverse();
  }

  get thresholds() {
    return this.props.item.thresholds.slice().reverse();
  }

  hide = () => {
    this.setState({ hidden: true });
  };

  show = () => {
    this.setState({ hidden: false });
  };

  render() {
    const style = {
      widthRatio: 1,
      boxHeightRatio: 0.45,
      textSizeRatio: 0.3
    };

    const controlW = 41;
    const w = parseInt(controlW * style.widthRatio, 10);
    const rectH = parseInt(style.boxHeightRatio * w, 10);
    const textSize = parseInt(w * style.textSizeRatio, 10);
    const unitH = textSize + 10;
    const svgSize = rectH * this.colors.length + textSize * 3;

    const colorBars = this.colors.map((color, ci) => {
      const colorCode =
        "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
      return (
        <rect
          className="legend-rect"
          key={ci}
          width={w}
          height={rectH}
          x="0"
          y={rectH * ci}
          fill={colorCode}
        />
      );
    });
    const texts = this.thresholds.map((threshold, ti) => {
      return (
        <text
          className="legend-text"
          key={ti}
          x={w / 2}
          y={(ti + 1) * rectH}
          dy="0.35em"
          fontSize={textSize}
          textAnchor="middle"
        >
          {threshold}
        </text>
      );
    });
    const topLine = (
      <line className="legend-border" x1="0" x2={w} y1="0" y2="0" />
    );

    const bottomLine = (
      <line
        className="legend-border"
        x1="0"
        x2={w}
        y1={rectH * this.colors.length}
        y2={rectH * this.colors.length}
      />
    );

    return (
      <Control position="bottomright">
        <div className="legend pure-button secondary">
          {this.state.hidden && (
            <a
              className="leaflet-control-button tooltip"
              href="#"
              title="Legende"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                this.show();
              }}
            >
              <span className="legend-toggle">Legende</span>
            </a>
          )}
          {!this.state.hidden && (
            <svg width={w} height={svgSize}>
              <text
                className="legend-units"
                x={w / 2}
                y={textSize * 1.35}
                fontSize={textSize}
                textAnchor="middle"
              >
                {this.props.item.units}
              </text>
              <g
                className="legend-wrapper"
                transform={"translate(0, " + unitH + ")"}
              >
                {colorBars}
                {topLine}
                {bottomLine}
                {texts}
              </g>
              <g id="legend-close" onClick={this.hide}>
                <rect
                  className="legend-close-button"
                  x="0"
                  y={svgSize - textSize}
                  width={w}
                  height={textSize * 1.5}
                />
                <text
                  className="legend-close-button-text"
                  x={w / 2}
                  y={svgSize}
                  fontSize={textSize}
                  textAnchor="middle"
                >
                  {"\u25BF"}
                </text>
              </g>
            </svg>
          )}
        </div>
      </Control>
    );
  }
}
