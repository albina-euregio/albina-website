import { Injectable } from "@angular/core";

import RegionsEuregio from "../../regions/regions.euregio.geojson.json";
import RegionsEuregioElevation from "../../regions/regions-elevation.euregio.geojson.json";
import { FeatureCollection } from "geojson";

@Injectable()
export class RegionsService {

  constructor() {
  }

  getRegionsEuregio(): FeatureCollection {
    return RegionsEuregio as any;
  }

  getRegionsEuregioWithElevation(): FeatureCollection {
    return RegionsEuregioElevation as any;
  }
}
