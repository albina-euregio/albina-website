import { observable, action, computed, toJS } from 'mobx';

export default class MapStore {
  @observable mapCenter;
  @observable mapZoom;

  constructor() {
    this.mapCenter = observable.box([47, 12]);
    this.mapZoom = observable.box(9);
  }

  @action setMapViewport(mapState) {
    this.mapCenter.set(mapState.center);
    this.mapZoom.set(mapState.zoom);
  }

  /**
   * Increase or decrease the zoom value of the bulletin map.
   */
  @action zoomIn() {
    this.mapZoom.set(this.mapZoom + 1);
  }
  @action zoomOut() {
    this.mapZoom.set(this.mapZoom - 1);
  }

  /**
   * Returns leaflet encoded value for map center
   */
  @computed get getMapCenter() {
    return toJS(this.mapCenter);
  }

  @computed get getMapZoom() {
    return toJS(this.mapZoom);
  }
}
