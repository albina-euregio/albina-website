import { observable, action, computed, toJS } from "mobx";

export default class MapStore {
  mapCenter;
  _mapZoom;

  constructor() {
    this.mapCenter = { lat: 47, lon: 12 };
    this._mapZoom = observable.box(9);
  }

  @action setMapViewport(mapState) {
    if (mapState.center.lat && mapState.center.lng) {
      this.mapCenter.lat = mapState.center.lat;
      this.mapCenter.lng = mapState.center.lng;
    }
    this._mapZoom.set(mapState.zoom);
  }

  /**
   * Increase or decrease the zoom value of the bulletin map.
   */
  @action zoomIn() {
    this._mapZoom.set(this._mapZoom.get() + 1);
  }
  @action zoomOut() {
    this._mapZoom.set(this._mapZoom.get() - 1);
  }

  /**
   * Returns leaflet encoded value for map center
   */
  // get mapCenter() {
  //   return this._mapCenter.get();
  // }

  get mapZoom() {
    return this._mapZoom.get();
  }
}
