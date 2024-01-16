const Player = ({ transitionTime, onTick, onStop, onStart }) => {
  let _itemsToLoad = [];
  let _intervalID = null;
  let _transitionTime = transitionTime || 1000;
  let _onTick = onTick || null;
  let _onStop = onStop || null;
  let _onStart = onStart || null;
  let _tickOverdue = false;

  const _tick = () => {
    //console.log("Player->tick: #1 s05",_itemsToLoad);
    if (_itemsToLoad.length > 0) {
      //console.log("Player->tick: Waiting for s06",_itemsToLoad);
      _tickOverdue = true;
      return;
    }
    //console.log("Player->tick: #2 s05",_itemsToLoad,);
    if (typeof _onTick === "function") _onTick();
  };

  const start = options => {
    //console.log("Player->start: ");
    if (_intervalID) return;
    if (options?.transitionTime) _transitionTime = transitionTime;
    if (options?.onTick) _onTick = onTick;

    _tickOverdue = false;
    //console.log("Player->start: eee setInterval", this);
    if (_onTick) _onTick();
    if (_onStart) _onStart();
    _intervalID = setInterval(_tick, _transitionTime);
  };

  const stop = () => {
    //console.log("Player->stop: s05");
    if (!_intervalID) return;
    clearInterval(_intervalID);
    _intervalID = null;
    if (_onStop) _onStop();
  };

  const toggle = () => {
    //console.log("Player->toggle: s05",_onTick);
    if (!_intervalID) start({});
    else stop();
  };

  const reset = () => {
    _itemsToLoad = [];
    start();
  };

  const onLayerEvent = (layerId, state) => {
    console.log(
      "Player->onEvent: s071",
      state,
      layerId,
      _itemsToLoad,
      _itemsToLoad.includes(layerId)
    );

    switch (state) {
      case "loading":
        if (!_itemsToLoad.includes(layerId)) _itemsToLoad.push(layerId);
        break;
      case "load":
        _removeItemToLoad(layerId);
        break;
      case "error":
        _removeItemToLoad(layerId);
    }
    //console.log("Player->addLayerToLoad - after:",_layersToLoad);
  };

  const _removeItemToLoad = layerId => {
    //console.log("Player->onE_removeItemToLoadvent: s06", layerId);

    _itemsToLoad = _itemsToLoad.filter(item => item !== layerId);
    if (_intervalID && _tickOverdue) _tick();
  };

  const setTransitionTime = transitionTime => {
    //console.log("Player->setTransitionTime:", transitionTime);
    _transitionTime = transitionTime;
  };

  const playing = () => {
    //console.log("playing s05",_intervalID );
    return _intervalID !== null;
  };

  return {
    start,
    stop,
    toggle,
    reset,
    onLayerEvent,
    setTransitionTime,
    playing
  };
};

export default Player;
