import { observable, action } from "mobx";

export default class TimeStore {
  _layersToLoad;
  _layersLoading;
  _intervalID;
  _transitionTime;
  _avalailableTimes;
  @observable currentTime;
  _currentTimeId;
  _tickOverdue;

  constructor(options) {
    console.log("TimeStore->constructor: ", options);
    this._layersToLoad = [];
    this._avalailableTimes = options.avalailableTimes;
    this._transitionTime = options.transitionTime || 1000;
    this.currentTime = null;
    this._currentTimeId = 0;
    this._tickOverdue = false;
  }

  @action start() {
    console.log("TimeStore->start: ", this);
    if (this._intervalID) return;
    this._tickOverdue = false;
    console.log("TimeStore->start: setInterval", this);
    this._intervalID = setInterval(this._tick.bind(this), this._transitionTime);
  }

  @action stop() {
    if (!this._intervalID) return;
    clearInterval(this._intervalID);
    this._intervalID = null;
  }

  @action _tick() {
    //to be implemented
    console.log("TimeStore->tick: ");
    if (this._layersToLoad.length > 0) {
      console.log("TimeStore->tick: Waiting for", this._layersToLoad);
      return;
    }
    if (this._availableTimes.length > 0) {
      if (this._currentTimeId >= this._availableTimes.length - 1)
        this._currentTimeId = 0;
      else this._currentTimeId++;
      this._tickOverdue = false;
    } else this.currentTime = null;
    this.currentTime = this._availableTimes[this._currentTimeId];
  }

  @action resetLayerToLoad() {
    this._layersToLoad = [];
    this.start();
  }

  @action addLayerToLoad(layerId) {
    console.log("TimeStore->addLayerToLoad:", layerId, this);
    this._layersToLoad.push(layerId);
    console.log("TimeStore->addLayerToLoad - after:", this._layersToLoad);
  }

  @action removeLayerToLoad(layerId) {
    console.log("TimeStore->removeLayerToLoad:", layerId);
    this._layersToLoad = this._layersToLoad.filter(item => item !== layerId);
    console.log("TimeStore->removeLayerToLoad - after:", this._layersToLoad);
    if (this._tickOverdue) this._tick();
  }

  setTransitionTime(transitionTime) {
    console.log("TimeStore->setTransitionTime:", transitionTime);
    this._transitionTime = transitionTime;
  }

  setAvailableTimes(availableTimes) {
    this._availableTimes = availableTimes;
  }

  // get mapZoom() {
  //   return this._mapZoom.get();
  // }
}
