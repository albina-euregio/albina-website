import { Injectable } from "@angular/core";
/// <reference types="leaflet-sidebar-v2" />
import { Map, Canvas, LayerGroup, TileLayer, SidebarOptions, Icon } from "leaflet";
import { GenericObservation, ObservationSource } from "app/observations/models/generic-observation.model";
import { ConstantsService } from "../constants-service/constants.service";

// icons
import { appCircleAddIcon } from "../../svg/circle_add";
import { appCircleAlertIcon } from "../../svg/circle_alert";
import { appCircleCheckIcon } from "../../svg/circle_check";
import { appCircleDotsHorizontalIcon } from "../../svg/circle_dots_horizontal";
import { appCircleFullIcon } from "../../svg/circle_full";
import { appCircleMinusIcon } from "../../svg/circle_minus";
import { appCircleOkayTickIcon } from "../../svg/circle_okay_tick";
import { appCirclePlayEmptyIcon } from "../../svg/circle_play_empty";
import { appCirclePlayIcon } from "../../svg/circle_play";
import { appCircleStopIcon } from "../../svg/circle_stop";

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
    let svg: string;

    // const iconColor = observation.getColor();
    const iconColor = this.constantsService.colorBrand;

    switch (observation.$source) {
      case "Albina": {
        svg = appCircleAddIcon.data;
        break;
      }
      case "LwdKipBeobachtung": {
        svg = appCircleAlertIcon.data;
        break;
      }
      case "LwdKipLawinenabgang": {
        svg = appCircleCheckIcon.data;
        break;
      }
      case "LwdKipSprengerfolg": {
        svg = appCircleDotsHorizontalIcon.data;
        break;
      }
      case "LawisSnowProfiles": {
        svg = appCircleFullIcon.data;
        break;
      }
      case "LawisIncidents": {
        svg = appCircleMinusIcon.data;
        break;
      }
      case "LoLaSafetySnowProfiles": {
        svg = appCircleOkayTickIcon.data;
        break;
      }
      case "LoLaSafetyAvalancheReports": {
        svg = appCirclePlayEmptyIcon.data;
        break;
      }
      case "Natlefs": {
        svg = appCirclePlayIcon.data;
        break;
      }
      case "AvaObsSnowProfiles": {
        svg = appCircleStopIcon.data;
        break;
      }
      case "AvaObsObservations": {
        svg = appCircleStopIcon.data;
        break;
      }
      case "AvaObsSimpleObservations": {
        svg = appCircleStopIcon.data;
        break;
      }
      default: {
        svg = appCircleStopIcon.data;
        break;
      }
    }

    return svg;
  }
}
