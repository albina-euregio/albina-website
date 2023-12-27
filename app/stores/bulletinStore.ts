import { action, makeObservable, observable } from "mobx";
import { dateToISODateString, getSuccDate, parseDate } from "../util/date.js";

import {
  AvalancheProblemType,
  Bulletin,
  Bulletins,
  DangerRating,
  matchesValidTimePeriod,
  toAmPm,
  ValidTimePeriod
} from "./bulletin";
import {
  filterFeature,
  microRegions,
  microRegionsElevation,
  RegionOutlineProperties
} from "./microRegions";
import { fetchExists, fetchJSON } from "../util/fetch.js";
import { getWarnlevelNumber, WarnLevelNumber } from "../util/warn-levels";
import eawsRegions from "@eaws/outline_properties/index.json";
import { regionsRegex } from "../util/regions.js";

export type Status = "pending" | "ok" | "empty" | "n/a";

export type RegionState =
  | "selected"
  | "highlighted"
  | "dehighlighted"
  | "dimmed"
  | "default";

/**
 * Class storing one Caaml.Bulletins object with additional state.
 */
class BulletinCollection {
  date: string;
  status: Status;
  statusMessage: string;
  dataRaw: Bulletins | null;
  maxDangerRatings: Record<string, WarnLevelNumber>;

  constructor(date: string) {
    this.date = date;
    this.status = "pending";
    this.statusMessage = "";
    this.dataRaw = null;
  }

  static _getBulletinUrl(date: string): string {
    const region = date > "2022-05-06" ? "EUREGIO_" : "";
    return config.template(config.apis.bulletin.json, {
      date,
      region,
      lang: document.body.parentElement.lang
    });
  }

  async loadStatus(): Promise<Status> {
    const url = BulletinCollection._getBulletinUrl(this.date);
    const ok = await fetchExists(url);
    return ok ? "ok" : "n/a";
  }

  async load(): Promise<this> {
    const url = BulletinCollection._getBulletinUrl(this.date);
    try {
      const response = await fetchJSON(url, { cache: "no-cache" });
      this.setData(response);
    } catch (error) {
      console.error("Cannot load bulletin for date " + this.date, error);
      this.setData(null);
      this.status = "n/a";
    }
    return this;
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
      if (!Array.isArray(b.tendency) && typeof b.tendency === "object") {
        b.tendency = [b.tendency];
      }
      b.avalancheProblems?.forEach(p => {
        if (p.problemType === ("wind_drifted_snow" as string)) {
          p.problemType = "wind_slab" as AvalancheProblemType;
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
          (["all_day", "earlier", "later"] as ValidTimePeriod[]).flatMap(
            validTimePeriod =>
              (["low", "high"] as const).map(elevation => [
                `${regionID}:${elevation}${toAmPm[validTimePeriod]}`,
                this.getWarnLevel(regionID, validTimePeriod, b, elevation)
              ])
          )
        )
      ) || []
    );
  }

  private getWarnLevel(
    regionID: string,
    validTimePeriod: ValidTimePeriod,
    b: Bulletin,
    elevation: "low" | "high"
  ): WarnLevelNumber {
    const dangerRatings = this.dangerRatings(validTimePeriod, b, elevation);
    const warnlevel = dangerRatings
      .map(danger => getWarnlevelNumber(danger.mainValue))
      .reduce((w1, w2) => Math.max(w1, w2) as WarnLevelNumber, 0);

    if (elevation === "high") {
      // take "low" when lowerBound exceeds region threshold
      const threshold = microRegionsElevation.find(feature => {
        return feature.id === regionID && feature.elevation === "high";
      })?.threshold;
      if (
        dangerRatings
          .map(e => e.elevation?.lowerBound)
          .some(bound => +bound > threshold)
      ) {
        return this.getWarnLevel(regionID, validTimePeriod, b, "low");
      }
    }

    return warnlevel;
  }

  private dangerRatings(
    validTimePeriod: ValidTimePeriod,
    bulletin: Bulletin,
    elevation: "low" | "high"
  ): DangerRating[] {
    return bulletin?.dangerRatings
      .filter(danger =>
        matchesValidTimePeriod(validTimePeriod, danger.validTimePeriod)
      )
      .filter(
        danger =>
          (!danger?.elevation?.upperBound && !danger?.elevation?.lowerBound) ||
          (danger?.elevation?.upperBound && elevation === "low") ||
          (danger?.elevation?.lowerBound && elevation === "high")
      );
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

  constructor() {
    makeObservable(this, {
      bulletins: observable,
      latest: observable,
      settings: observable,
      _latestBulletinChecker: action,
      _setLatest: action,
      load: action,
      activate: action,
      setRegion: action
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
    const status = await new BulletinCollection(tomorrow).loadStatus();
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
  async load(date: string, activate = true): Promise<BulletinCollection> {
    if (typeof date !== "string") return;
    if (this.bulletins[date]) {
      if (activate) {
        this.activate(date);
      }
      return this.bulletins[date];
    }
    // create empty bulletin entry
    this.bulletins[date] = new BulletinCollection(date);
    if (activate) {
      this.activate(date);
    }

    try {
      await this.bulletins[date].load();
    } catch (error) {
      console.error("Cannot load bulletin for date " + date, error);
      this.settings.status = "n/a";
      return this.bulletins[date];
    }

    if (activate && this.settings.date == date) {
      // reactivate to notify status change
      this.activate(date);
    }
    return this.bulletins[date];
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

  /**
   * Get the bulletins that match the current selection.
   * @return {BulletinCollection} A list of bulletins that match the selection
   */
  get activeBulletinCollection(): BulletinCollection {
    if (this.settings.status == "ok") {
      return this.bulletins[this.settings.date];
    }
    return null;
  }

  /**
   * Get the bulletin that is relevant for the currently set region.
   * @return A bulletin object that matches the selection
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

  get eawsRegionIds(): string[] {
    return eawsRegions
      .map(properties => properties.id)
      .filter(id => !regionsRegex.test(id));
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
}

export const BULLETIN_STORE = new BulletinStore();

export { BulletinStore, BulletinCollection };
