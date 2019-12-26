import { observable, action, computed } from "mobx";
import axios from "axios";

export class StationData {
  constructor(object) {
    Object.assign(this, object);
  }
  get lon() {
    return this.geometry.coordinates[0];
  }
  get lat() {
    return this.geometry.coordinates[1];
  }
  get elev() {
    return this.geometry.coordinates[2];
  }
  get name() {
    return this.properties.name;
  }
  get operator() {
    return this.properties.operator;
  }
  get state() {
    const region = this.properties["LWD-Region"];
    if (typeof region === "string") {
      const match = region.match(window.config.regionsRegex);
      return match ? match[0] : "";
    } else {
      return "";
    }
  }
  get region() {
    return this.state;
  }
  get microRegion() {
    return this.properties["LWD-Region"];
  }
  get date() {
    return new Date(this.properties.date);
  }
  get temp() {
    return this.properties.LT;
  }
  get temp_max() {
    return this.properties.LT_MAX;
  }
  get temp_min() {
    return this.properties.LT_MIN;
  }
  get snow() {
    return this.properties.HS;
  }
  get snow24() {
    return this.properties.HSD24;
  }
  get snow48() {
    return this.properties.HSD48;
  }
  get snow72() {
    return this.properties.HSD72;
  }
  get rhum() {
    return this.properties.RH;
  }
  get wdir() {
    return this.properties.WR;
  }
  get x_wdir() {
    if (typeof this.properties.WR !== "number") {
      return false;
    }
    const index = Math.round(((this.properties.WR + 360 - 22.5) % 360) / 45);
    const classes = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    return classes[index];
  }
  get wspd() {
    return this.properties.WG;
  }
  get wgus() {
    return this.properties.WG_BOE;
  }

  get plot() {
    return this.properties.plot;
  }

  get parametersForDialog() {
    const types = [
      { type: "snow", digits: 0, unit: "cm" },
      { type: "temp", digits: 1, unit: "°C" },
      { type: "rhum", digits: 0, unit: "%" },
      { type: "wspd", digits: 0, unit: "km/h" },
      { type: "wgus", digits: 0, unit: "km/h" }
    ];
    return types
      .filter(t => this[t.type] !== undefined)
      .map(t => ({
        ...t,
        value: this[t.type]
      }));
  }

  round(value, digits = 0) {
    if (typeof value === "number") {
      return +value.toFixed(digits);
    } else if (value === undefined) {
      return false;
    } else {
      return value;
    }
  }
}

export default class StationDataStore {
  @observable data;
  @observable _activeRegions;
  @observable searchText;
  @observable activeData;
  @observable sortValue;
  @observable sortDir;

  constructor() {
    this.data = [];

    this._activeRegions = (() => {
      let regions = {};
      Object.keys(window.appStore.regions).forEach(r => {
        regions[r] = true;
      });
      return regions;
    })();

    this._searchText = observable.box("");
    this.activeData = {
      snow: true,
      temp: true,
      wind: true
    };
    this._sortValue = observable.box("");
    this._sortDir = observable.box("asc");
  }

  @computed get activeRegion() {
    const actives = Object.keys(this._activeRegions).filter(
      e => this._activeRegions[e]
    );

    const a =
      actives.length > 0 &&
      actives.length < Object.keys(this._activeRegions).length
        ? actives[0]
        : "all";
    return a;
  }

  set activeRegion(el) {
    // activate all if undefined or null is given
    const newActive = el ? [el] : Object.keys(this._activeRegions);

    Object.keys(this._activeRegions).forEach(e => {
      this._activeRegions[e] = newActive.indexOf(e) >= 0;
    });
  }

  get searchText() {
    return this._searchText.get();
  }

  set searchText(value) {
    this._searchText.set(value);
  }

  get sortValue() {
    return this._sortValue.get();
  }

  get sortDir() {
    return this._sortDir.get();
  }

  set sortValue(val) {
    this._sortValue.set(val);
  }

  set sortDir(dir) {
    this._sortDir.set(dir);
  }

  @action
  load() {
    return axios.get(config.apis.weather.stations).then(response => {
      const data = response.data.features.filter(el => el.properties.date);

      this.data = data.map(el => new StationData(el));

      // default ordering by "region" and "name"
      this.data.sort((a, b) => {
        if (a.region != b.region) {
          return a.region < b.region ? -1 : 1;
        }
        const nameA = a.properties.name.toLowerCase();
        const nameB = b.properties.name.toLowerCase();

        if (nameA != nameB) {
          return nameA < nameB ? -1 : 1;
        }
        return 0;
      });
      return this.data;
    });
  }
}
