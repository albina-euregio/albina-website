import * as v from "valibot";
import {
  vCaamlAspect,
  vCaamlAvalancheBulletin,
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
  vCaamlValidTimePeriod
} from "../../api/valibot.gen";

export * from "./bulletinCollection";

// The CAAML schemas live in `app/api/valibot.gen.ts`, generated from the
// avalanche.report OpenAPI spec (regenerate with `pnpm openapi`). Import those
// `vCaaml*` schemas directly where you need to validate. This module only adds
// what the generator cannot express: the website-facing type aliases, plus the
// handful of schemas that need overriding — `customData` (kept free-form `any`),
// date fields (coerced to `Date`) and `tendency` (single object or array).

/** Coerces a JSON date (ISO string, timestamp or Date) into a `Date`. */
const CoerceDateSchema = v.pipe(
  v.union([v.string(), v.number(), v.date()]),
  v.transform(value => new Date(value))
);

const CustomDataSchema = v.optional(v.any());
export type CustomData = v.InferOutput<typeof CustomDataSchema>;

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

const ValidTimeSchema = v.object({
  endTime: v.optional(CoerceDateSchema),
  startTime: v.optional(CoerceDateSchema)
});
export type ValidTime = v.InferOutput<typeof ValidTimeSchema>;

const DangerRatingSchema = v.object({
  ...vCaamlDangerRating.entries,
  customData: CustomDataSchema,
  mainValue: vCaamlDangerRatingValue
});
export type DangerRating = v.InferOutput<typeof DangerRatingSchema>;

const RegionSchema = v.object({
  ...vCaamlRegion.entries,
  customData: CustomDataSchema,
  regionID: v.string()
});
export type Region = v.InferOutput<typeof RegionSchema>;

const PersonSchema = v.object({
  ...vCaamlPerson.entries,
  customData: CustomDataSchema
});
export type Person = v.InferOutput<typeof PersonSchema>;

const AvalancheBulletinProviderSchema = v.object({
  ...vCaamlAvalancheBulletinProvider.entries,
  contactPerson: v.optional(PersonSchema),
  customData: CustomDataSchema
});
export type AvalancheBulletinProvider = v.InferOutput<
  typeof AvalancheBulletinProviderSchema
>;

const AvalancheBulletinSourceSchema = v.object({
  ...vCaamlAvalancheBulletinSource.entries,
  provider: v.optional(AvalancheBulletinProviderSchema)
});
export type AvalancheBulletinSource = v.InferOutput<
  typeof AvalancheBulletinSourceSchema
>;

const AvalancheProblemSchema = v.object({
  ...vCaamlAvalancheProblem.entries,
  customData: CustomDataSchema,
  problemType: vCaamlAvalancheProblemType
});
export type AvalancheProblem = v.InferOutput<typeof AvalancheProblemSchema>;

const TendencySchema = v.object({
  ...vCaamlTendency.entries,
  customData: CustomDataSchema,
  validTime: v.optional(ValidTimeSchema)
});
export type Tendency = v.InferOutput<typeof TendencySchema>;

const BulletinSchema = v.object({
  ...vCaamlAvalancheBulletin.entries,
  avalancheProblems: v.optional(v.array(AvalancheProblemSchema)),
  bulletinID: v.string(),
  customData: CustomDataSchema,
  dangerRatings: v.optional(v.array(DangerRatingSchema)),
  nextUpdate: v.optional(CoerceDateSchema),
  publicationTime: CoerceDateSchema,
  regions: v.optional(v.array(RegionSchema)),
  source: v.optional(AvalancheBulletinSourceSchema),
  tendency: v.optional(
    v.union([
      v.pipe(
        TendencySchema,
        v.transform(t => [t])
      ),
      v.array(TendencySchema)
    ])
  ),
  validTime: v.optional(ValidTimeSchema)
});
export type Bulletin = v.InferOutput<typeof BulletinSchema>;

export const BulletinsSchema = v.object({
  ...vCaamlAvalancheBulletins.entries,
  bulletins: v.array(BulletinSchema),
  customData: CustomDataSchema
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

export interface BulletinPhoto {
  url: string;
  copyright: string;
  date: string;
  microRegionId: string;
  locationName: string;
  latitude: number;
  longitude: number;
}

interface AlbinaCustomData extends CustomData {
  ALBINA: {
    mainDate: string;
    bulletinPhotos: BulletinPhoto[];
  };
  LWD_Tyrol: {
    dangerPatterns: DangerPattern[];
  };
}

export function getDangerPatterns(data: CustomData): DangerPattern[] {
  return (data as AlbinaCustomData)?.LWD_Tyrol?.dangerPatterns || [];
}

export function getBulletinPhotos(data: CustomData): BulletinPhoto[] {
  return (data as AlbinaCustomData)?.ALBINA?.bulletinPhotos || [];
}
