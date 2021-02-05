import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import RegionsEuregio from "../../regions/regions.euregio.geojson.json";
import RegionsEuregioElevation from "../../regions/regions-elevation.euregio.geojson.json";
import RegionsAran from "../../regions/regions.aran.geojson.json";
import RegionsAranElevation from "../../regions/regions-elevation.aran.geojson.json";
import { FeatureCollection, Polygon, MultiPolygon } from "geojson";

@Injectable()
export class RegionsService {
  constructor(private translateService: TranslateService) {}

  getRegionsEuregio(): FeatureCollection<Polygon, RegionProperties> {
    const data = RegionsEuregio as FeatureCollection<Polygon, RegionProperties>;
    this.translateNames(data);
    return data;
  }

  getRegionsEuregioWithElevation(): FeatureCollection<Polygon, RegionWithElevationProperties> {
    const data = RegionsEuregioElevation as FeatureCollection<Polygon, RegionWithElevationProperties>;
    this.translateNames(data);
    return data;
  }

  getRegionsAran(): FeatureCollection<Polygon, RegionProperties> {
    const data = RegionsAran as FeatureCollection<Polygon, RegionProperties>;
    this.translateNames(data);
    return data;
  }

  getRegionsAranWithElevation(): FeatureCollection<MultiPolygon, RegionWithElevationProperties> {
    const data = RegionsAranElevation as FeatureCollection<MultiPolygon, RegionWithElevationProperties>;
    this.translateNames(data);
    return data;
  }

  private translateNames(data: FeatureCollection<any, RegionProperties>) {
    data.features.forEach(feature => feature.properties.name = this.translateService.instant("region." + feature.properties.id));
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
  threshold: number;
  elevation: "h" | "l";
}
