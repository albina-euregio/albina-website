import { observable } from 'mobx';

export default class CookieConsentStore {
  _active;

  constructor() {
    // TODO: request from window.storage
    this._active = observable.box(true);
  }

  get active() {
    return this._active.get();
  }

  set active(flag) {
    this._active.set(flag);
  }
}
