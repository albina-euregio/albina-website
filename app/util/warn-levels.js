export const warnlevelNumbers = Object.freeze({
  low: 1,
  moderate: 2,
  considerable: 3,
  high: 4,
  very_high: 5,
  no_snow: 0,
  no_rating: 0
});

export function getWarnlevelNumber(id) {
  if (warnlevelNumbers[id]) {
    return warnlevelNumbers[id];
  }
  return 0;
}
