import {observable} from 'mobx';
import Base from './base.js';

export default class BulletinStore {
  // TODO: add language support
  @observable date = '';
  @observable ampm = 'am';
  @observable isLoading = true;
  bulletins = {};

  constructor() {
  }

  load(date, activate = true) {
    const url = config.get('apis.bulletin') + '?date=' + encodeURIComponent(date + 'T00:00:00+02:00');
    if(this.bulletins[date]) {
      if(activate) {
        this.date = date;
      }
    } else {
      this.isLoading = true;

      return Base.doRequest(url).then(
        response => {
          const responseParsed = JSON.parse(response);
          this.bulletins[date] = responseParsed;
          this.date = date;
          this.isLoading = false;
        }
      );
    }
  }

  get(date, ampm) {
    if(this.bulletins[date]) {
      return this.bulletins[date];
    }
    return {};
  }
}
