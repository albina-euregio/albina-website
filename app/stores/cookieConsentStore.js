import { observable } from 'mobx';
import { storageAvailable } from '../util/storage';

/**
 * Storage for cookie consent dialog. If the dialog is accepted, a localStorage
 * entry is created to prevent the dialog from popping up on page reload.
 */
export default class CookieConsentStore {
  _active;
  hasStorage;

  constructor() {
    this.hasStorage = storageAvailable();

    // localStorage uses string-based key-value storage (no booleans)
    // -> flag is stored as a string !!!
    const initialValue = (this.hasStorage)
      ? (window.localStorage.getItem('cookieConsentAccepted') !== 'true')
      : true;

    this._active = observable.box(initialValue);
  }

  get active() {
    return this._active.get();
  }

  set active(flag) {
    this._active.set(flag);
    if(this.hasStorage) {
      window.localStorage.setItem('cookieConsentAccepted', String(!flag));
    }
  }
}
