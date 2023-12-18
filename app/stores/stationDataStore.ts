import { makeAutoObservable } from "mobx";
import { Util } from "leaflet";
import { RegionCodes, regionCodes } from "../util/regions";
import { dateFormat } from "../util/date";
import { currentSeasonYear } from "../util/date-season";

interface FeatureProperties {
  "LWD-Nummer"?: string;
  "LWD-Region"?: string;
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
  operatorLink?: string;
  plot: string;
  RH?: number;
  TD?: number;
  WG_BOE?: number;
  WG?: number;
  WR?: number;
}

export class StationData {
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
  get operatorLink() {
    return this.properties.operatorLink || "";
  }
  get observationStart() {
    return this.properties.Beobachtungsbeginn;
  }
  get state() {
    const region = this.properties["LWD-Region"];
    if (typeof region !== "string") {
      return "";
    }
    const match = region.match(window.config.regionsRegex);
    return match ? match[0] : "";
  }
  get region() {
    return this.state;
  }
  get microRegion() {
    const region = this.properties["LWD-Region"];
    if (typeof region !== "string") {
      return "";
    }
    return region.split(/ /)?.[0];
  }
  get date() {
    return new Date(this.properties.date);
  }
  get temp() {
    return this.properties.LT;
  }
  get temp_srf() {
    return this.properties.OFT;
  }
  get dewp() {
    return this.properties.TD;
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

export default class StationDataStore {
  dateTime: Date;
  readonly dateTimeMax = new Date();
  data: StationData[] = [];
  activeYear: number | "" = currentSeasonYear();
  _activeRegions: Record<string, boolean> = {};
  searchText = "";
  activeData = {
    snow: true,
    temp: true,
    wind: true,
    radiation: true
  };
  sortValue: keyof StationData = "name";
  sortDir: "asc" | "desc" = "asc";
  collator = new Intl.Collator("de");
  _filterObservationStart = false;

  constructor(activeRegion: (r: RegionCodes) => boolean = () => true) {
    regionCodes.forEach(r => (this._activeRegions[r] = activeRegion(r)));
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
      const year = params.get("activeYear");
      this.activeYear = year === "" ? year : +year;
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

  get filterObservationStart() {
    return this._filterObservationStart;
  }

  setFilterObservationStart(filterObservationStart: boolean) {
    this._filterObservationStart = filterObservationStart;
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

  setActiveYear(activeYear: number | "") {
    this.activeYear = activeYear;
  }

  toggleActiveData(key: string | number) {
    this.activeData[key] = !this.activeData[key];
  }

  sortBy(sortValue: keyof StationData, sortDir: "asc" | "desc") {
    this.sortValue = sortValue;
    this.sortDir = sortDir;
  }

  get minYear(): number {
    return this.data.length
      ? Math.min(...this.data.map(d => +d.observationStart))
      : 2000;
  }

  get sortedFilteredData(): StationData[] {
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
          row.properties["LWD-Nummer"]?.match(pattern) ||
          row.microRegion.match(pattern) ||
          row.operator.match(pattern)
      )
      .filter(row => !activeRegion || row.region == activeRegion)
      .filter(
        row =>
          !this._filterObservationStart ||
          !this.activeYear ||
          +row.observationStart <= this.activeYear
      )
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

  async load({ dateTime, ogd }: LoadOptions = {}): Promise<StationData[]> {
    const timePrefix =
      dateTime instanceof Date && +dateTime
        ? dateFormat(new Date(dateTime), "%Y-%m-%d_%H-00", true) + "_"
        : "";
    const stationsFile = ogd
      ? window.config.apis.weather.stationsArchive
      : !dateTime
      ? window.config.apis.weather.stations
      : Util.template(window.config.apis.weather.stationsDateTime, {
          dateTime: timePrefix
        });
    let response: Response;
    try {
      response = await fetch(stationsFile, { cache: "no-cache" });
      if (!response.ok) throw new Error(response.statusText);
      if (
        !dateTime &&
        window.config.apis.weatherFallback &&
        Date.now() - Date.parse(response.headers.get("last-modified")) >
          3 * 3600 * 1000
      ) {
        throw new Error("Too old!");
      }
    } catch (err) {
      if (window.config.apis.weatherFallback) {
        Object.assign(
          window.config.apis.weather,
          window.config.apis.weatherFallback
        );
        delete window.config.apis.weatherFallback;
        console.warn("Using fallback weather data!");
        return this.load({ dateTime, ogd });
      }
      throw err;
    }
    if (response.status === 404) return [];
    const data = await response.json();
    return this.setDataAfterLoad(data, { dateTime, ogd });
  }

  setDataAfterLoad(
    data: GeoJSON.FeatureCollection<GeoJSON.Point, FeatureProperties>,
    { dateTime, ogd }: LoadOptions = {}
  ) {
    this.dateTime = dateTime;
    this.data = data.features
      .filter(el => ogd || el.properties.date)
      .filter(el => !ogd || el.properties.operator.match(/LWD Tirol/))
      .filter(el => !ogd || !el.properties.name.startsWith("Beobachter"))
      .map(feature => new StationData(feature));
    return this.data;
  }
}

interface LoadOptions {
  dateTime?: Date;
  ogd?: boolean;
}
