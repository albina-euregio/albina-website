import { observable, action } from 'mobx';

export default class ModalStateStore {
  _isOpen;

  constructor() {
    this._isOpen = observable.box(false);
  }

  @action open() {
    console.log('OPEN DIALOG');
    this._isOpen.set(true);
  }

  @action close() {
    console.log('CLOSE DIALOG');
    this._isOpen.set(false);
  }

  get isOpen() {
    return this._isOpen.get();
  }
}
