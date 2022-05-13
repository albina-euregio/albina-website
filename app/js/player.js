import { computed, observable, runInAction, makeObservable } from "mobx";

export default class Player {
  constructor(options) {
    //console.log("PlayerStore->constructor: ", options);
    this._itemsToLoad = [];
    this._intervalID = null;
    this._owner = options.owner || self;
    this._transitionTime = options.transitionTime || 1000;
    this._onTick = options.onTick || null;
    this._tickOverdue = false;
    makeObservable(this, {
      _intervalID: observable,
      playing: computed
    });
  }

  start() {
    //console.log("PlayerStore->start: ", this);
    if (this._intervalID) return;
    this._tickOverdue = false;
    //console.log("PlayerStore->start: eee setInterval", this);
    if (this._onTick) this._onTick.call(this._owner);
    runInAction(() => {
      this._intervalID = setInterval(
        this._tick.bind(this),
        this._transitionTime
      );
    });
  }

  stop() {
    if (!this._intervalID) return;
    clearInterval(this._intervalID);
    runInAction(() => {
      this._intervalID = null;
    });
  }

  toggle() {
    //console.log("PlayerStore->toggle: eee", this);
    if (!this._intervalID) this.start();
    else this.stop();
  }

  _tick() {
    //console.log("PlayerStore->tick: #1", this._itemsToLoad, this._onTick);
    if (this._itemsToLoad.length > 0) {
      //console.log("PlayerStore->tick: Waiting for eee", this._itemsToLoad);
      this._tickOverdue = true;
      return;
    }
    //console.log("PlayerStore->tick: #2", this._itemsToLoad, typeof this._onTick);
    if (typeof this._onTick === "function") this._onTick.call(this._owner);
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
    //console.log("PlayerStore->onE_removeItemToLoadvent: eee", layerId);

    this._itemsToLoad = this._itemsToLoad.filter(item => item !== layerId);
    if (this._intervalID && this._tickOverdue) this._tick();
  }

  setTransitionTime(transitionTime) {
    //console.log("PlayerStore->setTransitionTime:", transitionTime);
    this._transitionTime = transitionTime;
  }

  get playing() {
    //console.log("playing", this._intervalID, this._intervalID !== null);
    return this._intervalID !== null;
  }
}
