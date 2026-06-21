type PlayerCallback = (() => void) | null;

interface PlayerOptions {
  transitionTime?: number;
  onTick?: PlayerCallback;
  onStop?: PlayerCallback;
  onStart?: PlayerCallback;
}

class Player {
  private _itemsToLoad: string[] = [];
  private _intervalID: ReturnType<typeof setInterval> | null = null;
  private _transitionTime: number;
  private _onTick: PlayerCallback;
  private _onStop: PlayerCallback;
  private _onStart: PlayerCallback;
  private _tickOverdue = false;

  constructor({ transitionTime, onTick, onStop, onStart }: PlayerOptions = {}) {
    this._transitionTime = transitionTime || 1000;
    this._onTick = onTick || null;
    this._onStop = onStop || null;
    this._onStart = onStart || null;
  }

  private _tick = () => {
    //console.log("Player->tick: #1 s05",_itemsToLoad);
    if (this._itemsToLoad.length > 0) {
      //console.log("Player->tick: Waiting for s06",_itemsToLoad);
      this._tickOverdue = true;
      return;
    }
    this._tickOverdue = false;
    //console.log("Player->tick: #2 s05",_itemsToLoad,);
    if (typeof this._onTick === "function") this._onTick();
  };

  start = (options?: Pick<PlayerOptions, "transitionTime" | "onTick">) => {
    //console.log("Player->start: ");
    if (this._intervalID) return;
    if (options?.transitionTime) this._transitionTime = options.transitionTime;
    if (options?.onTick) this._onTick = options.onTick;

    this._tickOverdue = false;
    //console.log("Player->start: eee setInterval", this);
    if (this._onTick) this._onTick();
    if (this._onStart) this._onStart();
    this._intervalID = setInterval(this._tick, this._transitionTime);
  };

  stop = () => {
    //console.log("Player->stop: s05");
    if (!this._intervalID) return;
    clearInterval(this._intervalID);
    this._intervalID = null;
    if (this._onStop) this._onStop();
  };

  toggle = () => {
    //console.log("Player->toggle: s05",_onTick);
    if (!this._intervalID) this.start({});
    else this.stop();
  };

  reset = () => {
    this._itemsToLoad = [];
    this.start();
  };

  onLayerEvent = (layerId: string, state: string) => {
    // console.log(
    //   "Player->onEvent: s071",
    //   state,
    //   layerId,
    //   _itemsToLoad,
    //   _itemsToLoad.includes(layerId)
    // );

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
    //console.log("Player->addLayerToLoad - after:",_layersToLoad);
  };

  private _removeItemToLoad = (layerId: string) => {
    //console.log("Player->onE_removeItemToLoadvent: s06", layerId);

    this._itemsToLoad = this._itemsToLoad.filter(item => item !== layerId);
    if (this._intervalID && this._tickOverdue) {
      //console.log("Player->onE_removeItemToLoadvent: s06", layerId);
      this._tick();
    }
  };

  setTransitionTime = (transitionTime: number) => {
    //console.log("Player->setTransitionTime:", transitionTime);
    this._transitionTime = transitionTime;
  };

  playing = () => {
    //console.log("playing s05",_intervalID );
    return this._intervalID !== null;
  };
}

export default Player;
