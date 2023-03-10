import {
  Aspect,
  AvalancheProblem,
  DangerPattern as GenericDangerPattern,
  GenericObservation,
  imageCountString,
  ImportantObservation,
  ObservationSource,
  ObservationType
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
  Gm10 = "GM10"
}

export enum DangerSign {
  AvalancheActivity = "avalancheActivity",
  GlideCracks = "glideCracks",
  NoDangerSigns = "noDangerSigns",
  ShootingCracks = "shootingCracks",
  Whumpfing = "whumpfing"
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
  snowSurface: any[];
  snowLine: number;
  stabilityTests: any[];
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

export function convertLoLaKronos(
  kronos: LolaKronosApi,
  urlPrefix: string,
  source?: ObservationSource
): GenericObservation[] {
  return [
    ...kronos.lolaAvalancheEvent.map((obs) =>
      convertLoLaToGeneric(
        obs,
        ObservationType.Avalanche,
        urlPrefix + "avalancheEvent/"
      )
    ),
    ...kronos.lolaEvaluation.map((obs) =>
      convertLoLaToGeneric(
        obs,
        ObservationType.Evaluation,
        urlPrefix + "evaluation/"
      )
    ),
    ...kronos.lolaSimpleObservation.map((obs) =>
      convertLoLaToGeneric(
        obs,
        ObservationType.SimpleObservation,
        urlPrefix + "simpleObservation/"
      )
    ),
    ...kronos.lolaSnowProfile.map((obs) =>
      convertLoLaToGeneric(
        obs,
        ObservationType.Profile,
        urlPrefix + "snowProfile/"
      )
    )
  ];
}

export function convertLoLaToGeneric(
  obs: LolaSimpleObservation | LolaAvalancheEvent | LolaSnowProfile | LolaEvaluation,
  $type: ObservationType,
  urlPrefix: string
): GenericObservation {
  return {
    $data: obs,
    $externalURL: urlPrefix + obs.uuId,
    $source: ObservationSource.LoLaKronos,
    $type,
    // TODO implement,
    stability: undefined,
    aspect: (obs as LolaSnowProfile).aspects?.[0],
    authorName: obs.firstName + " " + obs.lastName,
    content: obs.comment + imageCountString(obs.images),
    elevation: (obs as LolaSnowProfile).altitude,
    eventDate: new Date(obs.time),
    latitude: ((obs as LolaSimpleObservation | LolaAvalancheEvent).gpsPoint ?? (obs as LolaSnowProfile | LolaEvaluation).position)?.lat,
    locationName:
      (obs as LolaSimpleObservation | LolaAvalancheEvent).locationDescription ?? (obs as LolaSnowProfile | LolaEvaluation).placeDescription,
    longitude: ((obs as LolaSimpleObservation | LolaAvalancheEvent).gpsPoint ?? (obs as LolaSnowProfile | LolaEvaluation).position)?.lng,
    avalancheProblems: getAvalancheProblems(obs as LolaEvaluation),
    dangerPatterns: (obs as LolaEvaluation).dangerPatterns?.map((dp) => getDangerPattern(dp)) || [],
    region: obs.regionName,
    importantObservations: [
      (obs as LolaSimpleObservation).snowLine ? ImportantObservation.SnowLine : undefined,
      (obs as LolaSimpleObservation).snowSurface?.includes("surfaceHoar") ? ImportantObservation.SurfaceHoar : undefined,
      (obs as LolaSimpleObservation).snowSurface?.includes("veryLightNewSnow") ? ImportantObservation.VeryLightNewSnow : undefined,
      (obs as LolaSimpleObservation).snowSurface?.includes("graupel") ? ImportantObservation.Graupel : undefined,
      (obs as LolaSimpleObservation).snowSurface?.includes("iceFormation") ? ImportantObservation.IceFormation : undefined,
      (obs as LolaSimpleObservation).stabilityTests?.length > 0 ? ImportantObservation.StabilityTest : undefined
    ].filter(o => !!o)
  };
}

function getAvalancheProblems(data: LolaEvaluation): AvalancheProblem[] {
  const problems: AvalancheProblem[] = [];
  if (data.freshSnowProblem?.result > 0) problems.push(AvalancheProblem.new_snow);
  if (data.glidingSnowProblem?.result > 0) problems.push(AvalancheProblem.gliding_snow);
  if (data.persistentWeakLayersProblem?.result > 0) problems.push(AvalancheProblem.persistent_weak_layers);
  if (data.wetSnowProblem?.result > 0) problems.push(AvalancheProblem.wet_snow);
  if (data.windDriftetSnowProblem?.result > 0) problems.push(AvalancheProblem.wind_slab);
  return problems;
}

function getDangerPattern(data: DangerPattern): GenericDangerPattern {
  switch (data) {
    case DangerPattern.Gm1:
      return GenericDangerPattern.dp1;
    case DangerPattern.Gm2:
      return GenericDangerPattern.dp2;
    case DangerPattern.Gm3:
      return GenericDangerPattern.dp3;
    case DangerPattern.Gm4:
      return GenericDangerPattern.dp4;
    case DangerPattern.Gm5:
      return GenericDangerPattern.dp5;
    case DangerPattern.Gm6:
      return GenericDangerPattern.dp6;
    case DangerPattern.Gm7:
      return GenericDangerPattern.dp7;
    case DangerPattern.Gm8:
      return GenericDangerPattern.dp8;
    case DangerPattern.Gm9:
      return GenericDangerPattern.dp9;
    case DangerPattern.Gm10:
      return GenericDangerPattern.dp10;
  }
}
