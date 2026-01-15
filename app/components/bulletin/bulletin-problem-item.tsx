import React, { useMemo } from "react";
import { wordDiff } from "../../util/wordDiff";
import DiffMatchPatch from "diff-match-patch";
import { useIntl } from "../../i18n";
import ProblemIconLink from "../icons/problem-icon-link";
import ExpositionIcon from "../icons/exposition-icon";
import ElevationIcon from "../icons/elevation-icon";
// import SnowpackStabilityIconLink from "../icons/snowpack-stability-icon-link";
// import FrequencyIconLink from "../icons/frequency-icon-link";
// import AvalancheSizeIconLink from "../icons/avalanche-size-icon-link";
import type { AvalancheProblem } from "../../stores/bulletin";
import { EnabledLanguages } from "./bulletin-glossary";
const BulletinGlossaryText = React.lazy(
  () => import("./bulletin-glossary-text")
);

interface Props {
  problem: AvalancheProblem;
  problem170000: AvalancheProblem;
  showDiff: 0 | 1 | 2;
}

const textInfoToClass = {
  frequency: {
    few: 2,
    some: 3,
    many: 4
  },
  snowpackStability: {
    fair: 2,
    poor: 3,
    very_poor: 4
  },
  avalancheSize: {
    "1": 2,
    "2": 3,
    "3": 4,
    "4": 4,
    "5": 4
  }
};

function BulletinProblemItem({ problem, problem170000, showDiff }: Props) {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  function getElevationIcon() {
    const lowerBound = problem?.elevation?.lowerBound;
    const upperBound = problem?.elevation?.upperBound;

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
          where={"all"}
          title={intl.formatMessage({
            id: "bulletin:report:problem:elevation:all:hover"
          })}
        />
      );
    }
  }

  const aspectText = useMemo(
    () =>
      intl.formatMessage({
        id: "bulletin:report:exposition"
      }) +
      (Array.isArray(problem?.aspects)
        ? ": " +
          problem?.aspects
            .map(e =>
              intl.formatMessage({
                id: "bulletin:report:problem:aspect:" + e.toLocaleLowerCase()
              })
            )
            .join(", ")
        : ""),
    [problem?.aspects, intl]
  );
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
    <li
      // style={
      //   showDiff && problem170000 === undefined
      //     ? { backgroundColor: "#e6eef2" }
      //     : {}
      // }
      className={
        showDiff && problem170000 === undefined ? "bulletin-update-diff" : ""
      }
    >
      {problem && <ProblemIconLink problem={problem} />}
      {problem?.aspects && (
        <div
          // style={
          //   showDiff && !compareAspects(problem, problem170000)
          //     ? { backgroundColor: "#e6eef2" }
          //     : {}
          // }
          className={
            showDiff && !compareAspects(problem, problem170000)
              ? "bulletin-update-diff"
              : ""
          }
        >
          <ExpositionIcon expositions={problem?.aspects} title={aspectText} />
        </div>
      )}
      <div
        // style={
        //   showDiff && !compareElevation(problem, problem170000)
        //     ? { backgroundColor: "#e6eef2" }
        //     : {}
        // }
        className={
          showDiff && !compareElevation(problem, problem170000)
            ? "bulletin-update-diff"
            : ""
        }
      >
        {getElevationIcon()}
      </div>

      {problem?.customData?.ALBINA?.avalancheType == "slab" &&
        (problem?.snowpackStability ||
          problem?.frequency ||
          problem?.avalancheSize) && (
          <div className="bulletin-report-picto matrix-information">
            {problem?.snowpackStability &&
              problem?.problemType !== "gliding_snow" && (
                <div
                  className={
                    `matrix-info matrix-info-value-${
                      textInfoToClass.snowpackStability[
                        problem?.snowpackStability
                      ]
                    }` +
                    (showDiff &&
                    !compareSnowpackStability(problem, problem170000)
                      ? " bulletin-update-diff"
                      : "")
                  }
                  // style={
                  //   showDiff && !compareSnowpackStability(problem, problem170000)
                  //     ? { backgroundColor: "#e6eef2" }
                  //     : {}
                  // }
                >
                  <span className="matrix-info-name">
                    {snowpackStabilityText}:
                    </span>
                    <span className="matrix-info-value">
                      <a href={`/education/snowpack-stability`}>
                        <BulletinGlossaryText
                          text={intl.formatMessage({
                            id: `bulletin:report:problem:snowpack-stability:${problem?.snowpackStability}`
                          })}
                          locale={lang as EnabledLanguages}
                        />
                      </a>
                    </span>
                </div>
              )}
            {problem?.frequency && (
              <div
                className={
                  `matrix-info matrix-info-value-${textInfoToClass.frequency[problem?.frequency]}` +
                  (showDiff && !compareFrequency(problem, problem170000)
                    ? " bulletin-update-diff"
                    : "")
                }
                // style={
                //   showDiff && !compareFrequency(problem, problem170000)
                //     ? { backgroundColor: "#e6eef2" }
                //     : {}
                // }
              >
                <span className="matrix-info-name">{frequencyText}:</span>
                  <span className="matrix-info-value">
                    <a href={`/education/frequency`}>
                      {intl.formatMessage({
                        id: `bulletin:report:problem:frequency:${problem?.frequency}`
                      })}
                    </a>
                  </span>
              </div>
            )}
            {problem?.avalancheSize && (
              <div
                className={
                  `matrix-info matrix-info-value-${
                    textInfoToClass.avalancheSize[problem?.avalancheSize]
                  }` +
                  (showDiff && !compareAvalancheSize(problem, problem170000)
                    ? " bulletin-update-diff"
                    : "")
                }
                // style={
                //   showDiff && !compareAvalancheSize(problem, problem170000)
                //     ? { backgroundColor: "#e6eef2" }
                //     : {}
                // }
              >
                <span className="matrix-info-name">{avalancheSizeText}:</span>
                  <span className="matrix-info-value">
                    <a
                      href={`/education/avalanche-sizes#anchor-${problem?.avalancheSize}`}
                    >
                      {intl.formatMessage({
                        id: `bulletin:report:problem:avalanche-size:${problem?.avalancheSize}`
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

export default BulletinProblemItem;

export function compareAvalancheProblem(
  problem: AvalancheProblem,
  problem170000: AvalancheProblem
) {
  return (
    problem &&
    problem170000 &&
    compareAspects(problem, problem170000) &&
    compareElevation(problem, problem170000) &&
    compareSnowpackStability(problem, problem170000) &&
    compareFrequency(problem, problem170000) &&
    compareAvalancheSize(problem, problem170000)
  );
}

function compareAspects(
  problem: AvalancheProblem,
  problem170000: AvalancheProblem
): boolean {
  const a1 = problem?.aspects ?? [];
  const a2 = problem170000?.aspects ?? [];
  return a1.slice().sort().join() === a2.slice().sort().join();
}

function compareElevation(
  problem: AvalancheProblem,
  problem170000: AvalancheProblem
): boolean {
  return (
    problem?.elevation?.lowerBound === problem170000?.elevation?.lowerBound &&
    problem?.elevation?.upperBound === problem170000?.elevation?.upperBound
  );
}

function compareSnowpackStability(
  problem: AvalancheProblem,
  problem170000: AvalancheProblem
) {
  return problem?.snowpackStability === problem170000?.snowpackStability;
}

function compareFrequency(
  problem: AvalancheProblem,
  problem170000: AvalancheProblem
) {
  return problem?.frequency === problem170000?.frequency;
}

function compareAvalancheSize(
  problem: AvalancheProblem,
  problem170000: AvalancheProblem
) {
  return problem?.avalancheSize === problem170000?.avalancheSize;
}
