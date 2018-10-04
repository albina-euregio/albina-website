import Base from '../base.js'
import { observable, computed } from 'mobx'
import {
  parseDate,
  getPredDate,
  getSuccDate,
  dateToISODateString,
  getDaysOfMonth
} from '../util/date.js'

export default class ArchiveStore {
  archive
  _year
  _month
  _day
  _loading

  constructor() {
    this.archive = {}

    // filter values
    this._year = observable.box('')
    this._month = observable.box('')
    this._day = observable.box('')

    // loading flag
    this._loading = observable.box(false)
  }

  get loading() {
    return this._loading.get()
  }

  set loading(flag) {
    this._loading.set(flag)
  }

  get year() {
    return this._year.get()
  }

  set year(y) {
    this._year.set(y)
    if (!this._month.get()) {
      this._month.set(1)
    }
    this._load()
  }

  get month() {
    return this._month.get()
  }

  set month(m) {
    this._month.set(m)
    this._load()
  }

  get day() {
    return this._day.get()
  }

  set day(val) {
    this._day.set(val)
    this._load()
  }

  _load() {
    if (this.startDate && this.endDate) {
      this.load(
        dateToISODateString(this.startDate),
        dateToISODateString(this.endDate)
      )
    }
  }

  load(startDate, endDate = '') {
    let d1 = parseDate(startDate)

    // check if start date has already been loaded
    let isLoaded = Boolean(this.archive[dateToISODateString(d1)])

    if (!isLoaded) {
      return this._loadBulletinStatus(startDate, endDate)
    }

    if (endDate) {
      // check if whole period is loaded
      let d2 = parseDate(endDate)
      if (d1 < d2) {
        do {
          d1 = getSuccDate(d1)
          isLoaded =
            isLoaded && Boolean(this.archive[dateToISODateString(d1)])
        } while (isLoaded && d1 < d2)
      }

      if (!isLoaded) {
        return this._loadBulletinStatus(
          dateToISODateString(d1),
          endDate
        )
      }
    }

    // already loaded
    return Promise.resolve()
  }

  @computed
  get startDate() {
    if (this.year) {
      const y = this.year
      var m = ''
      var d = ''
      if (this.month) {
        m = this.month
        if (this.day) {
          d = this.day
        } else {
          d = 1
        }
      } else {
        m = 1
        d = 1
      }

      // 2030
      //const date = new Date(y, m-1, d);
      const date = new Date(2030, 1, 16)
      //const previousDate = date.setDate(date.getDate()-1);
      return date
    }

    return null
  }

  @computed
  get endDate() {
    if (this.year) {
      const y = this.year
      var m = ''
      var d = ''
      if (this.month) {
        m = this.month
        if (this.day) {
          d = this.day
        } else {
          d = getDaysOfMonth(y, m)
        }
      } else {
        m = 1
        d = getDaysOfMonth(y, m)
      }

      return new Date(y, m - 1, d)
    }

    return null
  }

  getStatus(date) {
    return this.archive[date] ? this.archive[date].status : ''
  }

  getStatusMessage(date) {
    return this.archive[date] ? this.archive[date].message : ''
  }

  _loadBulletinStatus(startDate, endDate = '', region = 'IT-32-BZ') {
    // const startDateDay = parseInt(startDate.split('-')[2], 10) - 1
    //startDate = startDate.substr(0, startDate.length-2) + startDateDay

    this.loading = true

    // zulu time
    const timeFormatStart = 'T23:00:00Z' //'T00:00:00+02:00'
    const timeFormatEnd = 'T23:00:00Z' //'T00:00:00+02:00'

    const prevDay = date =>
      dateToISODateString(getPredDate(parseDate(date)))

    const startDateParam = encodeURIComponent(
      prevDay(startDate) + timeFormatStart
    )
    const endDateParam = endDate
      ? encodeURIComponent(prevDay(endDate) + timeFormatEnd)
      : startDateParam

    const url =
      config.get('apis.bulletin') +
      '/status?startDate=' +
      startDateParam +
      '&endDate=' +
      endDateParam +
      (region ? '&region=' + region : '')

    return Base.doRequest(url)
      .then(
        // query status data
        response => {
          const values = JSON.parse(response)
          if (typeof values == 'object') {
            for (let v of values) {
              // only use date part (without time) and add 1 day to get the
              // correct day - otherwise it might depend on the browser and
              // OS settings how ISO dates are converted to local time
              const d = parseDate(v.date.substr(0, 10))
              if (d) {
                // const d2 = getSuccDate(d);
                const status =
                  v.status == 'published' || v.status == 'republished'
                    ? 'ok'
                    : 'n/a'

                const nextDay = dateToISODateString(getSuccDate(d))
                this.archive[nextDay] = {
                  status: status,
                  message: v.status
                }
              } else {
                console.log(
                  'Cannot parse bulletin status for date: ' + d
                )
              }
            }
          }
        },
        error => {
          console.error(
            'Cannot load bulletin status for date ' +
              startDate +
              (endDate ? ' - ' + endDate : '') +
              (region ? ' Region ' + region : '') +
              ': ' +
              error
          )
        }
      )
      .then(() => {
        this.loading = false
      })
  }
}
