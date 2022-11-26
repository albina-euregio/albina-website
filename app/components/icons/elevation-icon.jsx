import React from "react";
import { Tooltip } from "../tooltips/tooltip";

export default class ElevationIcon extends React.Component {
  imgRoot;
  icons;

  constructor(props) {
    super(props);

    this.imgRoot = window.config.projectRoot + "images/pro/warning-pictos/";
    this.imgFormat = window.config.webp ? ".webp" : ".png";
    this.icons = {
      above: "levels_above" + this.imgFormat,
      below: "levels_below" + this.imgFormat,
      all: "levels_all" + this.imgFormat,
      middle: "levels_middle" + this.imgFormat
    };
  }

  render() {
    const classes = [
      "bulletin-report-picto",
      "problem-altitude",
      "problem-" + this.props.where
    ];
    const src = this.imgRoot + this.icons[this.props.where];

    return (
      <Tooltip label={this.props.title}>
        <div className={classes.join(" ")}>
          <img src={src} alt={this.props.title} title={this.props.title} />
          {this.props.where != "all" && (
            <span>
              {this.props.text}
              <i className="icon" />
            </span>
          )}
        </div>
      </Tooltip>
    );
  }
}
