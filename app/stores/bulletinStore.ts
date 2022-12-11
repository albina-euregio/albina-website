import { observable, action, makeObservable } from "mobx";
import { getSuccDate, dateToISODateString, parseDate } from "../util/date.js";

import { Util } from "leaflet";
import {
  AvalancheProblem,
  AvalancheProblemType,
  Bulletin,
  Bulletins,
  isAmPm,
  RegionOutlineProperties
} from "./bulletin";
import { fetchJSON } from "../util/fetch.js";

import { APP_STORE } from "../appStore";
import { WarnLevelNumber, warnlevelNumbers } from "../util/warn-levels";
import { default as filterFeature } from "eaws-regions/filterFeature.mjs";

import microRegions from "./micro_regions.features.json";
import eawsRegions from "./eaws_regions.features.json";

type Status = "pending" | "ok" | "empty" | "n/a";

export type RegionState =
  | "selected"
  | "highlighted"
  | "dehighlighted"
  | "dimmed"
  | "default";

type AmPm = "am" | "pm" | "";

/**
 * Class storing one Caaml.Bulletins object with additional state.
 */
class BulletinCollection {
  date: string;
  status: Status;
  statusMessage: string;
  dataRaw: Bulletins | null;
  eawsBulletins: GeoJSON.FeatureCollection;
  maxDangerRatings: Record<string, WarnLevelNumber>;

  constructor(date: string) {
    this.date = date;
    this.status = "pending";
    this.statusMessage = "";
    this.dataRaw = null;
  }

  get bulletins(): Bulletin[] {
    return this.dataRaw?.bulletins || [];
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

    this.maxDangerRatings = this.computeMaxDangerRatings();
  }

  cancelLoad() {
    this.status = "empty";
  }

  toString() {
    return JSON.stringify(this.dataRaw);
  }

  private computeMaxDangerRatings(): Record<string, WarnLevelNumber> {
    return Object.fromEntries(
      this.dataRaw?.bulletins.flatMap(b =>
        b.regions.flatMap(({ regionID }) =>
          (["", "am", "pm"] as ("" | "am" | "pm")[]).flatMap(ampm =>
            (["low", "high"] as ("low" | "high")[]).map(elevation => [
              `${regionID}:${elevation}:${ampm}`.replace(/:$/, ""),
              this.getWarnlevel(ampm, b, elevation)
            ])
          )
        )
      ) || []
    );
  }

  private getWarnlevel(
    ampm: AmPm,
    bulletin: Bulletin,
    elevation: "low" | "high"
  ): WarnLevelNumber {
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
}

class BulletinStore {
  bulletins: Record<string, BulletinCollection> = {};
  latest: string | null = null;
  settings = {
    status: "" as Status,
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

  /**
   * Load a bulletin from the APIs and activate it, if desired.
   * @param date The date in YYYY-MM-DD format.
   * @param activate A flag to indicate, if the bulletin should be activated.
   * @return Void, if the bulletin has already been fetched or a promise object,
   *   if it need to be fetched.
   */
  async load(date: string, activate = true) {
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
      const response = await fetchJSON(url, { cache: "no-cache" });
      this.bulletins[date].setData(response);
    } catch (error) {
      console.error("Cannot load bulletin for date " + date, error);
      this.bulletins[date].setData(null);
      this.settings.status = "n/a";
      return;
    }

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

      /*
      if (this.bulletins[date].length === 1) {
        // TODO: filter by problem!!!
        let b = this.bulletins[date].getData();
        this.setRegion(b[0].id);
      }
      */
    } else {
      this.settings.status = "empty";
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

  get activeEaws(): RegionOutlineProperties | undefined {
    return eawsRegions.find(r => r.id === this.settings.region);
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

  getRegionState(regionId: string, ampm: AmPm = null): RegionState {
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

  get eawsRegionIds(): string[] {
    return eawsRegions.map(properties => properties.id);
  }

  get microRegionIds(): string[] {
    const today = "2022-12-01";
    return microRegions
      .filter(properties =>
        filterFeature({ properties }, this.settings.date || today)
      )
      .map(f => String(f.id))
      .sort();
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
    return fetch(url, { method: "head" }).then(
      res => (res.ok ? "ok" : "n/a"),
      () => "n/a"
    );
  }
}

export const BULLETIN_STORE = new BulletinStore();

export { BulletinStore, BulletinCollection };
