import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FeatureCollection, MultiPolygon, Geometry } from "geojson";

import RegionsEuregio_AT_07 from "eaws-regions/public/micro-regions/AT-07_micro-regions.geojson.json";
import RegionsEuregio_IT_32_BZ from "eaws-regions/public/micro-regions/IT-32-BZ_micro-regions.geojson.json";
import RegionsEuregio_IT_32_TN from "eaws-regions/public/micro-regions/IT-32-TN_micro-regions.geojson.json";
const RegionsEuregio: FeatureCollection<MultiPolygon, RegionProperties> = mergeFeatureCollections(
  RegionsEuregio_AT_07 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsEuregio_IT_32_BZ as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsEuregio_IT_32_TN as FeatureCollection<MultiPolygon, RegionProperties>,
);

import RegionsEuregioElevation_AT_07 from "eaws-regions/public/micro-regions_elevation/AT-07_micro-regions_elevation.geojson.json";
import RegionsEuregioElevation_IT_32_BZ from "eaws-regions/public/micro-regions_elevation/IT-32-BZ_micro-regions_elevation.geojson.json";
import RegionsEuregioElevation_IT_32_TN from "eaws-regions/public/micro-regions_elevation/IT-32-TN_micro-regions_elevation.geojson.json";
const RegionsEuregioElevation: FeatureCollection<MultiPolygon, RegionWithElevationProperties> = mergeFeatureCollections(
  RegionsEuregioElevation_AT_07 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsEuregioElevation_IT_32_BZ as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsEuregioElevation_IT_32_TN as FeatureCollection<MultiPolygon, RegionWithElevationProperties>
);
    
import RegionsAineva_IT_21 from "eaws-regions/public/micro-regions/IT-21_micro-regions.geojson.json";
import RegionsAineva_IT_23 from "eaws-regions/public/micro-regions/IT-23_micro-regions.geojson.json";
import RegionsAineva_IT_25 from "eaws-regions/public/micro-regions/IT-25_micro-regions.geojson.json";
import RegionsAineva_IT_34 from "eaws-regions/public/micro-regions/IT-34_micro-regions.geojson.json";
import RegionsAineva_IT_36 from "eaws-regions/public/micro-regions/IT-36_micro-regions.geojson.json";
import RegionsAineva_IT_57 from "eaws-regions/public/micro-regions/IT-57_micro-regions.geojson.json";
const RegionsAineva: FeatureCollection<MultiPolygon, RegionProperties> = mergeFeatureCollections(
  RegionsAineva_IT_21 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_23 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_25 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_34 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_36 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_57 as FeatureCollection<MultiPolygon, RegionProperties>
);

import RegionsAinevaElevation_IT_21 from "eaws-regions/public/micro-regions_elevation/IT-21_micro-regions_elevation.geojson.json";
import RegionsAinevaElevation_IT_23 from "eaws-regions/public/micro-regions_elevation/IT-23_micro-regions_elevation.geojson.json";
import RegionsAinevaElevation_IT_25 from "eaws-regions/public/micro-regions_elevation/IT-25_micro-regions_elevation.geojson.json";
import RegionsAinevaElevation_IT_34 from "eaws-regions/public/micro-regions_elevation/IT-34_micro-regions_elevation.geojson.json";
import RegionsAinevaElevation_IT_36 from "eaws-regions/public/micro-regions_elevation/IT-36_micro-regions_elevation.geojson.json";
import RegionsAinevaElevation_IT_57 from "eaws-regions/public/micro-regions_elevation/IT-57_micro-regions_elevation.geojson.json";
const RegionsAinevaElevation: FeatureCollection<MultiPolygon, RegionWithElevationProperties> = mergeFeatureCollections(
  RegionsAinevaElevation_IT_21 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_23 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_25 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_34 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_36 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_57 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>
);

import RegionsAran_ES_CT_L from "eaws-regions/public/micro-regions/ES-CT-L_micro-regions.geojson.json";
const RegionsAran: FeatureCollection<MultiPolygon, RegionProperties> = mergeFeatureCollections(
  RegionsAran_ES_CT_L as FeatureCollection<MultiPolygon, RegionProperties>
);

import RegionsAranElevation_ES_CT_L from "eaws-regions/public/micro-regions_elevation/ES-CT-L_micro-regions_elevation.geojson.json";
const RegionsAranElevation: FeatureCollection<MultiPolygon, RegionWithElevationProperties> = mergeFeatureCollections(
  RegionsAranElevation_ES_CT_L as FeatureCollection<MultiPolygon, RegionWithElevationProperties>
);

import {default as regionsNamesDe} from "eaws-regions/public/micro-regions_names/de.json";
import {default as regionsNamesIt} from "eaws-regions/public/micro-regions_names/it.json";
import {default as regionsNamesEn} from "eaws-regions/public/micro-regions_names/en.json";
import {default as regionsNamesFr} from "eaws-regions/public/micro-regions_names/fr.json";
import {default as regionsNamesEs} from "eaws-regions/public/micro-regions_names/es.json";
import {default as regionsNamesCa} from "eaws-regions/public/micro-regions_names/ca.json";
import {default as regionsNamesOc} from "eaws-regions/public/micro-regions_names/oc.json";

const Regions: FeatureCollection<MultiPolygon, RegionProperties> = mergeFeatureCollections(
  RegionsEuregio_AT_07 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsEuregio_IT_32_BZ as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsEuregio_IT_32_TN as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_21 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_23 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_25 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_34 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_36 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_57 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAran_ES_CT_L as FeatureCollection<MultiPolygon, RegionProperties>
);  

const RegionsElevation: FeatureCollection<MultiPolygon, RegionWithElevationProperties> = mergeFeatureCollections(
  RegionsEuregioElevation_AT_07 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsEuregioElevation_IT_32_BZ as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsEuregioElevation_IT_32_TN as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_21 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_23 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_25 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_34 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_36 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_57 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAranElevation_ES_CT_L as FeatureCollection<MultiPolygon, RegionWithElevationProperties>
);  

import * as L from "leaflet";
import { isMarkerInsidePolygon } from "./isMarkerInsidePolygon";

@Injectable()
export class RegionsService {
  euregioGeoJSON: L.GeoJSON;

  initialAggregatedRegion: Record<string, string[]> = {
    "AT-07": RegionsEuregio.features.map(f => f.properties.id).filter(id => id.startsWith("AT-07")),
    "IT-32-BZ": RegionsEuregio.features.map(f => f.properties.id).filter(id => id.startsWith("IT-32-BZ")),
    "IT-32-TN": RegionsEuregio.features.map(f => f.properties.id).filter(id => id.startsWith("IT-32-TN")),
    "ES-CT-L": RegionsAran.features.map(f => f.properties.id).filter(id => id.startsWith("ES-CT-L"))
  };

  // Level 1 regions: parts of provinces
  level1: string[][] = [
    ["AT-07-01", "AT-07-02-01", "AT-07-02-02", "AT-07-07", "AT-07-08", "AT-07-10", "AT-07-11", "AT-07-12"], // west
    ["AT-07-03", "AT-07-04-01", "AT-07-04-02", "AT-07-05"], // north
    ["AT-07-06", "AT-07-17-01", "AT-07-17-02", "AT-07-18"], // east
    ["AT-07-09", "AT-07-13", "AT-07-14-01", "AT-07-14-02", "AT-07-14-03", "AT-07-14-04", "AT-07-14-05", "AT-07-15", "AT-07-16"], // center
    ["AT-07-19", "AT-07-20", "AT-07-21", "AT-07-22", "AT-07-23", "AT-07-24"], // AHK
    ["AT-07-25", "AT-07-26", "AT-07-27", "AT-07-28", "AT-07-29"], // east tyrol
    ["IT-32-BZ-01-01", "IT-32-BZ-01-02", "IT-32-BZ-02-01", "IT-32-BZ-02-02", "IT-32-BZ-03", "IT-32-BZ-04-01", "IT-32-BZ-04-02", "IT-32-BZ-05-01", "IT-32-BZ-05-02", "IT-32-BZ-05-03", "IT-32-BZ-06", "IT-32-BZ-07-01", "IT-32-BZ-07-02", "IT-32-BZ-11"], // AHK
    ["IT-32-BZ-14", "IT-32-BZ-15"], // west
    ["IT-32-BZ-08-01", "IT-32-BZ-08-02", "IT-32-BZ-08-03", "IT-32-BZ-09", "IT-32-BZ-10", "IT-32-BZ-12", "IT-32-BZ-13", "IT-32-BZ-16", "IT-32-BZ-17", "IT-32-BZ-18-01", "IT-32-BZ-18-02", "IT-32-BZ-19", "IT-32-BZ-20"], // east
    ["IT-32-TN-01", "IT-32-TN-02", "IT-32-TN-19", "IT-32-TN-20", "IT-32-TN-04", "IT-32-TN-05"], // west
    ["IT-32-TN-18", "IT-32-TN-12", "IT-32-TN-03", "IT-32-TN-11", "IT-32-TN-17", "IT-32-TN-15"], // center
    ["IT-32-TN-14", "IT-32-TN-06", "IT-32-TN-10", "IT-32-TN-21", "IT-32-TN-08", "IT-32-TN-07", "IT-32-TN-09", "IT-32-TN-16", "IT-32-TN-13"] // east
  ]; 
  // Level 2 regions: provinces
  level2: string[][] = [
    ["AT-07-01", "AT-07-02-01", "AT-07-02-02", "AT-07-03", "AT-07-04-01", "AT-07-04-02", "AT-07-05", "AT-07-06", "AT-07-07", "AT-07-08", "AT-07-09", "AT-07-10", "AT-07-11", "AT-07-12", "AT-07-13", "AT-07-14-01", "AT-07-14-02", "AT-07-14-03", "AT-07-14-04", "AT-07-14-05", "AT-07-15", "AT-07-16", "AT-07-17-01", "AT-07-17-02", "AT-07-18", "AT-07-19", "AT-07-20", "AT-07-21", "AT-07-22", "AT-07-23", "AT-07-24", "AT-07-25", "AT-07-26", "AT-07-27", "AT-07-28", "AT-07-29"],
    ["IT-32-BZ-01-01", "IT-32-BZ-01-02", "IT-32-BZ-02-01", "IT-32-BZ-02-02", "IT-32-BZ-03", "IT-32-BZ-04-01", "IT-32-BZ-04-02", "IT-32-BZ-05-01", "IT-32-BZ-05-02", "IT-32-BZ-05-03", "IT-32-BZ-06", "IT-32-BZ-07-01", "IT-32-BZ-07-02", "IT-32-BZ-08-01", "IT-32-BZ-08-02", "IT-32-BZ-08-03", "IT-32-BZ-09", "IT-32-BZ-10", "IT-32-BZ-11", "IT-32-BZ-12", "IT-32-BZ-13", "IT-32-BZ-14", "IT-32-BZ-15", "IT-32-BZ-16", "IT-32-BZ-17", "IT-32-BZ-18-01", "IT-32-BZ-18-02", "IT-32-BZ-19", "IT-32-BZ-20"],
    ["IT-32-TN-01", "IT-32-TN-02", "IT-32-TN-03", "IT-32-TN-04", "IT-32-TN-05", "IT-32-TN-06", "IT-32-TN-07", "IT-32-TN-08", "IT-32-TN-09", "IT-32-TN-10", "IT-32-TN-11", "IT-32-TN-12", "IT-32-TN-13", "IT-32-TN-14", "IT-32-TN-15", "IT-32-TN-16", "IT-32-TN-17", "IT-32-TN-18", "IT-32-TN-19", "IT-32-TN-20", "IT-32-TN-21"]
  ]; 

  constructor(private translateService: TranslateService) {
    this.translateAllNames();
    this.translateService.onLangChange.subscribe(() => this.translateAllNames());
    this.euregioGeoJSON = L.geoJSON(this.getRegionsEuregio());
  }

  getLevel1Regions(id) {
    for (let i = 0; i < this.level1.length; i++) {
      if (this.level1[i].includes(id)) {
        return this.level1[i];
      }
    }
    return [];
  }

  getLevel2Regions(id) {
    for (let i = 0; i < this.level2.length; i++) {
      if (this.level2[i].includes(id)) {
        return this.level2[i];
      }
    }
    return [];
  }

  getRegions(): FeatureCollection<MultiPolygon, RegionProperties> {
    return Regions;
  }

  getRegionsWithElevation(): FeatureCollection<MultiPolygon, RegionWithElevationProperties> {
    return RegionsElevation;
  }

  getRegionsEuregio(): FeatureCollection<MultiPolygon, RegionProperties> {
    return RegionsEuregio;
  }

  getRegionsEuregioWithElevation(): FeatureCollection<MultiPolygon, RegionWithElevationProperties> {
    return RegionsEuregioElevation;
  }

  getRegionsAran(): FeatureCollection<MultiPolygon, RegionProperties> {
    return RegionsAran;
  }

  getRegionsAranWithElevation(): FeatureCollection<MultiPolygon, RegionWithElevationProperties> {
    return RegionsAranElevation;
  }

  getRegionsAineva(): FeatureCollection<MultiPolygon, RegionProperties> {
    return RegionsAineva;
  }

  getRegionsAinevaWithElevation(): FeatureCollection<MultiPolygon, RegionWithElevationProperties> {
    return RegionsAinevaElevation;
  }

  getRegionNames(): any {
    switch (this.translateService.currentLang) {
      case 'de':
        return regionsNamesDe;
      case 'it':
        return regionsNamesIt;
      case 'en':
        return regionsNamesEn;
      case 'fr':
        return regionsNamesFr;
      case 'es':
        return regionsNamesEs;
      case 'ca':
        return regionsNamesCa;
      case 'oc':
        return regionsNamesOc;
      default:
        return regionsNamesEn;
    }
  }

  private translateAllNames() {
    this.translateNames(this.getRegionsEuregio());
    this.translateNames(this.getRegionsEuregioWithElevation());
    this.translateNames(this.getRegionsAran());
    this.translateNames(this.getRegionsAranWithElevation());
    this.translateNames(this.getRegionsAineva());
    this.translateNames(this.getRegionsAinevaWithElevation());
  }

  private translateNames(data: FeatureCollection<any, RegionProperties>) {
    data.features.forEach((feature) => feature.properties.name = this.getRegionNames()[feature.properties.id]);
  }

  getRegionName(id) {
    return this.getRegionNames()[id];
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

function mergeFeatureCollections<G extends Geometry, P>(
  ...collections: FeatureCollection<G, P>[]
): FeatureCollection<G, P> {
  const today = "2022-12-01";
  return {
    type: "FeatureCollection",
    features: []
      .concat(...collections.map((collection) => collection.features))
      .filter((feature) => filterFeature(feature, today)),
  };
}

function filterFeature(
  feature: GeoJSON.Feature,
  today = new Date().toISOString().slice(0, "2006-01-02".length)
): boolean {
  const properties = feature.properties;
  return (
    (!properties.start_date || properties.start_date <= today) &&
    (!properties.end_date || properties.end_date > today)
  );
}
