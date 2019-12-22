import React from "react";
import { computed } from "mobx";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";
import ProblemIconLink from "../icons/problem-icon-link.jsx";
import ExpositionIcon from "../icons/exposition-icon.jsx";
import ElevationIcon from "../icons/elevation-icon.jsx";

class BulletinProblemItem extends React.Component {
  constructor(props) {
    super(props);
  }

  @computed
  get where() {
    if (this.props.problem.elevationLow && this.props.problem.elevationHigh) {
      return "middle";
    }
    if (this.props.problem.elevationLow || this.props.problem.treelineLow) {
      return "above";
    }
    if (this.props.problem.elevationHigh || this.props.problem.treelineHigh) {
      return "below";
    }

    return "all";
  }

  get elevation() {
    const elevation = [];
    switch (this.where) {
      case "below":
        elevation.push(this.props.problem.elevationHigh);
        break;

      case "above":
        elevation.push(this.props.problem.elevationLow);
        break;

      case "middle":
        elevation.push(this.props.problem.elevationLow);
        elevation.push(this.props.problem.elevationHigh);
        break;
    }
    return elevation;
  }

  get elevationText() {
    if (this.props.problem.treelineHigh || this.props.problem.treelineLow) {
      return this.props.intl.formatMessage({
        id: "bulletin:treeline"
      });
    }
    if (this.where == "middle") {
      return this.elevation.sort().join("-") + "m";
    }
    if (this.where !== "all") {
      return this.elevation[0] + "m";
    }
    return "";
  }

  get elevationTitle() {
    if (this.props.problem.treelineHigh) {
      return this.props.intl.formatMessage({
        id: "bulletin:report:problem-treeline-below:hover"
      });
    }
    if (this.props.problem.treelineLow) {
      return this.props.intl.formatMessage({
        id: "bulletin:report:problem-treeline:hover"
      });
    }
    if (this.where == "above") {
      return this.props.intl.formatMessage(
        { id: "bulletin:report:problem-above:hover" },
        { elev: this.elevation[0] }
      );
    }
    if (this.where == "below") {
      return this.props.intl.formatMessage(
        { id: "bulletin:report:problem-below:hover" },
        { elev: this.elevation[0] }
      );
    }
    if (this.where == "middle") {
      return this.props.intl.formatMessage(
        { id: "bulletin:report:problem-at:hover" },
        {
          elevLow: this.elevation[0],
          elevHigh: this.elevation[1]
        }
      );
    }
    if (this.where == "all") {
      return this.props.intl.formatMessage({
        id: "bulletin:report:problem-all-elevations:hover"
      });
    }
    return "";
  }

  render() {
    const expositionText = this.props.intl.formatMessage({
      id: "bulletin:report:exposition"
    });
    return (
      <li>
        {this.props.problem && this.props.problem.avalancheSituation && (
          <ProblemIconLink problem={this.props.problem.avalancheSituation} />
        )}
        {this.props.problem && this.props.problem.aspects && (
          <ExpositionIcon
            expositions={this.props.problem.aspects}
            title={expositionText}
          />
        )}
        {this.props.problem && this.where && (
          <ElevationIcon
            elevation={this.elevation}
            text={this.elevationText}
            where={this.where}
            title={this.elevationTitle}
          />
        )}
      </li>
    );
  }
}

export default inject("locale")(injectIntl(observer(BulletinProblemItem)));
