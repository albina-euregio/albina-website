import React from "react";
import { observer } from "mobx-react";
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

    if (lowerBound && upperBound) {
      if (lowerBound === "treeline") {
        if (upperBound === "treeline") {
          // from treeline to treeline, should not happen
          return (
            <ElevationIcon
              elevation={[]}
              text={this.props.intl.formatMessage({
                id: "bulletin:report:problem:elevation:between:treeline-treeline"
              })}
              where={"middle"}
              title={this.props.intl.formatMessage({
                id: "bulletin:report:problem:elevation:between:treeline-treeline:hover"
              })}
            />
          );
        } else {
          // from treeline to upper
          return (
            <ElevationIcon
              elevation={[]}
              text={this.props.intl.formatMessage(
                { id: "bulletin:report:problem:elevation:between:treeline-m" },
                {
                  elevationHigh: upperBound
                }
              )}
              where={"middle"}
              title={this.props.intl.formatMessage(
                {
                  id: "bulletin:report:problem:elevation:between:treeline-m:hover"
                },
                {
                  elevationHigh: upperBound
                }
              )}
            />
          );
        }
      } else if (upperBound === "treeline") {
        // from lower to treeline
        return (
          <ElevationIcon
            elevation={[]}
            text={this.props.intl.formatMessage(
              { id: "bulletin:report:problem:elevation:between:m-treeline" },
              {
                elevationLow: lowerBound
              }
            )}
            where={"middle"}
            title={this.props.intl.formatMessage(
              {
                id: "bulletin:report:problem:elevation:between:m-treeline:hover"
              },
              {
                elevationLow: lowerBound
              }
            )}
          />
        );
      } else {
        // from lower to upper
        return (
          <ElevationIcon
            elevation={[lowerBound, upperBound]}
            text={`${lowerBound}–${upperBound}m`}
            where={"middle"}
            title={this.props.intl.formatMessage(
              { id: "bulletin:report:problem:elevation:between:m-m:hover" },
              {
                elevationLow: lowerBound,
                elevationHigh: upperBound
              }
            )}
          />
        );
      }
    } else if (lowerBound === "treeline") {
      return (
        <ElevationIcon
          elevation={[]}
          text={this.props.intl.formatMessage({
            id: "bulletin:treeline"
          })}
          where={"above"}
          title={this.props.intl.formatMessage({
            id: "bulletin:report:problem:elevation:above:treeline:hover"
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
            id: "bulletin:report:problem:elevation:below:treeline:hover"
          })}
        />
      );
    } else if (lowerBound) {
      return (
        <ElevationIcon
          elevation={[lowerBound]}
          text={`${lowerBound}m`}
          where={"above"}
          title={this.props.intl.formatMessage(
            { id: "bulletin:report:problem:elevation:above:m:hover" },
            { elevationLow: lowerBound }
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
            { id: "bulletin:report:problem:elevation:below:m:hover" },
            { elevationHigh: upperBound }
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
            id: "bulletin:report:problem:elevation:all:hover"
          })}
        />
      );
    }
  }

  render() {
    const expositions = this.props.problem?.dangerRating?.aspects;
    if (!expositions) return <li></li>;
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

export default injectIntl(observer(BulletinProblemItem));
