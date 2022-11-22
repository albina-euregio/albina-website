import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "../tooltips/tooltip";

export default class AvalancheSizeIcon extends React.Component {
  imgRoot;

  constructor(props) {
    super(props);
    this.imgRoot = window.config.projectRoot + "images/pro/avalanche-sizes/";
  }

  render() {
    const classes = ["bulletin-report-picto", "bulletin-situation-frequency"];

    return (
      <div className={classes.join(" ")}>
        <Tooltip label={this.props.title}>
          <Link
            to={"/education/avalanche-problems#avalancheSize"}
            className="img"
            href="#"
          >
            <img
              src={
                this.imgRoot +
                "avalanche-size_" +
                this.props.avalancheSize +
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
