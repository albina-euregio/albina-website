import { Temporal } from "temporal-polyfill";

export function currentSeasonYear() {
  const now = Temporal.Now.plainDateISO();
  return now.month < 9 ? now.year - 1 : now.year;
}
