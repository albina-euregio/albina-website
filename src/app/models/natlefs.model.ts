export interface Natlefs {
  snowConditions?: SnowCondition[];
  driftingSnow: DriftingSnow;
  author: Author;
  penetrationDepth?: PenetrationDepth;
  rode?: TerrainFeature[];
  alarmSigns?: AlarmSigns;
  tracks: Avalanches;
  avoided?: TerrainFeature[];
  datetime: DateTime;
  avalancheProblems?: AvalancheProblem[];
  avalanches: Avalanches;
  newSnow: NewSnow;
  location: Location;
  surfaceSnowWetness?: SurfaceSnowWetness;
  ridingQuality?: RidingQuality;
  comment?: string;
}

export enum AlarmSigns {
  Frequent = "frequent",
  None = "none",
  Occasional = "occasional",
}

export interface Author {
  name: string;
}

export enum AvalancheProblem {
  FavourableSituation = "favourable_situation",
  GlidingSnow = "gliding_snow",
  NewSnow = "new_snow",
  WeakPersistentLayer = "weak_persistent_layer",
  WindDriftedSnow = "wind_drifted_snow",
}

export enum Avalanches {
  Many = "many",
  None = "none",
  Some = "some",
}

export enum TerrainFeature {
  ConvexSlopes = "convexSlopes",
  DenseTrees = "denseTrees",
  ModeratelySteepSlopes = "moderatelySteepSlopes",
  OpenTrees = "openTrees",
  ShadySlopes = "shadySlopes",
  SteepSlopes = "steepSlopes",
  SunnySlopes = "sunnySlopes",
  VerySteepSlopes = "verySteepSlopes",
}

export interface DateTime {
  date: Date;
  quality: Quality;
}

export enum Quality {
  Measured = "measured",
}

export enum DriftingSnow {
  None = "none",
  Occasional = "occasional",
  Widespread = "widespread",
}

export interface Location {
  geo?: Geo;
  elevation?: number;
  aspect?: string;
  name: string;
  accuracy?: number;
  region?: string;
}

export interface Geo {
  latitude: number;
  longitude: number;
}

export enum NewSnow {
  High = "high",
  Low = "low",
  Medium = "medium",
  None = "none",
}

export enum PenetrationDepth {
  Little = "little",
  Medium = "medium",
  Much = "much",
  Spotty = "spotty",
}

export enum RidingQuality {
  Amazing = "amazing",
  Good = "good",
  Indifferent = "indifferent",
  Ok = "ok",
}

export enum SnowCondition {
  Crusty = "crusty",
  Hard = "hard",
  Heavy = "heavy",
  Powder = "powder",
  Wet = "wet",
  WindAffected = "windAffected",
}

export enum SurfaceSnowWetness {
  Dry = "dry",
  Sticky = "sticky",
}
