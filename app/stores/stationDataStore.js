import { makeAutoObservable } from "mobx";
import { fetchJSON } from "../util/fetch";
import { Util } from "leaflet";
import { regionCodes } from "../util/regions";

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
  constructor() {
    this.data = [];

    this._activeRegions = (() => {
      let regions = {};
      regionCodes.forEach(r => {
        regions[r] = true;
      });
      return regions;
    })();

    this.searchText = "";
    this.activeData = {
      snow: true,
      temp: true,
      wind: true
    };
    this.sortValue = "";
    this.sortDir = "asc";

    makeAutoObservable(this);
  }

  /**
   * @param {URLSearchParams} params
   */
  fromURLSearchParams(params) {
    if (params.has("searchText")) {
      this.searchText = params.get("searchText");
    }
    if (params.has("activeRegion")) {
      this.activeRegion = params.get("activeRegion");
    }
    if (params.has("sortValue")) {
      this.sortValue = params.get("sortValue");
    }
    if (params.has("sortDir")) {
      this.sortDir = params.get("sortDir");
    }
    Object.keys(this.activeData).filter(
      key => (this.activeData[key] = params.get(key) !== "false")
    );
  }

  /**
   * @returns {URLSearchParams}
   */
  toURLSearchParams() {
    const params = new URLSearchParams();
    if (this.searchText) {
      params.set("searchText", this.searchText);
    }
    if (this.activeRegion !== "all") {
      params.set("activeRegion", this.activeRegion);
    }
    if (this.sortValue) {
      params.set("sortValue", this.sortValue);
    }
    if (this.sortDir && this.sortDir !== "asc") {
      params.set("sortDir", this.sortDir);
    }
    Object.keys(this.activeData)
      .filter(key => this.activeData[key] === false)
      .forEach(key => params.set(key, String(this.activeData[key])));
    return params;
  }

  get activeRegion() {
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

  setSearchText(searchText) {
    this.searchText = searchText;
  }

  toggleActiveData(key) {
    this.activeData[key] = !this.activeData[key];
  }

  sortBy(sortValue, sortDir) {
    this.sortValue = sortValue;
    this.sortDir = sortDir;
  }

  load(timePrefix) {
    let stationsFile = Util.template(window.config.apis.weather.stations, {
      dateTime: timePrefix
    });
    //console.log("StationDataStore->load", timePrefix, stationsFile);

    return fetchJSON(stationsFile)
      .then(data => this.setDataAfterLoad(data))
      .catch(error => {
        if (error.response.status === 404) {
          //console.log("StationDataStore->load could not load", stationsFile);
          return [];
        } else return Promise.reject(error.response);
      });
  }

  setDataAfterLoad(data) {
    this.data = data.features
      .filter(el => el.properties.date)
      .map(feature => new StationData(feature))
      .sort((f1, f2) =>
        f1.properties.name.localeCompare(f2.properties.name, "de")
      );
    return this.data;
  }
}
