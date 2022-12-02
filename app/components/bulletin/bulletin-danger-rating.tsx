import React from "react";
import WarnLevelIcon from "../icons/warn-level-icon";
import type * as Caaml from "../../stores/bulletin/CaamlBulletin";

type Props = { bulletin: Caaml.Bulletin };

function BulletinDangerRating({ bulletin }: Props) {
  const dangerRatings = bulletin.dangerRatings;
  if (!dangerRatings || !dangerRatings.length) return null;

  const dangerRatingBelow = dangerRatings.find(
    r => r?.elevation?.lowerBound === undefined
  )?.mainValue;
  const dangerRatingAbove = dangerRatings.find(
    r => r?.elevation?.upperBound === undefined
  )?.mainValue;
  const dangerRatingBounds = dangerRatings.flatMap(r => [
    r?.elevation?.lowerBound,
    r?.elevation?.upperBound
  ]);
  const elevation = dangerRatingBounds.find(bound => bound !== "treeline");
  const treeline = dangerRatingBounds.some(bound => bound === "treeline");

  return (
    <WarnLevelIcon
      below={dangerRatingBelow}
      above={dangerRatingAbove}
      elevation={elevation}
      treeline={treeline}
    />
  );
}

export default BulletinDangerRating;
