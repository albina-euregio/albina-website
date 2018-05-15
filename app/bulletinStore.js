import Base from './base.js';
import { observable, action, computed, toJS } from 'mobx';

export default class BulletinStore {
  // TODO: add language support
  @observable date = '';
  @observable ampm = 'pm';
  @observable region = 'all';
  @observable isLoading = false;
  @observable mapCenter = [15, 50];
  @observable mapZoom = 12;

  bulletins = {};

  constructor() {
    this.mapCenter = observable.box([47, 12]);
    this.mapZoom = observable.box(9);
  }

  /**
   * Load a bulletin from the API and activate it, if desired.
   * @param date The date in YYYY-MM-DD format.
   * @return Void, if the bulletin has already been fetched or a promise object,
   *   if it need to be fetched.
   */
  load(date, activate = true) {
    const url =
      config.get('apis.bulletin') +
      '?date=' +
      encodeURIComponent(date + 'T00:00:00+02:00');
    if (this.bulletins[date]) {
      if (activate) {
        this.setDate(date);
      }
    } else {
      this.isLoading = true;

      return Base.doRequest(url).then(response => {
        const responseParsed = JSON.parse(response);
        this.bulletins[date] = responseParsed;
        if (activate) {
          this.setDate(date);
        }
        this.isLoading = false;
      });
    }
  }

  @action
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
        this.ampm = ampm;
        break;

      default:
        break;
    }
  }

  @action
  setRegion(region) {
    this.region = region;
  }

  @computed
  get getActive() {
    return this.get(this.date, this.ampm, this.region);
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
