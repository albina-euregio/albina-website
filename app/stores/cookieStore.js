import { observable } from "mobx";
import { storageAvailable } from "../util/storage";

/**
 * Storage for cookie consent dialog. If the dialog is accepted, a localStorage
 * entry is created to prevent the dialog from popping up on page reload.
 */
export default class CookieStore {
  _active;
  hasStorage;

  constructor(cookieName) {
    this.hasStorage = storageAvailable();
    this.name = cookieName;

    // localStorage uses string-based key-value storage (no booleans)
    // -> flag is stored as a string !!!
    const initialValue = this.hasStorage
      ? window.localStorage.getItem(this.name) !== "true"
      : true;

    this._active = observable.box(initialValue);
  }

  get active() {
    return this._active.get();
  }

  set active(flag) {
    this._active.set(flag);
    if (this.hasStorage) {
      window.localStorage.setItem(this.name, String(!flag));
    }
  }
}
