import { GenericObservation, ObservationSource, toAspect } from "./generic-observation.model";

// https://gis.tirol.gv.at/arcgis/rest/services/APPS_DVT/lwdkip/MapServer/layers?f=json
export interface ArcGisLayer {
  id: number;
  name: string;
  description: string;
  type: "Feature Layer" | "Group Layer" | "Mosaic Layer" | "Raster Layer";
  geometryType?: "esriGeometryPoint" | "esriGeometryPolygon" | "esriGeometryPolyline";
}

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

export function convertLwdKipSprengerfolg(feature: GeoJSON.Feature<GeoJSON.Point, SprengerfolgProperties>): GenericObservation {
  let eventDate = feature.properties.BEOBDATUM + feature.properties.SPRENGUNGZEIT;
  eventDate += 60_000 * new Date(feature.properties.BEOBDATUM).getTimezoneOffset();
  return {
    $data: feature.properties,
    $extraDialogRows: (t) => [
      { label: "Sprengerfolg", value: feature.properties.SPRENGERFOLG },
      { label: "Sprenggrund", value: feature.properties.SPRENGGRUND },
      { label: t("observations.incline"), number: feature.properties.NEIGUNG }
    ],
    $markerColor: "#a6761d",
    $source: ObservationSource.LwdKipSprengerfolg,
    aspect: toAspect(feature.properties.EXPOSITION),
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

export type LwdKipLawinenabgang = GeoJSON.FeatureCollection<GeoJSON.LineString, LawinenabgangProperties>;

export interface LawinenabgangProperties {
  BEZEICHNUNG: string;
  OBJECTID: number;
  BEOBDATUM: number;
  ZEIT?: number;
  LAWINENGROESSE: string;
  LAWINENART: string;
  LAWINENFEUCHTE: string;
  SPRENGUNG?: number;
  NOTIZEN?: string;
  NEIGUNG?: number;
  EXPOSITION: number;
  SHAPE?: any;
}

export function convertLwdKipLawinenabgang(feature: GeoJSON.Feature<GeoJSON.LineString, LawinenabgangProperties>): GenericObservation {
  let eventDate = feature.properties.BEOBDATUM + feature.properties.ZEIT;
  eventDate += 60_000 * new Date(feature.properties.BEOBDATUM).getTimezoneOffset();
  return {
    $data: feature.properties,
    $extraDialogRows: (t) => [
      { label: "Lawinengröße", value: feature.properties.LAWINENGROESSE },
      { label: "Lawinenart", value: feature.properties.LAWINENART },
      { label: "Lawinenfeuchte", value: feature.properties.LAWINENFEUCHTE },
      { label: "Sprengung", boolean: feature.properties.SPRENGUNG > 0 },
      { label: t("observations.incline"), number: feature.properties.NEIGUNG }
    ],
    $markerColor: "#ff7f00",
    $source: ObservationSource.LwdKipLawinenabgang,
    aspect: toAspect(feature.properties.EXPOSITION),
    authorName: undefined,
    content: [
      feature.properties.NOTIZEN,
      feature.properties.LAWINENGROESSE && `Lawinengröße: ${feature.properties.LAWINENGROESSE}`,
      feature.properties.LAWINENART && `Lawinenart: ${feature.properties.LAWINENART}`,
      feature.properties.LAWINENFEUCHTE && `Lawinenfeuchte: ${feature.properties.LAWINENFEUCHTE}`
    ]
      .filter((s) => !!s)
      .join(" – "),
    elevation: undefined,
    eventDate: new Date(eventDate),
    latitude: feature.geometry?.coordinates?.[0]?.[1],
    locationName: feature.properties.BEZEICHNUNG,
    longitude: feature.geometry?.coordinates?.[0]?.[0],
    region: undefined
  };
}
