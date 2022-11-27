import { observable, action, makeObservable } from "mobx";
import { getSuccDate, dateToISODateString, parseDate } from "../util/date.js";

import { GeoJSON as LeafletGeoJSON, PathOptions, Util } from "leaflet";
import {
  AvalancheProblem,
  AvalancheProblemType,
  Bulletin,
  Bulletins,
  isAmPm
} from "./bulletin";
import { fetchJSON, fetchText } from "../util/fetch.js";
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

export type Status = "pending" | "ok" | "empty" | "n/a";

type AmPm = "am" | "pm" | "";

class BulletinCollection {
  date: string;
  status: Status;
  statusMessage: string;
  dataRaw: Bulletins | null;
  eawsBulletins: GeoJSON.FeatureCollection;

  constructor(date: string) {
    this.date = date;
    this.status = "pending";
    this.statusMessage = "";
    this.dataRaw = null;
  }

  get bulletins(): Bulletin[] {
    return this.dataRaw?.bulletins || [];
  }

  get publicationDate(): Date {
    return new Date(this.bulletins[0]?.publicationTime);
  }

  get length(): number {
    return this.dataRaw.bulletins.length;
  }

  getBulletinForBulletinOrRegion(id: string): Bulletin {
    return (
      this.bulletins.find(el => el.bulletinID == id) ??
      this.bulletins.find(el => el.regions.some(r => r.regionID === id))
    );
  }

  getData(): Bulletins {
    return this.dataRaw;
  }

  setData(caaml: Bulletins | null) {
    this.dataRaw = caaml;
    this.dataRaw?.bulletins.forEach(b => {
      b.avalancheProblems?.forEach(p => {
        if (p.problemType === ("wind_drifted_snow" as any)) {
          p.problemType = "wind_slab" as any;
        }
      });
    });
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
    status: "" as Status,
    eawsCount: 0,
    date: "",
    region: ""
  };
  problems: Record<AvalancheProblemType, { highlighted: boolean }> = {
    new_snow: { highlighted: false },
    wind_slab: { highlighted: false },
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

  get date(): Date | undefined {
    return this.settings.date ? parseDate(this.settings.date) : undefined;
  }

  get latestDate(): Date | undefined {
    return this.latest ? parseDate(this.latest) : undefined;
  }

  async _latestBulletinChecker() {
    const now = new Date();
    const today = dateToISODateString(now);
    const tomorrow = dateToISODateString(getSuccDate(now));
    const status = await BulletinStore.getBulletinStatus(tomorrow);
    this._setLatest(status === "ok" ? tomorrow : today);
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

    const url = BulletinStore._getBulletinUrl(date);
    try {
      const response = await fetchJSON(url, {});
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

  dimProblem(problemId: AvalancheProblemType) {
    if (typeof this.problems[problemId] !== "undefined") {
      this.problems[problemId].highlighted = false;
    }
  }

  highlightProblem(problemId: AvalancheProblemType) {
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
  get activeBulletin(): Bulletin {
    if (this.activeBulletinCollection) {
      return this.activeBulletinCollection.getBulletinForBulletinOrRegion(
        this.settings.region
      );
    }
    return null;
  }

  get activeEaws(): GeoJSON.Feature {
    return this._eawsRegions.features.find(f => f.id === this.settings.region);
  }

  getProblemsForRegion(
    regionId: string,
    ampm: AmPm = null
  ): AvalancheProblem[] {
    if (!this.activeBulletinCollection) {
      return [];
    }
    const bulletin =
      this.activeBulletinCollection.getBulletinForBulletinOrRegion(regionId);
    const problems = bulletin?.avalancheProblems?.filter(p =>
      isAmPm(ampm, p.validTimePeriod)
    );
    return problems || [];
  }

  getRegionState(
    regionId: string,
    ampm: AmPm = null
  ): "selected" | "highlighted" | "dimmed" | "dehighlighted" | "default" {
    if (this.settings?.region === regionId) {
      return "selected";
    }
    if (this.activeBulletin?.regions?.some(r => r.regionID === regionId)) {
      return "highlighted";
    }
    if (this.settings.region) {
      // some other region is selected
      return "dimmed";
    }

    const problems = this.getProblemsForRegion(regionId, ampm);
    if (problems.some(p => this.problems?.[p.problemType]?.highlighted)) {
      return "highlighted";
    }

    // dehighligt if any filter is activated
    if (
      (Object.keys(this.problems) as AvalancheProblemType[]).some(
        p => this.problems[p].highlighted
      )
    ) {
      return "dehighlighted";
    }
    return "default";
  }

  getWarnlevel(
    ampm: AmPm,
    regionId: string,
    elevation: "low" | "high"
  ): WarnLevelNumber {
    const bulletin =
      this.activeBulletinCollection.getBulletinForBulletinOrRegion(regionId);
    return bulletin?.dangerRatings
      .filter(({ validTimePeriod }) => isAmPm(ampm, validTimePeriod))
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
      filterFeature(f, this.settings.date)
    );
  }

  get microRegionsElevation(): GeoJSON.Feature[] {
    return this._microRegionsElevation.features
      .filter(f => filterFeature(f, this.settings.date))
      .map(f => this._augmentFeature(f));
  }

  get eawsRegions(): GeoJSON.Feature[] {
    return this._eawsRegions.features
      .filter(f => filterFeature(f, this.settings.date))
      .map(f => this._augmentFeature(f));
  }

  _augmentFeature(f: GeoJSON.Feature, ampm: AmPm = null): GeoJSON.Feature {
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
  getVectorRegions(ampm: AmPm = null): GeoJSON.Feature[] {
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

  static _getBulletinUrl(date: string): string {
    const region = date > "2022-05-06" ? "EUREGIO_" : "";
    return Util.template(config.apis.bulletin.CAAMLv6_2022, {
      date,
      region,
      lang: APP_STORE.language
    });
  }

  static getBulletinStatus(date: string): Promise<Status> {
    const url = BulletinStore._getBulletinUrl(date);
    // cannot use fetchJSON for HTTP HEAD
    return fetchText(url, { method: "head" }).then(
      () => "ok",
      () => "n/a"
    );
  }
}

export const BULLETIN_STORE = new BulletinStore();

export { BulletinStore, BulletinCollection };
