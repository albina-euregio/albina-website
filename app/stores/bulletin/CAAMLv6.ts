import * as z from "zod";

export const CustomDataSchema = z.any().optional();
export type CustomData = z.infer<typeof CustomDataSchema>;

export const AspectSchema = z.enum([
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
export type Aspect = z.infer<typeof AspectSchema>;

export const DangerRatingValueSchema = z.enum([
  "considerable",
  "high",
  "low",
  "moderate",
  "no_rating",
  "no_snow",
  "very_high"
]);
export type DangerRatingValue = z.infer<typeof DangerRatingValueSchema>;

export const ExpectedAvalancheFrequencySchema = z.enum([
  "few",
  "many",
  "none",
  "some"
]);
export type ExpectedAvalancheFrequency = z.infer<
  typeof ExpectedAvalancheFrequencySchema
>;

export const AvalancheProblemTypeSchema = z.enum([
  "cornices",
  "favourable_situation",
  "gliding_snow",
  "new_snow",
  "no_distinct_avalanche_problem",
  "persistent_weak_layers",
  "wet_snow",
  "wind_slab"
]);
export type AvalancheProblemType = z.infer<typeof AvalancheProblemTypeSchema>;

export const ExpectedSnowpackStabilitySchema = z.enum([
  "fair",
  "good",
  "poor",
  "very_poor"
]);
export type ExpectedSnowpackStability = z.infer<
  typeof ExpectedSnowpackStabilitySchema
>;

export const ValidTimePeriodSchema = z.enum(["all_day", "earlier", "later"]);
export type ValidTimePeriod = z.infer<typeof ValidTimePeriodSchema>;

export const TendencyTypeSchema = z.enum([
  "decreasing",
  "increasing",
  "steady"
]);
export type TendencyType = z.infer<typeof TendencyTypeSchema>;

export const TextsSchema = z.object({
  comment: z.string().optional(),
  highlights: z.string().optional()
});
export type Texts = z.infer<typeof TextsSchema>;

export const ElevationBoundaryOrBandSchema = z.object({
  lowerBound: z.string().optional(),
  upperBound: z.string().optional()
});
export type ElevationBoundaryOrBand = z.infer<
  typeof ElevationBoundaryOrBandSchema
>;

export const ExternalFileSchema = z.object({
  description: z.string().optional(),
  fileReferenceURI: z.string().optional(),
  fileType: z.string().optional()
});
export type ExternalFile = z.infer<typeof ExternalFileSchema>;

export const ValidTimeSchema = z.object({
  endTime: z.coerce.date().optional(),
  startTime: z.coerce.date().optional()
});
export type ValidTime = z.infer<typeof ValidTimeSchema>;

export const MetaDataSchema = z.object({
  comment: z.string().optional(),
  extFiles: z.array(ExternalFileSchema).optional()
});
export type MetaData = z.infer<typeof MetaDataSchema>;

export const DangerRatingSchema = z.object({
  aspects: z.array(AspectSchema).optional(),
  customData: CustomDataSchema,
  elevation: ElevationBoundaryOrBandSchema.optional(),
  mainValue: DangerRatingValueSchema,
  metaData: MetaDataSchema.optional(),
  validTimePeriod: ValidTimePeriodSchema.optional()
});
export type DangerRating = z.infer<typeof DangerRatingSchema>;

export const RegionSchema = z.object({
  customData: CustomDataSchema,
  metaData: MetaDataSchema.optional(),
  name: z.string().optional(),
  regionID: z.string()
});
export type Region = z.infer<typeof RegionSchema>;

export const PersonSchema = z.object({
  customData: CustomDataSchema,
  metaData: MetaDataSchema.optional(),
  name: z.string().optional(),
  website: z.string().optional()
});
export type Person = z.infer<typeof PersonSchema>;

export const AvalancheBulletinProviderSchema = z.object({
  contactPerson: PersonSchema.optional(),
  customData: CustomDataSchema,
  metaData: MetaDataSchema.optional(),
  name: z.string().optional(),
  website: z.string().optional()
});
export type AvalancheBulletinProvider = z.infer<
  typeof AvalancheBulletinProviderSchema
>;

export const TendencySchema = z.object({
  comment: z.string().optional(),
  highlights: z.string().optional(),
  customData: CustomDataSchema,
  metaData: MetaDataSchema.optional(),
  tendencyType: TendencyTypeSchema.optional(),
  validTime: ValidTimeSchema.optional()
});
export type Tendency = z.infer<typeof TendencySchema>;

export const AvalancheProblemSchema = z.object({
  aspects: z.array(AspectSchema).optional(),
  avalancheSize: z.number().optional(),
  comment: z.string().optional(),
  customData: CustomDataSchema,
  dangerRatingValue: DangerRatingValueSchema.optional(),
  elevation: ElevationBoundaryOrBandSchema.optional(),
  frequency: ExpectedAvalancheFrequencySchema.optional(),
  metaData: MetaDataSchema.optional(),
  problemType: AvalancheProblemTypeSchema,
  snowpackStability: ExpectedSnowpackStabilitySchema.optional(),
  validTimePeriod: ValidTimePeriodSchema.optional()
});
export type AvalancheProblem = z.infer<typeof AvalancheProblemSchema>;

export const AvalancheBulletinSourceSchema = z.object({
  person: PersonSchema.optional(),
  provider: AvalancheBulletinProviderSchema.optional()
});
export type AvalancheBulletinSource = z.infer<
  typeof AvalancheBulletinSourceSchema
>;

export const BulletinSchema = z.object({
  avalancheActivity: TextsSchema.optional(),
  avalancheProblems: z.array(AvalancheProblemSchema).optional(),
  bulletinID: z.string().optional(),
  customData: CustomDataSchema,
  dangerRatings: z.array(DangerRatingSchema).optional(),
  highlights: z.string().optional(),
  lang: z.string().optional(),
  metaData: MetaDataSchema.optional(),
  nextUpdate: z.coerce.date().optional(),
  publicationTime: z.coerce.date(),
  regions: z.array(RegionSchema).optional(),
  snowpackStructure: TextsSchema.optional(),
  source: AvalancheBulletinSourceSchema.optional(),
  tendency: z.array(TendencySchema).optional(),
  travelAdvisory: TextsSchema.optional(),
  unscheduled: z.boolean().optional(),
  validTime: ValidTimeSchema.optional(),
  weatherForecast: TextsSchema.optional(),
  weatherReview: TextsSchema.optional()
});
export type Bulletin = z.infer<typeof BulletinSchema>;

export const BulletinsSchema = z.object({
  bulletins: z.array(BulletinSchema),
  customData: CustomDataSchema,
  metaData: MetaDataSchema.optional()
});
export type Bulletins = z.infer<typeof BulletinsSchema>;
