import React from "react";
import { observer } from "mobx-react";
import { injectIntl, useIntl } from "react-intl";
import ProblemIconLink from "../icons/problem-icon-link.jsx";
import ExpositionIcon from "../icons/exposition-icon.jsx";
import ElevationIcon from "../icons/elevation-icon.jsx";
// import SnowpackStabilityIconLink from "../icons/snowpack-stability-icon-link.jsx";
// import FrequencyIconLink from "../icons/frequency-icon-link.jsx";
// import AvalancheSizeIconLink from "../icons/avalanche-size-icon-link.jsx";
import type * as Caaml from "../../stores/bulletin/CaamlBulletin";

type Props = { problem: Caaml.AvalancheProblem };

function BulletinProblemItem({ problem }: Props) {
  const intl = useIntl();
  function getElevationIcon() {
    const lowerBound = problem?.dangerRating?.elevation?.lowerBound;
    const upperBound = problem?.dangerRating?.elevation?.upperBound;

    if (lowerBound && upperBound) {
      if (lowerBound === "treeline") {
        if (upperBound === "treeline") {
          // from treeline to treeline, should not happen
          return (
            <ElevationIcon
              elevation={[]}
              text={intl.formatMessage({
                id: "bulletin:report:problem:elevation:between:treeline-treeline"
              })}
              where={"middle"}
              title={intl.formatMessage({
                id: "bulletin:report:problem:elevation:between:treeline-treeline:hover"
              })}
            />
          );
        } else {
          // from treeline to upper
          return (
            <ElevationIcon
              elevation={[]}
              text={intl.formatMessage(
                { id: "bulletin:report:problem:elevation:between:treeline-m" },
                {
                  elevationHigh: upperBound
                }
              )}
              where={"middle"}
              title={intl.formatMessage(
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
            text={intl.formatMessage(
              { id: "bulletin:report:problem:elevation:between:m-treeline" },
              {
                elevationLow: lowerBound
              }
            )}
            where={"middle"}
            title={intl.formatMessage(
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
            title={intl.formatMessage(
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
          text={intl.formatMessage({
            id: "bulletin:treeline"
          })}
          where={"above"}
          title={intl.formatMessage({
            id: "bulletin:report:problem:elevation:above:treeline:hover"
          })}
        />
      );
    } else if (upperBound === "treeline") {
      return (
        <ElevationIcon
          elevation={[]}
          text={intl.formatMessage({
            id: "bulletin:treeline"
          })}
          where={"below"}
          title={intl.formatMessage({
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
          title={intl.formatMessage(
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
          title={intl.formatMessage(
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
          title={intl.formatMessage({
            id: "bulletin:report:problem:elevation:all:hover"
          })}
        />
      );
    }
  }

  const expositions = problem?.dangerRating?.aspects;
  if (!expositions) return <li></li>;
  const snowpackStability = problem?.dangerRating?.snowpackStability;
  const frequency = problem?.dangerRating?.frequency;
  const avalancheSize = problem?.dangerRating?.avalancheSize;
  const expositionText = intl.formatMessage({
    id: "bulletin:report:exposition"
  });
  const snowpackStabilityText = intl.formatMessage({
    id: "bulletin:report:problem:snowpack-stability"
  });
  const frequencyText = intl.formatMessage({
    id: "bulletin:report:problem:frequency"
  });
  const avalancheSizeText = intl.formatMessage({
    id: "bulletin:report:problem:avalanche-size"
  });
  return (
    <li>
      {problem && <ProblemIconLink problem={problem} />}
      {expositions && (
        <ExpositionIcon expositions={expositions} title={expositionText} />
      )}
      {getElevationIcon()}

      {(snowpackStability || frequency || avalancheSize) && (
        <div className="bulletin-report-picto matrix-information">
          {snowpackStability && (
            <div className="matrix-info">
              <span className="matrix-info-name">{snowpackStabilityText}:</span>
              <span className="matrix-info-value">
                <a
                  href={"/education/snowpack-stabilities#" + snowpackStability}
                >
                  {intl.formatMessage({
                    id:
                      "bulletin:report:problem:snowpack-stability:" +
                      snowpackStability
                  })}
                </a>
              </span>
            </div>
          )}
          {frequency && (
            <div className="matrix-info">
              <span className="matrix-info-name">{frequencyText}:</span>
              <span className="matrix-info-value">
                <a href={"/education/frequencies#" + frequency}>
                  {intl.formatMessage({
                    id: "bulletin:report:problem:frequency:" + frequency
                  })}
                </a>
              </span>
            </div>
          )}
          {avalancheSize && (
            <div className="matrix-info">
              <span className="matrix-info-name">{avalancheSizeText}:</span>
              <span className="matrix-info-value">
                <a href={"/education/avalanche-sizes#anchor-" + avalancheSize}>
                  {intl.formatMessage({
                    id:
                      "bulletin:report:problem:avalanche-size:" + avalancheSize
                  })}
                </a>
              </span>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default observer(BulletinProblemItem);
