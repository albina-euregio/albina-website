function parseDate(dateString) {
  const dateMatch = dateString.match(/^(\d{4}-\d{2}-\d{2})([T ].*)?$/);
  if(dateMatch) {
    const dateString = dateMatch[1];
    if(typeof(dateMatch[2]) == 'undefined') {
      // no time supplied
      return _parseDatetime(dateString + 'T00:00:00');
    }

    // time supplied
    const timeString = dateMatch[2].substr(1);
    let timeMatch = timeString.match(/^(\d{2}:\d{2})(:\d{2})?.*$/);
    if(timeMatch) {
      const str = timeMatch[1] + ((timeMatch[2]) ? timeMatch[2] : ':00');
      return _parseDatetime(dateString + 'T' + str);
    }
  }
  return null;
}


function _parseDatetime(dateTimeString) {
  console.log('TEST4: ' + dateTimeString);
  return Date.parse(dateTimeString);
}


function getPredDate(date) {
  if(date) {
    return new Date(date.valueOf() - 1000*60*60*24);
  }
  return null;
}

function getSuccDate(date) {
  if(date) {
    return new Date(date.valueOf() + 1000*60*60*24);
  }
  return null;
}

function dateToDateString(date) {
  return _formatDate(date, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
}

function dateToLongDateString(date) {
  return _formatDate(date, {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
}

function dateToDateTimeString(date) {
  return _formatDate(date, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });
}

function dateToISODateString(date) {
  return date.toISOString().substr(0, 10);
}

function _formatDate(date, options = {}) {
  if(date) {
    // TODO: replace with current language
    return Intl.DateTimeFormat('de', options).format(date);
  }
  return '';
}

export {parseDate, getPredDate, getSuccDate, dateToDateString, dateToDateTimeString, dateToLongDateString, dateToISODateString};
