export default class Player {
  _itemsToLoad;
  _intervalID;
  _transitionTime;
  _avalailableTimes;
  _onTick;
  _currentTimeId;
  _tickOverdue;
  _owner;

  constructor(options) {
    console.log("PlayerStore->constructor: ", options);
    this._itemsToLoad = [];
    this._owner = options.owner || self;
    this._avalailableTimes = options.avalailableTimes;
    this._transitionTime = options.transitionTime || 1000;
    this._onTick = options.onTick || null;
    this._currentTimeId = 0;
    this._tickOverdue = false;
  }

  start() {
    console.log("PlayerStore->start: ", this);
    if (this._intervalID) return;
    this._tickOverdue = false;
    console.log("PlayerStore->start: setInterval", this);
    this._intervalID = setInterval(this._tick.bind(this), this._transitionTime);
  }

  stop() {
    if (!this._intervalID) return;
    clearInterval(this._intervalID);
    this._intervalID = null;
  }

  _tick() {
    //to be implemented
    //console.log("PlayerStore->tick: ");
    if (this._itemsToLoad.length > 0) {
      console.log("PlayerStore->tick: Waiting for xxx", this._itemsToLoad);
      this._tickOverdue = true;
      return;
    }
    if (this._avalailableTimes.length > 0) {
      if (this._currentTimeId >= this._avalailableTimes.length - 1)
        this._currentTimeId = 0;
      else this._currentTimeId++;
      this._tickOverdue = false;
    } else this._currentTime.set(null);
    //this._currentTime.set(this._avalailableTimes[this._currentTimeId]);
    console.log(
      "################ PlayerStore->tick - after: xxx",
      this._avalailableTimes[this._currentTimeId]
    );
    if (this._onTick)
      this._onTick.call(
        this._owner,
        this._avalailableTimes[this._currentTimeId]
      );
  }

  reset() {
    this._itemsToLoad = [];
    this.start();
  }

  onEvent(layerId, state) {
    console.log("PlayerStore->onEvent: xxx", state, layerId);

    switch (state) {
      case "loading":
        this._itemsToLoad.push(layerId);
      case "load":
        this._removeItemToLoad(layerId);
      case "error":
      //this._removeItemToLoad(layerId);
    }
    //console.log("PlayerStore->addLayerToLoad - after:", this._layersToLoad);
  }

  _removeItemToLoad(layerId) {
    this._itemsToLoad = this._itemsToLoad.filter(item => item !== layerId);
    if (this._tickOverdue) this._tick();
  }

  setTransitionTime(transitionTime) {
    console.log("PlayerStore->setTransitionTime:", transitionTime);
    this._transitionTime = transitionTime;
  }

  setAvailableTimes(availableTimes) {
    this._availableTimes = availableTimes;
  }

  get currentTime() {
    return this._avalailableTimes[this._currentTimeId];
  }
}
