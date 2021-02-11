import { ObservationSource } from "./generic-observation.model";

export type LwdKipSprengerfolg = GeoJSON.FeatureCollection<GeoJSON.Point, SprengerfolgProperties>;

export interface SprengerfolgProperties {
  OBJECTID: number;
  TBEOBACHTUNGSEQ: number;
  TKOMMISSIONSEQ: number;
  MANDANTSEQ: number;
  BEOBDATUM: number;
  SPRENGERFOLGSEQ?: number;
  SPRENGERFOLG?: string;
  SEEHOEHE: number;
  EXPOSITION: number;
  NEIGUNG?: number;
  BEZEICHNUNG: string;
  SPRENGUNGZEIT?: number;
  SPRENGGRUND?: string;
  NOTIZEN?: string;
}

export function convertLwdKipToGeneric(feature: GeoJSON.Feature<GeoJSON.Point, SprengerfolgProperties>) {
  let eventDate = feature.properties.BEOBDATUM + feature.properties.SPRENGUNGZEIT;
  eventDate += 60_000 * new Date(feature.properties.BEOBDATUM).getTimezoneOffset();
  return {
    $data: feature.properties,
    $markerColor: "#a6761d",
    $source: ObservationSource.LwdKipSprengerfolg,
    aspect: undefined,
    authorName: undefined,
    content: [
      feature.properties.SPRENGERFOLG && `Sprengerfolg: ${feature.properties.SPRENGERFOLG}`,
      feature.properties.SPRENGGRUND && `Sprenggrund: ${feature.properties.SPRENGGRUND}`,
      feature.properties.NOTIZEN
    ]
      .filter((s) => !!s)
      .join(" – "),
    elevation: feature.properties.SEEHOEHE,
    eventDate: new Date(eventDate),
    latitude: feature.geometry.coordinates[1],
    locationName: feature.properties.BEZEICHNUNG,
    longitude: feature.geometry.coordinates[0],
    region: undefined
  };
}
