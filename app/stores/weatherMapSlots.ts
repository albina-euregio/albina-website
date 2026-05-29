/**
 * Pure utility functions for weather map time slot calculations.
 * No store dependencies — all state passed as parameters.
 */

/**
 * Valid slot hours for a given absolute timespan.
 * e.g. absTimeSpan=6 → [0, 6, 12, 18], absTimeSpan=1 → [0..23]
 */
export function getValidSlots(absTimeSpan: number): number[] {
  const slots: number[] = [];
  if (!Number.isFinite(absTimeSpan) || absTimeSpan <= 0) return slots;
  let hour = 0;
  while (hour < 24) {
    slots.push(hour);
    hour += absTimeSpan;
  }
  return slots;
}

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

/**
 * Calculate the default time for a domain/timespan combination.
 *
 * The timestamp represents the END of the forecast period (not the start).
 *
 * Three modes:
 * - Forecast (+N): next slot > now — shows current/upcoming forecast period
 * - Historical (-N): most recent slot ≤ data availability
 * - Instantaneous (+-N): closest valid slot to now with available data
 */
export function getDefaultTime(
  now: Temporal.Instant,
  dataAvailableTime: Temporal.Instant,
  timeSpan: string,
  absTimeSpan: number
): Temporal.Instant {
  const timesForSpan = getValidSlots(absTimeSpan);

  if (!timeSpan || !Number.isFinite(absTimeSpan) || timesForSpan.length === 0) {
    return dataAvailableTime;
  }
  const nowUTC = now.toZonedDateTimeISO("UTC");
  const dataAvailableTimeUTC = dataAvailableTime.toZonedDateTimeISO("UTC");

  const isInstantaneous = timeSpan.startsWith("+-");
  const isForecast = timeSpan.startsWith("+") && !isInstantaneous;
  const isHistorical = timeSpan.startsWith("-");

  // Instantaneous overlays (snow-height, temp, wind, etc.)
  // Find the closest valid hour to now that has available data
  if (isInstantaneous) {
    let closestHour = timesForSpan[0];
    let minDiff = 24;
    for (const h of timesForSpan) {
      const diff = Math.min(
        Math.abs(h - nowUTC.hour),
        24 - Math.abs(h - nowUTC.hour)
      );
      if (diff < minDiff) {
        minDiff = diff;
        closestHour = h;
      }
    }

    let candidate = dataAvailableTimeUTC.with({ hour: closestHour });

    while (
      Temporal.ZonedDateTime.compare(candidate, dataAvailableTimeUTC) > 0
    ) {
      candidate = candidate.subtract({ hours: absTimeSpan });
    }

    return candidate.toInstant();
  }

  // Forecast overlays (+6, +12, +24, etc.)
  // Timestamp = period END. Show the next slot after now.
  if (isForecast) {
    const sortedSlots = [...timesForSpan].sort((a, b) => a - b);
    const laterSlots = sortedSlots.filter(h => h > nowUTC.hour);

    let candidate = nowUTC;
    if (laterSlots.length > 0) {
      candidate = candidate.with({ hour: laterSlots[0] });
    } else {
      candidate = candidate.add({ days: 1 }).with({ hour: sortedSlots[0] });
    }

    return candidate.toInstant();
  }

  // Historical overlays (-6, -12, -24, etc.)
  // Show the most recent past period
  if (isHistorical) {
    const dataHour = dataAvailableTimeUTC.hour;
    const soonerToday = timesForSpan.filter(h => h <= dataHour);

    let candidate = dataAvailableTimeUTC;
    if (soonerToday.length > 0) {
      candidate = candidate.with({ hour: Math.max(...soonerToday) });
    } else {
      candidate = candidate
        .subtract({ days: 1 })
        .with({ hour: Math.max(...timesForSpan) });
    }

    return candidate.toInstant();
  }

  // Fallback — original behavior for unrecognized timespan patterns
  let currentTime = dataAvailableTimeUTC;
  if (currentTime.hour !== 0) {
    const currHours = currentTime.hour;
    const soonerTimesToday = timesForSpan.filter(aTime => aTime <= currHours);
    let foundStartHour;
    if (soonerTimesToday.length) foundStartHour = Math.max(...soonerTimesToday);
    else foundStartHour = Math.max(...timesForSpan);

    if (soonerTimesToday.length === 0)
      currentTime = currentTime.subtract({ hours: 24 });
    currentTime = currentTime.with({ hour: foundStartHour });
  }
  return currentTime.toInstant();
}
