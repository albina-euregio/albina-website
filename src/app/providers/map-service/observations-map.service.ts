import { Injectable } from "@angular/core";
/// <reference types="leaflet-sidebar-v2" />
import { Map, Canvas, LayerGroup, TileLayer, SidebarOptions, Icon } from "leaflet";
import { GenericObservation, ObservationSource } from "app/observations/models/generic-observation.model";
import { ConstantsService } from "../constants-service/constants.service";

import * as geojson from "geojson";
import '../../../assets/js/leaflet.canvas-markers.js';
import * as L from "leaflet";

declare module "leaflet" {
  interface GeoJSON<P = any> {
    feature?: geojson.Feature<geojson.MultiPoint, P>;
    getLayers(): GeoJSON<P>[];
  }
}

@Injectable()
export class ObservationsMapService {
  public observationsMap: Map;
  public observationsMaps: Record<string, TileLayer>;
  public observationLayers: Record<ObservationSource, LayerGroup>;

  public sidebarOptions: SidebarOptions = {
    position: 'right',
    autopan: false,
    closeButton: false,
    container: 'sidebar',
  }

  // This is very important! Use a canvas otherwise the chart is too heavy for the browser when
  // the number of points is too high
  public myRenderer = new Canvas({
    padding: 0.5
  });

  constructor(
    private constantsService: ConstantsService) {
    this.initMaps();
    this.observationLayers = {} as any;
    // @ts-ignore
    Object.keys(ObservationSource).forEach(source => this.observationLayers[source] = L.canvasIconLayer({}));
  }

  initMaps() {
    this.observationsMaps = {
      OpenTopoMap: new TileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        className: "leaflet-layer-grayscale",
        minZoom: 12.5,
        maxZoom: 17,
        attribution: "Map data: &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>, <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a> (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)"
      }),
      AlbinaBaseMap: new TileLayer("https://avalanche.report/avalanche_report_tms/{z}/{x}/{y}.png", {
        minZoom: 5,
        maxZoom: 12,
        tms: false,
        attribution: ""
      })
    };
  }

  style(observation) {
    return {
        icon: this.getIcon(observation),
        radius: observation.$markerRadius,
        weight: 0,
        opacity: 1,
        renderer: this.myRenderer
    };
  }

  highlightStyle(observation) {
    return {
        icon: this.getIcon(observation),
        radius: observation.$markerRadius,
        weight: 1,
        opacity: 1,
        renderer: this.myRenderer
    };
  }

  private getIcon(observation: GenericObservation<any>): import("leaflet").Icon<import("leaflet").IconOptions> | import("leaflet").DivIcon {

    // const iconSize = observation.getRadius();
    const iconSize = 20;

    const iconUrl = 'data:image/svg+xml;base64,' + btoa(this.getSvg(observation));

    const icon = new Icon({
      iconUrl: iconUrl,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize/2, iconSize/2]
    });

    return icon;
  }

  private getSvg(observation: GenericObservation<any>) {
    
    // const iconColor = observation.getColor();
    const iconColor = this.constantsService.colorBrand;

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M11 5H9v4H5v2h4v4h2v-4h4V9h-4V5zm-1-5C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="' + iconColor + '" fill-rule="evenodd"/></svg>';
  }
}
