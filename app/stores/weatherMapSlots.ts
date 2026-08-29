/**
 * Pure utility functions for weather map time slot calculations.
 * No store dependencies — all state passed as parameters.
 */

/**
 * Snap a date to the nearest hour the data is actually published at, i.e. a
 * multiple of the live config's `timeStepHours` for this domain/timespan.
 * Returns a new Date with minutes/seconds/ms zeroed.
 */
export function snapToSlot(
  date: Temporal.Instant,
  timeStepHours: number
): Temporal.Instant {
  if (!Number.isFinite(timeStepHours) || timeStepHours <= 0) return date;
  let snapped = date.toZonedDateTimeISO("UTC");
  const hour = snapped.hour;
  const lowerSlot = Math.floor(hour / timeStepHours) * timeStepHours;
  const upperSlot = lowerSlot + timeStepHours;
  const useLower = hour - lowerSlot <= upperSlot - hour;
  snapped = snapped.with({ hour: useLower ? lowerSlot : upperSlot % 24 });
  if (!useLower && upperSlot >= 24) {
    snapped = snapped.add({ days: 1 });
  }
  return snapped.toInstant();
}
