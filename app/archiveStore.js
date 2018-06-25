import Base from './base.js';
import { observable, action, computed } from 'mobx';
import { parseDate, getSuccDate, dateToISODateString } from './util/date.js';

export default class ArchiveStore {
  archive;

  constructor() {
    this.archive = {};
  }

  load(startDate, endDate = '') {
    // TODO: check if already loaded
    return this._loadBulletinStatus(startDate, endDate)
  }

  getStatus(date) {
    return this.archive[date] ? this.archive[date] : '';
  }

  _loadBulletinStatus(startDate, endDate = '', region = 'IT-32-BZ') {
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
            const d = parseDate(v.date);
            if(d) {
              // bulletin is published at 22:00 for the day after
              const d2 = getSuccDate(d);
              const status =
                (v.status == 'published' || v.status == 'republished')
                  ? 'ok' : 'n/a';
              this.archive[dateToISODateString(d2)] = status;
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
    );
  }

}
