export type WarnLevelNumber = 0 | 1 | 2 | 3 | 4 | 5;

export const warnlevelNumbers = Object.freeze({
  low: 1 as WarnLevelNumber,
  moderate: 2 as WarnLevelNumber,
  considerable: 3 as WarnLevelNumber,
  high: 4 as WarnLevelNumber,
  very_high: 5 as WarnLevelNumber,
  no_snow: 0 as WarnLevelNumber,
  no_rating: 0 as WarnLevelNumber
});

export function getWarnlevelNumber(id: string): WarnLevelNumber {
  if (warnlevelNumbers[id]) {
    return warnlevelNumbers[id];
  }
  return 0;
}

export const WARNLEVEL_COLORS = Object.freeze([
  "#ffffff",
  "#ccff66",
  "#ffff00",
  "#ff9900",
  "#ff0000",
  "#600000" // FIXME color for very_high
]);
