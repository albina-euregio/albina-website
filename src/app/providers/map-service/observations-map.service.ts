import { Injectable } from "@angular/core";
import { Map } from "leaflet";
import { ObservationSource, ObservationSourceColors } from "app/observations/models/generic-observation.model";
import { ConstantsService } from "../constants-service/constants.service";

import * as L from "leaflet";
import * as geojson from "geojson";

declare module "leaflet" {
  interface GeoJSON<P = any> {
    feature?: geojson.Feature<geojson.MultiPoint, P>;
    getLayers(): GeoJSON<P>[];
  }
}

export class ObservationMarker extends L.CircleMarker {
  public type: String;

  constructor(latLng, type, options?: L.MarkerOptions) {
    super(latLng, options);
    this.type = type;
  }

  // TODO: match marker types to observation types
  _updatePath() {
    switch (this.type) {
      case "LawisSnowProfiles":
      case "LoLaSafetySnowProfiles":
      case "AvaObsSnowProfiles":
        // @ts-ignore
        this._renderer._profileMarker(this);
        break;
      case "LwdKipBeobachtung":
      case "LoLaSafetyAvalancheReports":
      case "AvaObsObservations":
      case "AvaObsSimpleObservations":
      case "Albina":
        // @ts-ignore
        this._renderer._observationMarker(this);
        break;
      case "Natlefs":
        // @ts-ignore
        this._renderer._natlefsMarker(this);
        break;
      case "LawisIncidents":
      case "LwdKipLawinenabgang":
          // @ts-ignore
        this._renderer._incidentMarker(this);
        break;
      case "LwdKipSprengerfolg":
        // @ts-ignore
        this._renderer._blastingMarker(this);
        break;
      default:
        // @ts-ignore
        this._renderer._defaultMarker(this);
        break;
    }
  }
}

// TODO: define the shape of different observation markers as SVG
L.Canvas.include({
  _profileMarker: function (layer) {
    if (!this._drawing || layer._empty()) { return; }
    const p = layer._point,
        ctx = this._ctx,
        r = Math.max(Math.round(layer._radius), 1);
    this._layers[layer._leaflet_id] = layer
    ctx.beginPath();
    ctx.moveTo(p.x + r       , p.y );
    ctx.lineTo(p.x + 0.43 * r, p.y + 0.25 * r);
    ctx.lineTo(p.x + 0.50 * r, p.y + 0.87 * r);
    ctx.lineTo(p.x           , p.y + 0.50 * r);
    ctx.lineTo(p.x - 0.50 * r, p.y + 0.87 * r);
    ctx.lineTo(p.x - 0.43 * r, p.y + 0.25 * r);
    ctx.lineTo(p.x -        r, p.y );
    ctx.lineTo(p.x - 0.43 * r, p.y - 0.25 * r);
    ctx.lineTo(p.x - 0.50 * r, p.y - 0.87 * r);
    ctx.lineTo(p.x           , p.y - 0.50 * r);
    ctx.lineTo(p.x + 0.50 * r, p.y - 0.87 * r);
    ctx.lineTo(p.x + 0.43 * r, p.y - 0.25 * r);
    ctx.closePath();
    this._fillStroke(ctx, layer);
  },
  _observationMarker: function (layer) {
    if (!this._drawing || layer._empty()) { return; }
    const p = layer._point,
        ctx = this._ctx,
        r = Math.max(Math.round(layer._radius), 1);
    this._layers[layer._leaflet_id] = layer
    ctx.beginPath();
    ctx.moveTo(p.x + r     , p.y );
    ctx.lineTo(p.x + 0.43 * r, p.y + 0.25 * r);
    ctx.lineTo(p.x + 0.50 * r, p.y + 0.87 * r);
    ctx.lineTo(p.x           , p.y + 0.50 * r);
    ctx.lineTo(p.x - 0.50 * r, p.y + 0.87 * r);
    ctx.lineTo(p.x - 0.43 * r, p.y + 0.25 * r);
    ctx.lineTo(p.x -        r, p.y );
    ctx.lineTo(p.x - 0.43 * r, p.y - 0.25 * r);
    ctx.lineTo(p.x - 0.50 * r, p.y - 0.87 * r);
    ctx.lineTo(p.x           , p.y - 0.50 * r);
    ctx.lineTo(p.x + 0.50 * r, p.y - 0.87 * r);
    ctx.lineTo(p.x + 0.43 * r, p.y - 0.25 * r);
    ctx.closePath();
    this._fillStroke(ctx, layer);
  },
  _incidentMarker: function (layer) {
    if (!this._drawing || layer._empty()) { return; }
    const p = layer._point,
        ctx = this._ctx,
        r = Math.max(Math.round(layer._radius), 1);
    this._layers[layer._leaflet_id] = layer
    ctx.beginPath();
    ctx.moveTo(p.x + r , p.y + r);
    ctx.lineTo(p.x + r , p.y - r);
    ctx.lineTo(p.x - r , p.y - r);
    ctx.lineTo(p.x - r , p.y + r);
    ctx.closePath();
    this._fillStroke(ctx, layer);
  },
  _natlefsMarker: function (layer) {
    if (!this._drawing || layer._empty()) { return; }
    const p = layer._point,
        ctx = this._ctx,
        r = Math.max(Math.round(layer._radius), 1);
    this._layers[layer._leaflet_id] = layer
    ctx.beginPath();
    ctx.moveTo(p.x + r , p.y + r);
    ctx.lineTo(p.x + r , p.y - r);
    ctx.lineTo(p.x - r , p.y - r);
    ctx.lineTo(p.x - r , p.y + r);
    ctx.closePath();
    this._fillStroke(ctx, layer);
  },
  _blastingMarker: function (layer) {
    if (!this._drawing || layer._empty()) { return; }
    const p = layer._point,
        ctx = this._ctx,
        r = Math.max(Math.round(layer._radius), 1);
    this._layers[layer._leaflet_id] = layer
    ctx.beginPath();
    ctx.moveTo(p.x + r , p.y + r);
    ctx.lineTo(p.x + r , p.y - r);
    ctx.lineTo(p.x - r , p.y - r);
    ctx.lineTo(p.x - r , p.y + r);
    ctx.closePath();
    this._fillStroke(ctx, layer);
  },
  _defaultMarker: function (layer) {
    if (!this._drawing || layer._empty()) { return; }
    const p = layer._point,
        ctx = this._ctx,
        r = Math.max(Math.round(layer._radius), 1);
    this._layers[layer._leaflet_id] = layer
    ctx.beginPath();
    ctx.moveTo(p.x + r , p.y + r);
    ctx.lineTo(p.x     , p.y - r);
    ctx.lineTo(p.x - r , p.y - r);
    ctx.lineTo(p.x - r , p.y + r);
    ctx.closePath();
    this._fillStroke(ctx, layer);
  }
});

@Injectable()
export class ObservationsMapService {
  public observationsMap: Map;
  public observationsMaps: Record<string, L.TileLayer>;
  public observationLayers: Record<ObservationSource, L.LayerGroup>;

  // This is very important! Use a canvas otherwise the chart is too heavy for the browser when
  // the number of points is too high
  public myRenderer = new L.Canvas({
    padding: 0.5
  });

  constructor(
    private constantsService: ConstantsService) {
    this.initMaps();
    this.observationLayers = {} as any;
    Object.keys(ObservationSource).forEach(source => this.observationLayers[source] = L.layerGroup([]));
  }

  initMaps() {
    this.observationsMaps = {
      OpenTopoMap: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        className: "leaflet-layer-grayscale",
        minZoom: 12.5,
        maxZoom: 17,
        attribution: "Map data: &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>, <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a> (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)"
      }),
      AlbinaBaseMap: L.tileLayer("https://avalanche.report/avalanche_report_tms/{z}/{x}/{y}.png", {
        maxZoom: 12,
        tms: false,
        attribution: ""
      })
    };
  }

  style(observation) {
    return {
        radius: observation.$markerRadius,
        fillColor: observation.$markerColor,
        color: observation.$markerColor,
        weight: 0,
        opacity: 1,
        fillOpacity: 0.9,
        renderer: this.myRenderer
    };
  }

  highlightStyle(observation) {
    return {
        radius: observation.$markerRadius,
        fillColor: this.constantsService.colorBrand,
        color: this.constantsService.colorBrand,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    };
  }
}
