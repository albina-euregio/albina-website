export type TranslationFunction = (key: string) => string;

export interface GenericObservation<Data = any> {
  /**
   * Additional data (e.g. original data stored when fetching from external API)
   */
  $data: Data;
  /**
   * External ID of this observations
   */
  $id?: string;
  /**
   * External URL/image to display as iframe
   */
  $externalURL?: string;
  /**
   * Additional information to display as table rows in the observation dialog
   */
  $extraDialogRows?:
    | ObservationTableRow[]
    | ((t: TranslationFunction) => ObservationTableRow[]);
  /**
   * Snowpack stability that can be inferred from this observation
   */
  stability?: Stability;
  $source: ObservationSource | ForecastSource;
  $type: ObservationType;
  /**
   * Aspect corresponding with this observation
   */
  aspect?: Aspect;
  /**
   * Name of the author
   */
  authorName: string;
  /**
   * Free-text content
   */
  content: string;
  /**
   * Elevation in meters
   */
  elevation: number;
  /**
   * Date when the event occurred
   */
  eventDate: Date;
  /**
   * Location latitude (WGS 84)
   */
  latitude: number;
  /**
   * Location name
   */
  locationName: string;
  /**
   * Location longitude (WGS 84)
   */
  longitude: number;
  /**
   * Micro-region code (computed from latitude/longitude)
   */
  region: string;
  /**
   * Date when the observation has been reported
   */
  reportDate?: Date;
  /**
   * Avalanche problem corresponding with this observation
   */
  avalancheProblems?: AvalancheProblem[];
  /**
   * Danger pattern corresponding with this observation
   */
  dangerPatterns?: DangerPattern[];
  /**
   * Important observations
   */
  importantObservations?: ImportantObservation[];

  filterType?: ObservationFilterType;
  isHighlighted?: boolean;
}

// similar to Enum.AvalancheProblem as string enum
export enum AvalancheProblem {
  new_snow = "new_snow",
  wind_slab = "wind_slab",
  persistent_weak_layers = "persistent_weak_layers",
  wet_snow = "wet_snow",
  gliding_snow = "gliding_snow",
  favourable_situation = "favourable_situation",
  cornices = "cornices",
  no_distinct_problem = "no_distinct_problem",
}

// similar to Enum.DangerPattern as string enum
export enum DangerPattern {
  dp1 = "dp1",
  dp2 = "dp2",
  dp3 = "dp3",
  dp4 = "dp4",
  dp5 = "dp5",
  dp6 = "dp6",
  dp7 = "dp7",
  dp8 = "dp8",
  dp9 = "dp9",
  dp10 = "dp10",
}

export enum ObservationFilterType {
  Global = "Global",
  Local = "Local",
}

export enum ImportantObservation {
  SnowLine = "SnowLine",
  SurfaceHoar = "SurfaceHoar",
  Graupel = "Graupel",
  StabilityTest = "StabilityTest",
  IceFormation = "IceFormation",
  VeryLightNewSnow = "VeryLightNewSnow",
}

export enum Stability {
  good = "good",
  fair = "fair",
  poor = "poor",
  very_poor = "very_poor",
}

const colors: Record<Stability, string> = {
  good: "green",
  fair: "orange",
  poor: "red",
  very_poor: "black",
};

export function toMarkerColor(observation: GenericObservation) {
  return colors[observation?.stability ?? "unknown"] ?? "gray";
}

export enum ObservationSource {
  AvalancheWarningService = "AvalancheWarningService",
  Observer = "Observer",
  LwdKip = "LwdKip",
  Lawis = "Lawis",
  LoLaKronos = "LoLaKronos",
  LoLaAvalancheFeedbackAT5 = "LoLaAvalancheFeedbackAT5",
  LoLaAvalancheFeedbackAT8 = "LoLaAvalancheFeedbackAT8",
  WikisnowECT = "WikisnowECT",
  FotoWebcamsEU = "FotoWebcamsEU",
  Panomax = "Panomax",
}

export type ForecastSource =
  | "multimodel"
  | "meteogram"
  | "qfa"
  | "observed_profile"
  | "alpsolut_profile";

export enum ObservationType {
  SimpleObservation = "SimpleObservation",
  Evaluation = "Evaluation",
  Avalanche = "Avalanche",
  Blasting = "Blasting",
  Closure = "Closure",
  Profile = "Profile",
  TimeSeries = "TimeSeries",
  Webcam = "Webcam",
}

export enum Aspect {
  N = "N",
  NE = "NE",
  E = "E",
  SE = "SE",
  S = "S",
  SW = "SW",
  W = "W",
  NW = "NW",
}

export enum LocalFilterTypes {
  Elevation = "Elevation",
  Aspect = "Aspect",
  AvalancheProblem = "AvalancheProblem",
  Stability = "Stability",
  ObservationType = "ObservationType",
  ImportantObservation = "ImportantObservation",
  DangerPattern = "DangerPattern",
  Days = "Days",
}

export interface ChartsData {
  Elevation: Object;
  Aspects: Object;
  AvalancheProblem: Object;
  Stability: Object;
  ObservationType: Object;
  ImportantObservation: Object;
  DangerPattern: Object;
  Days: Object;
}

export interface FilterSelectionData {
  all: string[];
  selected: string[];
  highlighted: string[];
}

export interface ObservationTableRow {
  label: string;
  date?: Date;
  number?: number;
  boolean?: boolean;
  url?: string;
  value?: string;
}

export function toObservationTable(
  observation: GenericObservation,
  t: (key: string) => string
): ObservationTableRow[] {
  return [
    { label: t("observations.eventDate"), date: observation.eventDate },
    { label: t("observations.reportDate"), date: observation.reportDate },
    { label: t("observations.authorName"), value: observation.authorName },
    { label: t("observations.locationName"), value: observation.locationName },
    { label: t("observations.elevation"), number: observation.elevation },
    {
      label: t("observations.aspect"),
      value:
        observation.aspect !== undefined
          ? t("aspect." + observation.aspect)
          : undefined,
    },
    { label: t("observations.comment"), value: observation.content },
  ];
}

export function toAspect(
  aspect: number | string | undefined
): Aspect | undefined {
  enum NumericAspect {
    N = 1,
    NE = 2,
    E = 3,
    SE = 4,
    S = 5,
    SW = 6,
    W = 7,
    NW = 8,
  }
  if (typeof aspect === "number") {
    const string = NumericAspect[aspect];
    return Aspect[string];
  } else if (typeof aspect === "string") {
    return Aspect[aspect];
  }
}

export function imageCountString(images: any[] | undefined) {
  return images?.length ? ` 📷 ${images.length}` : "";
}

export function toGeoJSON(observations: GenericObservation[]) {
  const features = observations.map(
    (o): GeoJSON.Feature => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          o.longitude ?? 0.0,
          o.latitude ?? 0.0,
          o.elevation ?? 0.0,
        ],
      },
      properties: {
        ...o,
        ...(o.$data || {}),
        $data: undefined,
      },
    })
  );
  const collection: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features,
  };
  return collection;
}
