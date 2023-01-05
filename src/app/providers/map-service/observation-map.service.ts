import { Injectable } from '@angular/core';
// @ts-ignore
/// <reference types="leaflet-sidebar-v2" />
import { Map, Canvas, LayerGroup, TileLayer, SidebarOptions, Icon, DivIcon, MarkerOptions, CircleMarkerOptions, Browser, Control, LatLng } from "leaflet";
import {
  GenericObservation,
  ObservationFilterType,
  ObservationSource,
  ObservationType,
  ObservationTypeIcons,
  Stability,
  toMarkerColor
} from "../../observations/models/generic-observation.model";

// icons
import { appCircleStopIcon } from "../../svg/circle_stop";

@Injectable()
export class ObservationMapService {
  public USE_CANVAS_LAYER = true;

  constructor() { }

  // This is very important! Use a canvas otherwise the chart is too heavy for the browser when
  // the number of points is too high
  public myRenderer = !this.USE_CANVAS_LAYER ? undefined : new Canvas({
    padding: 0.5
  });

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
    //const iconColor = toMarkerColor(observation);
    let iconColor = "#000";

    if (observation.isHighlighted) {
      iconColor = "#ff0000"
    }

    const svg = ObservationTypeIcons[observation.$type] ?? appCircleStopIcon.data;
    return svg.replace(/currentcolor/g, iconColor);
  }
}
