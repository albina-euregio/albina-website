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
import { appCircleIcon } from "../../svg/circle";

@Injectable()
export class ObservationMapService {
  public USE_CANVAS_LAYER = true;

  readonly markerRadius = 40;

  constructor() { }

  // This is very important! Use a canvas otherwise the chart is too heavy for the browser when
  // the number of points is too high
  public myRenderer = !this.USE_CANVAS_LAYER ? undefined : new Canvas({
    padding: 0.5
  });

  style(observation: GenericObservation): MarkerOptions | CircleMarkerOptions {
    return {
        icon: this.getIcon(observation),
        radius: this.markerRadius,
        weight: 0,
        opacity: 1,
        renderer: this.myRenderer
    };
  }

  highlightStyle(observation: GenericObservation): MarkerOptions | CircleMarkerOptions {
    return {
        icon: this.getIcon(observation),
        radius: this.markerRadius,
        weight: 1,
        opacity: 1,
        renderer: this.myRenderer
    };
  }

  private getIcon(observation: GenericObservation<any>): Icon | DivIcon {

    const iconSize = this.markerRadius;

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
    let svg = appCircleIcon.data;

    let iconColor = "#fff";
    let textColor = "#000";

    if (observation.isHighlighted) {
      iconColor = "#ff0000";
      textColor = "#fff";
    }

    // Style background of circle
    svg = svg.replace("$bg", iconColor);
    // Style text color
    svg = svg.replace("$color", textColor);

    // Set text of Marker (max. 2 characters)
    const label = String(observation.$source).slice(0, 1) + String(observation.$type).slice(0, 1);
    svg = svg.replace("$data", label);

    const aspect = observation.aspect;

    // Colorize aspect of observation
    svg = svg.replace(`"$${aspect}"`, "\"20\"");
    svg = svg.replace(/"\$[NEWS]+"/g, "\"0\"");

    // Remove separators if there is a gap between two aspects
    let allAspects = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    allAspects = allAspects.filter(e => e !== aspect);

    allAspects.forEach(value => {
      const regex = new RegExp(`(("\\$[NWSE]{1,2}_${value})")|(("\\$${value}_[NWSE]{1,2})")`, "g");
      svg = svg.replace(regex, "\"0\"");
    });

    // Add separators when there are two adjacent aspects
    svg = svg.replace(/"\$[NWSE_]+"/g, "\"3\"");

    return svg;
  }
}
