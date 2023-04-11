import {
  AvalancheProblem,
  GenericObservation,
  imageCountString,
  ImportantObservation,
  ObservationSource,
  ObservationTableRow,
  ObservationType,
  Stability,
  toAspect,
  TranslationFunction
} from "./generic-observation.model";

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
  problem: IdText<ProblemText>;
}

export enum ProblemText {
  FreshSnow = "fresh snow",
  GlidingSnow = "gliding snow",
  OldSnow = "old snow",
  Unknown = "unknown",
  WetSnow = "wet snow",
  WindDriftedSnow = "wind-drifted snow"
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

export interface IdText<T = string> {
  id: number;
  text: T;
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
    reportDate: parseLawisDate(lawis.reported.date),
    latitude: lawis.location.latitude,
    locationName: lawis.location.name,
    longitude: lawis.location.longitude,
    region: lawis.location.region.text
  };
}

export function toLawisProfileDetails(
  profile: GenericObservation<Profile>,
  lawisDetails: ProfileDetails
): GenericObservation<ProfileDetails> {
  return {
    ...profile,
    $data: lawisDetails,
    stability: getLawisProfileStability(lawisDetails),
    importantObservations: lawisDetails.stability_tests.length ? [ImportantObservation.StabilityTest] : [],
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
): GenericObservation<IncidentDetails> {
  return {
    ...incident,
    $data: lawisDetails,
    $extraDialogRows: (t) => toLawisIncidentTable(lawisDetails, t),
    stability: getLawisIncidentStability(lawisDetails),
    avalancheProblems: getLawisIncidentAvalancheProblems(lawisDetails),
    authorName: lawisDetails.reported?.name,
    content: (lawisDetails.comments || "") + imageCountString(lawisDetails.images),
    reportDate: parseLawisDate(lawisDetails.reported?.date)
  };
}

export function toLawisIncidentTable(incident: IncidentDetails, t: TranslationFunction): ObservationTableRow[] {
  const avalancheType = AvalancheType[AvalancheType[incident.avalanche?.type?.id]];
  const avalancheSize = AvalancheSize[AvalancheSize[incident.avalanche.size.id]];
  return [
    {
      label: t("observations.dangerRating"),
      value: incident.danger?.rating?.id
    },
    {
      label: t("observations.avalancheProblem"),
      value: incident.danger?.problem?.id
    },
    {
      label: t("observations.incline"),
      number: incident.location?.slope_angle
    },
    { label: t("observations.avalancheType"), value: avalancheType },
    { label: t("observations.avalancheSize"), value: avalancheSize },
    {
      label: t("observations.avalancheLength"),
      number: incident.avalanche?.extent?.length
    },
    {
      label: t("observations.avalancheWidth"),
      number: incident.avalanche?.extent?.width
    },
    {
      label: t("observations.fractureDepth"),
      number: incident.avalanche?.breakheight
    }
  ];
}

export function parseLawisDate(datum: string): Date {
  return new Date(datum.replace(/ /, "T"));
}

function getLawisProfileStability(profile: ProfileDetails): Stability {
  // Ausbildungshandbuch, 6. Auflage, Seiten 170/171
  const ect_tests = profile.stability_tests.filter((t) => t.type.text === "ECT") || [];
  const colors = ect_tests.map((t) => getECTestStability(t.step, t.result.text));
  if (colors.includes(Stability.very_poor)) {
    return Stability.very_poor;
  } else if (colors.includes(Stability.poor)) {
    return Stability.poor;
  } else if (colors.includes(Stability.fair)) {
    return Stability.fair;
  } else if (colors.includes(Stability.good)) {
    return Stability.good;
  }
  return null;
}

export function getECTestStability(step: number, propagation: string): Stability {
  // Ausbildungshandbuch, 6. Auflage, Seiten 170/171
  const propagation1 = /\bP\b/.test(propagation);
  const propagation0 = /\bN\b/.test(propagation);
  if (step <= 11 && propagation1) {
    // sehr schwach
    return Stability.very_poor;
  } else if (step <= 22 && propagation1) {
    // schwach
    return Stability.poor;
  } else if (step <= 30 && propagation1) {
    // mittel
    return Stability.fair;
  } else if (step <= 11 && propagation0) {
    // mittel
    return Stability.fair;
  } else if (step <= 30 && propagation0) {
    return Stability.good;
  } else if (step === 31) {
    return Stability.good;
  }
  return null;
}

function getLawisIncidentStability(incident: IncidentDetails): Stability {
  return incident.involved?.dead || incident.involved?.injured || incident.involved?.buried_partial || incident.involved?.buried_total
    ? Stability.poor
    : Stability.fair;
}

function getLawisIncidentAvalancheProblems(incident: IncidentDetails): AvalancheProblem[] {
  const problem = incident?.danger?.problem?.text;
  switch (problem || "") {
    case ProblemText.FreshSnow:
      return [AvalancheProblem.new_snow];
    case ProblemText.GlidingSnow:
      return [AvalancheProblem.gliding_snow];
    case ProblemText.OldSnow:
      return [AvalancheProblem.persistent_weak_layers];
    case ProblemText.WetSnow:
      return [AvalancheProblem.wet_snow];
    case ProblemText.WindDriftedSnow:
      return [AvalancheProblem.wind_slab];
    default:
      return [];
  }
}
