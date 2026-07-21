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
import * as v from "valibot";
import { $extraRegions, $focusRegions } from "../../appStore";
import { eawsRegion } from "../eawsRegions";
import { microRegionsElevation } from "../microRegions";
import { fetchExists, fetchJSON, NotFoundError } from "../../util/fetch.js";
import {
  getDangerRatingValue,
  getWarnlevelNumber,
  WarnLevelNumber
} from "../../util/warn-levels";

export type Status = "pending" | "ok" | "empty" | "n/a";

type RegionID = string;
type LowHigh = "low" | "high";
type ColonLowHigh = "" | `:${LowHigh}`;
type RegionLowHighAmPm = `${RegionID}${ColonLowHigh}${ColonAmPm}`;

export type MaxWarnLevels = Record<RegionLowHighAmPm, WarnLevelNumber>;
export type MaxDangerRatings = Record<RegionLowHighAmPm, DangerRatingValue>;

export type EawsAvalancheProblems = Record<
  RegionLowHighAmPm,
  AvalancheProblemType[]
>;

export function getMaxMainValue(
  dangerRatings: DangerRating[] | DangerRatingValue[] = []
): DangerRatingValue {
  return dangerRatings
    .map(r => (typeof r === "object" ? r.mainValue : r))
    .reduce(
      (a, b): DangerRatingValue =>
        getWarnlevelNumber(a) > getWarnlevelNumber(b) ? a : b,
      "low" as DangerRatingValue
    );
}

/**
 * Class storing one Caaml.Bulletins object with additional state.
 */
class BulletinCollection {
  status: Status = "pending";
  macroRegionStatuses: Record<string, Status> = {};
  private dataRaw: Bulletins | null = null;
  private dataRaw170000: Bulletins | null = null;
  private extraBulletins: Bulletin[] = [];
  maxDangerRatings: MaxDangerRatings = {};
  eawsMaxDangerRatings: MaxDangerRatings = {};
  eawsAvalancheProblems: EawsAvalancheProblems = {};

  constructor(
    public readonly date: Temporal.PlainDate,
    public readonly lang: string
  ) {}

  private _getBulletinUrl(
    publicationDate = "",
    regionOverride?: string
  ): string | undefined {
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
        region: `${regionOverride ?? $focusRegions.get()[0]}_`,
        lang: this.lang
      }
    );
  }

  /** Returns region codes to load: individual regionCodes when no province, or [province] when set. */
  private _getLoadRegions(): string[] {
    return $focusRegions.get();
  }

  async loadStatus(): Promise<Status> {
    const regions = this._getLoadRegions();
    const results = await Promise.all(
      regions
        .map(r => this._getBulletinUrl("", r))
        .filter((url): url is string => !!url)
        .map(url => fetchExists(url))
    );
    return results.some(Boolean) ? "ok" : "n/a";
  }

  private async fetchFromURL(url: string): Promise<Bulletins> {
    const response = await fetchJSON<unknown>(url, { cache: "no-cache" });
    return await v.parseAsync(BulletinsSchema, response);
  }

  private async fetchAndMergeRegions(
    publicationDate: string,
    regions: string[]
  ): Promise<Bulletins> {
    const bulletinMap = new Map<string, Bulletin>();
    await Promise.all(
      regions.map(async r => {
        const url = this._getBulletinUrl(publicationDate, r);
        if (!url) return;
        try {
          const data = await this.fetchFromURL(url);
          data?.bulletins.forEach(b => {
            this.upgradeLegacyCAAML(b);
            bulletinMap.set(b.bulletinID, b);
          });
        } catch (error) {
          if (!(error instanceof NotFoundError)) {
            console.error(
              `Cannot load ${r} bulletin for date ${this.date}`,
              error
            );
          }
        }
      })
    );
    return { bulletins: [...bulletinMap.values()] };
  }

  async load(): Promise<void> {
    const regions = this._getLoadRegions();
    this.dataRaw = await this.fetchAndMergeRegions("", regions);
    if (this.dataRaw.bulletins.length === 0 && regions.length > 1) {
      // No individual CAAMLs found — fall back to the combined EUREGIO CAAML
      try {
        const url = this._getBulletinUrl("", "EUREGIO");
        if (url) {
          this.dataRaw = await this.fetchFromURL(url);
          this.dataRaw?.bulletins.forEach(b => this.upgradeLegacyCAAML(b));
        }
      } catch (error) {
        if (!(error instanceof NotFoundError)) {
          console.error(
            `Cannot load EUREGIO bulletin for date ${this.date}`,
            error
          );
        }
      }
    }
    this.status = this.dataRaw.bulletins.length > 0 ? "ok" : "n/a";
    this.maxDangerRatings = this.computeMaxDangerRatings();
    // Derive per-region statuses from actual bulletin coverage
    $focusRegions.get().forEach(regionCode => {
      const hasBulletins = this.bulletins.some(b =>
        b.regions?.some(
          r =>
            r.regionID === regionCode || r.regionID.startsWith(regionCode + "-")
        )
      );
      this.macroRegionStatuses[regionCode] = hasBulletins ? "ok" : "n/a";
    });
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
      const regions = this._getLoadRegions();
      const merged = await this.fetchAndMergeRegions(publicationDate, regions);
      if (merged.bulletins.length) {
        this.dataRaw170000 = merged;
      }
    } catch (error) {
      console.error(`Cannot load 17:00 bulletin for date ${this.date}`, error);
    }
  }

  static isAfter1700(): boolean {
    return Temporal.Now.plainTimeISO("Europe/Vienna").toString() >= "17:00";
  }

  async loadExtraBulletins() {
    this.extraBulletins = [];
    const extraRegions = $extraRegions.get();
    const data = await Promise.all(
      extraRegions.flatMap(id => {
        const awsList = eawsRegion(id)?.aws ?? [];
        return awsList.map(async (aws): Promise<Bulletins | undefined> => {
          try {
            let url0 = aws.url["api:date"];
            if (!url0?.endsWith("CAAMLv6.json")) return;
            let data: Bulletins;
            let url: string;
            try {
              url = config.template(url0, {
                region: id,
                date: this.date,
                lang: this.lang
              });
              data = await this.fetchFromURL(url);
            } catch (e) {
              if (e instanceof NotFoundError || e instanceof TypeError) {
                url = config.template(url0, {
                  region: id,
                  date: this.date,
                  lang: "en" // fallback lang
                });
                data = await this.fetchFromURL(url);
              } else {
                throw e;
              }
            }
            (data.bulletins ?? []).forEach(b => {
              b.source = {
                provider: {
                  customData: { regionID: id, url },
                  name: aws.name,
                  website: aws.url[this.lang] || Object.values(aws.url)[0]
                }
              };
            });
            return data;
          } catch (error) {
            if (!(error instanceof NotFoundError)) {
              console.error(
                `Cannot load ${id} bulletin for date ${this.date}`,
                error
              );
            }
          }
        });
      })
    );
    this.extraBulletins = data.flatMap(b => b?.bulletins ?? []);
    this.maxDangerRatings = this.computeMaxDangerRatings();

    const loadedExtraRegionIds = new Set(
      this.extraBulletins
        .map(b => b.source?.provider?.customData?.regionID)
        .filter(Boolean)
    );
    extraRegions.forEach(id => {
      this.macroRegionStatuses[id] = loadedExtraRegionIds.has(id)
        ? "ok"
        : "n/a";
    });
  }

  async loadEawsBulletins() {
    this.eawsMaxDangerRatings = {};
    if (!this.date || this.date.toString() < "2021-01-25") {
      return;
    }
    if (!config.eawsRegions.length) {
      return;
    }
    try {
      const url = config.template(config.apis.bulletin.eaws, {
        date: this.date,
        region:
          config.eawsRegions.length === 1 // this.date < "2023-11-01"
            ? `-${config.eawsRegions[0]}`
            : ""
      });
      const { maxDangerRatings } = await fetchJSON<{
        maxDangerRatings: MaxWarnLevels;
      }>(url, {
        cache: "no-cache"
      });
      this.eawsMaxDangerRatings = Object.fromEntries(
        Object.entries(maxDangerRatings)
          .filter(([r]) => config.eawsRegionsRegex.test(r))
          .map(([r, v]) => [r, getDangerRatingValue(v)])
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
    const bulletins = this.dataRaw?.bulletins ?? [];
    const bulletinIDs = new Set(bulletins.map(b => b.bulletinID));
    return [
      ...bulletins,
      ...this.extraBulletins.filter(b => !bulletinIDs.has(b.bulletinID))
    ];
  }

  get ownBulletins(): Bulletin[] {
    return this.dataRaw?.bulletins ?? [];
  }

  get bulletinsWith170000(): [Bulletin, Bulletin | undefined][] {
    return this.bulletins.map(b => [
      b,
      this.dataRaw170000?.bulletins?.find(
        b2 => b.bulletinID === b2.bulletinID
      ) ??
        this.dataRaw170000?.bulletins?.find(b2 =>
          b2.regions.some(r2 => r2.regionID === b.regions[0]?.regionID)
        )
    ]);
  }

  get generalHeadline(): string {
    return this.dataRaw?.customData?.ALBINA?.generalHeadline?.trim() ?? null;
  }

  getBulletinForBulletinOrRegion(id: string): Bulletin {
    return (
      this.bulletins.find(el => el.bulletinID == id) ??
      this.bulletins.find(el => el.regions.some(r => r.regionID === id))
    );
  }

  private upgradeLegacyCAAML(b: Bulletin) {
    b.dangerRatings?.forEach(b => (b.elevation = undefined));
    b.avalancheProblems?.forEach(p => {
      if (p.problemType === ("wind_drifted_snow" as string)) {
        p.problemType = "wind_slab" as AvalancheProblemType;
      }
    });
  }

  private computeMaxDangerRatings(): MaxDangerRatings {
    return Object.fromEntries(
      this.bulletins.flatMap(b =>
        (b.regions ?? []).flatMap(({ regionID }) =>
          (["all_day", "earlier", "later"] as ValidTimePeriod[]).flatMap(
            validTimePeriod => [
              [
                `${regionID}${toAmPm[validTimePeriod]}`,
                this.mainValue(regionID, validTimePeriod, b, undefined)
              ] satisfies [RegionLowHighAmPm, DangerRatingValue],
              ...(["low", "high"] as const).map(
                elevation =>
                  [
                    `${regionID}:${elevation}${toAmPm[validTimePeriod]}`,
                    this.mainValue(regionID, validTimePeriod, b, elevation)
                  ] satisfies [RegionLowHighAmPm, DangerRatingValue]
              )
            ]
          )
        )
      ) || []
    );
  }

  private mainValue(
    regionID: string,
    validTimePeriod: ValidTimePeriod,
    b: Bulletin,
    elevation: LowHigh | undefined
  ): DangerRatingValue {
    const dangerRatings = this.dangerRatings(validTimePeriod, b, elevation);
    const mainValue = getMaxMainValue(dangerRatings);

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
        return this.mainValue(regionID, validTimePeriod, b, "low");
      }
    }

    return mainValue;
  }

  private dangerRatings(
    validTimePeriod: ValidTimePeriod,
    bulletin: Bulletin,
    elevation: LowHigh | undefined
  ): DangerRating[] {
    return (bulletin?.dangerRatings ?? [])
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
