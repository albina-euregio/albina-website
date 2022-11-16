import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "../tooltips/tooltip";

export default class FrequencyIcon extends React.Component {
  imgRoot;

  constructor(props) {
    super(props);
    this.imgRoot = window.config.projectRoot + "images/pro//frequencies/";
  }

  render() {
    const classes = ["bulletin-report-picto", "bulletin-situation-frequency"];

    return (
      <div className={classes.join(" ")} title={this.props.title}>
        <Tooltip label={this.props.title}>
          <Link
            to={"/education/avalanche-problems#frequency"}
            className="img"
            href="#"
          >
            <img
              src={this.imgRoot + "frequency_" + this.props.frequency + ".png"}
              title={this.props.title}
            />
          </Link>
        </Tooltip>
      </div>
    );
  }
}
