import { observable, action } from "mobx";

export default class ModalStateStore {
  _isOpen;

  constructor() {
    this._isOpen = observable.box(false);
  }

  @action open() {
    this._isOpen.set(true);
  }

  @action close() {
    this._isOpen.set(false);
  }

  get isOpen() {
    return this._isOpen.get();
  }
}
