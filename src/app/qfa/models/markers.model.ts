import * as types from  "../../qfa/types/QFA";

export class Markers implements types.MarkerData {
  public markers = {
    "bozen": {
      lng: 11.33,
      lat: 46.47
    },
    "innsbruck": {
      lng: 11.35,
      lat: 47.27
    },
    "linz": {
      lng: 12.80,
      lat: 46.83
    }
  } as types.markers;

  constructor() {}

  getCityName(ll: types.coordinates) {
    return Object.keys(this.markers).find(key => this.markers[key] === ll);
  }
}
