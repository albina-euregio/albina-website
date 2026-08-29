/**
 * Pure utility functions for weather map time slot calculations.
 * No store dependencies — all state passed as parameters.
 */

/**
 * Snap a date to the nearest valid slot hour for this timespan.
 * Returns a new Date with minutes/seconds/ms zeroed.
 */
export function snapToSlot(
  date: Temporal.Instant,
  absTimeSpan: number
): Temporal.Instant {
  if (!Number.isFinite(absTimeSpan) || absTimeSpan <= 0) return date;
  let snapped = date.toZonedDateTimeISO("UTC");
  const hour = snapped.hour;
  const lowerSlot = Math.floor(hour / absTimeSpan) * absTimeSpan;
  const upperSlot = lowerSlot + absTimeSpan;
  const useLower = hour - lowerSlot <= upperSlot - hour;
  snapped = snapped.with({ hour: useLower ? lowerSlot : upperSlot % 24 });
  if (!useLower && upperSlot >= 24) {
    snapped = snapped.add({ days: 1 });
  }
  return snapped.toInstant();
}
