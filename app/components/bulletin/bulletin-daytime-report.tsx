import React from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import BulletinProblemItem from "./bulletin-problem-item.jsx";
import { Tooltip } from "../tooltips/tooltip";
import {
  matchesValidTimePeriod,
  type Bulletin,
  type DangerRating,
  type Region,
  type ValidTimePeriod
} from "../../stores/bulletin";
import { getWarnlevelNumber } from "../../util/warn-levels";

interface Props {
  validTimePeriod: ValidTimePeriod;
  bulletin: Bulletin;
  bulletin170000: Bulletin;
  showDiff: 0 | 1 | 2;
  date: Temporal.PlainDate;
}

function BulletinDaytimeReport({
  validTimePeriod,
  bulletin,
  bulletin170000,
  showDiff
}: Props) {
  const intl = useIntl();
  const problems =
    bulletin?.avalancheProblems?.filter(p =>
      matchesValidTimePeriod(validTimePeriod, p.validTimePeriod)
    ) || [];
  const problems170000 =
    bulletin170000?.avalancheProblems?.filter(p =>
      matchesValidTimePeriod(validTimePeriod, p.validTimePeriod)
    ) || [];
  const dangerRatings =
    bulletin?.dangerRatings?.filter(p =>
      matchesValidTimePeriod(validTimePeriod, p.validTimePeriod)
    ) || [];
  // D2 (Rainer, 23 Apr 2026): the per-problem danger digit is the headline
  // danger-level number repeated — not problem.dangerRatingValue (empty in data).
  const maxWarnlevelNumber = dangerRatings.length
    ? Math.max(...dangerRatings.map(r => getWarnlevelNumber(r.mainValue)))
    : 0;

  return (
    <div>
      {validTimePeriod && (
        <h2 className="subheader">
          <FormattedMessage id={`bulletin:report:daytime:${validTimePeriod}`} />
        </h2>
      )}
      <h2 className="subheader bulletin-report-problems-headline">
        <FormattedMessage id="bulletin:report:problems:headline" />
        <Tooltip
          html={true}
          label={`<p>${intl.formatMessage({
            id: "bulletin:report:problems:core-zone:info"
          })}</p>`}
        >
          <span className="tooltip-trigger icon-info"></span>
        </Tooltip>
      </h2>
      <div className="bulletin-report-pictobar">
        <ul className="list-plain list-bulletin-report-pictos">
          {problems.map((problem, index) => (
            <BulletinProblemItem
              key={index}
              problem={problem}
              problem170000={problems170000.find(
                p => p.problemType === problem.problemType
              )}
              showDiff={showDiff}
              warnlevelNumber={
                problem.dangerRatingValue
                  ? getWarnlevelNumber(problem.dangerRatingValue)
                  : maxWarnlevelNumber
              }
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BulletinDaytimeReport;

export function compareRegions(regions: Region[], regions170000: Region[]) {
  return (
    regions
      .map(r => r.regionID)
      .sort((s1, s2) => s1.localeCompare(s2))
      .join() ===
    regions170000
      ?.map(r => r.regionID)
      .sort((s1, s2) => s1.localeCompare(s2))
      .join()
  );
}

export function compareDangerRatings(
  dangerRatings: DangerRating[],
  dangerRatings170000: DangerRating[]
): boolean {
  return (
    dangerRatings.length === dangerRatings170000.length &&
    dangerRatings.every((r1, i) =>
      compareDangerRating(r1, dangerRatings170000[i])
    )
  );
}

function compareDangerRating(r1: DangerRating, r2: DangerRating): boolean {
  if (!r2) return false;
  return (
    r1.elevation?.lowerBound === r2.elevation?.lowerBound &&
    r1.elevation?.upperBound === r2.elevation?.upperBound &&
    r1.mainValue === r2.mainValue &&
    r1.validTimePeriod === r2.validTimePeriod
  );
}
