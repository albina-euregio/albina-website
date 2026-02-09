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
export function snapToSlot(date: Date, absTimeSpan: number): Date {
  const snapped = new Date(date);
  if (!Number.isFinite(absTimeSpan) || absTimeSpan <= 0) return snapped;
  const hour = snapped.getUTCHours();
  const lowerSlot = Math.floor(hour / absTimeSpan) * absTimeSpan;
  const upperSlot = lowerSlot + absTimeSpan;
  const useLower = hour - lowerSlot <= upperSlot - hour;
  snapped.setUTCHours(useLower ? lowerSlot : upperSlot % 24, 0, 0, 0);
  if (!useLower && upperSlot >= 24) {
    snapped.setUTCDate(snapped.getUTCDate() + 1);
  }
  return snapped;
}

/**
 * Clamp a date to [start, end] range.
 * Returns a new Date — never mutates input.
 */
export function clampToRange(date: Date, start: Date, end: Date): Date {
  if (+date < +start) return new Date(start);
  if (+date > +end) return new Date(end);
  return new Date(date);
}

/**
 * Step forward or backward by one slot interval.
 * Returns a new Date.
 */
export function stepTime(
  date: Date,
  absTimeSpan: number,
  direction: 1 | -1
): Date {
  const stepped = new Date(date);
  stepped.setUTCHours(stepped.getUTCHours() + direction * absTimeSpan);
  return stepped;
}

/**
 * Calculate the default time for a domain/timespan combination.
 *
 * The timestamp represents the END of the forecast period (not the start).
 *
 * Three modes:
 * - Forecast (+N): next slot > now — shows current/upcoming forecast period
 * - Historical (-N): most recent slot ≤ data availability
 * - Instantaneous (+-1): closest hour to now with available data
 */
export function getDefaultTime(
  now: Date,
  dataAvailableTime: Date,
  timeSpan: string,
  absTimeSpan: number
): Date {
  const timesForSpan = getValidSlots(absTimeSpan);

  if (!timeSpan || !Number.isFinite(absTimeSpan) || timesForSpan.length === 0) {
    return new Date(dataAvailableTime);
  }

  const isInstantaneous = timeSpan === "+-1";
  const isForecast = timeSpan.startsWith("+") && !isInstantaneous;
  const isHistorical = timeSpan.startsWith("-");

  // Instantaneous overlays (snow-height, temp, wind, etc.)
  // Find the closest valid hour to now that has available data
  if (isInstantaneous) {
    const candidate = new Date(dataAvailableTime);
    const nowHour = now.getUTCHours();

    let closestHour = timesForSpan[0];
    let minDiff = 24;
    for (const h of timesForSpan) {
      const diff = Math.min(Math.abs(h - nowHour), 24 - Math.abs(h - nowHour));
      if (diff < minDiff) {
        minDiff = diff;
        closestHour = h;
      }
    }

    candidate.setUTCHours(closestHour, 0, 0, 0);

    while (+candidate > +dataAvailableTime) {
      candidate.setUTCHours(candidate.getUTCHours() - absTimeSpan);
    }

    return candidate;
  }

  // Forecast overlays (+6, +12, +24, etc.)
  // Timestamp = period END. Show the next slot after now.
  if (isForecast) {
    const candidate = new Date(now);
    const nowHour = now.getUTCHours();
    const sortedSlots = [...timesForSpan].sort((a, b) => a - b);

    const laterSlots = sortedSlots.filter(h => h > nowHour);

    if (laterSlots.length > 0) {
      candidate.setUTCHours(laterSlots[0], 0, 0, 0);
    } else {
      candidate.setUTCDate(candidate.getUTCDate() + 1);
      candidate.setUTCHours(sortedSlots[0], 0, 0, 0);
    }

    return candidate;
  }

  // Historical overlays (-6, -12, -24, etc.)
  // Show the most recent past period
  if (isHistorical) {
    const candidate = new Date(dataAvailableTime);
    const dataHour = dataAvailableTime.getUTCHours();

    const soonerToday = timesForSpan.filter(h => h <= dataHour);

    if (soonerToday.length > 0) {
      candidate.setUTCHours(Math.max(...soonerToday), 0, 0, 0);
    } else {
      candidate.setUTCDate(candidate.getUTCDate() - 1);
      candidate.setUTCHours(Math.max(...timesForSpan), 0, 0, 0);
    }

    return candidate;
  }

  // Fallback — original behavior for unrecognized timespan patterns
  const currentTime = new Date(dataAvailableTime);
  if (currentTime.getUTCHours() !== 0) {
    const currHours = currentTime.getUTCHours();
    const soonerTimesToday = timesForSpan.filter(aTime => aTime <= currHours);
    let foundStartHour;
    if (soonerTimesToday.length) foundStartHour = Math.max(...soonerTimesToday);
    else foundStartHour = Math.max(...timesForSpan);

    if (soonerTimesToday.length === 0)
      currentTime.setUTCHours(currentTime.getUTCHours() - 24);
    currentTime.setUTCHours(foundStartHour);
  }
  return currentTime;
}
