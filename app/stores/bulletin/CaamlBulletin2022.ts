export interface Bulletins {
  bulletins: Bulletin[];
  metaData?: MetaData;
}

export interface Bulletin {
  avalancheActivityComment?: string;
  avalancheActivityHighlights?: string;
  avalancheProblems?: AvalancheProblem[];
  bulletinID: string;
  dangerRatings?: DangerRating[];
  highlights?: string;
  lang: string;
  metaData?: MetaData;
  publicationTime: Date;
  regions: Region[];
  snowpackStructureComment?: string;
  snowpackStructureHighlights?: string;
  source?: Source;
  tendency?: Tendency;
  travelAdvisoryComment?: string;
  travelAdvisoryHighlights?: string;
  validTime: ValidTime;
  wxSynopsisComment?: string;
  wxSynopsisHighlights?: string;
}

export interface AvalancheProblem {
  comment?: string;
  dangerRating?: DangerRating;
  mainValue?: DangerRatingValue;
  problemType?: AvalancheProblemType;
}

export interface DangerRating {
  aspect?: Aspect[];
  avalancheSize?: number;
  comment?: string;
  customData?: any;
  elevation?: Elevation;
  frequency?: FrequencyType;
  mainValue?: DangerRatingValue;
  snowpackStability?: SnowpackStabilityType;
}

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

export interface Elevation {
  lowerBound?: string;
  upperBound?: string;
}

export enum FrequencyType {
  Few = "few",
  Many = "many",
  Some = "some"
}

export enum DangerRatingValue {
  Considerable = "considerable",
  High = "high",
  Low = "low",
  Moderate = "moderate",
  NoRating = "no_rating",
  NoSnow = "no_snow",
  VeryHigh = "very_high"
}

export enum SnowpackStabilityType {
  Fair = "fair",
  Good = "good",
  Poor = "poor",
  VeryPoor = "very_poor"
}

export enum AvalancheProblemType {
  CorniceFailure = "cornice_failure",
  FavourableSituation = "favourable_situation",
  GlidingSnow = "gliding_snow",
  NewSnow = "new_snow",
  PersistentWeakLayers = "persistent_weak_layers",
  WetSnow = "wet_snow",
  WindDriftedSnow = "wind_drifted_snow"
}

export interface MetaData {
  comment?: string;
  customData?: any;
  extFiles?: ExtFile[];
}

export interface ExtFile {
  customData?: any;
  fileReferenceURI?: string;
  fileType?: ExtFileType;
}

export enum ExtFileType {
  DangerRatingMap = "dangerRatingMap",
  DangerRatingMapOverlay = "dangerRatingMapOverlay",
  PrintOut = "printOut",
  Website = "website"
}

export interface Region {
  metaData?: MetaData;
  name?: string;
  regionID: string;
}

export interface Source {
  provider?: Provider;
}

export interface Provider {
  name?: string;
  website?: string;
}

export interface Tendency {
  tendencyComment?: string;
  tendencyType?: TendencyType;
  validTime?: ValidTime;
}

export enum TendencyType {
  Decreasing = "decreasing",
  Increasing = "increasing",
  Steady = "steady"
}

export interface ValidTime {
  endTime?: Date;
  startTime?: Date;
}
