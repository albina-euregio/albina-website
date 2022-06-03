import { observable, action, makeObservable } from "mobx";
import {
  parseDate,
  parseDateSeconds,
  getSuccDate,
  dateToISODateString
} from "../util/date.js";

import { GeoJSON as LeafletGeoJSON, PathOptions, Util } from "leaflet";
import {
  AvalancheProblem,
  AvalancheProblemType,
  Bulletins,
  convertCaamlToJson,
  DaytimeBulletin,
  toDaytimeBulletins
} from "./bulletin";
import { fetchText } from "../util/fetch.js";
import { loadEawsBulletins } from "./bulletinStoreEaws";

import { decodeFeatureCollection } from "../util/polyline.js";
import { APP_STORE } from "../appStore";
import {
  WarnLevelNumber,
  warnlevelNumbers,
  WARNLEVEL_COLORS,
  WARNLEVEL_OPACITY
} from "../util/warn-levels";
import { default as filterFeature } from "eaws-regions/filterFeature.mjs";

const enableEawsRegions = true;

type Status = "pending" | "ok" | "empty" | "n/a";

class BulletinCollection {
  date: string;
  status: Status;
  statusMessage: string;
  dataRaw: Bulletins;
  daytimeBulletins: DaytimeBulletin[];
  eawsBulletins: GeoJSON.FeatureCollection;

  constructor(date: string) {
    this.date = date;
    this.status = "pending";
    this.statusMessage = "";
    this.dataRaw = null;
    this.daytimeBulletins = [];
  }

  get regions(): string[] {
    return this.daytimeBulletins.map(el => el.id);
  }

  get publicationDate(): Date {
    // return maximum of all publicationDates
    if (this.status == "ok" && this.length > 0) {
      return this.daytimeBulletins
        .map(b => parseDate(b.forenoon.publicationTime))
        .reduce((acc, d) => (d > acc ? d : acc), new Date(0));
    }

    return null;
  }

  get publicationDateSeconds(): Date {
    // return maximum of all publicationDates
    if (this.status == "ok" && this.length > 0) {
      return this.daytimeBulletins
        .map(b => parseDateSeconds(b.forenoon.publicationTime))
        .reduce((acc, d) => (d > acc ? d : acc), new Date(0));
    }

    return null;
  }

  get length(): number {
    return this.daytimeBulletins.length;
  }

  hasDaytimeDependency(): boolean {
    return this.daytimeBulletins.some(b => b.hasDaytimeDependency);
  }

  getBulletinForRegion(regionId: string): DaytimeBulletin {
    return (
      this.daytimeBulletins.find(el => el.id == regionId) ??
      this.daytimeBulletins.find(el =>
        el.forenoon.regions.find(r => r.id === regionId)
      )
    );
  }

  getData(): Bulletins {
    return this.dataRaw;
  }

  setData(xmlString: string | any[]) {
    if (typeof xmlString !== "string" || xmlString.length == 0) {
      this.dataRaw = undefined;
      this.status = "empty";
      return;
    }
    const parser = new DOMParser();
    const document = parser.parseFromString(xmlString, "application/xml");
    this.dataRaw = convertCaamlToJson(document.documentElement);
    this.daytimeBulletins = toDaytimeBulletins(this.dataRaw?.bulletins || []);
    // console.log(this.dataRaw);
    this.status =
      typeof this.dataRaw === "object" && this.dataRaw && this.dataRaw.bulletins
        ? this.dataRaw.bulletins.length > 0
          ? "ok"
          : "empty"
        : "n/a";
  }

  cancelLoad() {
    this.status = "empty";
  }

  toString() {
    return JSON.stringify(this.dataRaw);
  }
}

class BulletinStore {
  // not observable
  _microRegions: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: []
  };
  // not observable
  _microRegionsElevation: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: []
  };
  // not observable
  _eawsRegions: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: []
  };
  bulletins: Record<string, BulletinCollection> = {};
  latest: string | null = null;
  settings = {
    status: "",
    eawsCount: 0,
    date: "",
    region: ""
  };
  problems: Record<AvalancheProblemType, { highlighted: boolean }> = {
    new_snow: { highlighted: false },
    wind_drifted_snow: { highlighted: false },
    persistent_weak_layers: { highlighted: false },
    wet_snow: { highlighted: false },
    gliding_snow: { highlighted: false }
  };
  constructor() {
    makeObservable(this, {
      bulletins: observable,
      latest: observable,
      settings: observable,
      problems: observable,
      _latestBulletinChecker: action,
      _setLatest: action,
      load: action,
      loadEawss: action,
      activate: action,
      setRegion: action,
      dimProblem: action,
      highlightProblem: action
    });
  }

  init(): this {
    if (this.latest) {
      return;
    }
    this._latestBulletinChecker();
    return this;
  }

  clear() {
    this.bulletins = {};
    this.settings = {
      status: "",
      eawsCount: 0,
      date: "",
      region: ""
    };
  }

  _latestBulletinChecker() {
    const now = new Date();
    const today = dateToISODateString(now);
    const tomorrow = dateToISODateString(getSuccDate(now));
    const url = this._getBulletinUrl(tomorrow);
    fetchText(url, { method: "head" }).then(
      () => this._setLatest(tomorrow),
      () => this._setLatest(today)
    );
    window.setTimeout(
      () => this._latestBulletinChecker(),
      config.bulletin.checkForLatestInterval * 60000
    );
  }

  _setLatest(latest: string) {
    this.latest = latest;
  }

  async loadMicroRegions() {
    if (this._microRegions.features.length) return;
    const polyline = await import("./micro_regions.polyline.json");
    this._microRegions = decodeFeatureCollection(polyline.default);
  }

  async loadMicroRegionsElevation() {
    if (this._microRegionsElevation.features.length) return;
    const polyline = await import("./micro-regions_elevation.polyline.json");
    this._microRegionsElevation = decodeFeatureCollection(polyline.default);
  }

  async loadEawsRegions() {
    if (this._eawsRegions.features.length) return;
    const polyline = await import("./eaws_regions.polyline.json");
    this._eawsRegions = decodeFeatureCollection(polyline.default);
  }

  /**
   * Load a bulletin from the APIs and activate it, if desired.
   * @param date The date in YYYY-MM-DD format.
   * @param activate A flag to indicate, if the bulletin should be activated.
   * @return Void, if the bulletin has already been fetched or a promise object,
   *   if it need to be fetched.
   */
  async load(date: string, activate = true) {
    this.loadMicroRegions();
    this.loadMicroRegionsElevation();
    this.loadEawsRegions();
    // console.log("loading bulletin", { date, activate });
    if (typeof date !== "string") return;
    if (this.bulletins[date]) {
      if (activate) {
        this.activate(date);
      }
      return;
    }
    // create empty bulletin entry
    this.bulletins[date] = new BulletinCollection(date);
    if (activate) {
      this.activate(date);
    }

    const url = this._getBulletinUrl(date);
    try {
      const response = await fetchText(url, {});
      this.bulletins[date].setData(response);
    } catch (error) {
      console.error("Cannot load bulletin for date " + date, error);
      this.bulletins[date].setData(null);
      return;
    }

    if (activate && this.settings.date == date) {
      // reactivate to notify status change
      this.activate(date);
    }
  }

  async loadEawss(date: string, activate = true) {
    if (!enableEawsRegions) return;
    if (typeof date !== "string") return;
    this.settings.eawsCount = 0;
    const geojson = await loadEawsBulletins(date);
    this.bulletins[date].eawsBulletins = geojson;
    if (activate && this.settings.date == date) {
      // reactivate to notify status change
      this.activate(date);
    }
  }

  /**
   * Activate bulletin collection for a given date.
   * @param date The date in yyyy-mm-dd format.
   */
  activate(date: string) {
    if (this.bulletins[date]) {
      this.settings.region = "";
      this.settings.date = date;
      this.settings.status = this.bulletins[date].status;
      this.settings.eawsCount =
        this.bulletins[date].eawsBulletins?.features?.length ?? 0;

      /*
      if (this.bulletins[date].length === 1) {
        // TODO: filter by problem!!!
        let b = this.bulletins[date].getData();
        this.setRegion(b[0].id);
      }
      */
    } else {
      this.settings.status = "missing";
    }
  }

  setRegion(id: string) {
    this.settings.region = id;
  }

  dimProblem(problemId: string | number) {
    if (typeof this.problems[problemId] !== "undefined") {
      this.problems[problemId].highlighted = false;
    }
  }

  highlightProblem(problemId: string | number) {
    if (typeof this.problems[problemId] !== "undefined") {
      this.problems[problemId].highlighted = true;
    }
  }

  /**
   * Get the bulletins that match the current selection.
   * @return {BulletinCollection} A list of bulletins that match the selection of
   *   this.date and this.ampm
   */
  get activeBulletinCollection(): BulletinCollection {
    if (this.settings.status == "ok") {
      return this.bulletins[this.settings.date];
    }
    return null;
  }

  get activeEawsBulletins() {
    return this.bulletins[this.settings.date]?.eawsBulletins;
  }

  get activeRegionName(): string {
    if (!this.settings?.region?.match(config.regionsRegex)) {
      return "";
    }
    const feature = this.microRegions.find(f => f.id === this.settings.region);
    return (feature?.id as string) ?? "";
  }

  /**
   * Get the bulletin that is relevant for the currently set region.
   * @return A bulletin object that matches the selection of
   *   this.date, this.ampm and this.region
   */
  get activeBulletin(): DaytimeBulletin {
    if (this.activeBulletinCollection) {
      return this.activeBulletinCollection.getBulletinForRegion(
        this.settings.region
      );
    }
    return null;
  }

  get activeEaws(): GeoJSON.Feature {
    return this._eawsRegions.features.find(f => f.id === this.settings.region);
  }

  getProblemsForRegion(regionId: string, ampm = null): AvalancheProblem[] {
    if (!this.activeBulletinCollection) {
      return [];
    }
    const bulletin =
      this.activeBulletinCollection.getBulletinForRegion(regionId);
    if (!bulletin) {
      return [];
    }
    const daytime =
      bulletin.hasDaytimeDependency && ampm == "pm" ? "afternoon" : "forenoon";
    return bulletin[daytime].avalancheProblems || [];
  }

  getRegionState(
    regionId: string,
    ampm = null
  ): "selected" | "highlighted" | "dimmed" | "dehighlighted" | "default" {
    if (this.settings?.region === regionId) {
      return "selected";
    }
    if (this.activeBulletin?.forenoon?.regions?.some(r => r.id === regionId)) {
      return "highlighted";
    }
    if (this.settings.region) {
      // some other region is selected
      return "dimmed";
    }

    const problems = this.getProblemsForRegion(regionId, ampm);
    if (problems.some(p => this.problems?.[p.type]?.highlighted)) {
      return "highlighted";
    }

    // dehighligt if any filter is activated
    if (Object.keys(this.problems).some(p => this.problems[p].highlighted)) {
      return "dehighlighted";
    }
    return "default";
  }

  getWarnlevel(
    ampm: "am" | "pm",
    regionId: string,
    elevation: "low" | "high"
  ): WarnLevelNumber {
    const daytimeBulletin =
      this.activeBulletinCollection.getBulletinForRegion(regionId);
    const daytime =
      daytimeBulletin?.hasDaytimeDependency && ampm == "pm"
        ? "afternoon"
        : "forenoon";
    const bulletin = daytimeBulletin?.[daytime];
    return bulletin?.dangerRatings
      .filter(
        danger =>
          (!danger?.elevation?.upperBound && !danger?.elevation?.lowerBound) ||
          (danger?.elevation?.upperBound && elevation === "low") ||
          (danger?.elevation?.lowerBound && elevation === "high")
      )
      .map(danger => warnlevelNumbers[danger.mainValue])
      .reduce((w1, w2) => Math.max(w1, w2), 0);
  }

  getMicroElevationStyle(
    feature: GeoJSON.Feature,
    ampm: "am" | "pm"
  ): PathOptions {
    let id = String(feature.id);
    let warnlevel = this.getWarnlevel(ampm, id, feature.properties.elevation);
    if (warnlevel == undefined) warnlevel = 0;
    return {
      stroke: false,
      fillColor: WARNLEVEL_COLORS[warnlevel],
      fillOpacity: WARNLEVEL_OPACITY[warnlevel]
    };
  }

  get microRegions(): GeoJSON.Feature[] {
    return this._microRegions.features.filter(f =>
      filterFeature(f, this.latest)
    );
  }

  get microRegionsElevation(): GeoJSON.Feature[] {
    return this._microRegionsElevation.features
      .filter(f => filterFeature(f, this.latest))
      .map(f => this._augmentFeature(f));
  }

  get eawsRegions(): GeoJSON.Feature[] {
    return this._eawsRegions.features
      .filter(f => filterFeature(f, this.latest))
      .map(f => this._augmentFeature(f));
  }

  _augmentFeature(f: GeoJSON.Feature, ampm = null): GeoJSON.Feature {
    if (!f.properties) f.properties = {};
    f.properties.state = this.getRegionState(f.id, ampm);
    if (!f.properties.latlngs) {
      f.properties.latlngs = LeafletGeoJSON.coordsToLatLngs(
        f.geometry.coordinates,
        f.geometry.type === "Polygon" ? 1 : 2
      );
    }
    return f;
  }

  // assign states to regions
  getVectorRegions(ampm = null): GeoJSON.Feature[] {
    const collection = this.activeBulletinCollection;

    if (collection && collection.length > 0) {
      const regions: GeoJSON.Feature[] = this.microRegions.map(f =>
        this._augmentFeature(f, ampm)
      );

      const states = [
        "selected",
        "highlighted",
        "dehighlighted",
        "dimmed",
        "default"
      ];
      regions.sort((r1, r2) => {
        return states.indexOf(r1.properties.state) <
          states.indexOf(r2.properties.state)
          ? 1
          : -1;
      });
      return regions;
    } else {
      return [];
    }
  }

  _getBulletinUrl(date: string): string {
    const region = date > "2022-05-06" ? "EUREGIO_" : "";
    return Util.template(config.apis.bulletin.xml, {
      date,
      region,
      lang: APP_STORE.language
    });
  }
}

export const BULLETIN_STORE = new BulletinStore();

export { BulletinStore, BulletinCollection };
