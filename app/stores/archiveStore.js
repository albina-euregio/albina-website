import { makeAutoObservable } from "mobx";
import {
  parseDate,
  getSuccDate,
  dateToISODateString,
  getDaysOfMonth
} from "../util/date.js";
import { BulletinStore } from "./bulletinStore";

export default class ArchiveStore {
  constructor() {
    this.archive = {};

    // filter values
    this._year = "";
    this._month = "";
    this._day = "";

    // loading flag
    this._loading = false;

    makeAutoObservable(this);
  }

  get loading() {
    return this._loading;
  }

  set loading(flag) {
    this._loading = flag;
  }

  get year() {
    return this._year;
  }

  set year(y) {
    this._year = y;
    if (!this._month) {
      this._month = 1;
    }
    this._load();
  }

  get month() {
    return this._month;
  }

  set month(m) {
    this._month = m;
    this._load();
  }

  get day() {
    return this._day;
  }

  set day(val) {
    this._day = val;
    this._load();
  }

  _load() {
    if (this.startDate && this.endDate) {
      this.load(
        dateToISODateString(this.startDate),
        dateToISODateString(this.endDate)
      );
    }
  }

  load(startDate, endDate = "") {
    let d1 = parseDate(startDate);

    // check if start date has already been loaded
    let isLoaded = Boolean(this.archive[dateToISODateString(d1)]);
    if (!isLoaded) {
      return this._loadBulletinStatus(startDate, endDate);
    }

    if (endDate) {
      // check if whole period is loaded
      let d2 = parseDate(endDate);
      if (d1 < d2) {
        do {
          d1 = getSuccDate(d1);
          isLoaded = isLoaded && Boolean(this.archive[dateToISODateString(d1)]);
        } while (isLoaded && d1 < d2);
      }

      if (!isLoaded) {
        return this._loadBulletinStatus(dateToISODateString(d1), endDate);
      }
    }

    // already loaded
    return Promise.resolve();
  }

  get startDate() {
    if (this.year) {
      const y = this.year;
      var m = "";
      var d = "";
      if (this.month) {
        m = this.month;
        if (this.day) {
          d = this.day;
        } else {
          d = 1;
        }
      } else {
        m = 1;
        d = 1;
      }

      const date = new Date(y, m - 1, d);
      // const previousDate = date.setDate(date.getDate()-1);
      return date;
    }

    return null;
  }

  get endDate() {
    if (this.year) {
      const y = this.year;
      var m = "";
      var d = "";
      if (this.month) {
        m = this.month;
        if (this.day) {
          d = this.day;
        } else {
          d = getDaysOfMonth(y, m);
        }
      } else {
        m = 1;
        d = getDaysOfMonth(y, m);
      }

      return new Date(y, m - 1, d);
    }

    return null;
  }

  getStatus(date) {
    return this.archive[date] ? this.archive[date].status : "";
  }

  getStatusMessage(date) {
    return this.archive[date] ? this.archive[date].message : "";
  }

  /**
   * @param {string} startDate
   * @param {string} endDate
   */
  _loadBulletinStatus(startDate, endDate = "") {
    // const startDateDay = parseInt(startDate.split('-')[2], 10) - 1
    // startDate = startDate.substr(0, startDate.length-2) + startDateDay
    if (!endDate) endDate = startDate;

    const dates = [];
    for (
      let date = new Date(startDate);
      date <= new Date(endDate);
      date = getSuccDate(date)
    ) {
      dates.push(date.toISOString().slice(0, 10));
    }

    this.loading = true;
    return Promise.all(
      dates.map(async date => await this._loadBulletinStatusForDate(date))
    ).finally(() => (this.loading = false));
  }

  async _loadBulletinStatusForDate(date) {
    try {
      const status = await BulletinStore.getBulletinStatus(date);
      this.archive[date] = {
        status: status,
        message: status
      };
    } catch (e) {
      console.warn("Cannot parse bulletin status for date: " + date, e);
    }
  }
}

export const ARCHIVE_STORE = new ArchiveStore();
