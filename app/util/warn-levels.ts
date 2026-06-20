import type { DangerRatingValue } from "../stores/bulletin";

export type WarnLevelNumber = 0 | 1 | 2 | 3 | 4 | 5;

export const warnlevelNumbers = Object.freeze({
  low: 1,
  moderate: 2,
  considerable: 3,
  high: 4,
  very_high: 5,
  no_snow: 0,
  no_rating: 0
} satisfies Record<DangerRatingValue, WarnLevelNumber>);

export function getWarnlevelNumber(id: DangerRatingValue): WarnLevelNumber {
  return warnlevelNumbers[id] ?? 0;
}

export function getDangerRatingValue(n: WarnLevelNumber): DangerRatingValue {
  return (
    [
      "no_rating",
      "low",
      "moderate",
      "considerable",
      "high",
      "very_high"
    ] as const
  )[n];
}

export const WARNLEVEL_COLORS = Object.freeze([
  "#ffffff",
  "#ccff66",
  "#ffff00",
  "#ff9900",
  "#ff0000",
  "#000000"
]);
