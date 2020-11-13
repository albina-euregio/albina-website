import React from "react";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";
import ProblemIconLink from "../icons/problem-icon-link.jsx";
import ExpositionIcon from "../icons/exposition-icon.jsx";
import ElevationIcon from "../icons/elevation-icon.jsx";
//import FrequencyIconLink from "../icons/frequency-icon-link.jsx";

/**
 * @typedef {object} Props
 * @prop {Caaml.AvalancheProblem} problem
 *
 * @extends {React.Component<Props>}
 */
class BulletinProblemItem extends React.Component {
  constructor(props) {
    super(props);
  }

  getElevationIcon() {
    const lowerBound = this.props.problem?.dangerRating?.elevation?.lowerBound;
    const upperBound = this.props.problem?.dangerRating?.elevation?.upperBound;
    if (lowerBound === "treeline") {
      return (
        <ElevationIcon
          elevation={[]}
          text={this.props.intl.formatMessage({
            id: "bulletin:treeline"
          })}
          where={"above"}
          title={this.props.intl.formatMessage({
            id: "bulletin:report:problem-treeline:hover"
          })}
        />
      );
    } else if (upperBound === "treeline") {
      return (
        <ElevationIcon
          elevation={[]}
          text={this.props.intl.formatMessage({
            id: "bulletin:treeline"
          })}
          where={"below"}
          title={this.props.intl.formatMessage({
            id: "bulletin:report:problem-treeline-below:hover"
          })}
        />
      );
    } else if (lowerBound && upperBound) {
      return (
        <ElevationIcon
          elevation={[lowerBound, upperBound]}
          text={`${lowerBound}–${upperBound}m`}
          where={"middle"}
          title={this.props.intl.formatMessage(
            { id: "bulletin:report:problem-at:hover" },
            {
              elevLow: lowerBound,
              elevHigh: upperBound
            }
          )}
        />
      );
    } else if (lowerBound) {
      return (
        <ElevationIcon
          elevation={[lowerBound]}
          text={`${lowerBound}m`}
          where={"above"}
          title={this.props.intl.formatMessage(
            { id: "bulletin:report:problem-above:hover" },
            { elev: lowerBound }
          )}
        />
      );
    } else if (upperBound) {
      return (
        <ElevationIcon
          elevation={[upperBound]}
          text={`${upperBound}m`}
          where={"below"}
          title={this.props.intl.formatMessage(
            { id: "bulletin:report:problem-below:hover" },
            { elev: upperBound }
          )}
        />
      );
    } else {
      return (
        <ElevationIcon
          elevation={[]}
          text={this.elevationText}
          where={"all"}
          title={this.props.intl.formatMessage({
            id: "bulletin:report:problem-all-elevations:hover"
          })}
        />
      );
    }
  }

  render() {
    if (!this.props.problem) return <li></li>;

    const expositions = this.props.problem.dangerRating.aspects;
    //const frequency = this.props.problem.dangerRating.frequency;
    const expositionText = this.props.intl.formatMessage({
      id: "bulletin:report:exposition"
    });
    // const frequencyText = this.props.intl.formatMessage({
    //   id: "bulletin:report:frequency"
    // });
    return (
      <li>
        {this.props.problem && <ProblemIconLink problem={this.props.problem} />}
        <ExpositionIcon expositions={expositions} title={expositionText} />
        {this.getElevationIcon()}
        {/* <FrequencyIconLink frequency={frequency || 3} title={frequencyText} /> */}
      </li>
    );
  }
}

export default inject("locale")(injectIntl(observer(BulletinProblemItem)));
