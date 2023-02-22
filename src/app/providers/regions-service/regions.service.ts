import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FeatureCollection, MultiPolygon, Geometry } from "geojson";
import { ConstantsService } from "../constants-service/constants.service";
import aggregatedRegions from "../../../assets/aggregated_regions.json"
// @ts-ignore
import RegionsEuregio_AT_07 from "eaws-regions/public/micro-regions/AT-07_micro-regions.geojson.json";
// @ts-ignore
import RegionsEuregio_IT_32_BZ from "eaws-regions/public/micro-regions/IT-32-BZ_micro-regions.geojson.json";
// @ts-ignore
import RegionsEuregio_IT_32_TN from "eaws-regions/public/micro-regions/IT-32-TN_micro-regions.geojson.json";
//
const RegionsEuregio: FeatureCollection<MultiPolygon, RegionProperties> = mergeFeatureCollections(
  RegionsEuregio_AT_07 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsEuregio_IT_32_BZ as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsEuregio_IT_32_TN as FeatureCollection<MultiPolygon, RegionProperties>,
);

// @ts-ignore
import RegionsEuregioElevation_AT_07 from "eaws-regions/public/micro-regions_elevation/AT-07_micro-regions_elevation.geojson.json";
// @ts-ignore
import RegionsEuregioElevation_IT_32_BZ from "eaws-regions/public/micro-regions_elevation/IT-32-BZ_micro-regions_elevation.geojson.json";
// @ts-ignore
import RegionsEuregioElevation_IT_32_TN from "eaws-regions/public/micro-regions_elevation/IT-32-TN_micro-regions_elevation.geojson.json";
//
const RegionsEuregioElevation: FeatureCollection<MultiPolygon, RegionWithElevationProperties> = mergeFeatureCollections(
  RegionsEuregioElevation_AT_07 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsEuregioElevation_IT_32_BZ as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsEuregioElevation_IT_32_TN as FeatureCollection<MultiPolygon, RegionWithElevationProperties>
);

// @ts-ignore
import RegionsAineva_IT_21 from "eaws-regions/public/micro-regions/IT-21_micro-regions.geojson.json";
// @ts-ignore
import RegionsAineva_IT_23 from "eaws-regions/public/micro-regions/IT-23_micro-regions.geojson.json";
// @ts-ignore
import RegionsAineva_IT_25 from "eaws-regions/public/micro-regions/IT-25_micro-regions.geojson.json";
// @ts-ignore
import RegionsAineva_IT_34 from "eaws-regions/public/micro-regions/IT-34_micro-regions.geojson.json";
// @ts-ignore
import RegionsAineva_IT_36 from "eaws-regions/public/micro-regions/IT-36_micro-regions.geojson.json";
// @ts-ignore
import RegionsAineva_IT_57 from "eaws-regions/public/micro-regions/IT-57_micro-regions.geojson.json";
//
const RegionsAineva: FeatureCollection<MultiPolygon, RegionProperties> = mergeFeatureCollections(
  RegionsAineva_IT_21 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_23 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_25 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_34 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_36 as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsAineva_IT_57 as FeatureCollection<MultiPolygon, RegionProperties>
);

// @ts-ignore
import RegionsAinevaElevation_IT_21 from "eaws-regions/public/micro-regions_elevation/IT-21_micro-regions_elevation.geojson.json";
// @ts-ignore
import RegionsAinevaElevation_IT_23 from "eaws-regions/public/micro-regions_elevation/IT-23_micro-regions_elevation.geojson.json";
// @ts-ignore
import RegionsAinevaElevation_IT_25 from "eaws-regions/public/micro-regions_elevation/IT-25_micro-regions_elevation.geojson.json";
// @ts-ignore
import RegionsAinevaElevation_IT_34 from "eaws-regions/public/micro-regions_elevation/IT-34_micro-regions_elevation.geojson.json";
// @ts-ignore
import RegionsAinevaElevation_IT_36 from "eaws-regions/public/micro-regions_elevation/IT-36_micro-regions_elevation.geojson.json";
// @ts-ignore
import RegionsAinevaElevation_IT_57 from "eaws-regions/public/micro-regions_elevation/IT-57_micro-regions_elevation.geojson.json";
//
const RegionsAinevaElevation: FeatureCollection<MultiPolygon, RegionWithElevationProperties> = mergeFeatureCollections(
  RegionsAinevaElevation_IT_21 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_23 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_25 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_34 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_36 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsAinevaElevation_IT_57 as FeatureCollection<MultiPolygon, RegionWithElevationProperties>
);

// @ts-ignore
import RegionsAran_ES_CT_L from "eaws-regions/public/micro-regions/ES-CT-L_micro-regions.geojson.json";
//
const RegionsAran: FeatureCollection<MultiPolygon, RegionProperties> = mergeFeatureCollections(
  RegionsAran_ES_CT_L as FeatureCollection<MultiPolygon, RegionProperties>
);

// @ts-ignore
import RegionsAranElevation_ES_CT_L from "eaws-regions/public/micro-regions_elevation/ES-CT-L_micro-regions_elevation.geojson.json";
//
const RegionsAranElevation: FeatureCollection<MultiPolygon, RegionWithElevationProperties> = mergeFeatureCollections(
  RegionsAranElevation_ES_CT_L as FeatureCollection<MultiPolygon, RegionWithElevationProperties>
);

// @ts-ignore
import RegionsSwitzerland_CH from "eaws-regions/public/micro-regions/CH_micro-regions.geojson.json";

const RegionsSwitzerland: FeatureCollection<MultiPolygon, RegionProperties> = mergeFeatureCollections(
  RegionsSwitzerland_CH as FeatureCollection<MultiPolygon, RegionProperties>
);

// @ts-ignore
import RegionsSwitzerlandElevation_CH from "eaws-regions/public/micro-regions_elevation/CH_micro-regions_elevation.geojson.json";
//
const RegionsSwitzerlandElevation: FeatureCollection<MultiPolygon, RegionWithElevationProperties> = mergeFeatureCollections(
  RegionsSwitzerlandElevation_CH as FeatureCollection<MultiPolygon, RegionWithElevationProperties>
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
  RegionsAran_ES_CT_L as FeatureCollection<MultiPolygon, RegionProperties>,
  RegionsSwitzerland_CH as FeatureCollection<MultiPolygon, RegionProperties>
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
  RegionsAranElevation_ES_CT_L as FeatureCollection<MultiPolygon, RegionWithElevationProperties>,
  RegionsSwitzerlandElevation_CH as FeatureCollection<MultiPolygon, RegionWithElevationProperties>
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
    "ES-CT-L": RegionsAran.features.map(f => f.properties.id).filter(id => id.startsWith("ES-CT-L")),
    "CH": RegionsSwitzerland.features.map(f => f.properties.id).filter(id => id.startsWith("CH")),
  };

  // Level 1 regions: parts of provinces
  level1: string[][] = aggregatedRegions.level1
  // Level 2 regions: provinces
  level2: string[][] = aggregatedRegions.level2

  constructor(private translateService: TranslateService, private constantsService: ConstantsService,) {
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

  getActiveRegion(activeRegionCode: String): FeatureCollection<MultiPolygon, RegionProperties> {
    switch(activeRegionCode){
      case this.constantsService.codeAran: {
        return RegionsAran;
      }
      case this.constantsService.codeSwitzerland: {
        return RegionsSwitzerland;
      }
      default: {
        return RegionsEuregio;
      }
    }
  }

  getActiveRegionWithElevation(activeRegionCode: String): FeatureCollection<MultiPolygon, RegionWithElevationProperties> {
    switch(activeRegionCode){
      case this.constantsService.codeAran: {
        return RegionsAranElevation;
      }
      case this.constantsService.codeSwitzerland: {
        return RegionsSwitzerlandElevation;
      }
      default: {
        return RegionsEuregioElevation;
      }
    }
  }

  getRegionsEuregio(): FeatureCollection<MultiPolygon, RegionProperties> {
    return RegionsEuregio;
  }

  getRegionsEuregioWithElevation(): FeatureCollection<MultiPolygon, RegionWithElevationProperties> {
    return RegionsEuregioElevation;
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
    this.translateNames(Regions);
    this.translateNames(RegionsElevation);
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
  elevation: "high" | "low" | "low_high";
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
