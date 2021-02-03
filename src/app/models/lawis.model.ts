import * as Enums from "../enums/enums";

export interface Lawis {
  profiles: Profile[],
  incidents: Incident[]
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
  incident_id:  number;
  datum:        string;
  country_id:   number;
  region_id:    number;
  subregion_id: number;
  ort:          string;
  elevation?:    number ;
  latitude:     number;
  longitude:    number;
  incline?:      number ;
  aspect_id:    number;
  danger_id?:    number ;
  n_injured?:    number ;
  n_dead?:       number ;
  n_uninjured?:  number ;
  involved_sum?: number ;
  involved:     Involved;
  valid_time:   boolean;
  revision:     number;
}

export enum Involved {
  None = "none",
  Unknown = "unknown",
  Yes = "yes",
}
