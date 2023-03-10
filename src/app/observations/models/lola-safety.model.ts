import { convertLoLaToGeneric, LolaSnowProfile as SnowProfile } from "./lola-kronos.model";
import { GenericObservation, ObservationSource, ObservationType, Stability } from "./generic-observation.model";

export interface LoLaSafetyApi {
  snowProfiles: SnowProfile[];
  avalancheReports: AvalancheReport[];
}

export interface LoLaSafety {
  snowProfiles: GenericObservation<SnowProfile>[];
  avalancheReports: GenericObservation<AvalancheReport>[];
}

export interface AvalancheReport {
  images: string[];
  regionId: string;
  processStatus: string;
  serverStatus: string;
  uuId: string;
  weather: Weather;
  avalanchePotential: AvalanchePotential;
  headlineGerman: string;
  headlineEnglish: string;
  type: string;
  time: string;
  avalancheId: string;
  avalancheName: string;
  userId: string;
  firstName: string;
  lastName: string;
  regionName: string;
  publicPdf: string;
  publicPdfFinish: boolean;
  publicPdfToken: string;
  publicPdfTokenTime: string;
  publicPdfGeneratedTime: string;
  latitude?: number;
  longitude?: number;
  detailedPdf: string;
  detailedPdfFinish: boolean;
  detailedPdfToken: string;
  detailedPdfTokenTime: string;
  detailedPdfGeneratedTime: string;
}

export interface AvalanchePotential {
  riskAssessment: number;
  snowpackStructure: number;
  avalanchePotentialValue: number;
  avalancheCharacteristicString: string;
  windDriftedSnow: AvalancheProblem;
  persistentWeakLayer: AvalancheProblem;
  wetSnow: AvalancheProblem;
  glidingSnow: AvalancheProblem;
  newSnow: AvalancheProblem;
  snowpackStructureActive: boolean;
  triggeringProbability: string;
  avalancheSize: string;
  avalancheType: string;
  avalancheRiskTendency24h: string;
  avalancheRiskTendency48h: string;
  comment: null;
  oldSnowFloatingSnow: boolean;
  oldSnowSleet: boolean;
  oldSnowWeakLayers: boolean;
  wetSnowRain: boolean;
  wetSnowTemperatureIncrease: boolean;
  wetSnowHighRadiation: boolean;
}

export interface AvalancheProblem {
  riskAssessment: number;
  aspects: Aspect[];
  elevation?: number;
  above: boolean;
  below: boolean;
  active: boolean;
}

export type Aspect = "N" | "NO" | "NW" | "O" | "S" | "SO" | "SW" | "W";

export interface Weather {
  cloudiness: string;
  freshSnowAmount: string;
  officialAvalancheReport: boolean;
  precipitationIntensity: string;
  precipitationType: string;
  temperaturePeak?: number;
  temperatureTreeline?: number;
  temperatureValley?: number;
  weatherTendency: string;
  windDirection: any[];
  windSpeed: string;
  visibilityConditions: string;
}

export function convertLoLaSafety(lola: LoLaSafetyApi): GenericObservation[] {
  return [
    ...lola.avalancheReports.map((obs) => convertAvalancheReport(obs)),
    ...lola.snowProfiles.map((obs) =>
      convertLoLaToGeneric(obs, ObservationType.Profile, "https://www.lola-safety.info/snowProfile/")
    )
  ];
}

function convertAvalancheReport(report: AvalancheReport): GenericObservation<AvalancheReport> {
  return {
    $data: report,
    $externalURL: "https://www.lola-safety.info/api/file/avalancheReport/" + (report.detailedPdf ?? report.publicPdf),
    $source: ObservationSource.LoLaSafety,
    $type: ObservationType.Evaluation,
    stability: getAvalancheReportStability(report),
    aspect: undefined,
    authorName: report.firstName + " " + report.lastName,
    content: report.headlineGerman + " " + report.headlineEnglish,
    elevation: undefined,
    eventDate: new Date(report.time),
    latitude: report.latitude,
    locationName: report.regionName + " " + report.avalancheName,
    longitude: report.longitude,
    region: undefined
  };
}

function getAvalancheReportStability(report: AvalancheReport): Stability {
  if (report.avalanchePotential.riskAssessment < 25) {
    return Stability.good;
  } else if (report.avalanchePotential.riskAssessment < 50) {
    return Stability.fair;
  } else if (report.avalanchePotential.riskAssessment < 75) {
    return Stability.poor;
  } else {
    return Stability.very_poor;
  }
}
