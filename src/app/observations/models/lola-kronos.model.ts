import {
  Aspect,
  GenericObservation,
  ObservationSource,
  ObservationTableRow,
} from "./generic-observation.model";

export interface LolaKronosApi {
  lolaSimpleObservation: LolaSimpleObservation[];
  lolaEvaluation: LolaEvaluation[];
  lolaSnowProfile: LolaSnowProfile[];
  lolaAvalancheEvent: LolaAvalancheEvent[];
}

export interface LolaAvalancheEvent {
  uuId: string;
  avalancheEventTime: string;
  avalancheProblem: string[];
  avalancheSize: string;
  avalancheType: string;
  comment: string;
  createdAt: Date;
  damageCaused: boolean;
  deleted: boolean;
  deletedTime: Date;
  deletedUsername: string;
  edited: any[];
  firstName: string;
  gpsPoint: GpsPoint;
  images: Image[];
  lastName: string;
  locationDescription: string;
  lolaApplication: LolaApplication;
  pdfGeneratedTime: Date;
  pdfName: string;
  processStatus: string;
  regionId: string;
  regionName: string;
  rhbRegionId: string;
  rhbRegionName: string;
  serverStatus: string;
  storedInDb: Date;
  time: Date;
  userId: string;
}

export interface GpsPoint {
  lat: number | null;
  lng: number | null;
}

export interface Image {
  imageUuid: string;
  copyRight: string;
  comment: string;
  fileName: string;
}

export enum LolaApplication {
  Avaobs = "avaobs",
  KipLive = "kipLive",
  Natlefs = "natlefs",
}

export interface LolaEvaluation {
  uuId: string;
  avalanchePotential: number;
  comment: string;
  createdAt: Date;
  dangerPatterns: DangerPattern[];
  dangerSigns: DangerSign[];
  deleted: boolean;
  deletedTime: null;
  deletedUsername: string;
  edited: any[];
  firstAssessment: number;
  firstName: string;
  freshSnowProblem: Problem | null;
  glidingAvalanche: Avalanche | null;
  glidingSnowProblem: Problem | null;
  images: Image[];
  lastName: string;
  latency: string;
  loadCapacity: string;
  lolaApplication: LolaApplication;
  looseSnowAvalanche: Avalanche | null;
  measures: string[];
  measuresComment: string;
  pdfGeneratedTime: Date;
  pdfGererated: boolean;
  pdfName: string;
  persistentWeakLayersProblem: Problem | null;
  personsObjectsInDanger: string;
  placeDescription: string;
  position: GpsPoint;
  processStatus: string;
  regionId: string;
  regionName: string;
  rhbRegionId: string;
  rhbRegionName: string;
  serverStatus: string;
  slabAvalanche: Avalanche | null;
  snowQualitySkifun: number;
  snowStabilityTests: SnowStabilityTest[];
  snowSurface: string[];
  snowSurfaceTemperatur: number | null;
  storedInApp: Date;
  storedInDb: Date;
  surfaceCharacteristic: string;
  surfaceWetness: string;
  time: Date;
  traces: string;
  userId: string;
  weather: Weather;
  wetSnowProblem: Problem | null;
  windDriftetSnowProblem: Problem | null;
}

export enum DangerPattern {
  Gm1 = "GM1",
  Gm2 = "GM2",
  Gm3 = "GM3",
  Gm4 = "GM4",
  Gm5 = "GM5",
  Gm6 = "GM6",
  Gm7 = "GM7",
  Gm8 = "GM8",
  Gm9 = "GM9",
  Gm10 = "GM10",
}

export enum DangerSign {
  AvalancheActivity = "avalancheActivity",
  GlideCracks = "glideCracks",
  NoDangerSigns = "noDangerSigns",
  ShootingCracks = "shootingCracks",
  Whumpfing = "whumpfing",
}

export interface Problem {
  sliderValue: number;
  result: number;
  scope: string;
  scopeMetersFrom: number | null;
  scopeMetersTo: number | null;
  directions: Aspect[];
  avalancheSize: string;
  avalancheSizeValue: number;
  avalancheType: string;
  matrixValue: number;
  snowCoverStabilityLabel: string;
  distributionDangersLabel: string;
}

export interface Avalanche {
  avalancheType: string;
  size: string;
  release: string;
  frequency: string;
  directions: Aspect[];
  altitude: number | null;
  comment: string;
}

export interface SnowStabilityTest {
  type: string;
  number: number | null;
  position: number | null;
  comment: string;
  snowStability: string;
  isKBTTest: boolean;
  KBBTOverlayingLayer: null | string;
  KBBTFractureSurface: string | null;
  KBBTImpactHardness: string | null;
  KBBTCrystalsSize: null | string;
  KBBTWeakLayerThickness: null | string;
  measureFrom: string;
}

export interface Weather {
  temperatureAir: number | null;
  temperatureRange: string;
  temperatureTendency24h: string;
  precipitationType: string;
  precipitationIntense: string;
  clouds: string;
  windDirection: string[];
  windSignsAge: string;
  windDirectionChanging: boolean;
  freshWindDriftedSnow: boolean;
  windSpeed: string;
  weatherTrend24h: string;
  snowHeight: number | null;
  freshSnow24H: string;
  freshSnow72H: string;
  snowfallLine: number | null;
  windSignsOlderThen24h: boolean;
  windDriftedSnowAmout24h: string;
}

export interface LolaSimpleObservation {
  uuId: string;
  comment: string;
  deleted: boolean;
  deletedTime: Date;
  deletedUsername: string;
  edited: any[];
  firstName: string;
  gpsPoint: GpsPoint;
  images: Image[];
  lastName: string;
  locationDescription: string;
  pdfGenerated: boolean;
  pdfGeneratedTime: Date;
  pdfName: string;
  processStatus: string;
  regionId: string;
  regionName: string;
  rhbRegionId: string;
  rhbRegionName: string;
  serverStatus: string;
  storedInDb: Date;
  time: Date;
  userId: string;
}

export interface LolaSnowProfile {
  uuId: string;
  altitude: number | null;
  aspects: Aspect[];
  comment: string;
  createdAt: Date;
  deleted: boolean;
  deletedTime: null;
  deletedUsername: string;
  edited: any[];
  firstName: string;
  furtherPersons: string[];
  images: Image[];
  lastName: string;
  latency: string;
  loadCapacity: string;
  lolaApplication: LolaApplication;
  lwdBayernBillable: null;
  lwdBayernBillingValue: number;
  lwdBayernGeneratedInCockpit: boolean;
  lwdBayernGeneratedInCockpitFromUserName: string;
  lwdBayernMapShapeId: null;
  lwdBayernObservationField: null;
  pdfGenerated: boolean;
  pdfGeneratedTime: Date;
  pdfName: string;
  placeDescription: string;
  position: GpsPoint;
  processStatus: string;
  regionId: string;
  regionName: string;
  rhbRegionId: string;
  rhbRegionName: string;
  serverStatus: string;
  snowCoverComment: string;
  snowLayers: SnowLayer[];
  snowStabilityTest: SnowStabilityTest[];
  storedInApp: Date;
  storedInDb: Date;
  surfaceCharacteristic: string;
  temperatures: Temperature[];
  tilt: number | null;
  time: Date;
  totalSnowHeight: number | null;
  userId: string;
  weakestSnowStability: string;
  weather: Weather;
  windSignsAge: string;
  windSignsOlderThen24h: boolean;
}

export interface SnowLayer {
  end: number;
  start: number;
  grainShape: string | null;
  grainShape2: string;
  grainSizeFrom: number | null;
  grainSizeTo: number | null;
  layerHeight: number;
  liquidWaterContent: string;
  snowHardness: string;
}

export interface Temperature {
  temperature: number;
  position: number;
}

export function convertLoLaKronos(kronos: LolaKronosApi): GenericObservation[] {
  return [
    ...kronos.lolaAvalancheEvent.map((obs) =>
      convertLoLaToGeneric(
        obs,
        obs.lolaApplication === "avaobs"
          ? ObservationSource.AvaObsAvalancheEvent
          : obs.lolaApplication === "kipLive"
          ? ObservationSource.KipLiveAvalancheEvent
          : obs.lolaApplication === "natlefs"
          ? ObservationSource.NatlefsAvalancheEvent
          : undefined,
        () => [
          {
            label: "URL",
            url: "https://www.lola-kronos.info/avalancheEvent/" + obs.uuId,
          },
        ]
      )
    ),
    ...kronos.lolaEvaluation.map((obs) =>
      convertLoLaToGeneric(
        obs,
        obs.lolaApplication === "avaobs"
          ? ObservationSource.AvaObsEvaluation
          : obs.lolaApplication === "kipLive"
          ? ObservationSource.KipLiveEvaluation
          : obs.lolaApplication === "natlefs"
          ? ObservationSource.NatlefsEvaluation
          : undefined,
        (t) => toLoLaEvaluationTable(obs, t)
      )
    ),
    ...kronos.lolaSimpleObservation.map((obs) =>
      convertLoLaToGeneric(
        obs,
        ObservationSource.AvaObsSimpleObservation, // FIXME
        () => [
          {
            label: "URL",
            url: "https://www.lola-kronos.info/simpleObservation/" + obs.uuId,
          },
        ]
      )
    ),
    ...kronos.lolaSnowProfile.map((obs) =>
      convertLoLaToGeneric(
        obs,
        obs.lolaApplication === "avaobs"
          ? ObservationSource.AvaObsSnowProfile
          : obs.lolaApplication === "kipLive"
          ? ObservationSource.KipLiveSnowProfile
          : obs.lolaApplication === "natlefs"
          ? ObservationSource.NatlefsSnowProfile
          : undefined,
        () => [
          {
            label: "URL",
            url: "https://www.lola-kronos.info/snowProfile/" + obs.uuId,
          },
        ]
      )
    ),
  ];
}

export function convertLoLaToGeneric(
  obs:
    | LolaSimpleObservation
    | LolaAvalancheEvent
    | LolaSnowProfile
    | LolaEvaluation,
  $source: ObservationSource,
  $extraDialogRows?: (t: (key: string) => string) => ObservationTableRow[]
): GenericObservation {
  return {
    $data: obs,
    $extraDialogRows,
    $source,
    aspect: (obs as LolaSnowProfile).aspects?.[0],
    authorName: obs.firstName + " " + obs.lastName,
    content: obs.comment,
    elevation: (obs as LolaSnowProfile).altitude,
    eventDate: new Date(obs.time),
    latitude: (
      (obs as LolaSimpleObservation | LolaAvalancheEvent).gpsPoint ??
      (obs as LolaSnowProfile | LolaEvaluation).position
    ).lat,
    locationName:
      (obs as LolaSimpleObservation | LolaAvalancheEvent).locationDescription ??
      (obs as LolaSnowProfile | LolaEvaluation).placeDescription,
    longitude: (
      (obs as LolaSimpleObservation | LolaAvalancheEvent).gpsPoint ??
      (obs as LolaSnowProfile | LolaEvaluation).position
    ).lng,
    region: obs.regionName,
  };
}

export function toLoLaEvaluationTable(
  obs: LolaEvaluation,
  t: (key: string) => string
): ObservationTableRow[] {
  return [
    {
      label: "URL",
      url: "https://www.lola-kronos.info/evaluation/" + obs.uuId,
    },
    {
      label: "avalanchePotential",
      value: obs.avalanchePotential,
    },
    {
      label: "dangerPatterns",
      value: obs.dangerPatterns.join(),
    },
    {
      label: "dangerSigns",
      value: obs.dangerSigns.join(),
    },
    {
      label: "firstAssessment",
      value: obs.firstAssessment,
    },
    {
      label: "freshSnowProblem",
      value: formatProblem(obs.freshSnowProblem),
    },
    {
      label: "glidingAvalanche",
      value: formatAvalanche(obs.glidingAvalanche),
    },
    {
      label: "glidingSnowProblem",
      value: formatProblem(obs.glidingSnowProblem),
    },
    {
      label: "latency",
      value: obs.latency,
    },
    {
      label: "loadCapacity",
      value: obs.loadCapacity,
    },
    {
      label: "looseSnowAvalanche",
      value: formatAvalanche(obs.looseSnowAvalanche),
    },
    {
      label: "measures",
      value: obs.measures.join(),
    },
    {
      label: "measuresComment",
      value: obs.measuresComment,
    },
    {
      label: "persistentWeakLayersProblem",
      value: formatProblem(obs.persistentWeakLayersProblem),
    },
    {
      label: "personsObjectsInDanger",
      value: obs.personsObjectsInDanger,
    },
    {
      label: "slabAvalanche",
      value: formatAvalanche(obs.slabAvalanche),
    },
    {
      label: "snowQualitySkifun",
      value: obs.snowQualitySkifun,
    },
    {
      label: "snowStabilityTests",
      value: formatSnowStabilityTests(obs.snowStabilityTests),
    },
    {
      label: "snowSurface",
      value: obs.snowSurface.join(),
    },
    {
      label: "snowSurfaceTemperatur",
      value: obs.snowSurfaceTemperatur,
    },
    {
      label: "surfaceCharacteristic",
      value: obs.surfaceCharacteristic,
    },
    {
      label: "surfaceWetness",
      value: obs.surfaceWetness,
    },
    {
      label: "traces",
      value: obs.traces,
    },
    {
      label: "weather",
      value: formatWeather(obs.weather),
    },
    {
      label: "wetSnowProblem",
      value: formatProblem(obs.wetSnowProblem),
    },
    {
      label: "windDriftetSnowProblem",
      value: formatProblem(obs.windDriftetSnowProblem),
    },
  ].filter(
    ({ url, value }) => url || (value && value !== "null" && value !== "n/a" && value !== "[]")
  );
}

function formatAvalanche(avalanche: Avalanche) {
  return JSON.stringify(avalanche, undefined, 2);
}

function formatProblem(problem: Problem) {
  return JSON.stringify(problem, undefined, 2);
}

function formatSnowStabilityTests(snowStabilityTests: SnowStabilityTest[]) {
  return JSON.stringify(snowStabilityTests, undefined, 2);
}

function formatWeather(weather: Weather) {
  return JSON.stringify(weather, undefined, 2);
}
