import React from "react";
import ProblemIconLink from "../icons/problem-icon-link";
import BulletinDangerRating from "./bulletin-danger-rating.jsx";
import {
  Bulletin,
  matchesValidTimePeriod,
  ValidTimePeriod
} from "../../stores/bulletin";
import { useIntl } from "../../i18n";

type Props = {
  validTimePeriod: ValidTimePeriod;
  bulletin: Bulletin;
  region: string;
  unselectRegion: () => void;
};

function BulletinMapDetails({
  validTimePeriod,
  bulletin,
  region,
  unselectRegion
}: Props) {
  const intl = useIntl();
  const problems =
    bulletin.avalancheProblems.filter(p =>
      matchesValidTimePeriod(validTimePeriod, p.validTimePeriod)
    ) || [];
  const dangerRatings =
    bulletin.dangerRatings.filter(p =>
      matchesValidTimePeriod(validTimePeriod, p.validTimePeriod)
    ) || [];
  let key = 0;
  let count = 0;

  return (
    <>
      <a
        href="#"
        onClick={() => unselectRegion()}
        className="bulletin-map-details-close icon-close"
      >
        <span className="is-visually-hidden">
          {intl.formatMessage({ id: "bulletin:map:details:close" })}
        </span>
      </a>
      <p className="bulletin-report-region-name">
        <span className="bulletin-report-region-name-region">{region}</span>
      </p>
      <ul className="list-plain">
        <li className="bulletin-report-picto">
          <BulletinDangerRating dangerRatings={dangerRatings} />
        </li>{" "}
        {problems.map(problem => {
          if (count < 2) {
            if (
              !(key > 0 && problems[0].problemType == problems[key].problemType)
            ) {
              count++;
              return (
                <li key={key++}>
                  <ProblemIconLink problem={problem} />
                </li>
              );
            } else {
              key++;
            }
          }
        })}
      </ul>

      {bulletin.highlights && (
        <p className="bulletin-report-public-alert">
          <span className="icon-attention bulletin-report-public-alert-icon"></span>
          {bulletin.highlights}
        </p>
      )}
    </>
  );
}

export default BulletinMapDetails;
