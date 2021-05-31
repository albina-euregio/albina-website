import { Injectable } from "@angular/core";
import { Map } from "leaflet";

import * as L from "leaflet";
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
  public zamgModelsMaps: Record<string, L.TileLayer>;
  public layers = {
    zamgModelPoints: L.layerGroup()
  };

  constructor() {
    this.initMaps();
  }

  initMaps() {
    this.zamgModelsMaps = {
      AlbinaBaseMap: L.tileLayer("https://avalanche.report/avalanche_report_tms.dev/{z}/{x}/{y}.png", {
        tms: false,
        attribution: ""
      })
    };
  }

  createZamgModelPointOptions(): L.CircleMarkerOptions {
    return {
      radius: 8,
      fillColor: "#19abff",
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }
}
