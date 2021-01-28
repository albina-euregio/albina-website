export interface Observation {
  aspect: Aspect;
  authorName: string;
  content: string;
  elevation: number;
  eventDate: string;
  eventType: EventType;
  id: number;
  latitude: number;
  locationName: string;
  longitude: number;
  region: string;
  reportDate?: string;
}

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

export enum EventType {
  Important = "IMPORTANT",
  Normal = "NORMAL",
  PersonDead = "PERSON_DEAD",
  PersonInjured = "PERSON_INJURED",
  PersonNo = "PERSON_NO",
  PersonUninjured = "PERSON_UNINJURED"
}
