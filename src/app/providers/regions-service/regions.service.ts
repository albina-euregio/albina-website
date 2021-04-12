import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FeatureCollection, Polygon, MultiPolygon, Geometry } from "geojson";

import RegionsEuregio_AT_07 from "../../../../eaws-regions/public/micro-regions/AT-07_micro-regions.geojson.json";
import RegionsEuregio_IT_32_BZ from "../../../../eaws-regions/public/micro-regions/IT-32-BZ_micro-regions.geojson.json";
import RegionsEuregio_IT_32_TN from "../../../../eaws-regions/public/micro-regions/IT-32-TN_micro-regions.geojson.json";
const RegionsEuregio: FeatureCollection<MultiPolygon, RegionProperties> = mergeFeatureCollections(
  (properties) => properties,
  RegionsEuregio_AT_07 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsEuregio_IT_32_BZ as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsEuregio_IT_32_TN as FeatureCollection<MultiPolygon, RegionProperties>
);

import RegionsEuregioElevation_AT_07 from "../../../../eaws-regions/public/micro-regions_elevation/AT-07_micro-regions_elevation.geojson.json";
import RegionsEuregioElevation_IT_32_BZ from "../../../../eaws-regions/public/micro-regions_elevation/IT-32-BZ_micro-regions_elevation.geojson.json";
import RegionsEuregioElevation_IT_32_TN from "../../../../eaws-regions/public/micro-regions_elevation/IT-32-TN_micro-regions_elevation.geojson.json";
const RegionsEuregioElevation: FeatureCollection<MultiPolygon, RegionWithElevationProperties> = mergeFeatureCollections(
  (properties) => ({ ...properties, elevation: properties.hoehe === 1 ? "l" : properties.hoehe === 2 ? "h" : undefined }),
  RegionsEuregioElevation_AT_07 as FeatureCollection<MultiPolygon, RawRegionWithElevationProperties>,
  RegionsEuregioElevation_IT_32_BZ as FeatureCollection<MultiPolygon, RawRegionWithElevationProperties>,
  RegionsEuregioElevation_IT_32_TN as FeatureCollection<MultiPolygon, RawRegionWithElevationProperties>
);

import RegionsAran_ES_CT_L from "../../../../eaws-regions/public/micro-regions/ES-CT-L_micro-regions.geojson.json";
const RegionsAran: FeatureCollection<Polygon, RegionProperties> = mergeFeatureCollections(
  (properties) => properties,
  RegionsAran_ES_CT_L as FeatureCollection<Polygon, RegionProperties>
);

import RegionsAranElevation_ES_CT_L from "../../../../eaws-regions/public/micro-regions_elevation/ES-CT-L_micro-regions_elevation.geojson.json";
const RegionsAranElevation: FeatureCollection<MultiPolygon, RegionWithElevationProperties> = mergeFeatureCollections(
  (properties) => ({ ...properties, elevation: properties.hoehe === 1 ? "l" : properties.hoehe === 2 ? "h" : undefined }),
  RegionsAranElevation_ES_CT_L as FeatureCollection<MultiPolygon, RawRegionWithElevationProperties>
);

import * as L from "leaflet";
import { isMarkerInsidePolygon } from "./isMarkerInsidePolygon";

@Injectable()
export class RegionsService {
  euregioGeoJSON: L.GeoJSON;

  constructor(private translateService: TranslateService) {
    this.translateAllNames();
    this.translateService.onLangChange.subscribe(() => this.translateAllNames());
    this.euregioGeoJSON = L.geoJSON(this.getRegionsEuregio());
  }

  getRegionsEuregio(): FeatureCollection<MultiPolygon, RegionProperties> {
    return RegionsEuregio;
  }

  getRegionsEuregioWithElevation(): FeatureCollection<MultiPolygon, RegionWithElevationProperties> {
    return RegionsEuregioElevation;
  }

  getRegionsAran(): FeatureCollection<Polygon, RegionProperties> {
    return RegionsAran;
  }

  getRegionsAranWithElevation(): FeatureCollection<MultiPolygon, RegionWithElevationProperties> {
    return RegionsAranElevation;
  }

  private translateAllNames() {
    this.translateNames(this.getRegionsEuregio());
    this.translateNames(this.getRegionsEuregioWithElevation());
    this.translateNames(this.getRegionsAran());
    this.translateNames(this.getRegionsAranWithElevation());
  }

  private translateNames(data: FeatureCollection<any, RegionProperties>) {
    data.features.forEach((feature) => (feature.properties.name = this.translateService.instant("region." + feature.properties.id)));
  }

  getRegionForId(id: string): RegionProperties {
    return this.getRegionsEuregio().features.find((feature) => feature.properties.id === id)?.properties;
  }

  getRegionForLatLng(ll: L.LatLng): RegionProperties {
    const polygons = (this.euregioGeoJSON.getLayers() as any) as L.Polygon[];
    const polygon = polygons.find((p) => isMarkerInsidePolygon(ll, p));
    return polygon?.feature?.properties;
  }
}

export interface RegionProperties {
  id: string;
  name?: string;
  name_ar?: string;
  name_cat?: string;
  name_de?: string;
  name_en?: string;
  name_it?: string;
  name_sp?: string;
}

interface RawRegionWithElevationProperties extends RegionProperties {
  hoehe: 1 | 2;
}

export interface RegionWithElevationProperties extends RegionProperties {
  elevation: "h" | "l";
}

function mergeFeatureCollections<G extends Geometry, P, Q>(
  mapper: (properties: P) => Q,
  ...collections: FeatureCollection<G, P>[]
): FeatureCollection<G, Q> {
  return {
    type: "FeatureCollection",
    features: [].concat(
      ...collections.map((collection) =>
        collection.features.map((feature) => ({
          ...feature,
          properties: mapper(feature.properties)
        }))
      )
    )
  };
}
