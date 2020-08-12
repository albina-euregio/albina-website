import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import RegionsEuregio from "../../regions/regions.euregio.geojson.json";
import RegionsEuregioElevation from "../../regions/regions-elevation.euregio.geojson.json";
import RegionsAran from "../../regions/regions.aran.geojson.json";
import RegionsAranElevation from "../../regions/regions-elevation.aran.geojson.json";
import { FeatureCollection } from "geojson";

@Injectable()
export class RegionsService {

  constructor(
    private translateService: TranslateService,
    ) {
  }

  getRegionsEuregio(): FeatureCollection {
    const data = RegionsEuregio as any;
    for (const item in Object.keys(data.features)) {
      if (data.features.hasOwnProperty(item)) {
        data.features[item].properties.name = this.translateService.instant("region." + data.features[item].properties.id);
      }
    }
    return data;
  }

  getRegionsEuregioWithElevation(): FeatureCollection {
    const data = RegionsEuregioElevation as any;
    for (const item in data.features) {
      if (data.features.hasOwnProperty(item)) {
        data.features[item].properties.name = this.translateService.instant("region." + data.features[item].properties.id);
      }
    }
    return data;
  }

  getRegionsAran(): FeatureCollection {
    const data = RegionsAran as any;
    for (const item in Object.keys(data.features)) {
      if (data.features.hasOwnProperty(item)) {
        data.features[item].properties.name = this.translateService.instant("region." + data.features[item].properties.id);
      }
    }
    return data;
  }

  getRegionsAranWithElevation(): FeatureCollection {
    const data = RegionsAranElevation as any;
    for (const item in Object.keys(data.features)) {
      if (data.features.hasOwnProperty(item)) {
        data.features[item].properties.name = this.translateService.instant("region." + data.features[item].properties.id);
      }
    }
    return data;
  }
}
