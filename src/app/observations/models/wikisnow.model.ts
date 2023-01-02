import {
  GenericObservation,
  ObservationSource,
  ObservationType,
  toAspect,
} from "./generic-observation.model";
import { getECTestStability } from "./lawis.model";

export interface ApiWikisnowECT {
  $schema: object;
  data: WikisnowECT[];
}

export interface WikisnowECT {
  id: string;
  images: string;
  images_url: string;
  UserName: string;
  location: string;
  createDate: string;
  latlong: string;
  Sealevel: string;
  inclination: string;
  exposition: string;
  totalSnowDepth: string;
  ECT_result: string;
  kind_typ: string;
  hits: string;
  groundSnowpack: string;
  propagation: string;
  surface: string;
  weak_layer: string;
  weak_layer_thickness: string;
  snowpack: string;
  description: string;
  video: null;
  UserID: null;
  lat?: number;
  long?: number;
}

export function convertWikisnow(
  wikisnow: WikisnowECT
): GenericObservation<WikisnowECT> {
  return {
    $data: wikisnow,
    $source: ObservationSource.WikisnowECT,
    $type: ObservationType.Profile,
    stability: getECTestStability(+wikisnow.hits, wikisnow.propagation),
    aspect: toAspect(+wikisnow.exposition / 45),
    authorName: wikisnow.UserName,
    content: [
      wikisnow.ECT_result,
      wikisnow.propagation,
      wikisnow.surface,
      wikisnow.weak_layer,
      wikisnow.description,
    ].join(" // "),
    elevation: +wikisnow.Sealevel,
    eventDate: new Date(wikisnow.createDate),
    latitude: +wikisnow?.latlong?.split(/,\s*/)?.[0],
    locationName: wikisnow.location,
    longitude: +wikisnow?.latlong?.split(/,\s*/)?.[1],
    region: "",
  };
}
