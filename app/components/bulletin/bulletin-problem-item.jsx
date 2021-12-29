import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import ProblemIconLink from "../icons/problem-icon-link.jsx";
import ExpositionIcon from "../icons/exposition-icon.jsx";
import ElevationIcon from "../icons/elevation-icon.jsx";
//import FrequencyIconLink from "../icons/frequency-icon-link.jsx";
import Tippy from "@tippyjs/react";

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
            <Tippy
              content={this.props.intl.formatMessage({
                id: "bulletin:report:problem:elevation:between:treeline-treeline:hover"
              })}
            >
              <ElevationIcon
                elevation={[]}
                text={this.props.intl.formatMessage({
                  id: "bulletin:report:problem:elevation:between:treeline-treeline"
                })}
                where={"middle"}
              />
            </Tippy>
          );
        } else {
          // from treeline to upper
          return (
            <Tippy
              content={this.props.intl.formatMessage(
                {
                  id: "bulletin:report:problem:elevation:between:treeline-m:hover"
                },
                {
                  elevationHigh: upperBound
                }
              )}
            >
              <ElevationIcon
                elevation={[]}
                text={this.props.intl.formatMessage(
                  {
                    id: "bulletin:report:problem:elevation:between:treeline-m"
                  },
                  {
                    elevationHigh: upperBound
                  }
                )}
                where={"middle"}
              />
            </Tippy>
          );
        }
      } else if (upperBound === "treeline") {
        // from lower to treeline
        return (
          <Tippy
            content={this.props.intl.formatMessage(
              {
                id: "bulletin:report:problem:elevation:between:m-treeline:hover"
              },
              {
                elevationLow: lowerBound
              }
            )}
          >
            <ElevationIcon
              elevation={[]}
              text={this.props.intl.formatMessage(
                { id: "bulletin:report:problem:elevation:between:m-treeline" },
                {
                  elevationLow: lowerBound
                }
              )}
              where={"middle"}
            />
          </Tippy>
        );
      } else {
        // from lower to upper
        return (
          <Tippy
            content={this.props.intl.formatMessage(
              { id: "bulletin:report:problem:elevation:between:m-m:hover" },
              {
                elevationLow: lowerBound,
                elevationHigh: upperBound
              }
            )}
          >
            <ElevationIcon
              elevation={[lowerBound, upperBound]}
              text={`${lowerBound}–${upperBound}m`}
              where={"middle"}
            />
          </Tippy>
        );
      }
    } else if (lowerBound === "treeline") {
      return (
        <Tippy
          content={this.props.intl.formatMessage({
            id: "bulletin:report:problem:elevation:above:treeline:hover"
          })}
        >
          <ElevationIcon
            elevation={[]}
            text={this.props.intl.formatMessage({
              id: "bulletin:treeline"
            })}
            where={"above"}
          />
        </Tippy>
      );
    } else if (upperBound === "treeline") {
      return (
        <Tippy
          content={this.props.intl.formatMessage({
            id: "bulletin:report:problem:elevation:below:treeline:hover"
          })}
        >
          <ElevationIcon
            elevation={[]}
            text={this.props.intl.formatMessage({
              id: "bulletin:treeline"
            })}
            where={"below"}
          />
        </Tippy>
      );
    } else if (lowerBound) {
      return (
        <Tippy
          content={this.props.intl.formatMessage(
            { id: "bulletin:report:problem:elevation:above:m:hover" },
            { elevationLow: lowerBound }
          )}
        >
          <ElevationIcon
            elevation={[lowerBound]}
            text={`${lowerBound}m`}
            where={"above"}
          />
        </Tippy>
      );
    } else if (upperBound) {
      return (
        <Tippy
          content={this.props.intl.formatMessage(
            { id: "bulletin:report:problem:elevation:below:m:hover" },
            { elevationHigh: upperBound }
          )}
        >
          <ElevationIcon
            elevation={[upperBound]}
            text={`${upperBound}m`}
            where={"below"}
          />
        </Tippy>
      );
    } else {
      return (
        <Tippy
          content={this.props.intl.formatMessage({
            id: "bulletin:report:problem:elevation:all:hover"
          })}
        >
          <ElevationIcon
            elevation={[]}
            text={this.elevationText}
            where={"all"}
          />
        </Tippy>
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
        <Tippy content={expositionText}>
          <ExpositionIcon expositions={expositions} />
        </Tippy>
        {this.getElevationIcon()}
        {/* <FrequencyIconLink frequency={frequency || 3} title={frequencyText} /> */}
      </li>
    );
  }
}

export default injectIntl(observer(BulletinProblemItem));
