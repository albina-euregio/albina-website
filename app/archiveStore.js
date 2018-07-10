import Base from './base.js';
import { observable } from 'mobx';
import { parseDate, getSuccDate, dateToISODateString } from './util/date.js';

export default class ArchiveStore {
  archive;
  _year;
  _month;
  _day;
  _loading;

  constructor() {
    this.archive = {};
    this._year = observable.box('');
    this._month = observable.box('');
    this._day = observable.box('');
    this._loading = observable.box(false);
  }

  get loading() {
    return this._loading.get();
  }

  set loading(flag) {
    this._loading.set(flag);
  }

  get year() {
    return this._year.get();
  }

  set year(y) {
    this._year.set(y);
  }

  get month() {
    return this._month.get();
  }

  set month(m) {
    this._month.set(m);
  }

  get day() {
    return this._day.get();
  }

  set day(val) {
    this._day.set(val);
  }

  load(startDate, endDate = '') {
    let d1 = parseDate(startDate);
    // check if start date has already been loaded
    let isLoaded = Boolean(this.archive[dateToISODateString(d1)]);

    if(!isLoaded) {
      return this._loadBulletinStatus(startDate, endDate);
    }

    if(endDate) {
      // check if whole period is loaded
      let d2 = parseDate(endDate);
      if(d1 < d2) {
        do {
          d1 = getSuccDate(d1);
          isLoaded = isLoaded && Boolean(this.archive[dateToISODateString(d1)]);
        } while(isLoaded && d1 < d2);
      }

      if(!isLoaded) {
        return this._loadBulletinStatus(dateToISODateString(d1), endDate);
      }
    }

    // already loaded
    return Promise.resolve();
  }

  getStatus(date) {
    return this.archive[date] ? this.archive[date].status : '';
  }

  getStatusMessage(date) {
    return this.archive[date] ? this.archive[date].message : '';
  }

  _loadBulletinStatus(startDate, endDate = '', region = 'IT-32-BZ') {
    this.loading = true;

    const startDateParam = encodeURIComponent(startDate + 'T00:00:00+02:00');
    const endDateParam = endDate ? encodeURIComponent(endDate + 'T00:00:00+02:00') : startDateParam;

    const url =
      config.get('apis.bulletin') +
      '/status?startDate=' +
      startDateParam +
      '&endDate=' +
      endDateParam +
      (region ? ('&region=' + region) : '');

    return Base.doRequest(url).then(
      // query status data
      response => {
        const values = JSON.parse(response);
        if(typeof values == 'object') {
          for(let v of values) {
            // only use date part (without time) and add 1 day to get the
            // correct day - otherwise it might depend on the browser and
            // OS settings how ISO dates are converted to local time
            const d = parseDate(v.date.substr(0,10));
            if(d) {
              const d2 = getSuccDate(d);
              const status =
                (v.status == 'published' || v.status == 'republished')
                  ? 'ok' : 'n/a';
              this.archive[dateToISODateString(d2)] = {
                status: status,
                message: v.status
              };
            } else {
              console.log('Cannot parse bulletin status for date: ' + d);
            }
          }
        }
      },
      error => {
        console.error(
          'Cannot load bulletin status for date '
            + startDate
            + (endDate ? (' - ' + endDate) : '') +
            + (region ? (' Region ' + region) : '')
            + ': ' + error
        );
      }
    ).then(() => {
      this.loading = false;
    });
  }

}
