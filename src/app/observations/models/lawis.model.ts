import * as Enums from "app/enums/enums";
import { GenericObservation, imageCountString, ObservationSource, ObservationTableRow, ObservationType, Stability, toAspect, TranslationFunction } from "./generic-observation.model";

export const LAWIS_FETCH_DETAILS = true;

// https://lawis.at/lawis_api/public/swagger/
export interface Lawis {
  profiles: GenericObservation<Profile>[];
  incidents: GenericObservation<Incident>[];
}

// https://lawis.at/lawis_api/public/profile/
export interface Profile {
  id: number;
  href: string;
  caaml: string;
  date: string;
  reported: {
    date: string;
  };
  location: Location;
}

// https://lawis.at/lawis_api/public/profile/13794?lang=de&format=json
export interface ProfileDetails {
  id: number;
  files: Files;
  date: Date;
  reported: {
    date: string;
    name: string;
    email: string;
  };
  comments: string;
  location: Location;
  weather: any;
  profile: ProfilePart[];
  temperatures: Temperature[];
  stability_tests: StabilityTest[];
}

export interface ProfilePart {
  id: number;
  height: {
    min: number;
    max: number;
  };
  water_content: Aspect;
  grain: {
    size: {
      min: number;
      max: number;
    };
    shape1: Aspect;
    shape2: Aspect;
  };
  hardness: Aspect;
}

export interface Temperature {
  id: number;
  height: number;
  temperature: number;
}

export interface StabilityTest {
  id: number;
  type: IdText;
  height: number;
  step: number;
  result: Aspect;
}

export interface Files {
  pdf: string;
  png: string;
  thumbnail: string;
}

// https://lawis.at/lawis_api/public/incident
export interface Incident {
  valid_time: boolean;
  id: number;
  href: string;
  caaml: string;
  date: string;
  danger: Danger;
  location: Location;
}

export interface Danger {
  rating: IdText;
  problem: IdText;
}

export interface Location {
  name: string;
  longitude: number;
  latitude: number;
  aspect?: Aspect;
  country: Country;
  region: Country;
  subregion: Country;
  elevation?: number;
  slope_angle?: number;
}

export interface Aspect {
  id: number;
  text: "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
}

export interface Country {
  id: number;
  code: string;
  text: string;
}

// https://lawis.at/lawis_api/public/incident/10333?lang=de&format=json
export interface IncidentDetails {
  id: number;
  not_buried: number;
  valid_time: boolean;
  images: string[];
  date: string;
  reported: {
    date: string;
    name: string;
    email: string;
  };
  involved: Involved;
  danger: Danger;
  avalanche: Avalanche;
  comments: string;
  location: Location;
}

export interface Involved {
  dead: any;
  injured: any;
  uninjured: any;
  sweeped: any;
  buried_partial: any;
  buried_total: any;
  equipment: any;
  ascent_descent: any;
}

export interface Avalanche {
  extent: {
    length: number;
    width: number;
  };
  breakheight: number;
  type: IdText;
  size: IdText;
  release: IdText;
  humidity: IdText;
}

export enum AvalancheType {
  unknown = 0,
  slab = 1,
  gliding = 2,
  loose = 3
}

export enum AvalancheSize {
  unknown = 0,
  small = 1,
  medium = 2,
  large = 3,
  very_large = 4,
  extreme = 5
}

export interface IdText {
  id: number;
  text: string;
}

export function toLawisProfile(lawis: Profile, urlPattern: string): GenericObservation<Profile> {
  return {
    $data: lawis,
    $externalURL: urlPattern.replace("{{id}}", String(lawis.id)),
    $source: ObservationSource.Lawis,
    $type: ObservationType.Profile,
    aspect: toAspect(lawis.location.aspect?.text),
    authorName: "",
    content: "(LAWIS snow profile)",
    elevation: lawis.location.elevation,
    eventDate: parseLawisDate(lawis.date),
    latitude: lawis.location.latitude,
    locationName: lawis.location.name,
    longitude: lawis.location.longitude,
    region: lawis.location.region.text
  };
}

export function toLawisProfileDetails(profile: GenericObservation<Profile>, lawisDetails: ProfileDetails): GenericObservation<Profile> {
  return {
    ...profile,
    stability: getLawisProfileStability(lawisDetails),
    $markerRadius: getLawisProfileMarkerRadius(lawisDetails),
    authorName: lawisDetails.reported?.name,
    content: lawisDetails.comments
  };
}

export function toLawisIncident(lawis: Incident, urlPattern: string): GenericObservation<Incident> {
  return {
    $data: lawis,
    $externalURL: urlPattern.replace("{{id}}", String(lawis.id)),
    $source: ObservationSource.Lawis,
    $type: ObservationType.Incident,
    aspect: toAspect(lawis.location.aspect?.text),
    authorName: "",
    content: "(LAWIS incident)",
    elevation: lawis.location.elevation,
    eventDate: parseLawisDate(lawis.date),
    latitude: lawis.location.latitude,
    locationName: lawis.location.name,
    longitude: lawis.location.longitude,
    region: lawis.location.region.text
  };
}

export function toLawisIncidentDetails(
  incident: GenericObservation<Incident>,
  lawisDetails: IncidentDetails
): GenericObservation<Incident> {
  return {
    ...incident,
    $extraDialogRows: (t) => toLawisIncidentTable(lawisDetails, t),
    stability: getLawisIncidentStability(lawisDetails),
    $markerRadius: getLawisIncidentMarkerRadius(lawisDetails),
    authorName: lawisDetails.reported?.name,
    content: (lawisDetails.comments || "") + imageCountString(lawisDetails.images),
    reportDate: parseLawisDate(lawisDetails.reported?.date)
  };
}

export function toLawisIncidentTable(incident: IncidentDetails, t: TranslationFunction): ObservationTableRow[] {
  const dangerRating = Enums.DangerRating[Enums.DangerRating[incident.danger?.rating?.id]];
  const avalancheType = AvalancheType[AvalancheType[incident.avalanche?.type?.id]];
  const avalancheSize = AvalancheSize[AvalancheSize[incident.avalanche.size.id]];
  return [
    { label: t("observations.dangerRating"), value: t("dangerRating." + dangerRating) },
    { label: t("observations.avalancheProblem"), value: incident.danger?.problem?.id },
    { label: t("observations.incline"), number: incident.location?.slope_angle },
    { label: t("observations.avalancheType"), value: avalancheType },
    { label: t("observations.avalancheSize"), value: avalancheSize },
    { label: t("observations.avalancheLength"), number: incident.avalanche?.extent?.length },
    { label: t("observations.avalancheWidth"), number: incident.avalanche?.extent?.width },
    { label: t("observations.fractureDepth"), number: incident.avalanche?.breakheight }
  ];
}

export function parseLawisDate(datum: string): Date {
  return new Date(datum.replace(/ /, "T"));
}

function getLawisProfileStability(profile: ProfileDetails): Stability {
  // Ausbildungshandbuch, 6. Auflage, Seiten 170/171
  const ect_tests = profile.stability_tests.filter((t) => t.type.text === "ECT") || [];
  const colors = ect_tests.map((t) => getECTestStability(t.step, t.result.text));
  if (colors.includes(Enums.Stability.very_poor)) {
    return Enums.Stability.very_poor;
  } else if (colors.includes(Enums.Stability.poor)) {
    return Enums.Stability.poor;
  } else if (colors.includes(Enums.Stability.fair)) {
    return Enums.Stability.fair;
  } else if (colors.includes(Enums.Stability.good)) {
    return Enums.Stability.good;
  }
  return Enums.Stability.unknown;
}

export function getECTestStability(step: number, propagation: string): Stability {
  // Ausbildungshandbuch, 6. Auflage, Seiten 170/171
  const propagation1 = /\bP\b/.test(propagation);
  const propagation0 = /\bN\b/.test(propagation);
  if (step <= 11 && propagation1) {
    // sehr schwach
    return Enums.Stability.very_poor;
  } else if (step <= 22 && propagation1) {
    // schwach
    return Enums.Stability.poor;
  } else if (step <= 30 && propagation1) {
    // mittel
    return Enums.Stability.fair;
  } else if (step <= 10 && propagation0) {
    // mittel
    return Enums.Stability.fair;
  } else if (step <= 30 && propagation0) {
    return Enums.Stability.good;
  } else if (step === 31) {
    return Enums.Stability.good;
  }
  return Enums.Stability.unknown;
}

function getLawisProfileMarkerRadius(profile: ProfileDetails): number {
  return 15;
}

function getLawisIncidentStability(incident: IncidentDetails): Stability {
  return incident.involved?.dead || incident.involved?.injured || incident.involved?.buried_partial || incident.involved?.buried_total
    ? Enums.Stability.poor
    : Enums.Stability.fair;
}

function getLawisIncidentMarkerRadius(incident: IncidentDetails): number {
  const size_id = incident.avalanche?.size?.id;
  return size_id && size_id >= 1 && size_id <= 5 ? size_id * 10 : 10;
}
