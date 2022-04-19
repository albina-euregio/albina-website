import { Injectable } from "@angular/core";
// @ts-ignore
/// <reference types="leaflet-sidebar-v2" />
import { Map, Canvas, LayerGroup, TileLayer, SidebarOptions, Icon, DivIcon, MarkerOptions, CircleMarkerOptions, Browser, Control, LatLng } from "leaflet";
import { GenericObservation, ObservationSource, ObservationType, ObservationTypeIcons, Stability, toMarkerColor } from "app/observations/models/generic-observation.model";

// icons
import { appCircleStopIcon } from "../../svg/circle_stop";

import {CanvasIconLayer} from './leaflet.canvas-markers';
import * as geojson from "geojson";
import { AuthenticationService } from "../authentication-service/authentication.service";

declare module "leaflet" {
  interface GeoJSON<P = any> {
    feature?: geojson.Feature<geojson.MultiPoint, P>;
    getLayers(): GeoJSON<P>[];
  }
}

@Injectable()
export class ObservationsMapService {
  public USE_CANVAS_LAYER = true;
  public observationsMap: Map;
  public observationsMaps: Record<string, TileLayer>;
  public observationSourceLayers: Record<ObservationSource, LayerGroup>;
  public observationTypeLayers: Record<ObservationType, LayerGroup>;

  public sidebarOptions: SidebarOptions = {
    position: "right",
    autopan: false,
    closeButton: false,
    container: "sidebar",
  }

  // This is very important! Use a canvas otherwise the chart is too heavy for the browser when
  // the number of points is too high
  public myRenderer = !this.USE_CANVAS_LAYER ? undefined : new Canvas({
    padding: 0.5
  });

  constructor(
    private authenticationService: AuthenticationService) {
    this.observationSourceLayers = {} as any;
    this.observationTypeLayers = {} as any;
    Object.keys(ObservationSource).forEach(source => this.observationSourceLayers[source] = this.USE_CANVAS_LAYER ? new CanvasIconLayer() : new LayerGroup());
    Object.keys(ObservationType).forEach(type => this.observationTypeLayers[type] = this.USE_CANVAS_LAYER ? new CanvasIconLayer() : new LayerGroup());
  }

  initMaps(el: HTMLElement, onObservationClick: (o: GenericObservation) => void) {
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

    const map = new Map(el, {
      zoomAnimation: false,
      zoomControl: false,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      touchZoom: true,
      center: new LatLng(this.authenticationService.getUserLat(), this.authenticationService.getUserLng()),
      zoom: 8,
      minZoom: 4,
      maxZoom: 17,
      layers: [
        ...Object.values(this.observationsMaps),
        ...Object.values(this.observationTypeLayers)
      ]
    });

    this.initLayer(map, this.observationSourceLayers, document.getElementById("sourcesDiv"), onObservationClick);
    this.initLayer(map, this.observationTypeLayers, document.getElementById("typesDiv"), onObservationClick);
    this.observationsMap = map;
  }

  private initLayer(map: Map, layersObj: Record<string, LayerGroup<any>>, sidebar: HTMLElement, onObservationClick: (o: GenericObservation) => void) {
    if (this.USE_CANVAS_LAYER) {
      Object.values(layersObj).forEach((l: any) =>
        l.addOnClickListener((e, data) =>
          onObservationClick(data[0].data.observation)
        )
      );
    }

    const layers = new Control.Layers(null, layersObj, { collapsed: false });
    layers.addTo(map);

    const htmlObject = layers.getContainer();
    sidebar.appendChild(htmlObject);
  }

  style(observation: GenericObservation): MarkerOptions | CircleMarkerOptions {
    return {
        icon: this.getIcon(observation),
        radius: observation.$markerRadius,
        weight: 0,
        opacity: 1,
        renderer: this.myRenderer
    };
  }

  highlightStyle(observation: GenericObservation): MarkerOptions | CircleMarkerOptions {
    return {
        icon: this.getIcon(observation),
        radius: observation.$markerRadius,
        weight: 1,
        opacity: 1,
        renderer: this.myRenderer
    };
  }

  private getIcon(observation: GenericObservation<any>): Icon | DivIcon {

    const iconSize = observation.$markerRadius ?? 5;
    
    if (!this.USE_CANVAS_LAYER) {
      const html = this.getSvg(observation);
      return new DivIcon({
        html,
        className: `leaflet-div-icon-${iconSize}`,
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2]
      });
    }

    // 700533 - drawImage() fails silently when drawing an SVG image without @width or @height
    // https://bugzilla.mozilla.org/show_bug.cgi?id=700533
    const iconUrl = Browser.gecko
      ? "data:image/svg+xml;base64," + btoa(this.getSvg(observation).replace(/<svg/, '<svg width="20" height="20"'))
      : "data:image/svg+xml;base64," + btoa(this.getSvg(observation));

    const icon = new Icon({
      iconUrl: iconUrl,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2]
    });

    return icon;
  }

  private getSvg(observation: GenericObservation<any>) {
    const iconColor = toMarkerColor(observation);
    const svg = ObservationTypeIcons[observation.$type] ?? appCircleStopIcon.data;
    return svg.replace(/currentcolor/g, iconColor);
  }
}
