export const LONG_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric"
};
Object.freeze(LONG_DATE_FORMAT);

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
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false
};
Object.freeze(DATE_TIME_FORMAT_SHORT);

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
