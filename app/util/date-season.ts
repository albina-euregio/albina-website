/** The winter season a date belongs to, named after the year it starts in. */
export function seasonYear(date: Temporal.PlainDate) {
  return date.month < 9 ? date.year - 1 : date.year;
}

export function currentSeasonYear() {
  return seasonYear(Temporal.Now.plainDateISO());
}
