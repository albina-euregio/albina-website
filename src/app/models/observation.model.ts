import { GenericObservation, Aspect, Source } from "./generic-observation.model";

export interface Observation {
  aspect: Aspect;
  authorName: string;
  content: string;
  elevation: number;
  eventDate: string | Date;
  eventType: EventType;
  id: number;
  latitude: number;
  locationName: string;
  longitude: number;
  region: string;
  reportDate?: string | Date;
}

export enum EventType {
  Important = "IMPORTANT",
  NeighborRegion = "NEIGHBOR_REGION",
  Normal = "NORMAL",
  PersonDead = "PERSON_DEAD",
  PersonInjured = "PERSON_INJURED",
  PersonNo = "PERSON_NO",
  PersonUninjured = "PERSON_UNINJURED",
  PersonUnknown = "PERSON_UNKNOWN",
  Traffic = "TRAFFIC"
}

export function convertObservationToGeneric(observation: Observation): GenericObservation<Observation> {
  return {
    ...observation,
    $data: observation,
    $extraDialogRows: null,
    $markerColor: "#ca0020",
    $source: Source.albina,
    eventDate: observation.eventDate ? new Date(observation.eventDate) : undefined,
    reportDate: observation.reportDate ? new Date(observation.reportDate) : undefined
  };
}

export function isAlbinaObservation(observation: GenericObservation): observation is GenericObservation<Observation> {
  return observation.$source === Source.albina;
}
