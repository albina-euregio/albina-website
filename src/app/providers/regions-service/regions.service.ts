import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FeatureCollection, Polygon, MultiPolygon, Geometry } from "geojson";

import RegionsEuregio_AT_07 from "../../../../eaws-regions/public/micro-regions/AT-07_micro-regions.geojson.json";
import RegionsEuregio_IT_32_BZ from "../../../../eaws-regions/public/micro-regions/IT-32-BZ_micro-regions.geojson.json";
import RegionsEuregio_IT_32_TN from "../../../../eaws-regions/public/micro-regions/IT-32-TN_micro-regions.geojson.json";
const RegionsEuregio: FeatureCollection<MultiPolygon, RegionProperties> = mergeFeatureCollections(
  RegionsEuregio_AT_07 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsEuregio_IT_32_BZ as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsEuregio_IT_32_TN as FeatureCollection<MultiPolygon, RegionProperties>
);

import RegionsEuregioElevation_AT_07 from "../../../../eaws-regions/public/micro-regions_elevation/AT-07_micro-regions_elevation.geojson.json";
import RegionsEuregioElevation_IT_32_BZ from "../../../../eaws-regions/public/micro-regions_elevation/IT-32-BZ_micro-regions_elevation.geojson.json";
import RegionsEuregioElevation_IT_32_TN from "../../../../eaws-regions/public/micro-regions_elevation/IT-32-TN_micro-regions_elevation.geojson.json";
const RegionsEuregioElevation: FeatureCollection<MultiPolygon, RegionWithElevationProperties> = mergeFeatureCollections(
  RegionsEuregioElevation_AT_07 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsEuregioElevation_IT_32_BZ as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsEuregioElevation_IT_32_TN as FeatureCollection<MultiPolygon, RegionWithElevationProperties>
);

import RegionsAran_ES_CT_L from "../../../../eaws-regions/public/micro-regions/ES-CT-L_micro-regions.geojson.json";
const RegionsAran: FeatureCollection<Polygon, RegionProperties> = mergeFeatureCollections(
  RegionsAran_ES_CT_L as FeatureCollection<Polygon, RegionProperties>
);

import RegionsAranElevation_ES_CT_L from "../../../../eaws-regions/public/micro-regions_elevation/ES-CT-L_micro-regions_elevation.geojson.json";
const RegionsAranElevation: FeatureCollection<MultiPolygon, RegionWithElevationProperties> = mergeFeatureCollections(
  RegionsAranElevation_ES_CT_L as FeatureCollection<MultiPolygon, RegionWithElevationProperties>
);

import * as L from "leaflet";
import { isMarkerInsidePolygon } from "./isMarkerInsidePolygon";

@Injectable()
export class RegionsService {
  euregioGeoJSON: L.GeoJSON;

  // TODO define level 1 regions
  level1: string[] = ["IT-32-BZ-01", "IT-32-BZ-02", "IT-32-BZ-03", "IT-32-BZ-04", "IT-32-BZ-05", "IT-32-BZ-06"]; 
  // TODO define level 2 regions
  level2: string[] = ["IT-32-BZ-01", "IT-32-BZ-02", "IT-32-BZ-03", "IT-32-BZ-04", "IT-32-BZ-05", "IT-32-BZ-06", "IT-32-BZ-07", "IT-32-BZ-08", "IT-32-BZ-09", "IT-32-BZ-10", "IT-32-BZ-11"]; 

  constructor(private translateService: TranslateService) {
    this.translateAllNames();
    this.translateService.onLangChange.subscribe(() => this.translateAllNames());
    this.euregioGeoJSON = L.geoJSON(this.getRegionsEuregio());
  }

  getLevel1Regions(id) {
    return this.level1;
  }

  getLevel2Regions(id) {
    return this.level2;
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

export interface RegionWithElevationProperties extends RegionProperties {
  elevation: "high" | "low";
}

function mergeFeatureCollections<G extends Geometry, P>(...collections: FeatureCollection<G, P>[]): FeatureCollection<G, P> {
  return {
    type: "FeatureCollection",
    features: [].concat(...collections.map(collection => collection.features))
  };
}
