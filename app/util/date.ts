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

/* format date utc enabled */
export function dateFormat(date: Date, fstr: string, isUTC: boolean): string {
  const utc = isUTC ? "getUTC" : "get";
  return fstr.replace(/%[YmdHMS]/g, (m: string) => {
    switch (m) {
      case "%Y":
        return date[`${utc}FullYear`](); // no leading zeros required
      case "%m":
        m = 1 + date[`${utc}Month`]();
        break;
      case "%d":
        m = date[`${utc}Date`]();
        break;
      case "%H":
        m = date[`${utc}Hours`]();
        break;
      case "%M":
        m = date[`${utc}Minutes`]();
        break;
      case "%S":
        m = date[`${utc}Seconds`]();
        break;
      default:
        return m.slice(1); // unknown code, remove %
    }
    // add leading zero if required
    return ("0" + m).slice(-2);
  });
}
