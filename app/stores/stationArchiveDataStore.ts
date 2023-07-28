import { makeAutoObservable } from "mobx";
import { regionCodes } from "../util/regions";
import { currentSeasonYear } from "../util/date-season";

interface FeatureProperties {
  "LWD-Region": string;
  Beobachtungsbeginn: string;
  date?: Date;
  GS_O?: number;
  GS_U?: number;
  HS?: number;
  HSD24?: number;
  HSD48?: number;
  HSD72?: number;
  N6?: number;
  N24?: number;
  N48?: number;
  N72?: number;
  LD?: number;
  LT_MAX?: number;
  LT_MIN?: number;
  LT?: number;
  name: string;
  OFT?: number;
  operator: string;
  plot: string;
  RH?: number;
  TD?: number;
  WG_BOE?: number;
  WG?: number;
  WR?: number;
}

export class StationArchiveData {
  id: string;
  geometry: GeoJSON.Point;
  properties: FeatureProperties;

  constructor(object: GeoJSON.Feature<GeoJSON.Point, FeatureProperties>) {
    this.id = object.id as string;
    this.geometry = object.geometry;
    this.properties = object.properties;
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
  get observationStart() {
    return this.properties.Beobachtungsbeginn;
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
    return this.properties["LWD-Region"].split(/ /)?.[0];
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
  get temp_srf() {
    return this.properties.OFT;
  }
  get dewp() {
    return this.properties.TD;
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
  get precipitation6() {
    return this.properties.N6;
  }
  get precipitation24() {
    return this.properties.N24;
  }
  get precipitation48() {
    return this.properties.N48;
  }
  get precipitation72() {
    return this.properties.N72;
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
  get gr_a() {
    return this.properties.GS_O;
  }
  get gr_b() {
    return this.properties.GS_U;
  }

  get plot() {
    return this.properties.plot;
  }

  round(value: number, digits = 0) {
    if (typeof value === "number") {
      return +value.toFixed(digits);
    } else if (value === undefined) {
      return false;
    } else {
      return value;
    }
  }
}

export default class StationArchiveDataStore {
  data: StationArchiveData[] = [];
  activeYear: number = currentSeasonYear();
  _activeRegions: Record<string, boolean> = {};
  searchText = "";
  activeData = {
    snow: true,
    temp: true,
    wind: true,
    radiation: true
  };
  sortValue: keyof StationArchiveData = "name";
  sortDir: "asc" | "desc" = "asc";
  collator = new Intl.Collator("de");

  constructor() {
    // enable other provinces
    regionCodes.forEach(r => {
      if (r.startsWith("AT-07")) {
        this._activeRegions[r] = true;
      } else {
        this._activeRegions[r] = false;
      }
    });
    makeAutoObservable(this);
  }

  fromURLSearchParams(params: URLSearchParams) {
    if (params.has("searchText")) {
      this.searchText = params.get("searchText");
    }
    if (params.has("activeRegion")) {
      this.activeRegion = params.get("activeRegion");
    }
    if (params.has("activeYear")) {
      this.activeYear = +params.get("activeYear");
    }
    if (params.has("sortValue")) {
      this.sortValue = params.get("sortValue");
    }
    if (params.has("sortDir")) {
      this.sortDir = params.get("sortDir") as "asc" | "desc";
    }
    Object.keys(this.activeData).filter(
      key => (this.activeData[key] = params.get(key) !== "false")
    );
  }

  toURLSearchParams(): URLSearchParams {
    const params = new URLSearchParams();
    if (this.searchText) {
      params.set("searchText", this.searchText);
    }
    if (this.activeRegion !== "all") {
      params.set("activeRegion", this.activeRegion);
    }
    if (this.activeYear !== undefined) {
      params.set("activeYear", this.activeYear.toString());
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

  setSearchText(searchText: string) {
    this.searchText = searchText;
  }

  toggleActiveData(key: string | number) {
    this.activeData[key] = !this.activeData[key];
  }

  sortBy(sortValue: keyof StationArchiveData, sortDir: "asc" | "desc") {
    this.sortValue = sortValue;
    this.sortDir = sortDir;
  }

  get sortedFilteredData(): StationArchiveData[] {
    const pattern = this.searchText
      ? new RegExp(this.searchText, "i")
      : undefined;
    const activeRegion = regionCodes.includes(this.activeRegion)
      ? this.activeRegion
      : undefined;
    return this.data
      .filter(
        row =>
          !pattern ||
          row.name.match(pattern) ||
          row.microRegion.match(pattern) ||
          row.operator.match(pattern)
      )
      .filter(row => !activeRegion || row.region == activeRegion)
      .filter(row => +row.observationStart <= this.activeYear)
      .sort((val1, val2) => {
        const order = this.sortDir == "asc" ? [-1, 1] : [1, -1];
        const a = val1[this.sortValue];
        const b = val2[this.sortValue];

        if (a === b) {
          return 0;
        }
        if (typeof a === "string" && typeof b === "string") {
          return (this.sortDir == "asc" ? 1 : -1) * this.collator.compare(a, b);
        }
        if (typeof b === "undefined" || b === false || b === null) {
          return order[1];
        }
        if (typeof a === "undefined" || a === false || a === null) {
          return order[0];
        }
        return a < b ? order[0] : order[1];
      });
  }

  async load() {
    //console.log("stationDataStore->load ##33", dateTime);
    const response = await fetch(window.config.apis.weather.stationsArchive, {
      cache: "no-cache"
    });
    if (response.status === 404) return [];
    if (!response.ok) return Promise.reject(new Error(response.statusText));
    const data = await response.json();
    return this.setDataAfterLoad(data);
  }

  setDataAfterLoad(
    data: GeoJSON.FeatureCollection<GeoJSON.Point, FeatureProperties>
  ) {
    this.data = data.features
      // show only stations operated by LWD Tirol
      .filter(el => {
        return el.properties.operator.match(/^LWD Tirol$/);
      })
      .map(feature => new StationArchiveData(feature));
    return this.data;
  }
}
