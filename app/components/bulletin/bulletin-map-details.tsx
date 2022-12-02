import React from "react";
import { observer } from "mobx-react";
import ProblemIconLink from "../icons/problem-icon-link";
import BulletinDangerRating from "./bulletin-danger-rating.jsx";
import type { DaytimeBulletin } from "../../stores/bulletin/DaytimeBulletin";

type Props = {
  ampm: "am" | "pm";
  daytimeBulletin: DaytimeBulletin;
  region: string;
};

function BulletinMapDetails({ ampm, daytimeBulletin, region }: Props) {
  // TODO: create common component with bulletin-report

  const daytime =
    daytimeBulletin.hasDaytimeDependency && ampm == "pm"
      ? "afternoon"
      : "forenoon";
  const bulletin = daytimeBulletin[daytime]!;
  const problems = bulletin.avalancheProblems || [];
  let key = 0;
  let count = 0;

  return (
    <>
      <p className="bulletin-report-region-name">
        <span className="bulletin-report-region-name-region">{region}</span>
      </p>
      <ul className="list-plain">
        <li className="bulletin-report-picto">
          <BulletinDangerRating bulletin={bulletin} />
        </li>{" "}
        {problems.map(problem => {
          if (count < 2) {
            if (!(key > 0 && problems[0].type == problems[key].type)) {
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
