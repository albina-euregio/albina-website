import React from "react";
import WarnLevelIcon from "../icons/warn-level-icon";
import type * as Caaml from "../../stores/bulletin";
import { getMaxMainValue } from "../../stores/bulletin";

interface Props {
  dangerRatings: Caaml.DangerRating[];
}

function BulletinDangerRating({ dangerRatings }: Props) {
  if (!dangerRatings?.length) return null;

  const dangerRatingBelow = getMaxMainValue(
    dangerRatings.filter(r => r?.elevation?.lowerBound === undefined)
  );
  const dangerRatingAbove = getMaxMainValue(
    dangerRatings.filter(r => r?.elevation?.upperBound === undefined)
  );
  const dangerRatingBounds = dangerRatings.flatMap(r => [
    r?.elevation?.lowerBound,
    r?.elevation?.upperBound
  ]);
  const elevation = dangerRatingBounds.find(b => b && b !== "treeline");
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
