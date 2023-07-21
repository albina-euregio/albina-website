function parseDate(dateString) {
  const dateMatch = dateString.match(/^(\d{4}-\d{2}-\d{2})([T ].*)?$/);
  if (dateMatch) {
    console.assert(typeof dateMatch[1] === "string", dateMatch);
    const dateString = dateMatch[1];
    if (typeof dateMatch[2] === "undefined") {
      // no time supplied
      return _parseDatetime(dateString + "T00:00:00");
    }

    // time supplied
    const timeString = dateMatch[2].substr(1);
    let timeMatch = timeString.match(/^(\d{2}:\d{2})(:\d{2})?.*$/);
    if (timeMatch) {
      const str = timeMatch[1] + (timeMatch[2] ? timeMatch[2] : ":00");
      return _parseDatetime(dateString + "T" + str);
    }
  }
  return null;
}

function _parseDatetime(dateTimeString) {
  var a = dateTimeString.split(/[^0-9]/);
  //for (i=0;i<a.length;i++) { alert(a[i]); }
  var parsedDate = new Date(a[0], a[1] - 1, a[2], a[3], a[4]);

  return parsedDate ? parsedDate : null;
}

function getPredDate(date) {
  if (date) {
    const candidate = new Date(date.valueOf() - 1000 * 60 * 60 * 24);
    if (isSummerTime(date) && !isSummerTime(candidate)) {
      // there is one day when switching from winter to summer time that has
      // only 23h !!
      return new Date(date.valueOf() - 1000 * 60 * 60 * 23);
    }
    return candidate;
  }
  return null;
}

function getSuccDate(date) {
  let timeValue = date.valueOf();

  if (date) {
    return new Date(timeValue + 1000 * 60 * 60 * 24);
  }
  return null;
}

function isSummerTime(date) {
  // NOTE: getTimezoneOffset gives negative values for timezones east of GMT!
  const summerTimeOffset = (() => {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);
    return -Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  })();

  return -date.getTimezoneOffset() >= summerTimeOffset;
}

/**
 * @type {Intl.DateTimeFormatOptions}
 */
export const LONG_DATE_FORMAT = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric"
};
Object.freeze(LONG_DATE_FORMAT);

/**
 * @type {Intl.DateTimeFormatOptions}
 */
export const DATE_TIME_FORMAT = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false
};
Object.freeze(DATE_TIME_FORMAT);

/**
 * @type {Intl.DateTimeFormatOptions}
 */
export const DATE_TIME_ZONE_FORMAT = {
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

function dateToISODateString(date) {
  let pad = function (d) {
    if (d < 10) {
      return "0" + d;
    }
    return d;
  };

  if (date) {
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate())
    );
  }
  return "";
}

function isSameDay(d1, d2) {
  return (
    d1.getDate() == d2.getDate() &&
    d1.getMonth() == d2.getMonth() &&
    d1.getFullYear() == d2.getFullYear()
  );
}

function isAfter(d1, d2) {
  return d1.valueOf() > d2.valueOf();
}

/* format date utc enabled */
function dateFormat(date, fstr, utc) {
  utc = utc ? "getUTC" : "get";
  return fstr.replace(/%[YmdHMS]/g, function (m) {
    switch (m) {
      case "%Y":
        return date[utc + "FullYear"](); // no leading zeros required
      case "%m":
        m = 1 + date[utc + "Month"]();
        break;
      case "%d":
        m = date[utc + "Date"]();
        break;
      case "%H":
        m = date[utc + "Hours"]();
        break;
      case "%M":
        m = date[utc + "Minutes"]();
        break;
      case "%S":
        m = date[utc + "Seconds"]();
        break;
      default:
        return m.slice(1); // unknown code, remove %
    }
    // add leading zero if required
    return ("0" + m).slice(-2);
  });
}

function getDaysOfMonth(year, month) {
  // according to ECMA Standard, day is relative to the first of the month:
  // that means 0 is the last day of the previous month - see:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate
  //
  // therefore we set y and m to the successor month, to get the number of
  // days (the last day in month) for the desired month
  const y = month == 12 ? parseInt(year) + 1 : year;
  const m = month == 12 ? 0 : month;
  const d = new Date(y, m, 0);

  return d.getDate();
}

export {
  parseDate,
  getPredDate,
  getSuccDate,
  isSameDay,
  isAfter,
  isSummerTime,
  dateToISODateString,
  getDaysOfMonth,
  dateFormat
};
