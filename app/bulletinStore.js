import { observable, action } from 'mobx';
import Base from './base.js';
import { observable, action, computed, toJS } from 'mobx';

class BulletinData {
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
    if (this.status == 'ok' && this.dataRaw.length > 0) {
      return this.dataRaw[0].publicationDate;
    }

    return null;
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

  constructor() {
    settings = observable({
      status: '',
      date: '',
      ampm: '',
      filters: {}
    });
    bulletins = {};
    this.ampm = config.get('defaults.ampm');
    this.mapCenter = observable.box([47, 12]);
    this.mapZoom = observable.box(9);
  }

  /**
   * Load a bulletin from the API and activate it, if desired.
   * @param date The date in YYYY-MM-DD format.
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
        this.bulletins[date] = new BulletinData(date);

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

  @action
  activate(date) {
    if (this.bulletins[date]) {
      this.settings.date = date;
      this.settings.status = this.bulletins[date].status;
    }
  }

  /**
   * Set the current active 'am'/'pm' state.
   * @param ampm A string 'am' or 'pm'.
   */
  setDate(date) {
    this.date = date;
  }

  @action
  setMapViewport(mapState) {
    this.mapCenter.set(mapState.center);
    this.mapZoom.set(mapState.zoom);
  }

  @action
  zoomIn() {
    this.mapZoom.set(this.mapZoom + 1);
  }
  @action
  zoomOut() {
    this.mapZoom.set(this.mapZoom - 1);
  }

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

  /**
   * Set the current active region to a given value.
   * @param region A valid region identifier or 'all'.
   */
  @action
  setRegion(region) {
    this.settings.region = region;
  }

  /**
   * Get the bulletins that match the current selection.
   * @return A list of bulletins that match the selection of
   *   this.date, this.ampm and this.region
   */
  get active() {
    return this.bulletins[this.settings.date];
  }

  @computed
  get getMapCenter() {
    return toJS(this.mapCenter);
  }

  @computed
  get getMapZoom() {
    return toJS(this.mapZoom);
  }

  get(date, ampm, region = 'all') {
    if (this.bulletins[date]) {
      // TODO: filter by region
      return this.bulletins[date];
    }
    return {};
  }
}

export { BulletinStore, BulletinData };
