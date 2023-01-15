import { GenericObservation, ObservationSource, ObservationType } from "./generic-observation.model";

// https://gitlab.com/avalanche-warning
// SNOWPACK modelled snow profiles

export function convertObservedProfile(o: GenericObservation<any>): GenericObservation {
  o.authorName ??= "models.avalanche.report";
  o.eventDate = new Date(o.eventDate);
  o.$data = {};
  o.$source = ObservationSource.AvalancheWarningService;
  o.$type = ObservationType.Profile;
  return o;
}
