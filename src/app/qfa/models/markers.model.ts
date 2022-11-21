import * as types from  "../../qfa/types/QFA";

export class Markers {
  public data = {} as types.markers;

  constructor() {}

  public load() {
      if(localStorage.getItem("markers") !== null) {
        this.data = JSON.parse(localStorage.getItem("markers") || "");
      }
  }

  public add(marker: types.marker) {
      const key = `${marker.coordinates.lon}:${marker.coordinates.lat}`;
      if(key in this.data) {
          if(!(marker.name in this.data[key].names)) {
              this.data[key].names.push(marker.name);
          }
      } else {
          this.data[key] = {
              coordinates: marker.coordinates,
              names: [
                  marker.name
              ]
          }
      }
  }

  public get coordinates(): types.coordinates[] {
      const coordinates = Object.values(this.data).map(el => el.coordinates);
      return coordinates;
  }

  public getFilenames(coordinates: types.coordinates): string[] {
      const key = `${coordinates.lon}:${coordinates.lat}`;
      return this.data[key].names;
  }

  public save() {
      localStorage.setItem("markers", JSON.stringify(this.data));
  }
}
