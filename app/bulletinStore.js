import {observable} from 'mobx';
import Base from './base.js';

export default class BulletinStore {
  // TODO: add language support
  @observable date = '';
  @observable ampm = 'pm';
  @observable region = 'all';
  @observable isLoading = false;
  bulletins = {};

  constructor() {
  }

  /**
   * Load a bulletin from the API and activate it, if desired.
   * @param date The date in YYYY-MM-DD format.
   * @return Void, if the bulletin has already been fetched or a promise object,
   *   if it need to be fetched.
   */
  load(date, activate = true) {
    const url = config.get('apis.bulletin') + '?date=' + encodeURIComponent(date + 'T00:00:00+02:00');
    if(this.bulletins[date]) {
      if(activate) {
        this.setDate(date);
      }
    } else {
      this.isLoading = true;

      return Base.doRequest(url).then(
        response => {
          const responseParsed = JSON.parse(response);
          this.bulletins[date] = responseParsed;
          if(activate) {
            this.setDate(date);
          }
          this.isLoading = false;
        }
      );
    }
  }

  setDate(date) {
    this.date = date;
  }

  setAmPm(ampm) {
    switch(ampm) {
      case 'am':
      case 'pm':
        this.ampm = ampm;
        break;

      default:
        break;
    }
  }

  setRegion(region) {
    this.region = region;
  }

  getActive() {
    return this.get(this.date, this.ampm, this.region);
  }

  get(date, ampm, region = 'all') {
    if(this.bulletins[date]) {
      // TODO: filter by region
      return this.bulletins[date];
    }
    return {};
  }
}
