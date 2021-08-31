import { observable, action } from "mobx";

export default class ModalStateStore {
  _isOpen;
  _data;

  constructor() {
    this._isOpen = observable.box(false);
    this._data = observable.box(false);
  }

  @action open() {
    this._isOpen.set(true);
  }

  @action close() {
    this._isOpen.set(false);
  }

  @action setData(data) {
    this._data.set(data);
  }

  get isOpen() {
    return this._isOpen.get();
  }

  get data() {
    return this._data.get();
  }
}
