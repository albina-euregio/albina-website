import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "../tooltips/tooltip";

export default class SnowpackStabilityIcon extends React.Component {
  imgRoot;

  constructor(props) {
    super(props);
    this.imgRoot =
      window.config.projectRoot + "images/pro//snowpack-stabilities/";
  }

  render() {
    const classes = ["bulletin-report-picto", "bulletin-situation-frequency"];

    return (
      <div className={classes.join(" ")}>
        <Tooltip label={this.props.title}>
          <Link
            to={"/education/avalanche-problems#snowpackStability"}
            className="img"
            href="#"
          >
            <img
              src={
                this.imgRoot +
                "snowpack-stability_" +
                this.props.snowpackStability +
                ".png"
              }
              alt={this.props.title}
            />
          </Link>
        </Tooltip>
      </div>
    );
  }
}
