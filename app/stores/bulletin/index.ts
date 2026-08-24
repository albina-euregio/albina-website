import * as v from "valibot";
import {
  vCaamlAspect,
  vCaamlAvalancheBulletin,
  vCaamlAvalancheBulletinCustomData,
  vCaamlAvalancheBulletinCustomDataBulletinPhoto,
  vCaamlAvalancheBulletinProvider,
  vCaamlAvalancheBulletins,
  vCaamlAvalancheBulletinSource,
  vCaamlAvalancheProblem,
  vCaamlAvalancheProblemType,
  vCaamlDangerRating,
  vCaamlDangerRatingValue,
  vCaamlElevationBoundaryOrBand,
  vCaamlExpectedAvalancheFrequency,
  vCaamlExpectedSnowpackStability,
  vCaamlExternalFile,
  vCaamlMetaData,
  vCaamlPerson,
  vCaamlRegion,
  vCaamlTendency,
  vCaamlTendencyType,
  vCaamlTexts,
  vCaamlValidTime,
  vCaamlValidTimePeriod
} from "../../api/valibot.gen";

export * from "./bulletinCollection";

export type Aspect = v.InferOutput<typeof vCaamlAspect>;
export type DangerRatingValue = v.InferOutput<typeof vCaamlDangerRatingValue>;
export type ExpectedAvalancheFrequency = v.InferOutput<
  typeof vCaamlExpectedAvalancheFrequency
>;
export type AvalancheProblemType = v.InferOutput<
  typeof vCaamlAvalancheProblemType
>;
export type ExpectedSnowpackStability = v.InferOutput<
  typeof vCaamlExpectedSnowpackStability
>;
export type ValidTimePeriod = v.InferOutput<typeof vCaamlValidTimePeriod>;
export type TendencyType = v.InferOutput<typeof vCaamlTendencyType>;
export type Texts = v.InferOutput<typeof vCaamlTexts>;
export type ElevationBoundaryOrBand = v.InferOutput<
  typeof vCaamlElevationBoundaryOrBand
>;
export type ExternalFile = v.InferOutput<typeof vCaamlExternalFile>;
export type MetaData = v.InferOutput<typeof vCaamlMetaData>;
export type ValidTime = v.InferOutput<typeof vCaamlValidTime>;

export type DangerRating = v.InferOutput<typeof vCaamlDangerRating>;

export type Region = v.InferOutput<typeof vCaamlRegion>;

export type Person = v.InferOutput<typeof vCaamlPerson>;

export type AvalancheBulletinProvider = v.InferOutput<
  typeof vCaamlAvalancheBulletinProvider
>;

export type AvalancheBulletinSource = v.InferOutput<
  typeof vCaamlAvalancheBulletinSource
>;

export type AvalancheProblem = v.InferOutput<typeof vCaamlAvalancheProblem>;

export type Tendency = v.InferOutput<typeof vCaamlTendency>;

const BulletinSchema = v.object({
  ...vCaamlAvalancheBulletin.entries,
  tendency: v.optional(
    v.union([
      // Array branch must come first: v.object loosely accepts an array as an
      // object and strips it to {}, so a leading single-object branch would
      // swallow the array input and drop every tendency field.
      v.array(vCaamlTendency),
      v.pipe(
        vCaamlTendency,
        v.transform(t => [t])
      )
    ])
  )
});
export type Bulletin = v.InferOutput<typeof BulletinSchema>;

export const BulletinsSchema = v.object({
  ...vCaamlAvalancheBulletins.entries,
  bulletins: v.optional(v.array(BulletinSchema))
});
export type Bulletins = v.InferOutput<typeof BulletinsSchema>;

export function hasDaytimeDependency(b: Bulletin): boolean {
  return b.dangerRatings?.some(({ validTimePeriod }) => {
    return validTimePeriod === "earlier" || validTimePeriod === "later";
  });
}

export function matchesValidTimePeriod(
  p1: ValidTimePeriod | undefined,
  p2: ValidTimePeriod | undefined
): boolean {
  return (
    !p1 ||
    !p2 ||
    p1 === "all_day" ||
    p2 === "all_day" ||
    (p1 === "earlier" && p2 === "earlier") ||
    (p1 === "later" && p2 === "later")
  );
}

export type ColonAmPm = "" | ":am" | ":pm";

export const toAmPm: Record<ValidTimePeriod, ColonAmPm> = Object.freeze({
  all_day: "",
  earlier: ":am",
  later: ":pm"
});

export type DangerPattern =
  | "DP1"
  | "DP2"
  | "DP3"
  | "DP4"
  | "DP5"
  | "DP6"
  | "DP7"
  | "DP8"
  | "DP9"
  | "DP10";

type AlbinaCustomData = v.InferOutput<typeof vCaamlAvalancheBulletinCustomData>;

export type BulletinPhoto = v.InferOutput<
  typeof vCaamlAvalancheBulletinCustomDataBulletinPhoto
>;

export function getDangerPatterns(
  data: Bulletin["customData"]
): DangerPattern[] {
  return (data?.LWD_Tyrol?.dangerPatterns || []) as DangerPattern[];
}

export function getBulletinPhotos(
  data: Bulletin["customData"]
): BulletinPhoto[] {
  return data?.ALBINA?.bulletinPhotos || [];
}

export function getTendencyProgression(
  data: Bulletin["customData"]
): AlbinaCustomData["ALBINA"]["tendencyProgression"] | undefined {
  return data?.ALBINA?.tendencyProgression;
}
