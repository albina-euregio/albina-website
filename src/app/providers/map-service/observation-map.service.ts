import { Injectable } from '@angular/core';
import { Canvas, Icon, DivIcon, MarkerOptions, CircleMarkerOptions, Browser } from "leaflet";
import { GenericObservation} from "../../observations/models/generic-observation.model";

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
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 146 146">"><g><path d="M129.28053101569978 48.27362719336443 A62.0 62.0 0 0 1 129.28053101569978 95.72637280663557 " stroke="#19abff" fill="none" stroke-width="$E"/><path d="M129.28053101569978 95.72637280663557 A62.0 62.0 0 0 1 95.72637280663557 129.28053101569978 " stroke="#19abff" fill="none" stroke-width="$SE"/><path d="M95.72637280663557 129.28053101569978 A62.0 62.0 0 0 1 48.27362719336443 129.28053101569978 " stroke="#19abff" fill="none" stroke-width="$S"/><path d="M48.27362719336443 129.28053101569978 A62.0 62.0 0 0 1 14.71946898430022 95.72637280663557 " stroke="#19abff" fill="none" stroke-width="$SW"/><path d="M14.71946898430022 95.72637280663557 A62.0 62.0 0 0 1 14.719468984300214 48.27362719336444 " stroke="#19abff" fill="none" stroke-width="$W"/><path d="M14.719468984300214 48.27362719336444 A62.0 62.0 0 0 1 48.27362719336445 14.719468984300214 " stroke="#19abff" fill="none" stroke-width="$NW"/><path d="M48.27362719336445 14.719468984300214 A62.0 62.0 0 0 1 95.72637280663558 14.719468984300228 " stroke="#19abff" fill="none" stroke-width="$N"/><path d="M95.72637280663558 14.719468984300228 A62.0 62.0 0 0 1 129.28053101569978 48.27362719336445 " stroke="#19abff" fill="none" stroke-width="$NE"/><line x1="72.0" y1="72.0" x2="138.51932634081265" y2="44.44679286971353" stroke="black" stroke-width="$E_NE"/><line x1="72.0" y1="72.0" x2="138.51932634081265" y2="99.55320713028647" stroke="black" stroke-width="$SE_E"/><line x1="72.0" y1="72.0" x2="99.55320713028647" y2="138.51932634081265" stroke="black" stroke-width="$S_SE"/><line x1="72.0" y1="72.0" x2="44.44679286971353" y2="138.51932634081265" stroke="black" stroke-width="$SW_S"/><line x1="72.0" y1="72.0" x2="5.48067365918736" y2="99.55320713028647" stroke="black" stroke-width="$W_SW"/><line x1="72.0" y1="72.0" x2="5.48067365918736" y2="44.44679286971355" stroke="black" stroke-width="$NW_W"/><line x1="72.0" y1="72.0" x2="44.44679286971355" y2="5.480673659187346" stroke="black" stroke-width="$N_NW"/><line x1="72.0" y1="72.0" x2="99.55320713028648" y2="5.48067365918736" stroke="black" stroke-width="$NE_N"/></g><g><circle cx="72.0" cy="72.0" r="50" stroke="black" stroke-width="4.0" fill="$bg" /><text x="72.0" y="89.0" text-anchor="middle" fill="$color" font-size="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">$data</text></g></svg>`;

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
