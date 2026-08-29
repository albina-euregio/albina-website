export const LONG_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
};
Object.freeze(LONG_DATE_FORMAT);

export const LONG_DATE_FORMAT_NO_WEEKDAY: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric"
};
Object.freeze(LONG_DATE_FORMAT_NO_WEEKDAY);

export const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false
};
Object.freeze(DATE_TIME_FORMAT);

export const DATE_TIME_FORMAT_SHORT: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
  hour12: false
};
Object.freeze(DATE_TIME_FORMAT_SHORT);

/**
 * Time of day with its zone, e.g. "15:00 UTC" — `timeStyle` cannot carry
 * `timeZoneName`, so the components are spelled out.
 */
export const TIME_ZONE_FORMAT: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
  hour12: false,
  timeZone: "UTC"
};
Object.freeze(TIME_ZONE_FORMAT);

export const DATE_TIME_ZONE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  timeZoneName: "short",
  hour12: false
};
Object.freeze(DATE_TIME_ZONE_FORMAT);
