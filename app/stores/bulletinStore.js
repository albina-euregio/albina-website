import Base from '../base.js'
import ArchiveStore from './archiveStore.js'
import { observable, action, computed, toJS } from 'mobx'
import {
  parseDate,
  getPredDate,
  dateToISODateString
} from '../util/date.js'

import flip from '@turf/flip'

class BulletinCollection {
  date
  status
  statusMessage
  dataRaw
  geodata

  constructor(date) {
    this.date = date
    this.status = 'pending'
    this.statusMessage = ''
    this.dataRaw = null
    this.geodata = {}
  }

  get regions() {
    if (this.status != 'ok') {
      return []
    }

    return [] // TODO implement
  }

  get problems() {
    if (this.status != 'ok') {
      return []
    }

    return [] // TODO implement
  }

  get publicationDate() {
    // return maximum of all publicationDates
    if (this.status == 'ok' && this.dataRaw.length > 0) {
      return this.dataRaw
        .map(b => {
          return parseDate(b.publicationDate)
        })
        .reduce((acc, d) => {
          return d > acc ? d : acc
        }, new Date(0))
    }

    return null
  }

  get length() {
    return this.dataRaw ? this.dataRaw.length : 0
  }

  hasDaytimeDependency() {
    if (this.status == 'ok' && this.dataRaw.length > 0) {
      return this.dataRaw.reduce((acc, b) => {
        return acc || b.hasDaytimeDependency
      }, false)
    }
    return false
  }

  getData() {
    return this.dataRaw
  }

  getGeoData() {
    return this.geodata
  }

  setData(data) {
    this.dataRaw = data
    this.status =
      typeof data === 'object'
        ? data.length > 0
          ? 'ok'
          : 'empty'
        : 'n/a'
  }

  cancelLoad() {
    this.status = 'empty'
  }

  setGeoData(data) {
    if (typeof data === 'object') {
      this.geodata = data
    }
  }

  toString() {
    return JSON.stringify(this.dataRaw)
  }
}

class BulletinStore {
  // TODO: add language support
  @observable
  mapCenter = [15, 50]
  @observable
  mapZoom = 'object'
  @observable
  bulletins = {}
  settings = {}
  problems = {}

  constructor() {
    if (!window['archiveStore']) {
      window['archiveStore'] = new ArchiveStore()
    }
    this.archiveStore = window['archiveStore']

    this.settings = observable({
      status: '',
      date: '',
      region: '',
      ampm: config.get('defaults.ampm')
    })
    this.bulletins = {}

    this.problems = observable({
      new_snow: { highlighted: false },
      wind_drifted_snow: { highlighted: false },
      weak_persistent_layer: { highlighted: false },
      wet_snow: { highlighted: false },
      gliding_snow: { highlighted: false }
    })

    this.mapCenter = observable.box([47, 12])
    this.mapZoom = observable.box(9)
  }

  /**
   * Load a bulletin from the APIs and activate it, if desired.
   * @param date The date in YYYY-MM-DD format.
   * @param activate A flag to indicate, if the bulletin should be activated.
   * @return Void, if the bulletin has already been fetched or a promise object,
   *   if it need to be fetched.
   */
  @action
  load(date, activate = true) {
    if (date) {
      if (this.bulletins[date]) {
        if (activate) {
          this.activate(date)
        }
      } else {
        // create empty bulletin entry
        this.bulletins[date] = new BulletinCollection(date)

        if (activate) {
          this.activate(date)
        }

        /*
         * First check status data (via achiveStore). If status is 'ok'
         * (i.e. 'published' or 'republished'),
         * continue loading bulletin data and then load GeoJSON.
         *
         * NOTE: It would (in principle) be possible to load GeoJSON and
         * bulletin data in parallel (using Promise.all). However GeoJSON
         * filename conventions use 'fd_...' for non-time-dependent bulletins.
         * Therefore, we have to check daytime dependency before being able to
         * determine the correct url.
         */
        return this.archiveStore
          .load(date)
          .then(() => {
            const status = this.archiveStore.getStatus(date)

            if (status == 'ok') {
              return this._loadBulletinData(date)
            } else {
              this.bulletins[date].cancelLoad()
            }
          })
          .then(() => {
            if (this.bulletins[date].status == 'ok') {
              // bulletin data has been loaded, continue with GeoJSON
              if (this.bulletins[date].hasDaytimeDependency()) {
                // only request 'am' geojson - 'pm' has same geometries, only
                // different properties which are irrelevant here
                return this._loadGeoData(date, 'am')
              }
              // else (this will load the 'fd' geojson)
              return this._loadGeoData(date)
            }
          })
          .then(() => {
            if (activate && this.settings.date == date) {
              // reactivate to notify status change
              this.activate(date)
            }
          })
      }
    }
  }

  /**
   * Activate bulletin collection for a given date.
   * @param date The date in yyyy-mm-dd format.
   */
  @action
  activate(date) {
    if (this.bulletins[date]) {
      this.settings.region = ''
      this.settings.date = date
      this.settings.status = this.bulletins[date].status

      if (this.bulletins[date].length == 1) {
        // TODO: filter by problem!!!
        let b = this.bulletins[date].getData()
        this.setRegion(b[0].id)
      }
    }
  }

  // TODO move to map store
  @action
  setMapViewport(mapState) {
    this.mapCenter.set(mapState.center)
    this.mapZoom.set(mapState.zoom)
  }

  /**
   * Increase or decrease the zoom value of the bulletin map.
   * TODO: move to map store
   */
  @action
  zoomIn() {
    this.mapZoom.set(this.mapZoom + 1)
  }
  @action
  zoomOut() {
    this.mapZoom.set(this.mapZoom - 1)
  }

  /**
   * Set the current active 'am'/'pm' state.
   * @param ampm A string 'am' or 'pm'.
   */
  @action
  setAmPm(ampm) {
    switch (ampm) {
      case 'am':
      case 'pm':
        this.settings.ampm = ampm
        break

      default:
        break
    }
  }

  @action
  setRegion(id) {
    this.settings.region = id
  }

  @action
  dimProblem(problemId) {
    if (typeof this.problems[problemId] !== 'undefined') {
      this.problems[problemId].highlighted = false
    }
  }

  @action
  highlightProblem(problemId) {
    if (typeof this.problems[problemId] !== 'undefined') {
      this.problems[problemId].highlighted = true
    }
  }

  /**
   * Get the bulletins that match the current selection.
   * @return A list of bulletins that match the selection of
   *   this.date and this.ampm
   */
  get activeBulletinCollection() {
    if (this.settings.status == 'ok') {
      return this.bulletins[this.settings.date]
    }
    return null
  }

  /**
   * Get the bulletin that is relevant for the currently set region.
   * @return A bulletin object that matches the selection of
   *   this.date, this.ampm and this.region
   */
  get activeBulletin() {
    return this.getBulletinForRegion(this.settings.region)
  }

  getBulletinForRegion(regionId) {
    const collection = this.activeBulletinCollection

    if (collection && collection.length > 0) {
      return collection.getData().find(el => {
        return el.id == regionId
      })
    }

    return null
  }

  getProblemsForRegion(regionId) {
    const problems = []
    const b = this.getBulletinForRegion(regionId)
    if (b) {
      const daytime =
        b.hasDaytimeDependency && this.settings.ampm == 'pm'
          ? 'afternoon'
          : 'forenoon'
      const daytimeBulletin = b[daytime]

      if (daytimeBulletin && daytimeBulletin.avalancheSituation1) {
        problems.push(
          daytimeBulletin.avalancheSituation1.avalancheSituation
        )
      }
      if (daytimeBulletin && daytimeBulletin.avalancheSituation2) {
        problems.push(
          daytimeBulletin.avalancheSituation2.avalancheSituation
        )
      }
      return problems
    } else {
      return []
    }
  }

  getRegionState(regionId) {
    if (this.settings.region && this.settings.region === regionId) {
      return 'selected'
    }
    if (this.settings.region) {
      // some other region is selected
      return 'dimmed'
    }

    const checkHighlight = rId => {
      const problems = this.getProblemsForRegion(rId)
      return problems.some(
        p => this.problems[p] && this.problems[p].highlighted
      )
    }

    if (checkHighlight(regionId)) {
      return 'highlighted'
    }

    // dehighligt if any filter is activated
    if (
      Object.keys(this.problems).some(
        p => this.problems[p].highlighted
      )
    ) {
      return 'dehighlighted'
    }
    return 'default'
  }

  // assign states to regions
  @computed
  get vectorRegions() {
    const collection = this.activeBulletinCollection

    if (collection && collection.length > 0) {
      // clone original geojson
      const clonedGeojson = Object.assign({}, collection.getGeoData())

      const regions =
        clonedGeojson.features && clonedGeojson.features.length
          ? clonedGeojson.features.map(f => {
              const state = this.getRegionState(f.properties.bid)

              f = flip(f)
              f.properties.state = state
              return f
            })
          : []

      const states = [
        'selected',
        'highlighted',
        'dehighlighted',
        'dimmed',
        'default'
      ]
      regions.sort((r1, r2) => {
        return states.indexOf(r1.properties.state) <
          states.indexOf(r2.properties.state)
          ? 1
          : -1
      })
      return regions
    } else {
      return []
    }
  }

  /**
   * Returns leaflet encoded value for map center
   */
  @computed
  get getMapCenter() {
    return toJS(this.mapCenter)
  }

  @computed
  get getMapZoom() {
    return toJS(this.mapZoom)
  }

  _loadBulletinData(date) {
    console.log('loading bulletin', date)
    const prevDay = date =>
      dateToISODateString(getPredDate(parseDate(date)))

    // zulu time
    const dateParam = encodeURIComponent(prevDay(date) + 'T22:00:00Z')
    //const dateParam = encodeURIComponent(date + 'T22:00:00Z')
    //const dateParam = encodeURIComponent(date + 'T00:00:00+02:00')
    const url = config.get('apis.bulletin') + '?date=' + dateParam

    return Base.doRequest(url).then(
      // query bulletin data
      response => {
        this.bulletins[date].setData(JSON.parse(response))
      },
      error => {
        console.error(
          'Cannot load bulletin for date ' + date + ': ' + error
        )
        this.bulletins[date].setData(null)
      }
    )
  }

  _loadGeoData(date, daytime = null) {
    // API uses daytimes 'am', 'pm' and 'fd' ('full day')
    const d = daytime || 'fd'
    const url =
      config.get('apis.geo') + date + '/' + d + '_regions.json'

    return Base.doRequest(url).then(
      // query vector data
      response => {
        this.bulletins[date].setGeoData(JSON.parse(response), daytime)
      },
      error => {
        console.error(
          'Cannot load geo data for date ' + date + ': ' + error
        )
        this.bulletins[date].setGeoData(null, daytime)
      }
    )
  }
}

export { BulletinStore, BulletinCollection }
