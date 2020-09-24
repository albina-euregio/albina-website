import React from "react";
import { Link } from "react-router-dom";

export default class FrequencyIcon extends React.Component {
  imgRoot;

  constructor(props) {
    super(props);
    this.imgRoot =
      window.config.projectRoot + "images/pro//situation-frequencies/";
  }

  render() {
    const classes = ["bulletin-report-picto", "bulletin-situation-frequency"];

    return (
      <div className={classes.join(" ")} title={this.props.title}>
        <Link
          to={"/education/avalanche-problems#frequency"}
          className="img tooltip"
          href="#"
          title={this.props.title}
        >
          <img
            src={this.imgRoot + "frequency_" + this.props.frequency + ".png"}
            alt={this.props.title}
          />
        </Link>
      </div>
    );
  }
}
