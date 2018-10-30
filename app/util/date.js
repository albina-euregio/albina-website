function parseDate (dateString) {
  const dateMatch = dateString.match(/^(\d{4}-\d{2}-\d{2})([T ].*)?$/)
  if (dateMatch) {
    console.assert(typeof dateMatch[1] === 'string', dateMatch)
    const dateString = dateMatch[1]
    if (typeof dateMatch[2] === 'undefined') {
      // no time supplied
      return _parseDatetime(dateString + 'T00:00:00')
    }

    // time supplied
    const timeString = dateMatch[2].substr(1)
    let timeMatch = timeString.match(/^(\d{2}:\d{2})(:\d{2})?.*$/)
    if (timeMatch) {
      const str = timeMatch[1] + (timeMatch[2] ? timeMatch[2] : ':00')
      return _parseDatetime(dateString + 'T' + str)
    }
  }
  return null
}

function _parseDatetime (dateTimeString) {
  const timestamp = Date.parse(dateTimeString)
  return timestamp ? new Date(timestamp) : null
}

function getPredDate (date) {
  if (date) {
    return new Date(date.valueOf() - 1000 * 60 * 60 * 24)
  }
  return null
}

function getSuccDate (date) {
  let timeValue = date.valueOf()

  // summer time switch
  if (timeValue > 1540677000000) {
    timeValue += 1000 * 60 * 60
  }

  if (date) {
    return new Date(timeValue + 1000 * 60 * 60 * 24)
  }
  return null
}

function dateToDateString (date) {
  return _formatDate(date, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
}

function dateToTimeString (date) {
  return _formatDate(date, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  })
}

function dateToLongDateString (date) {
  return _formatDate(date, {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
}

function dateToDateTimeString (date) {
  return _formatDate(date, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  })
}

function dateToISODateString (date) {
  let pad = function (d) {
    if (d < 10) {
      return '0' + d
    }
    return d
  }

  if (date) {
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate())
    )
  }
  return ''
}

function getDaysOfMonth (year, month) {
  // according to ECMA Standard, day is relative to the first of the month:
  // that means 0 is the last day of the previous month - see:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate
  //
  // therefore we set y and m to the successor month, to get the number of
  // days (the last day in month) for the desired month
  const y = month == 12 ? parseInt(year) + 1 : year
  const m = month == 12 ? 0 : month
  const d = new Date(y, m, 0)

  return d.getDate()
}

function _formatDate (date, options = {}) {
  if (date) {
    return Intl.DateTimeFormat(window.appStore.language, options).format(date)
  }
  return ''
}

export {
  parseDate,
  getPredDate,
  getSuccDate,
  dateToDateString,
  dateToTimeString,
  dateToDateTimeString,
  dateToLongDateString,
  dateToISODateString,
  getDaysOfMonth
}
