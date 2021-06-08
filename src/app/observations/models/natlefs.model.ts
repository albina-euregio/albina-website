import { GenericObservation, ObservationTableRow, ObservationSource } from "./generic-observation.model";

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
  date: string;
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
  WindAffected = "windAffected"
}

export enum SurfaceSnowWetness {
  Dry = "dry",
  Sticky = "sticky"
}

export function convertNatlefsToGeneric(natlefs: Natlefs): GenericObservation<Natlefs> {
  return {
    $data: natlefs,
    $source: ObservationSource.Natlefs,
    $extraDialogRows: (t) => toNatlefsTable(natlefs, t),
    $markerColor: getNatlefsMarkerColor(natlefs),
    $markerRadius: getNatlefsMarkerRadius(natlefs),
    aspect: natlefs.location.aspect as any,
    authorName: natlefs.author.name,
    content: natlefs.comment,
    elevation: natlefs.location.elevation,
    eventDate: new Date(natlefs.datetime.date),
    latitude: natlefs.location?.geo?.latitude,
    locationName: natlefs.location.name,
    longitude: natlefs.location?.geo?.longitude,
    region: ""
  };
}

function toNatlefsTable(natlefs: Natlefs, t: (key: string) => string): ObservationTableRow[] {
  return [
    {
      label: t("location.accuracy"),
      number: natlefs.location.accuracy
    },
    {
      label: t("natlefs.title.newSnow"),
      value: natlefs.newSnow && t("newSnow." + natlefs.newSnow)
    },
    {
      label: t("natlefs.title.alarmSignsFrequency"),
      value: natlefs.alarmSigns && t("alarmSignsFrequency." + natlefs.alarmSigns)
    },
    {
      label: t("natlefs.title.driftingSnow"),
      value: natlefs.driftingSnow && t("driftingSnow." + natlefs.driftingSnow)
    },
    {
      label: t("natlefs.title.avalanches"),
      value: natlefs.avalanches && t("avalanches." + natlefs.avalanches)
    },
    {
      label: t("natlefs.title.penetrationDepth"),
      value: natlefs.penetrationDepth && t("penetrationDepth." + natlefs.penetrationDepth)
    },
    {
      label: t("natlefs.title.surfaceSnowWetness"),
      value: natlefs.surfaceSnowWetness && t("surfaceSnowWetness." + natlefs.surfaceSnowWetness)
    },
    {
      label: t("natlefs.title.tracks"),
      value: natlefs.tracks && t("tracks." + natlefs.tracks)
    },
    {
      label: t("natlefs.title.avalancheProblems"),
      value: natlefs.avalancheProblems?.map((p) => t("avalancheProblemNatlefs." + p))?.join(", ")
    },
    {
      label: t("natlefs.title.rode"),
      value: natlefs.rode?.map((terrain) => t("terrainFeature." + terrain))?.join(", ")
    },
    {
      label: t("natlefs.title.avoided"),
      value: natlefs.avoided?.map((terrain) => t("terrainFeature." + terrain))?.join(", ")
    },
    {
      label: t("natlefs.title.ridingQuality"),
      value: natlefs.ridingQuality && t("ridingQuality." + natlefs.ridingQuality)
    },
    {
      label: t("natlefs.title.comment"),
      value: natlefs.comment
    }
  ];
}

function getNatlefsMarkerColor(natlefs: Natlefs): string {
  // TODO implement
  return "green";
}

function getNatlefsMarkerRadius(natlefs: Natlefs): number {
  // TODO implement
  return 15;
}
