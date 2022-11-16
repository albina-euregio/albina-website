import React from "react";
import { Tooltip } from "../tooltips/tooltip";

export default class ExpositionIcon extends React.Component {
  imgRoot;
  alts;

  constructor(props) {
    super(props);

    this.imgRoot = window.config.projectRoot + "images/pro/expositions/";
    this.alts = {
      n: "North",
      ne: "North East",
      e: "East",
      se: "South East",
      s: "South",
      sw: "South West",
      w: "West",
      nw: "North West"
    };
  }

  render() {
    const classes = [
      "bulletin-report-picto",
      "bulletin-report-expositions",
      "tooltip"
    ].concat(this.props.expositions.map(e => "expo_" + e.toLowerCase()));
    const backgroundEntries = Object.entries(this.alts).map(e => (
      <img
        key={e[0]}
        className={"expo_" + e[0]}
        src={this.imgRoot + "exposition_" + e[0] + ".png"}
        title={this.alts[e[0]]}
      />
    ));
    return (
      <Tooltip label={this.props.title}>
        <div className={classes.join(" ")}>
          <img
            className="bulletin-report-exposition-rose"
            src={this.imgRoot + "exposition_bg.png"}
            title={this.props.title}
          />
          {backgroundEntries}
        </div>
      </Tooltip>
    );
  }
}
