// https://www.avaobs.info/api/archiv/all/:VON/:BIS
// https://www.avaobs.info/api/dataexport/observations/:VON/:BIS
// https://www.avaobs.info/api/dataexport/simpleobservations/:VON/:BIS

import { GenericObservation, ObservationSource } from "./generic-observation.model";

// https://www.avaobs.info/api/dataexport/snowprofiles/:VON/:BIS
export interface AvaObs {
  snowProfiles: GenericObservation<SnowProfile>[];
  observations: GenericObservation<Observation>[];
  simpleObservations: GenericObservation<SimpleObservation>[];
}

export interface SimpleObservation {
  images: string[];
  uuId: string;
  positionLng: number | null;
  positionLat: number | null;
  deletedTime: Date;
  deleted: boolean;
  placeDescription: string;
  comment: string;
  serverStatus: string;
  processStatus: string;
  lastName: string;
  firstName: string;
  storedInDatabase: Date;
  storedInAppTime: Date;
  time: Date;
  userId: string;
}

export interface Observation extends SimpleObservation {
  images: string[];
  dangerPatterns: DangerPattern[];
  avalancheDangerSigns: string[];
  uuId: string;
  avalancheRiskTendency: string;
  riskAssessment: number;
  slabAvalanche: EmbankmentSlip;
  glidingAvalanche: EmbankmentSlip;
  looseSnowAvalanche: EmbankmentSlip;
  embankmentSlip: EmbankmentSlip;
  snowPack: SnowPack;
  glidingSnow: GlidingSnow;
  persistentWeakLayer: GlidingSnow;
  wetSnow: GlidingSnow;
  windDriftedSnowAmount: string;
  windSigns: boolean;
  windDriftedSnow: GlidingSnow;
  newSnow: GlidingSnow;
  weather: Weather;
  positionLng: number | null;
  positionLat: number | null;
  deletedTime: Date;
  deleted: boolean;
  placeDescription: string;
  comment: string;
  serverStatus: string;
  processStatus: string;
  lastName: string;
  firstName: string;
  storedInDatabase: Date;
  storedInAppTime: Date;
  time: Date;
  userId: string;
}

export interface DangerPattern {
  value: string;
  nummer: number;
}

export interface EmbankmentSlip {
  active: boolean;
  size: string;
  releaseType: string;
  frequency: string;
  aspects: string[];
  elevation: number | null;
}

export interface GlidingSnow {
  riskAssessment: number;
  aspects: string[];
  elevation: number | null;
  elevationSecond: number | null;
  validity: string;
  active: boolean;
}

export interface SnowPack {
  boundedSnow: string;
  loadCapacity: string;
  surfaceCharacteristic: string;
  meltFreezeCrust: boolean;
  snowpack: string;
  snowpackConstruction: string;
  snowSurfaceType: string[];
  surfaceHoar: boolean;
  surfaceWetness: string;
}

export interface Weather {
  snowHeight: number | null;
  freshSnow24h: string;
  freshSnow72h: string;
  snowfallLine: number | null;
  windSpeed: string;
  windDirection: string[];
  currentTemperature: number | null;
  temperatureCurve24h: string;
}

export interface SnowProfile extends SimpleObservation {
  aspects: string[];
  snowLayers: SnowLayer[];
  temperatures: Temperature[];
  images: string[];
  uuId: string;
  ectNumber: number | null;
  ectPosition: number | null;
  storedInAppTime: Date;
  storedInDatabase: Date;
  serverStatus: string;
  processStatus: string;
  time: Date;
  ect: string;
  snowStability: string;
  firstName: string;
  lastName: string;
  userId: string;
  latency: string;
  loadcapacity: string;
  surface: string;
  tilt: string;
  deleted: boolean;
  deletedTime: Date;
  comment: string;
  totalSnowHeight: number;
  placeDescription: string;
  positionLat: number;
  positionLng: number;
}

export interface SnowLayer {
  start: number;
  end: number;
  layerHeight: number;
  grainShape: null | string;
  grainShape2: null | string;
  grainSizeFrom: number;
  grainSizeTo: number;
  snowHardness: string;
  liquidWaterContent: string;
}

export interface Temperature {
  temperature: number;
  position: number;
}

export function convertAvaObsToGeneric<T extends SimpleObservation>(
  obs: T,
  $source: ObservationSource,
  urlPrefix?: string
): GenericObservation<T> {
  return {
    $data: obs,
    $externalURL: urlPrefix ? urlPrefix + obs.uuId : undefined,
    $source,
    aspect: undefined,
    authorName: obs.firstName + " " + obs.lastName,
    content: obs.comment,
    elevation: undefined,
    eventDate: obs.time,
    latitude: obs.positionLat,
    locationName: obs.placeDescription,
    longitude: obs.positionLng,
    region: ""
  };
}
