import { SnowProfile } from "./avaobs.model";
import { GenericObservation, ObservationTableRow, Source } from "./generic-observation.model";

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
}

export interface AvalanchePotential {
  riskAssessment: number;
  snowpackStructure: number;
  avalanchePotentialValue: number;
  avalancheCharacteristicString: string;
  windDriftedSnow: AvalancheSituation;
  persistentWeakLayer: AvalancheSituation;
  wetSnow: AvalancheSituation;
  glidingSnow: AvalancheSituation;
  newSnow: AvalancheSituation;
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

export interface AvalancheSituation {
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

export function convertLoLaToGeneric(report: AvalancheReport): GenericObservation<AvalancheReport> {
  return {
    $data: report,
    $extraDialogRows: async (_, t) => toLoLaTable(report, t),
    $markerColor: "#1a9641",
    $source: Source.lola_safety,
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

export function toLoLaTable(report: AvalancheReport, t: (key: string) => string): ObservationTableRow[] {
  return [
    { label: t("LoLaAvalanchePotential.riskAssessment"), number: report.avalanchePotential.riskAssessment },
    { label: t("LoLaAvalanchePotential.snowpackStructure"), number: report.avalanchePotential.snowpackStructure },
    { label: t("LoLaAvalanchePotential.avalanchePotentialValue"), number: report.avalanchePotential.avalanchePotentialValue },
    { label: t("LoLaAvalanchePotential.avalancheCharacteristicString"), value: report.avalanchePotential.avalancheCharacteristicString },
    { label: t("avalancheProblem.windDriftedSnow"), value: formatAvalancheSituation(report.avalanchePotential.windDriftedSnow) },
    { label: t("avalancheProblem.persistentWeakLayers"), value: formatAvalancheSituation(report.avalanchePotential.persistentWeakLayer) },
    { label: t("avalancheProblem.wetSnow"), value: formatAvalancheSituation(report.avalanchePotential.wetSnow) },
    { label: t("avalancheProblem.glidingSnow"), value: formatAvalancheSituation(report.avalanchePotential.glidingSnow) },
    { label: t("LoLaAvalanchePotential.newSnow"), value: formatAvalancheSituation(report.avalanchePotential.newSnow) },
    { label: t("LoLaAvalanchePotential.snowpackStructureActive"), boolean: report.avalanchePotential.snowpackStructureActive },
    { label: t("LoLaAvalanchePotential.triggeringProbability"), value: report.avalanchePotential.triggeringProbability },
    { label: t("observations.avalancheSize"), value: report.avalanchePotential.avalancheSize },
    { label: t("observations.avalancheType"), value: report.avalanchePotential.avalancheType },
    { label: t("LoLaAvalanchePotential.avalancheRiskTendency24h"), value: report.avalanchePotential.avalancheRiskTendency24h },
    { label: t("LoLaAvalanchePotential.avalancheRiskTendency48h"), value: report.avalanchePotential.avalancheRiskTendency48h },
    { label: t("observations.comment"), value: report.avalanchePotential.comment },
    { label: t("LoLaAvalanchePotential.oldSnowFloatingSnow"), boolean: report.avalanchePotential.oldSnowFloatingSnow },
    { label: t("LoLaAvalanchePotential.oldSnowSleet"), boolean: report.avalanchePotential.oldSnowSleet },
    { label: t("LoLaAvalanchePotential.oldSnowWeakLayers"), boolean: report.avalanchePotential.oldSnowWeakLayers },
    { label: t("LoLaAvalanchePotential.wetSnowRain"), boolean: report.avalanchePotential.wetSnowRain },
    { label: t("LoLaAvalanchePotential.wetSnowTemperatureIncrease"), boolean: report.avalanchePotential.wetSnowTemperatureIncrease },
    { label: t("LoLaAvalanchePotential.wetSnowHighRadiation"), boolean: report.avalanchePotential.wetSnowHighRadiation },
    ...Object.keys(report.weather)
      .map((key) => ({ label: t("LoLaWeather." + key), value: report.weather[key] }))
      .filter(({ value }) => typeof value === "string")
  ];
}

function formatAvalancheSituation(situation: AvalancheSituation): string {
  return situation.aspects?.join(", ");
}
