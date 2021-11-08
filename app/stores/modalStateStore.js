import { makeAutoObservable } from "mobx";

export default class ModalStateStore {
  constructor() {
    this._isOpen = false;
    this._data = false;
    makeAutoObservable(this);
  }

  open() {
    this._isOpen = true;
  }

  close() {
    this._isOpen = false;
  }

  setData(data) {
    this._data = data;
  }

  get isOpen() {
    return this._isOpen;
  }

  get data() {
    return this._data;
  }
}
