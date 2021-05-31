import { Injectable } from "@angular/core";
import { Map } from "leaflet";
import { ObservationSource, ObservationSourceColors } from "app/observations/models/generic-observation.model";

import * as L from "leaflet";
import * as geojson from "geojson";

declare module "leaflet" {
  interface GeoJSON<P = any> {
    feature?: geojson.Feature<geojson.MultiPoint, P>;
    getLayers(): GeoJSON<P>[];
  }
}

@Injectable()
export class ObservationsMapService {
  public observationsMap: Map;
  public observationsMaps: Record<string, L.TileLayer>;
  public observationLayers: Record<ObservationSource, L.LayerGroup>;

  constructor() {
    this.initMaps();
    this.observationLayers = {} as any;
    Object.keys(ObservationSource).forEach(source => this.observationLayers[source] = L.layerGroup([], {
      attribution: `<span style="color: ${ObservationSourceColors[source]}">⬤</span> ${source}`
    }))
  }

  initMaps() {
    this.observationsMaps = {
      OpenTopoMap: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        className: "leaflet-layer-grayscale",
        minZoom: 12.5,
        maxZoom: 17,
        attribution: "Map data: &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>, <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a> (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)"
      }),
      AlbinaBaseMap: L.tileLayer("https://avalanche.report/avalanche_report_tms.dev/{z}/{x}/{y}.png", {
        maxZoom: 12,
        tms: false,
        attribution: ""
      })
    };
  }

  createObservationMarkerOptions(color: string): L.CircleMarkerOptions {
    return {
      radius: 6,
      fillColor: color,
      color,
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6
    };
  }
}
