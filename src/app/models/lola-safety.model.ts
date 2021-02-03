import { formatDate } from "@angular/common";
import { SnowProfile } from "./avaobs.model";
import { ObservationTableRow } from "./observation.model";

export interface LoLaSafety {
  snowProfiles: SnowProfile[];
  avalancheReports: AvalancheReport[];
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
  elevation: null;
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
  temperaturePeak: null;
  temperatureTreeline: null;
  temperatureValley: null;
  weatherTendency: string;
  windDirection: any[];
  windSpeed: string;
  visibilityConditions: string;
}

export function toLoLaTable(report: AvalancheReport, t: (key: string) => string): ObservationTableRow[] {
  return [
    {
      label: t("observations.region"),
      value: report.regionName
    },
    {
      label: t("observations.locationName"),
      value: report.avalancheName
    },
    {
      label: t("observations.authorName"),
      value: report.firstName + " " + report.lastName
    },
    {
      label: t("observations.eventDate"),
      value: formatDate(report.time, "full", "de")
    },
    ...Object.keys(report.avalanchePotential)
      .map((label) => ({ label, value: report.avalanchePotential[label] }))
      .filter(({ value }) => typeof value === "string"),
    ...Object.keys(report.weather)
      .map((label) => ({ label, value: report.weather[label] }))
      .filter(({ value }) => typeof value === "string")
  ];
}
