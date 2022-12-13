import { Injectable } from "@angular/core";
import { GeoJSON } from "leaflet";
import { ConstantsService } from "../constants-service/constants.service";
import * as Enums from "../../enums/enums";
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
} from "app/observations/models/generic-observation.model";

// icons
import { appCircleStopIcon } from "../../svg/circle_stop";

import {CanvasIconLayer} from './leaflet.canvas-markers';

import { AuthenticationService } from "../authentication-service/authentication.service";
import { RegionsService, RegionWithElevationProperties } from "../regions-service/regions.service";
declare module "leaflet" {
  interface GeoJSON<P = any> {
    feature?: geojson.Feature<geojson.MultiPoint, P>;
    getLayers(): GeoJSON<P>[];
  }
}


import * as L from "leaflet";
import * as geojson from "geojson";

declare module "leaflet" {
  interface GeoJSON<P = any> {
    feature?: geojson.Feature<geojson.MultiPoint, P>;
    getLayers(): GeoJSON<P>[];
  }
}
interface SelectableRegionProperties extends RegionWithElevationProperties {
  selected: boolean;
}

@Injectable()
export class ObservationsMapService {
  public USE_CANVAS_LAYER = true;
  public observationsMap: Map;
  public observationsMaps: Record<string, TileLayer>;
  public observationSourceLayers: Record<ObservationSource, LayerGroup>;
  public observationTypeLayers: Record<ObservationType, LayerGroup>;
  public overlayMaps: {
    // Micro  regions without elevation
    regions: GeoJSON<SelectableRegionProperties>;
    activeSelection: GeoJSON<SelectableRegionProperties>;
    editSelection: GeoJSON<SelectableRegionProperties>;
    aggregatedRegions: GeoJSON<SelectableRegionProperties>;
  };

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
    private authenticationService: AuthenticationService,
    private regionsService: RegionsService,
    private constantsService: ConstantsService) {
    this.observationSourceLayers = {} as any;
    this.observationTypeLayers = {} as any;
    Object.keys(ObservationSource).forEach(source => this.observationSourceLayers[source] = new LayerGroup());
    Object.keys(ObservationType).forEach(type => this.observationTypeLayers[type] = new LayerGroup());
    this.prepear();
  }


  prepear() {
    this.observationsMaps = {
      OpenTopoMap: new TileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        className: "leaflet-layer-grayscale",
        minZoom: 12.5,
        maxZoom: 17,
        attribution: "Map data: &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>, <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a> (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)"
      }),
      AlbinaBaseMap: new TileLayer("https://static.avalanche.report/tms/{z}/{x}/{y}.png", {
        minZoom: 5,
        maxZoom: 12,
        tms: false,
        attribution: ""
      })
    };

    console.log("initMaps", this.overlayMaps);
    this.overlayMaps = {
      // overlay to show micro regions without elevation (only outlines)
      regions: new GeoJSON(this.regionsService.getRegions(), {
        onEachFeature: this.onEachAggregatedRegionsFeature
      }),

      // overlay to show selected regions
      activeSelection: new GeoJSON(this.regionsService.getRegionsWithElevation()),

      // overlay to select regions (when editing an aggregated region)
      
      editSelection: new GeoJSON(this.regionsService.getRegionsEuregio(), {
        onEachFeature: this.onEachFeatureClosure(this, this.regionsService, this.overlayMaps)
      }),

      // // overlay to show aggregated regions
      aggregatedRegions: new GeoJSON(this.regionsService.getRegionsWithElevation())
    };


  }

  initMaps(el: HTMLElement, onObservationClick: (o: GenericObservation) => void) {
    this.observationsMaps = {
      OpenTopoMap: new TileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        className: "leaflet-layer-grayscale",
        minZoom: 12.5,
        maxZoom: 17,
        attribution: "Map data: &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>, <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a> (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)"
      }),
      AlbinaBaseMap: new TileLayer("https://static.avalanche.report/tms/{z}/{x}/{y}.png", {
        minZoom: 5,
        maxZoom: 12,
        tms: false,
        attribution: ""
      })
    };

    console.log("initMaps", this.overlayMaps);
    this.overlayMaps = {
      // overlay to show micro regions without elevation (only outlines)
      regions: new GeoJSON(this.regionsService.getRegions(), {
        onEachFeature: this.onEachAggregatedRegionsFeature
      }),

      // overlay to show selected regions
      activeSelection: new GeoJSON(this.regionsService.getRegionsWithElevation()),

      // overlay to select regions (when editing an aggregated region)
      
      editSelection: new GeoJSON(this.regionsService.getRegionsEuregio(), {
        onEachFeature: this.onEachFeatureClosure(this, this.regionsService, this.overlayMaps)
      }),

      // // overlay to show aggregated regions
      aggregatedRegions: new GeoJSON(this.regionsService.getRegionsWithElevation())
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
        //...Object.values(this.observationTypeLayers)
      ]
    });

    //this.initLayer(map, this.observationSourceLayers, document.getElementById("sourcesDiv"), onObservationClick);
    //this.initLayer(map, this.observationTypeLayers, document.getElementById("typesDiv"), onObservationClick);
    map.addLayer(this.overlayMaps.regions);
    map.addLayer(this.overlayMaps.activeSelection);
    map.addLayer(this.overlayMaps.editSelection);
    //map.addLayer(this.overlayMaps.aggregatedRegions);
    Object.values(this.observationTypeLayers).forEach(aLayer => {
      //aLayer.pane = "markerPane";
      aLayer.addTo(map)
    });
    this.resetAll();
    this.observationsMap = map;
  }

  clickRegion(regionIds: Array<String>) {
    //console.log("clickRegion", this.overlayMaps.regions);
    for (const entry of this.overlayMaps.regions.getLayers()) {
        entry.feature.properties.selected = regionIds.includes(entry.feature.properties.id);
    }
    this.updateEditSelection();
  }

  getClickedRegion(): String {
    //console.log("getClickedRegion", this.overlayMaps.regions);
    for (const entry of this.overlayMaps.regions.getLayers()) {
      if (entry.feature.properties.selected) {
        entry.feature.properties.selected = false;
        return entry.feature.properties.id;
      }
    }
    return null;
  }

  getSelectedRegions() {
    let selected = [];
    for (const entry of this.overlayMaps.editSelection.getLayers()) {
      if (entry.feature.properties.selected) selected.push(entry.feature.properties);
    }
    return selected;
  }


  updateEditSelection() {
    for (const entry of this.overlayMaps.editSelection.getLayers()) {
      if (entry.feature.properties.selected) {
        entry.setStyle({ fillColor: "#3852A4", fillOpacity: 0.5 });
      } else {
        entry.setStyle({ fillColor: "#000000", fillOpacity: 0.0 });
      }
    }
  }


  private getUserDependentRegionStyle(region) {
    let opacity = this.constantsService.lineOpacityForeignRegion;
    //console.log("getUserDependentRegionStyle ##09", region);
    if (this.authenticationService.isInSuperRegion(region)) {
      opacity = this.constantsService.lineOpacityOwnRegion;
    }

    
    return {
      fillColor: this.constantsService.lineColor,
      weight: this.constantsService.lineWeight,
      opacity: opacity,
      color: this.constantsService.lineColor,
      fillOpacity: 0.0
    };
  }


  private getActiveSelectionBaseStyle() {
    return {
      fillColor: this.constantsService.getDangerRatingColor("missing"),
      weight: this.constantsService.lineWeight,
      opacity: 0.0,
      color: this.constantsService.lineColor,
      fillOpacity: 0.0
    };
  }

  // private getUserDependentBaseStyle(region) {
  //   return {
  //     fillColor: this.constantsService.getDangerRatingColor("missing"),
  //     weight: this.constantsService.lineWeight,
  //     opacity: 0.0,
  //     color: this.constantsService.lineColor,
  //     fillOpacity: 0.0
  //   };
  // }

  private getEditSelectionBaseStyle() {
    return {
      fillColor: this.constantsService.getDangerRatingColor("missing"),
      weight: this.constantsService.lineWeight,
      opacity: 0.0,
      color: this.constantsService.lineColor,
      fillOpacity: 0.0
    };
  }

  // private getEditSelectionStyle(status) {
  //   let fillOpacity = this.constantsService.fillOpacityEditSuggested;
  //   if (status === Enums.RegionStatus.saved) {
  //     fillOpacity = this.constantsService.fillOpacityEditSelected;
  //   } else if (status === Enums.RegionStatus.suggested) {
  //     fillOpacity = this.constantsService.fillOpacityEditSuggested;
  //   }

  //   return {
  //     fillColor: this.constantsService.lineColor,
  //     weight: this.constantsService.lineWeight,
  //     opacity: 1,
  //     color: this.constantsService.lineColor,
  //     fillOpacity: fillOpacity
  //   };
  // }

  // resetAggregatedRegions() {
  //   for (const entry of this.overlayMaps.aggregatedRegions.getLayers()) {
  //     entry.setStyle(this.getUserDependentBaseStyle(entry.feature.properties.id));
  //   }
  // }

  // deselectAggregatedRegions() {
  //   for (const entry of this.overlayMaps.aggregatedRegions.getLayers()) {
  //     entry.feature.properties.selected = false;
  //   }
  // }

  resetRegions() {
    for (const entry of this.overlayMaps.regions.getLayers()) {
      entry.setStyle(this.getUserDependentRegionStyle(entry.feature.properties.id));
    }
  }

  resetActiveSelection() {
    for (const entry of this.overlayMaps.activeSelection.getLayers()) {
      entry.setStyle(this.getActiveSelectionBaseStyle());
    }
  }

  resetEditSelection() {
    for (const entry of this.overlayMaps.editSelection.getLayers()) {
      entry.setStyle(this.getEditSelectionBaseStyle());
    }
  }

  resetAll() {

    console.log("resetAll ##09", this.authenticationService);
    this.resetRegions();
    this.resetActiveSelection();
    //this.resetAggregatedRegions();
    this.resetEditSelection();
  }

  private onEachAggregatedRegionsFeature(feature, layer) {
    layer.on({
      click: function(e) {
        console.log("onEachAggregatedRegionsFeature", feature.properties.id);
        feature.properties.selected = true;
      },
      mouseover: function(e) {
        e.originalEvent.currentTarget.children[1].childNodes[1].children[0].innerHTML = e.target.feature.properties.name;
        const l = e.target;
        l.setStyle({
          weight: 3
        });
        if (!Browser.ie && !Browser.opera12 && !Browser.edge) {
          l.bringToFront();
        }
      },
      mouseout: function(e) {
        e.originalEvent.currentTarget.children[1].childNodes[1].children[0].innerHTML = " ";
        const l = e.target;
        l.setStyle({
          weight: 1
        });
        if (!Browser.ie && Browser.opera12 && !Browser.edge) {
          l.bringToFront();
        }
      }
    });
  }


  private onEachFeatureClosure(mapService, regionsService, overlayMaps) {
    
    return function onEachFeature(feature, layer) {
      //console.log("onEachFeatureClosure op map", overlayMaps);
      layer.on({
        click: function(e) {
          if (feature.properties.selected && feature.properties.selected === true) {
            if (e.originalEvent.ctrlKey) {
              const regions = regionsService.getLevel1Regions(feature.properties.id);
              for (const entry of overlayMaps.editSelection.getLayers()) {
                if (regions.includes(entry.feature.properties.id)) {
                  entry.feature.properties.selected = false;
                }
              }
            } else if (e.originalEvent.altKey) {
              const regions = regionsService.getLevel2Regions(feature.properties.id);
              for (const entry of overlayMaps.editSelection.getLayers()) {
                if (regions.includes(entry.feature.properties.id)) {
                  entry.feature.properties.selected = false;
                }
              }
            } else {
              feature.properties.selected = false;
            }
          } else {
            if (e.originalEvent.ctrlKey) {
              const regions = regionsService.getLevel1Regions(feature.properties.id);
              for (const entry of overlayMaps.editSelection.getLayers()) {
                if (regions.includes(entry.feature.properties.id)) {
                  entry.feature.properties.selected = true;
                }
              }
            } else if (e.originalEvent.altKey) {
              const regions = regionsService.getLevel2Regions(feature.properties.id);
              console.log("onEachFeature->click #4", overlayMaps);
              for (const entry of overlayMaps.editSelection.getLayers()) {
                if (regions.includes(entry.feature.properties.id)) {
                  entry.feature.properties.selected = true;
                }
              }
            } else {
              feature.properties.selected = true;
            }
          }
          mapService.updateEditSelection();
        },
        mouseover: function(e) {
          // TODO get current language
           e.originalEvent.currentTarget.children[1].childNodes[1].children[0].innerHTML = e.target.feature.properties.name;
          const l = e.target;
          l.setStyle({
            weight: 3
          });
          if (!L.Browser.ie && !L.Browser.opera12 && !L.Browser.edge) {
            l.bringToFront();
          }
        },
        mouseout: function(e) {
          e.originalEvent.currentTarget.children[1].childNodes[1].children[0].innerHTML = " ";
          const l = e.target;
          l.setStyle({
            weight: 1
          });
          if (!L.Browser.ie && !L.Browser.opera12 && !L.Browser.edge) {
            l.bringToFront();
          }
        }
      });
    }
  }


  // private initLayer(map: Map, layersObj: Record<string, LayerGroup<any>>, sidebar: HTMLElement, onObservationClick: (o: GenericObservation) => void) {
  //   if (this.USE_CANVAS_LAYER) {
  //     Object.values(layersObj).forEach((l: any) =>
  //       l.addOnClickListener((e, data) =>
  //         onObservationClick(data[0].data.observation)
  //       )
  //     );
  //   }

  //   const layers = new Control.Layers(null, layersObj, { collapsed: false });
  //   layers.addTo(map);

  //   const htmlObject = layers.getContainer();
  //   sidebar.appendChild(htmlObject);
  // }

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

    const iconSize = observation.$markerRadius ?? 20;

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
