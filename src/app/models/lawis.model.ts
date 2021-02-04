import * as Enums from "../enums/enums";
import { GenericObservation, ObservationTableRow } from "./generic-observation.model";

export interface Lawis {
  profiles: GenericObservation<Profile>[];
  incidents: GenericObservation<Incident>[];
}

// https://lawis.at/lawis_api/normalizer/profile/
export interface Profile {
  profil_id: number;
  datum: string;
  country_id: number;
  region_id: number;
  subregion_id: number;
  ort: string;
  seehoehe: number;
  latitude: number;
  longitude: number;
  hangneigung: number;
  exposition_id: Enums.Aspect | undefined;
  loggedon: string;
  revision: number;
}

// https://lawis.at/lawis_api/normalizer/profile/13794?lang=de
export interface ProfileDetails {
  id: number;
  name: string;
  profildatum: string;
  loggedon: string;
  country_id: string;
  region_id: string;
  subregion_id: string;
  ort: string;
  seehoehe: number;
  latitude: number;
  longitude: number;
  hangneigung: number;
  exposition_id: string;
  windgeschwindigkeit_id: string;
  windrichtung_id: null;
  lufttemperatur: number;
  niederschlag_id: string;
  intensity_id: null;
  bewoelkung_id: string;
  bemerkungen: string;
  active: number;
  email: string;
  obfuscate_email: boolean;
  revision: number;
  files: Files;
}

export interface Files {
  pdf: string;
  png: string;
  thumbnail: string;
}

// https://www.lawis.at/lawis_api/normalizer/profile/13794/tests?lang=de
export interface ProfileTest {
  id: number;
  height: string;
  belastungsst: number;
  testprocedureend: string;
  test_id: string;
  profil_id: number;
}

// https://lawis.at/lawis_api/normalizer/incident/
export interface Incident {
  incident_id: number;
  datum: string;
  country_id: number;
  region_id: number;
  subregion_id: number;
  ort: string;
  elevation?: number;
  latitude: number;
  longitude: number;
  incline?: number;
  aspect_id: Enums.Aspect;
  danger_id?: Enums.DangerRating;
  n_injured?: number;
  n_dead?: number;
  n_uninjured?: number;
  involved_sum?: number;
  involved: Involved;
  valid_time: boolean;
  revision: number;
}

export enum Involved {
  None = "none",
  Unknown = "unknown",
  Yes = "yes"
}

export interface IncidentDetails {
  incident_id: number;
  datum: string;
  country_id: number;
  region_id: number;
  subregion_id: number;
  ort: string;
  elevation: number;
  latitude: number;
  longitude: number;
  incline: number;
  aspect_id: Enums.Aspect;
  comments: string;
  extent_x: number;
  extent_y: number;
  breakheight: number;
  involved_id: number;
  dead: number;
  injured: number;
  uninjured: number;
  sweeped: number;
  buried_total: number;
  buried_partial: number;
  type_id: AvalancheType;
  size_id: AvalancheSize;
  danger_id: Enums.DangerRating;
  reporting_date: string;
  name: string;
  active: number;
  email: string;
  obfuscate_email: boolean;
  valid_time: boolean;
  av_humidity: string;
  av_humidity_extra: number;
  asc_desc: string;
  asc_desc_extra: number;
  equipment: string;
  equipment_extra: number;
  lvs: string;
  lvs_extra: number;
  airbag: string;
  airbag_extra: number;
  av_problem: string;
  av_problem_extra: number;
  av_release: string;
  av_release_extra: number;
  revision: number;
  images: Image[];
}

export interface Image {
  url: string;
  size: number;
  caption: null;
  comment: string;
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

export function toLawisIncidentTable(incident: IncidentDetails, t: (key: string) => string): ObservationTableRow[] {
  const dangerRating = Enums.DangerRating[Enums.DangerRating[incident.danger_id]];
  const avalancheType = AvalancheType[AvalancheType[incident.type_id]];
  const avalancheSize = AvalancheSize[AvalancheSize[incident.size_id]];
  return [
    { label: t("observations.dangerRating"), value: t("dangerRating." + dangerRating) },
    { label: t("observations.avalancheProblem"), value: incident.av_problem },
    { label: t("observations.incline"), number: incident.incline },
    { label: t("observations.avalancheType"), value: avalancheType },
    { label: t("observations.avalancheSize"), value: avalancheSize },
    { label: t("observations.avalancheLength"), number: incident.extent_x },
    { label: t("observations.avalancheWidth"), number: incident.extent_y },
    { label: t("observations.fractureDepth"), number: incident.breakheight },
    { label: "URL", value: "https://lawis.at/incident/#" + incident.incident_id }
  ];
}

export function parseLawisDate(datum: string): Date {
  return new Date(datum.replace(/ /, "T"));
}
