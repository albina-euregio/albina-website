import React from "react";
import { observer } from "mobx-react";
import ProblemIconLink from "../icons/problem-icon-link";
import BulletinDangerRating from "./bulletin-danger-rating.jsx";
import { Bulletin, isAmPm } from "../../stores/bulletin";

type Props = {
  ampm: "am" | "pm";
  bulletin: Bulletin;
  region: string;
};

function BulletinMapDetails({ ampm, bulletin, region }: Props) {
  const problems =
    bulletin.avalancheProblems.filter(p => isAmPm(ampm, p.validTimePeriod)) ||
    [];
  const dangerRatings =
    bulletin.dangerRatings.filter(p => isAmPm(ampm, p.validTimePeriod)) || [];
  let key = 0;
  let count = 0;

  return (
    <>
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

export default observer(BulletinMapDetails);
