export interface Bulletins {
  metaData?: MetaData[];
  bulletins: Bulletin[];
}

export interface Bulletin {
  id: string;
  lang: string;
  metaData?: MetaData[];
  publicationTime: Date;
  validTime: ValidTime;
  source: Source;
  regions: Region[];
  complexity?: "easy" | "challenging" | "complex" | "n/a";
  dangerRatings?: DangerRating[];
  dangerPatterns?: DangerPattern[];
  avalancheProblems?: AvalancheProblem[];
  tendency?: Tendency;
  highlights?: string;
  wxSynopsisHighlights?: string;
  wxSynopsisComment?: string;
  avalancheActivityHighlights?: string;
  avalancheActivityComment?: string;
  snowpackStructureComment?: string;
  travelAdvisoryHighlights?: string;
  travelAdvisoryComment?: string;
  tendencyComment?: string;
}

export interface AvalancheProblem {
  type: AvalancheProblemType;
  dangerRating: DangerRating;
  comment?: string;
  customData?: any;
}

export enum AvalancheProblemType {
  "new_snow",
  "wind_drifted_snow",
  "persistent_weak_layers",
  "wet_snow",
  "gliding_snow",
  "cornice_failure",
  "favourable_situation"
}

export enum DangerRatingValue {
  "low",
  "moderate",
  "considerable",
  "high",
  "very_high",
  "no_snow",
  "no_rating"
}

export enum Aspect {
  "E",
  "N",
  "NE",
  "NW",
  "S",
  "SE",
  "SW",
  "W"
}

export interface Elevation {
  uom: "m";
  lowerBound?: string; // pattern: treeline|0|[1-9][0-9]*[0][0]+
  upperBound?: string; // pattern: treeline|0|[1-9][0-9]*[0][0]+
}

export interface DangerPattern {
  type:
    | "dp1"
    | "dp2"
    | "dp3"
    | "dp4"
    | "dp5"
    | "dp6"
    | "dp7"
    | "dp8"
    | "dp9"
    | "dp10";
  aspect?: Aspect[];
  elevation?: Elevation;
  comment?: string;
  customData?: any;
}

export interface DangerRating {
  mainValue: DangerRatingValue;
  aspect?: Aspect[];
  elevation?: Elevation;
  terrainFeature?: string;
  artificialDangerRating?: DangerRatingValue;
  artificialAvalancheSize?: string;
  artificialAvalancheReleaseProbability?: string;
  artificialHazardSiteDistribution?: string;
  naturalDangerRating?: DangerRatingValue;
  naturalAvalancheReleaseProbability?: string;
  naturalHazardSiteDistribution?: string;
  comment?: string;
  customData?: any;
}

export interface MetaData {
  extFiles: ExtFile[];
  comment?: string;
  customData?: any;
}

export interface ExtFile {
  type: string;
  description: string;
  fileReferenceURI: string;
  customData?: any;
}

export interface Region {
  id: string;
  metaData?: MetaData;
  name: string;
  centerPoint?: any;
  outline?: any;
}

export interface Source {
  operation?: SourceBase;
  person?: SourceBase;
}

export interface SourceBase {
  metaData?: MetaData;
  name: string;
  website: string;
}

export interface Tendency {
  type: "decreasing" | "steady" | "increasing";
  validTime: ValidTime;
}

export interface ValidTime {
  startTime: Date;
  endTime: Date;
}
