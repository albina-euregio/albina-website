import { Temporal } from "temporal-polyfill";
import {
  AvalancheProblemType,
  Bulletin,
  Bulletins,
  BulletinsSchema,
  ColonAmPm,
  DangerRating,
  DangerRatingValue,
  matchesValidTimePeriod,
  toAmPm,
  ValidTimePeriod
} from ".";
import { microRegionsElevation } from "../microRegions";
import { fetchExists, fetchJSON } from "../../util/fetch.js";
import { getWarnlevelNumber, WarnLevelNumber } from "../../util/warn-levels";
import { atom } from "nanostores";

export type Status = "pending" | "ok" | "empty" | "n/a";

type RegionID = string;
type LowHigh = "low" | "high";
type ColonLowHigh = "" | `:${LowHigh}`;

export type MaxDangerRatings = Record<
  `${RegionID}${ColonLowHigh}${ColonAmPm}`,
  WarnLevelNumber
>;

export type EawsAvalancheProblems = Record<
  `${RegionID}${ColonLowHigh}${ColonAmPm}`,
  AvalancheProblemType[]
>;

const eawsRegions = Object.freeze([
  "AD",
  "AT-02",
  "AT-03",
  "AT-04",
  "AT-05",
  "AT-06",
  "AT-08",
  "CH",
  "CZ",
  "DE-BY",
  "ES-CT-L",
  "ES-CT",
  "ES",
  "FI",
  "FR",
  "GB",
  "IS",
  "IT-21",
  "IT-23",
  "IT-25",
  "IT-34",
  "IT-36",
  "IT-57",
  "NO",
  "PL",
  "PL-12",
  "SE",
  "SI",
  "SK"
]);

export const isOneDangerRating = atom(
  new URL(document.location.href).searchParams.get("one-danger-rating") === "1"
);

export function getMaxMainValue(
  dangerRatings: DangerRating[] = []
): DangerRatingValue {
  return dangerRatings.reduce(
    (a, b): DangerRatingValue =>
      getWarnlevelNumber(a) > getWarnlevelNumber(b.mainValue) ? a : b.mainValue,
    "low" as DangerRatingValue
  );
}

/**
 * Class storing one Caaml.Bulletins object with additional state.
 */
class BulletinCollection {
  status: Status;
  dataRaw: Bulletins | null;
  dataRaw170000: Bulletins | null;
  maxDangerRatings: MaxDangerRatings;
  eawsMaxDangerRatings: MaxDangerRatings;
  eawsAvalancheProblems: EawsAvalancheProblems;

  constructor(
    public readonly date: Temporal.PlainDate,
    public readonly lang: string
  ) {
    this.status = "pending";
    this.dataRaw = null;
  }

  private _getBulletinUrl(publicationDate = ""): string {
    if (!this.date || !this.lang) {
      return;
    }
    return config.template(
      publicationDate
        ? config.apis.bulletin.jsonPublicationDate
        : config.apis.bulletin.json,
      {
        date: this.date,
        publicationDate,
        region: "EUREGIO_",
        lang: this.lang
      }
    );
  }

  async loadStatus(): Promise<Status> {
    const url = this._getBulletinUrl();
    if (!url) return "empty";
    const ok = await fetchExists(url);
    return ok ? "ok" : "n/a";
  }

  private async fetchFromURL(url: string) {
    const response = await fetchJSON<unknown>(url, { cache: "no-cache" });
    return await BulletinsSchema.parseAsync(response);
  }

  async load(): Promise<void> {
    const url = this._getBulletinUrl();
    if (!url) return;
    try {
      this.dataRaw = await this.fetchFromURL(url);
      this.dataRaw?.bulletins.forEach(b => this.upgradeLegacyCAAML(b));
      this.status = this.computeStatus();
      this.maxDangerRatings = this.computeMaxDangerRatings();
    } catch (error) {
      console.error(`Cannot load bulletin for date ${this.date}`, error);
      this.dataRaw = null;
      this.status = "n/a";
      this.maxDangerRatings = {};
    }
  }

  async load170000(): Promise<void> {
    this.dataRaw170000 = null;
    try {
      if (!(this.dataRaw?.bulletins ?? []).some(b => b.unscheduled)) {
        return;
      }
      const date = this.date.subtract({ days: 1 });
      const hour = date
        .toPlainDateTime({ hour: 17 })
        .toZonedDateTime("Europe/Vienna")
        .withTimeZone("UTC").hour;
      const publicationDate = `${date}_${hour}-00-00`;
      const url = this._getBulletinUrl(publicationDate);
      const data = await this.fetchFromURL(url);
      if (data?.bulletins?.length) {
        this.dataRaw170000 = data;
      }
    } catch (error) {
      console.error(`Cannot load 17:00 bulletin for date ${this.date}`, error);
    }
  }

  async loadEawsBulletins() {
    this.eawsMaxDangerRatings = {};
    if (!this.date || this.date.toString() < "2021-01-25") {
      return;
    }
    const regex = new RegExp("^(" + eawsRegions.join("|") + ")");
    try {
      const url =
        eawsRegions.length === 1 // this.date < "2023-11-01"
          ? `https://static.avalanche.report/eaws_bulletins/${this.date}/${this.date}-${eawsRegions[0]}.ratings.json`
          : `https://static.avalanche.report/eaws_bulletins/${this.date}/${this.date}.ratings.json`;
      const { maxDangerRatings } = await fetchJSON<{
        maxDangerRatings: MaxDangerRatings;
      }>(url, {
        cache: "no-cache"
      });
      this.eawsMaxDangerRatings = Object.fromEntries(
        Object.entries(maxDangerRatings).filter(([r]) => regex.test(r))
      );
    } catch (error) {
      console.warn(`Cannot load EAWS bulletins for date ${this.date}`, error);
    }
  }

  async loadEawsProblems() {
    this.eawsAvalancheProblems = {};
    if (!this.date || this.date.toString() < "2024-01-01") {
      return;
    }
    try {
      const url = `https://static.avalanche.report/eaws_bulletins/${this.date}/${this.date}.problems.json`;
      const { avalancheProblems } = await fetchJSON<{
        avalancheProblems: EawsAvalancheProblems;
      }>(url, {
        cache: "no-cache"
      });
      this.eawsAvalancheProblems = avalancheProblems;
    } catch (error) {
      console.warn(`Cannot load EAWS problems for date ${this.date}`, error);
    }
  }

  get bulletins(): Bulletin[] {
    return this.dataRaw?.bulletins || [];
  }

  get bulletinsWith170000(): [Bulletin, Bulletin | undefined][] {
    return (this.dataRaw?.bulletins || []).map(b => [
      b,
      this.dataRaw170000?.bulletins?.find(
        b2 => b.bulletinID === b2.bulletinID
      ) ??
        this.dataRaw170000?.bulletins?.find(b2 =>
          b2.regions.some(r2 => r2.regionID === b.regions[0]?.regionID)
        )
    ]);
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
  private upgradeLegacyCAAML(b: Bulletin) {
    if (isOneDangerRating.get()) {
      b.dangerRatings?.forEach(b => (b.elevation = undefined));
    }
    b.avalancheProblems?.forEach(p => {
      if (p.problemType === ("wind_drifted_snow" as string)) {
        p.problemType = "wind_slab" as AvalancheProblemType;
      }
    });
  }

  private computeStatus(): Status {
    return typeof this.dataRaw === "object" && this.dataRaw?.bulletins
      ? this.dataRaw?.bulletins.length > 0
        ? "ok"
        : "empty"
      : "n/a";
  }

  private computeMaxDangerRatings(): MaxDangerRatings {
    return Object.fromEntries(
      this.dataRaw?.bulletins.flatMap(b =>
        b.regions.flatMap(({ regionID }) =>
          (["all_day", "earlier", "later"] as ValidTimePeriod[]).flatMap(
            validTimePeriod => [
              ...[
                isOneDangerRating.get()
                  ? [
                      `${regionID}${toAmPm[validTimePeriod]}`,
                      this.getWarnLevel(regionID, validTimePeriod, b, undefined)
                    ]
                  : []
              ],
              ...(["low", "high"] as const).map(elevation => [
                `${regionID}:${elevation}${toAmPm[validTimePeriod]}`,
                this.getWarnLevel(regionID, validTimePeriod, b, elevation)
              ])
            ]
          )
        )
      ) || []
    );
  }

  private getWarnLevel(
    regionID: string,
    validTimePeriod: ValidTimePeriod,
    b: Bulletin,
    elevation: LowHigh | undefined
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
    elevation: LowHigh | undefined
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
