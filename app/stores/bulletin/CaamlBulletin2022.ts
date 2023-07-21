/**
 * JSON schema for EAWS avalanche bulletin collection following the CAAMLv6 schema
 */
export interface Bulletins {
  bulletins: Bulletin[];
  customData?: CustomData;
  metaData?: MetaData;
}

/**
 * Avalanche Bulletin valid for a given set of regions.
 */
export interface Bulletin {
  /**
   * Texts element with highlight and comment for the avalanche activity.
   */
  avalancheActivity?: Texts;
  /**
   * Collection of Avalanche Problem elements for this bulletin.
   */
  avalancheProblems?: AvalancheProblem[];
  /**
   * Unique ID for the bulletin.
   */
  bulletinID?: string;
  customData?: CustomData;
  /**
   * Collection of Danger Rating elements for this bulletin.
   */
  dangerRatings?: DangerRating[];
  /**
   * Contains an optional short text to highlight an exceptionally dangerous situation.
   */
  highlights?: string;
  /**
   * Two-letter language code (ISO 639-1).
   */
  lang?: string;
  metaData?: MetaData;
  /**
   * Time and date when the bulletin was issued by the AWS to the Public. ISO 8601 timestamp
   * in UTC or with time zone information.
   */
  publicationTime?: string;
  /**
   * Collection of region elements for which this bulletin is valid.
   */
  regions?: Region[];
  /**
   * Texts element with highlight and comment for details on the snowpack structure.
   */
  snowpackStructure?: Texts;
  /**
   * Details about the issuer/AWS of the bulletin.
   */
  source?: AvalancheBulletinSource;
  /**
   * Tendency element for a detailed description of the expected avalanche situation tendency
   * after the bulletin's period of validity.
   */
  tendency?: Tendency;
  /**
   * Texts element with highlight and comment for travel advisory.
   */
  travelAdvisory?: Texts;
  /**
   * Date and Time from and until this bulletin is valid. ISO 8601 Timestamp in UTC or with
   * time zone information.
   */
  validTime?: ValidTime;
  /**
   * Texts element with highlight and comment for weather forcast information.
   */
  wxSynopsis?: Texts;
}

/**
 * Texts element with highlight and comment for the avalanche activity.
 *
 * Texts contains a highlight and a comment string, where highlights could also be described
 * as a kind of headline for the longer comment. For text-formating only the HTML-Tags <br/>
 * for a new line and <b> followed by </b> for a bold text.
 *
 * Texts element with highlight and comment for details on the snowpack structure.
 *
 * Texts element with highlight and comment for travel advisory.
 *
 * Texts element with highlight and comment for weather forcast information.
 */
export interface Texts {
  comment?: string;
  highlights?: string;
}

/**
 * Defines an avalanche problem, its time, aspect, and elevation constraints. A textual
 * detail about the affected terrain can be given in the terrainFeature field. Also, details
 * about the expected avalanche size, snowpack stability and its frequency can be defined.
 */
export interface AvalancheProblem {
  aspects?: Aspect[];
  avalancheSize?: number;
  customData?: CustomData;
  elevation?: ElevationBoundaryOrBand;
  frequency?: ExpectedAvalancheFrequency;
  metaData?: MetaData;
  problemType?: AvalancheProblemType;
  snowpackStability?: ExpectedSnowpackStability;
  terrainFeature?: string;
  validTimePeriod?: ValidTimePeriod;
}

/**
 * An aspect can be defined as a set of aspects. The aspects are the expositions as in a
 * eight part (45°) segments. The allowed aspects are the four main cardinal directions and
 * the four intercardinal directions.
 */
export enum Aspect {
  E = "E",
  N = "N",
  NA = "n/a",
  Ne = "NE",
  Nw = "NW",
  S = "S",
  SE = "SE",
  Sw = "SW",
  W = "W"
}

/**
 * Elevation describes either an elevation range below a certain bound (only upperBound is
 * set to a value) or above a certain bound (only lowerBound is set to a value). If both
 * values are set to a value, an elevation band is defined by this property. The value uses
 * a numeric value, not more detailed than 100m resolution. Additionally to the numeric
 * values also 'treeline' is allowed.
 */
export interface ElevationBoundaryOrBand {
  lowerBound?: string;
  upperBound?: string;
}

/**
 * Expected frequency of lowest snowpack stability, according to the EAWS definition. Three
 * stage scale (few, some, many).
 */
export enum ExpectedAvalancheFrequency {
  Few = "few",
  Many = "many",
  Some = "some"
}

/**
 * Meta data for various uses. Can be used to link to external files like maps, thumbnails
 * etc.
 */
export interface MetaData {
  comment?: string;
  extFiles?: ExternalFile[];
}

/**
 * External file is used to link to external files like maps, thumbnails etc.
 */
export interface ExternalFile {
  description?: string;
  fileReferenceURI?: string;
  fileType?: string;
}

/**
 * Expected avalanche problem, according to the EAWS avalanche problem definition.
 */
export enum AvalancheProblemType {
  Cornices = "cornices",
  FavourableSituation = "favourable_situation",
  GlidingSnow = "gliding_snow",
  NewSnow = "new_snow",
  NoDistinctAvalancheProblem = "no_distinct_avalanche_problem",
  PersistentWeakLayers = "persistent_weak_layers",
  WetSnow = "wet_snow",
  WindSlab = "wind_slab"
}

/**
 * Snowpack stability, according to the EAWS definition. Four stage scale (very poor, poor,
 * fair, good).
 */
export enum ExpectedSnowpackStability {
  Good = "good",
  Fair = "fair",
  Poor = "poor",
  VeryPoor = "very_poor"
}

/**
 * Valid time period can be used to limit the validity of an element to an erlier or later
 * period. It can be used to distinguish danger ratings or avalanche problems.
 */
export enum ValidTimePeriod {
  AllDay = "all_day",
  Earlier = "earlier",
  Later = "later"
}

/**
 * Defines a danger rating, its elevation constraints and the valid time period. If
 * validTimePeriod or elevation are constrained for a rating, it is expected to define a
 * dangerRating for all the other cases.
 */
export interface DangerRating {
  customData?: CustomData;
  elevation?: ElevationBoundaryOrBand;
  mainValue?: DangerRatingValue;
  metaData?: MetaData;
  validTimePeriod?: ValidTimePeriod;
}

/**
 * Danger rating value, according to EAWS danger scale definition.
 */
export enum DangerRatingValue {
  Considerable = "considerable",
  High = "high",
  Low = "low",
  Moderate = "moderate",
  NoRating = "no_rating",
  NoSnow = "no_snow",
  VeryHigh = "very_high"
}

/**
 * Region element describes a (micro) region. The regionID follows the EAWS schema. It is
 * recommended to have the region shape's files with the same IDs in
 * gitlab.com/eaws/eaws-regions. Additionally, the region name can be added.
 */
export interface Region {
  customData?: CustomData;
  metaData?: MetaData;
  name?: string;
  regionID?: string;
}

/**
 * Details about the issuer/AWS of the bulletin.
 *
 * Information about the bulletin source. Either as in a person or with a provider element
 * to specify details about the AWS.
 */
export interface AvalancheBulletinSource {
  contactPerson?: Person;
  provider?: AvalancheBulletinProvider;
}

/**
 * Details on a person.
 */
export interface Person {
  customData?: CustomData;
  metaData?: MetaData;
  name?: string;
  website?: string;
}

/**
 * Information about the bulletin provider. Defines the name, website and/or contactPerson
 * (which could be the author) of the issuing AWS.
 */
export interface AvalancheBulletinProvider {
  contactPerson?: Person;
  customData?: CustomData;
  metaData?: MetaData;
  name?: string;
  website?: string;
}

/**
 * Tendency element for a detailed description of the expected avalanche situation tendency
 * after the bulletin's period of validity.
 *
 * Texts element with highlight and comment for the avalanche activity.
 *
 * Texts contains a highlight and a comment string, where highlights could also be described
 * as a kind of headline for the longer comment. For text-formating only the HTML-Tags <br/>
 * for a new line and <b> followed by </b> for a bold text.
 *
 * Texts element with highlight and comment for details on the snowpack structure.
 *
 * Texts element with highlight and comment for travel advisory.
 *
 * Texts element with highlight and comment for weather forcast information.
 *
 * Describes the expected tendency of the development of the avalanche situation for a
 * defined time period.
 */
export interface Tendency {
  comment?: string;
  highlights?: string;
  customData?: CustomData;
  metaData?: MetaData;
  tendencyType?: TendencyType;
  validTime?: ValidTime;
}

export enum TendencyType {
  Decreasing = "decreasing",
  Increasing = "increasing",
  Steady = "steady"
}

/**
 * Valid time defines two ISO 8601 timestamps in UTC or with time zone information.
 *
 * Date and Time from and until this bulletin is valid. ISO 8601 Timestamp in UTC or with
 * time zone information.
 */
export interface ValidTime {
  endTime?: string;
  startTime?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomData {}
