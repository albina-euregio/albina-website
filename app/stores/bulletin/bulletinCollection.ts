import {
  AvalancheProblemType,
  Bulletin,
  Bulletins,
  DangerRating,
  matchesValidTimePeriod,
  toAmPm,
  ValidTimePeriod
} from ".";
import { microRegionsElevation } from "../microRegions";
import { fetchExists, fetchJSON } from "../../util/fetch.js";
import { getWarnlevelNumber, WarnLevelNumber } from "../../util/warn-levels";

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
  status: Status;
  dataRaw: Bulletins | null;
  maxDangerRatings: Record<string, WarnLevelNumber>;

  constructor(
    public readonly date: string,
    public readonly lang: string
  ) {
    this.status = "pending";
    this.dataRaw = null;
  }

  private _getBulletinUrl(): string {
    const region = this.date > "2022-05-06" ? "EUREGIO_" : "";
    return config.template(config.apis.bulletin.json, {
      date: this.date,
      region,
      lang: this.lang
    });
  }

  async loadStatus(): Promise<Status> {
    const url = this._getBulletinUrl();
    const ok = await fetchExists(url);
    return ok ? "ok" : "n/a";
  }

  async load(): Promise<this> {
    const url = this._getBulletinUrl();
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

export { BulletinCollection };
