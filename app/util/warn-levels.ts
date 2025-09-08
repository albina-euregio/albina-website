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

export function getWarnlevelNumber(
  id: keyof typeof warnlevelNumbers
): WarnLevelNumber {
  return warnlevelNumbers[id] ?? 0;
}

export const WARNLEVEL_COLORS = Object.freeze([
  "#ffffff",
  "#ccff66",
  "#ffff00",
  "#ff9900",
  "#ff0000",
  "#000000"
]);

export const WARNLEVEL_OPACITY = Object.freeze([0.0, 1.0, 1.0, 1.0, 1.0, 0.8]);

export const WARNLEVEL_STYLES = Object.freeze({
  intern: WARNLEVEL_COLORS.map((fillColor, warnlevel) =>
    Object.freeze({
      stroke: false,
      fill: true,
      fillColor,
      fillOpacity: WARNLEVEL_OPACITY[warnlevel]
    })
  ),
  extern: WARNLEVEL_COLORS.map(fillColor =>
    Object.freeze({
      stroke: false,
      fill: true,
      fillColor,
      fillOpacity: 0.5
    })
  )
});
