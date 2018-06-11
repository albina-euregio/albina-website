import Base from './base.js';
import { observable, action, computed, toJS } from 'mobx';
import { parseDate } from './util/date.js';

class BulletinCollection {
  date;
  status;
  dataRaw;

  constructor(date) {
    this.date = date;
    this.status = 'pending';
    this.dataRaw = null;
  }

  get regions() {
    if (this.status != 'ok') {
      return [];
    }

    return []; // TODO implement
  }

  get problems() {
    if (this.status != 'ok') {
      return [];
    }

    return []; // TODO implement
  }

  get publicationDate() {
    // return maximum of all publicationDates
    if (this.status == 'ok' && this.dataRaw.length > 0) {
      return this.dataRaw.map((b) => {
        return parseDate(b.publicationDate);
      }).reduce((acc, d) => {
        return (d > acc) ? d : acc;
      }, new Date(0));
    }

    return null;
  }

  get hasDaytimeDependency() {
    if (this.status == 'ok' && this.dataRaw.length > 0) {
      return this.dataRaw.reduce((acc, b) => {
        return acc || b.hasDaytimeDependency;
      }, false);
    }
    return false;
  }

  get length() {
    return this.dataRaw ? this.dataRaw.length : 0;
  }

  getData() {
    return this.dataRaw;
  }

  setData(data) {
    this.dataRaw = data;
    this.status =
      typeof data === 'object' ? (data.length > 0 ? 'ok' : 'empty') : 'n/a';
  }

  toString() {
    return JSON.stringify(this.dataRaw);
  }
}

class BulletinStore {
  // TODO: add language support
  @observable mapCenter = [15, 50];
  @observable mapZoom = 12;
  @observable bulletins = {};
  settings = {};
  problems = {};

  constructor() {
    this.settings = observable({
      status: '',
      date: '',
      region: '',
      ampm: config.get('defaults.ampm')
    });
    this.bulletins = {};

    this.problems = observable({
      'new_snow': { active: true },
      'wind_drifted_snow': { active: true },
      'old_snow': { active: true },
      'wet_snow': { active: true },
      'gliding_snow': { active: true }
    });

    this.mapCenter = observable.box([47, 12]);
    this.mapZoom = observable.box(9);
  }

  /**
   * Load a bulletin from the API and activate it, if desired.
   * @param date The date in YYYY-MM-DD format.
   * @param activate A flag to indicate, if the bulletin should be activated.
   * @return Void, if the bulletin has already been fetched or a promise object,
   *   if it need to be fetched.
   */
  @action
  load(date, activate = true) {
    if (date) {
      const url =
        config.get('apis.bulletin') +
        '?date=' +
        encodeURIComponent(date + 'T00:00:00+02:00');
      if (this.bulletins[date]) {
        if (activate) {
          this.activate(date);
        }
      } else {
        // create empty bulletin entry
        this.bulletins[date] = new BulletinCollection(date);

        if (activate) {
          this.activate(date);
        }

        return Base.doRequest(url)
          .then(
            response => {
              this.bulletins[date].setData(JSON.parse(response));
            },
            error => {
              console.error(
                'Cannot load bulletin for date ' + date + ': ' + error
              );
              this.bulletins[date].setData(null);
            }
          )
          .then(() => {
            if (activate && this.settings.date == date) {
              // reactivate to notify status change
              this.activate(date);
            }
          });
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
      this.settings.region = '';
      this.settings.date = date;
      this.settings.status = this.bulletins[date].status;

      if(this.bulletins[date].length == 1) {
        // TODO: filter by problem!!!
        let b = this.bulletins[date].getData();
        this.setRegion(b[0].id);
      }
    }
  }

  // TODO move to map store
  @action
  setMapViewport(mapState) {
    this.mapCenter.set(mapState.center);
    this.mapZoom.set(mapState.zoom);
  }

  /**
   * Increase or decrease the zoom value of the bulletin map.
   * TODO: move to map store
   */
  @action
  zoomIn() {
    this.mapZoom.set(this.mapZoom + 1);
  }
  @action
  zoomOut() {
    this.mapZoom.set(this.mapZoom - 1);
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
      this.settings.ampm = ampm;
      break;

    default:
      break;
    }
  }

  @action
  setRegion(id) {
    this.settings.region = id;
  }

  @action
  excludeProblem(problemId) {
    if (typeof this.problems[problemId] !== 'undefined') {
      this.problems[problemId].active = false;
    }
  }

  @action
  includeProblem(problemId) {
    if (typeof this.problems[problemId] !== 'undefined') {
      this.problems[problemId].active = true;
    }
  }

  /**
   * Get the bulletins that match the current selection.
   * @return A list of bulletins that match the selection of
   *   this.date and this.ampm
   */
  @computed
  get activeBulletinCollection() {
    return this.bulletins[this.settings.date];
  }

  /**
   * Get the bulletin that is relevant for the currently set region.
   * @return A bulletin object that matches the selection of
   *   this.date, this.ampm and this.region
   */
  @computed
  get activeBulletin() {
    const region = this.settings.region;
    const collection = this.activeBulletinCollection;

    if(collection && collection.length > 0) {
      return collection.getData().find((el) => {
        return el.id == region;
      });
    }
    return null;
  }

  /**
   * Returns leaflet encoded value for map center
   */
  @computed
  get getMapCenter() {
    return toJS(this.mapCenter);
  }

  @computed
  get getMapZoom() {
    return toJS(this.mapZoom);
  }
}

export { BulletinStore, BulletinCollection };
