import React from "react";

export default class ElevationIcon extends React.Component {
  imgRoot;
  icons;

  constructor(props) {
    super(props);

    // FIXME: should go to config.ini
    this.imgRoot =
      window["config"].get("projectRoot") + "images/pro/warning-pictos/";
    this.icons = {
      above: "levels_above.png",
      below: "levels_below.png",
      all: "levels_all.png",
      middle: "levels_middle.png"
    };
  }

  render() {
    const classes = [
      "bulletin-report-picto",
      "problem-altitude",
      "tooltip",
      "problem-" + this.props.where
    ];
    const src = this.imgRoot + this.icons[this.props.where];

    return (
      <div className={classes.join(" ")} title={this.props.title}>
        <img src={src} alt={this.props.title} />
        {this.props.where != "all" && (
          <span>
            {this.props.text}
            <i className="icon" />
          </span>
        )}
      </div>
    );
  }
}
