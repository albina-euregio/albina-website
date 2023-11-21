import { makeAutoObservable } from "mobx";
export default class MapStore {
  constructor() {
    this.mapCenter = { lat: 47, lon: 12 };
    this._mapZoom = 9;
    this._showStations = !/android|ip(hone|od|ad)/i.test(navigator.userAgent);
    makeAutoObservable(this);
  }

  setMapViewport(mapState) {
    if (
      mapState &&
      mapState.center &&
      mapState.center.lat &&
      mapState.center.lng
    ) {
      this.mapCenter.lat = mapState.center.lat;
      this.mapCenter.lng = mapState.center.lng;
    }
    this._mapZoom = mapState.zoom;
  }

  /**
   * Increase or decrease the zoom value of the bulletin map.
   */
  zoomIn() {
    this._mapZoom = this._mapZoom.get() + 1;
  }
  zoomOut() {
    this._mapZoom = this._mapZoom.get() - 1;
  }

  /**
   * Returns leaflet encoded value for map center
   */
  // get mapCenter() {
  //   return this._mapCenter.get();
  // }

  get mapZoom() {
    return this._mapZoom;
  }

  get showStations() {
    return this._showStations;
  }

  setShowStations = setTo => {
    this._showStations = setTo;
  };
}

export const MAP_STORE = new MapStore();
