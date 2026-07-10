import * as v from "valibot";

/** Coerces a JSON date (ISO string, timestamp or Date) into a `Date`. */
const CoerceDateSchema = v.pipe(
  v.union([v.string(), v.number(), v.date()]),
  v.transform(value => new Date(value))
);

export const CustomDataSchema = v.optional(v.any());
export type CustomData = v.InferOutput<typeof CustomDataSchema>;

export const AspectSchema = v.picklist([
  "E",
  "N",
  "n/a",
  "NE",
  "NW",
  "S",
  "SE",
  "SW",
  "W"
]);
export type Aspect = v.InferOutput<typeof AspectSchema>;

export const DangerRatingValueSchema = v.picklist([
  "considerable",
  "high",
  "low",
  "moderate",
  "no_rating",
  "no_snow",
  "very_high"
]);
export type DangerRatingValue = v.InferOutput<typeof DangerRatingValueSchema>;

export const ExpectedAvalancheFrequencySchema = v.picklist([
  "few",
  "many",
  "none",
  "some"
]);
export type ExpectedAvalancheFrequency = v.InferOutput<
  typeof ExpectedAvalancheFrequencySchema
>;

export const AvalancheProblemTypeSchema = v.picklist([
  "cornices",
  "favourable_situation",
  "gliding_snow",
  "new_snow",
  "no_distinct_avalanche_problem",
  "persistent_weak_layers",
  "wet_snow",
  "wind_slab"
]);
export type AvalancheProblemType = v.InferOutput<
  typeof AvalancheProblemTypeSchema
>;

export const ExpectedSnowpackStabilitySchema = v.picklist([
  "fair",
  "good",
  "poor",
  "very_poor"
]);
export type ExpectedSnowpackStability = v.InferOutput<
  typeof ExpectedSnowpackStabilitySchema
>;

export const ValidTimePeriodSchema = v.picklist([
  "all_day",
  "earlier",
  "later"
]);
export type ValidTimePeriod = v.InferOutput<typeof ValidTimePeriodSchema>;

export const TendencyTypeSchema = v.picklist([
  "decreasing",
  "increasing",
  "steady"
]);
export type TendencyType = v.InferOutput<typeof TendencyTypeSchema>;

export const TextsSchema = v.object({
  comment: v.optional(v.string()),
  highlights: v.optional(v.string())
});
export type Texts = v.InferOutput<typeof TextsSchema>;

export const ElevationBoundaryOrBandSchema = v.object({
  lowerBound: v.optional(v.string()),
  upperBound: v.optional(v.string())
});
export type ElevationBoundaryOrBand = v.InferOutput<
  typeof ElevationBoundaryOrBandSchema
>;

export const ExternalFileSchema = v.object({
  description: v.optional(v.string()),
  fileReferenceURI: v.optional(v.string()),
  fileType: v.optional(v.string())
});
export type ExternalFile = v.InferOutput<typeof ExternalFileSchema>;

export const ValidTimeSchema = v.object({
  endTime: v.optional(CoerceDateSchema),
  startTime: v.optional(CoerceDateSchema)
});
export type ValidTime = v.InferOutput<typeof ValidTimeSchema>;

export const MetaDataSchema = v.object({
  comment: v.optional(v.string()),
  extFiles: v.optional(v.array(ExternalFileSchema))
});
export type MetaData = v.InferOutput<typeof MetaDataSchema>;

export const DangerRatingSchema = v.object({
  aspects: v.optional(v.array(AspectSchema)),
  customData: CustomDataSchema,
  elevation: v.optional(ElevationBoundaryOrBandSchema),
  mainValue: DangerRatingValueSchema,
  metaData: v.optional(MetaDataSchema),
  validTimePeriod: v.optional(ValidTimePeriodSchema)
});
export type DangerRating = v.InferOutput<typeof DangerRatingSchema>;

export const RegionSchema = v.object({
  customData: CustomDataSchema,
  metaData: v.optional(MetaDataSchema),
  name: v.optional(v.string()),
  regionID: v.string()
});
export type Region = v.InferOutput<typeof RegionSchema>;

export const PersonSchema = v.object({
  customData: CustomDataSchema,
  metaData: v.optional(MetaDataSchema),
  name: v.optional(v.string()),
  website: v.optional(v.string())
});
export type Person = v.InferOutput<typeof PersonSchema>;

export const AvalancheBulletinProviderSchema = v.object({
  contactPerson: v.optional(PersonSchema),
  customData: CustomDataSchema,
  metaData: v.optional(MetaDataSchema),
  name: v.optional(v.string()),
  website: v.optional(v.string())
});
export type AvalancheBulletinProvider = v.InferOutput<
  typeof AvalancheBulletinProviderSchema
>;

export const TendencySchema = v.object({
  comment: v.optional(v.string()),
  highlights: v.optional(v.string()),
  customData: CustomDataSchema,
  metaData: v.optional(MetaDataSchema),
  tendencyType: v.optional(TendencyTypeSchema),
  validTime: v.optional(ValidTimeSchema)
});
export type Tendency = v.InferOutput<typeof TendencySchema>;

export const AvalancheProblemSchema = v.object({
  aspects: v.optional(v.array(AspectSchema)),
  avalancheSize: v.optional(v.number()),
  comment: v.optional(v.string()),
  customData: CustomDataSchema,
  dangerRatingValue: v.optional(DangerRatingValueSchema),
  elevation: v.optional(ElevationBoundaryOrBandSchema),
  frequency: v.optional(ExpectedAvalancheFrequencySchema),
  metaData: v.optional(MetaDataSchema),
  problemType: AvalancheProblemTypeSchema,
  snowpackStability: v.optional(ExpectedSnowpackStabilitySchema),
  validTimePeriod: v.optional(ValidTimePeriodSchema)
});
export type AvalancheProblem = v.InferOutput<typeof AvalancheProblemSchema>;

export const AvalancheBulletinSourceSchema = v.object({
  person: v.optional(PersonSchema),
  provider: v.optional(AvalancheBulletinProviderSchema)
});
export type AvalancheBulletinSource = v.InferOutput<
  typeof AvalancheBulletinSourceSchema
>;

export const BulletinSchema = v.object({
  avalancheActivity: v.optional(TextsSchema),
  avalancheProblems: v.optional(v.array(AvalancheProblemSchema)),
  bulletinID: v.string(),
  customData: CustomDataSchema,
  dangerRatings: v.optional(v.array(DangerRatingSchema)),
  highlights: v.optional(v.string()),
  lang: v.optional(v.string()),
  metaData: v.optional(MetaDataSchema),
  nextUpdate: v.optional(CoerceDateSchema),
  publicationTime: CoerceDateSchema,
  regions: v.optional(v.array(RegionSchema)),
  snowpackStructure: v.optional(TextsSchema),
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
  travelAdvisory: v.optional(TextsSchema),
  unscheduled: v.optional(v.boolean()),
  validTime: v.optional(ValidTimeSchema),
  weatherForecast: v.optional(TextsSchema),
  weatherReview: v.optional(TextsSchema)
});
export type Bulletin = v.InferOutput<typeof BulletinSchema>;

export const BulletinsSchema = v.object({
  bulletins: v.array(BulletinSchema),
  customData: CustomDataSchema,
  metaData: v.optional(MetaDataSchema)
});
export type Bulletins = v.InferOutput<typeof BulletinsSchema>;
