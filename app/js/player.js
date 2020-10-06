import { computed, observable } from "mobx";

export default class Player {
  _itemsToLoad;
  @observable _intervalID = null;
  _transitionTime;
  _onTick;
  _tickOverdue;
  _owner;

  constructor(options) {
    //console.log("PlayerStore->constructor: ", options);
    this._itemsToLoad = [];
    this._owner = options.owner || self;
    this._transitionTime = options.transitionTime || 1000;
    this._onTick = options.onTick || null;
    this._tickOverdue = false;
  }

  start() {
    //console.log("PlayerStore->start: ", this);
    if (this._intervalID) return;
    this._tickOverdue = false;
    //console.log("PlayerStore->start: eee setInterval", this);
    if (this._onTick) this._onTick.call(this._owner);
    this._intervalID = setInterval(this._tick.bind(this), this._transitionTime);
  }

  stop() {
    if (!this._intervalID) return;
    clearInterval(this._intervalID);
    this._intervalID = null;
  }

  toggle() {
    //console.log("PlayerStore->toggle: eee", this);
    if (!this._intervalID) this.start();
    else this.stop();
  }

  _tick() {
    //to be implemented
    //console.log("PlayerStore->tick: yyyy1", this);
    if (this._itemsToLoad.length > 0) {
      //console.log("PlayerStore->tick: Waiting for eee", this._itemsToLoad);
      this._tickOverdue = true;
      return;
    }
    if (this._onTick) this._onTick.call(this._owner);
  }

  reset() {
    this._itemsToLoad = [];
    this.start();
  }

  onLayerEvent(layerId, state) {
    //console.log("PlayerStore->onEvent: eee", state, layerId, this._itemsToLoad, this._itemsToLoad.includes(layerId));

    switch (state) {
      case "loading":
        if (!this._itemsToLoad.includes(layerId))
          this._itemsToLoad.push(layerId);
        break;
      case "load":
        this._removeItemToLoad(layerId);
        break;
      case "error":
        this._removeItemToLoad(layerId);
    }
    //console.log("PlayerStore->addLayerToLoad - after:", this._layersToLoad);
  }

  _removeItemToLoad(layerId) {
    this._itemsToLoad = this._itemsToLoad.filter(item => item !== layerId);
    if (this._tickOverdue) this._tick();
  }

  setTransitionTime(transitionTime) {
    //console.log("PlayerStore->setTransitionTime:", transitionTime);
    this._transitionTime = transitionTime;
  }

  @computed get playing() {
    //console.log("playing", this._intervalID, this._intervalID !== null);
    return this._intervalID !== null;
  }
}
