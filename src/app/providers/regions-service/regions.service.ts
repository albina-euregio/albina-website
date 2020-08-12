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
    var data = RegionsEuregio as any;
    for (var item in data.features) {
      let name = this.translateService.instant("region." + data.features[item].properties.id);
      data.features[item].properties.name = this.translateService.instant("region." + data.features[item].properties.id);
    }
    return data;
  }

  getRegionsEuregioWithElevation(): FeatureCollection {
    var data = RegionsEuregioElevation as any;
    for (var item in data.features) {
      let name = this.translateService.instant("region." + data.features[item].properties.id);
      data.features[item].properties.name = this.translateService.instant("region." + data.features[item].properties.id);
    }
    return data;
  }

  getRegionsAran(): FeatureCollection {
    var data = RegionsAran as any;
    for (var item in data.features) {
      let name = this.translateService.instant("region." + data.features[item].properties.id);
      data.features[item].properties.name = this.translateService.instant("region." + data.features[item].properties.id);
    }
    return data;
  }

  getRegionsAranWithElevation(): FeatureCollection {
    var data = RegionsAranElevation as any;
    for (var item in data.features) {
      let name = this.translateService.instant("region." + data.features[item].properties.id);
      data.features[item].properties.name = this.translateService.instant("region." + data.features[item].properties.id);
    }
    return data;
  }
}
