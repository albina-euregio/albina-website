import { Injectable } from "@angular/core";
import { CircleMarkerOptions, LayerGroup, Map, TileLayer } from "leaflet";
import { ConstantsService } from "../constants-service/constants.service";

import * as geojson from "geojson";

declare module "leaflet" {
  interface GeoJSON<P = any> {
    feature?: geojson.Feature<geojson.MultiPoint, P>;
    getLayers(): GeoJSON<P>[];
  }
}

@Injectable()
export class ZamgModelsMapService {
  public zamgModelsMap: Map;
  public zamgModelsMaps: Record<string, TileLayer>;
  public layers = {
    zamgModelPoints: new LayerGroup()
  };

  constructor(
    private constantsService: ConstantsService) {
    this.initMaps();
  }

  initMaps() {
    this.zamgModelsMaps = {
      AlbinaBaseMap: new TileLayer("https://avalanche.report/avalanche_report_tms/{z}/{x}/{y}.png", {
        tms: false,
        attribution: ""
      })
    };
  }

  createZamgModelPointOptions(): CircleMarkerOptions {
    return {
      radius: 8,
      fillColor: this.constantsService.colorBrand,
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }
}
