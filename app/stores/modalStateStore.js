import { observable, action, makeObservable } from "mobx";

export default class ModalStateStore {
  constructor() {
    this._isOpen = observable.box(false);
    this._data = observable.box(false);
    makeObservable(this, {
      open: action,
      close: action,
      setData: action
    });
  }

  open() {
    this._isOpen.set(true);
  }

  close() {
    this._isOpen.set(false);
  }

  setData(data) {
    this._data.set(data);
  }

  get isOpen() {
    return this._isOpen.get();
  }

  get data() {
    return this._data.get();
  }
}
