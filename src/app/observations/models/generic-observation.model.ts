import * as Enums from "app/enums/enums";

// icons
import { appCircleAddIcon } from "../../svg/circle_add";
import { appCircleAlertIcon } from "../../svg/circle_alert";
import { appCircleCheckIcon } from "../../svg/circle_check";
import { appCircleDotsHorizontalIcon } from "../../svg/circle_dots_horizontal";
import { appCircleFullIcon } from "../../svg/circle_full";
import { appCircleMinusIcon } from "../../svg/circle_minus";
import { appCircleOkayTickIcon } from "../../svg/circle_okay_tick";
import { appCirclePlayEmptyIcon } from "../../svg/circle_play_empty";
import { appCirclePlayIcon } from "../../svg/circle_play";
import { appCircleStopIcon } from "../../svg/circle_stop";

export interface GenericObservation<Data = any> {
  $data: Data;
  $externalURL?: string;
  $extraDialogRows?: (t: (key: string) => string) => ObservationTableRow[];
  stability?: Stability;
  $markerRadius?: number;
  $source: ObservationSource;
  $type: ObservationType;
  aspect?: Aspect;
  authorName: string;
  content: string;
  elevation: number;
  eventDate: Date;
  latitude: number;
  locationName: string;
  longitude: number;
  region: string;
  reportDate?: Date;
  avalancheSituation?: Enums.AvalancheSituation;
  dangerPattern?: Enums.DangerPattern;
}

export type Stability = "good" | "medium" | "weak" | "unknown";

const colors: Record<Stability, string> = {
  good: "green",
  medium: "orange",
  weak: "red",
  unknown: "gray"
};

export function toMarkerColor(observation: GenericObservation) {
  return colors[observation?.stability ?? "unknown"] ?? colors.unknown;
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

export enum ObservationType {
  Observation = "Observation",
  Avalanche = "Avalanche",
  Blasting = "Blasting",
  Profile = "Profile",
  Incident = "Incident"
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

export const ObservationTypeIcons: Record<ObservationType, string> = Object.freeze({
   [ObservationType.Observation]: appCircleAddIcon.data,
   [ObservationType.Incident]: appCircleAlertIcon.data,
   [ObservationType.Profile]: appCircleCheckIcon.data,
   [ObservationType.Avalanche]: appCircleDotsHorizontalIcon.data,
   [ObservationType.Blasting]: appCircleFullIcon.data,
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

export function toAspect(aspect: Enums.Aspect | string | undefined): Aspect | undefined {
  if (typeof aspect === "number") {
    const string = Enums.Aspect[aspect];
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
