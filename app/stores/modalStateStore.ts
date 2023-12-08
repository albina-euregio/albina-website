import { makeAutoObservable } from "mobx";

export default class ModalStateStore {
  private _isOpen = false;
  constructor() {
    makeAutoObservable(this);
  }

  open() {
    this._isOpen = true;
  }

  close() {
    this._isOpen = false;
  }

  get isOpen() {
    return this._isOpen;
  }
}
