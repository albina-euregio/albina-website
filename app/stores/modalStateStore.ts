import { makeAutoObservable } from "mobx";
import type { StationData } from "./stationDataStore";

type Data = {
  stationData: StationData[];
  rowId: string;
};

export default class ModalStateStore {
  private _isOpen = false;
  private _data: Data = false as unknown as Data;
  constructor() {
    makeAutoObservable(this);
  }

  open() {
    this._isOpen = true;
  }

  close() {
    this._isOpen = false;
  }

  setData(data: Data) {
    this._data = data;
  }

  get isOpen() {
    return this._isOpen;
  }

  get data(): Data {
    return this._data;
  }
}
