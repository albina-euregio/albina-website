import * as Enums from "app/enums/enums";

export interface GenericObservation<Data = any> {
  $data: Data;
  $externalURL?: string;
  $extraDialogRows?: (t: (key: string) => string) => ObservationTableRow[];
  $markerColor?: string;
  $source: ObservationSource;
  aspect: Aspect;
  authorName: string;
  content: string;
  elevation: number;
  eventDate: Date;
  latitude: number;
  locationName: string;
  longitude: number;
  region: string;
  reportDate?: Date;
}

export enum ObservationSource {
  Albina = "Albina",
  AvalancheWarningService = "AvalancheWarningService",
  LwdKipBeobachtung = "LwdKipBeobachtung",
  LwdKipLawinenabgang = "LwdKipLawinenabgang",
  LwdKipSperre = "LwdKipSperre",
  LwdKipSprengerfolg = "LwdKipSprengerfolg",
  LawisSnowProfiles = "LawisSnowProfiles",
  LawisIncidents = "LawisIncidents",
  LoLaSafetySnowProfiles = "LoLaSafetySnowProfiles",
  LoLaSafetyAvalancheReports = "LoLaSafetyAvalancheReports",
  AvaObsAvalancheEvent = "AvaObsAvalancheEvent",
  AvaObsEvaluation = "AvaObsEvaluation",
  AvaObsSimpleObservation = "AvaObsSimpleObservation",
  AvaObsSnowProfile = "AvaObsSnowProfile",
  KipLiveAvalancheEvent = "KipLiveAvalancheEvent",
  KipLiveEvaluation = "KipLiveEvaluation",
  KipLiveSimpleObservation = "KipLiveSimpleObservation",
  KipLiveSnowProfile = "KipLiveSnowProfile",
  NatlefsAvalancheEvent = "NatlefsAvalancheEvent",
  NatlefsEvaluation = "NatlefsEvaluation",
  NatlefsSimpleObservation = "NatlefsSimpleObservation",
  NatlefsSnowProfile = "NatlefsSnowProfile",
  WikisnowECT = "WikisnowECT",
}

export const ObservationSourceColors: Record<ObservationSource, string> = Object.freeze({
  [ObservationSource.Albina]: "#ca0020",
  [ObservationSource.AvalancheWarningService]: "#83e4f0",
  [ObservationSource.LwdKipBeobachtung]: "#f781bf",
  [ObservationSource.LwdKipLawinenabgang]: "#ff7f00",
  [ObservationSource.LwdKipSperre]: "#455132",
  [ObservationSource.LwdKipSprengerfolg]: "#a6761d",
  [ObservationSource.LawisSnowProfiles]: "#44a9db",
  [ObservationSource.LawisIncidents]: "#b76bd9",
  [ObservationSource.LoLaSafetySnowProfiles]: "#a6d96a",
  [ObservationSource.LoLaSafetyAvalancheReports]: "#1a9641",
  [ObservationSource.AvaObsAvalancheEvent]: "#6a3d9a",
  [ObservationSource.AvaObsEvaluation]: "#018571",
  [ObservationSource.AvaObsSimpleObservation]: "#80cdc1",
  [ObservationSource.AvaObsSnowProfile]: "#2c7bb6",
  [ObservationSource.KipLiveAvalancheEvent]: "#6a3d9a",
  [ObservationSource.KipLiveEvaluation]: "#018571",
  [ObservationSource.KipLiveSimpleObservation]: "#80cdc1",
  [ObservationSource.KipLiveSnowProfile]: "#2c7bb6",
  [ObservationSource.NatlefsAvalancheEvent]: "#6a3d9a",
  [ObservationSource.NatlefsEvaluation]: "#018571",
  [ObservationSource.NatlefsSimpleObservation]: "#80cdc1",
  [ObservationSource.NatlefsSnowProfile]: "#2c7bb6",
  [ObservationSource.WikisnowECT]: "#c6e667",
});

export enum Aspect {
  N = "N",
  NE = "NE",
  E = "E",
  SE = "SE",
  S = "S",
  SW = "SW",
  W = "W",
  NW = "NW"
}

export interface ObservationTableRow {
  label: string;
  date?: Date;
  number?: number;
  boolean?: boolean;
  url?: string;
  value?: string;
}

export function toObservationTable(observation: GenericObservation, t: (key: string) => string): ObservationTableRow[] {
  return [
    { label: t("observations.eventDate"), date: observation.eventDate },
    { label: t("observations.reportDate"), date: observation.reportDate },
    { label: t("observations.authorName"), value: observation.authorName },
    { label: t("observations.locationName"), value: observation.locationName },
    { label: t("observations.elevation"), number: observation.elevation },
    { label: t("observations.aspect"), value: observation.aspect !== undefined ? t("aspect." + observation.aspect) : undefined },
    { label: t("observations.comment"), value: observation.content }
  ];
}

export function toAspect(aspect: Enums.Aspect | string): Aspect {
  if (typeof aspect === "number") {
    const string = Enums.Aspect[aspect];
    return Aspect[string];
  } else if (typeof aspect === "string") {
    return Aspect[aspect];
  }
}
