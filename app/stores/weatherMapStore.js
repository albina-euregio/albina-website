import { observable, action } from 'mobx';
import Base from '../base';

export default class WeatherMapStore {
  _domain;
  @observable activeItem;
  config;

  constructor(initialDomain) {
    this._domain = observable.box('');
    this.config = {};
    this.activeItem = {};

    Base.doRequest(config.get('links.meteoViewerConfig')).then((response) => {
      this.config = JSON.parse(response);
      this.changeDomain(initialDomain);
    });
  }

  get domain() {
    return this._domain.get();
  }

  get activeConfig() {
    return this.config[this.domain];
  }

  @action
  changeDomain(d) {
    if(d != this._domain.get()) {
      this._domain.set(d);
      this.changeItem();
    }
  }

  @action
  changeItem(itemId = this.domain) {
    if(this.config[this.domain] && this.config[this.domain].items.length > 0) {
      this.activeItem = this.config[this.domain].items.find((i) => (i.id == itemId));
    }
  }
}
