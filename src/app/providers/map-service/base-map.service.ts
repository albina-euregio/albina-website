import { Injectable } from "@angular/core";
import { GeoJSON } from "leaflet";
import { ConstantsService } from "../constants-service/constants.service";
// @ts-ignore
/// <reference types="leaflet-sidebar-v2" />
import {
  Map,
  LayerGroup,
  TileLayer,
  SidebarOptions,
  MarkerOptions,
  CircleMarkerOptions,
  Browser,
  Control,
  LatLng,
  CircleMarker,
  Marker,
} from "leaflet";
import {
  GenericObservation,
  ObservationType,
} from "app/observations/models/generic-observation.model";

import { AuthenticationService } from "../authentication-service/authentication.service";
import {
  RegionsService,
  RegionWithElevationProperties,
} from "../regions-service/regions.service";
import { ObservationMapService } from "./observation-map.service";
declare module "leaflet" {
  interface GeoJSON<P = any> {
    feature?: geojson.Feature<geojson.MultiPoint, P>;
    getLayers(): GeoJSON<P>[];
  }
}

import * as geojson from "geojson";

declare var L: any;

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
export class BaseMapService {
  public map: Map;
  public baseMaps: Record<string, TileLayer>;
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
  };

  public layers = {
    forecast: new LayerGroup(),
  };

  constructor(
    private authenticationService: AuthenticationService,
    private regionsService: RegionsService,
    private constantsService: ConstantsService,
    private observationMapService: ObservationMapService
  ) {
    this.observationTypeLayers = {} as any;
    Object.keys(ObservationType).forEach(
      (type) => (this.observationTypeLayers[type] = new LayerGroup())
    );
  }

  initMaps(
    el: HTMLElement,
    onObservationClick: (o: GenericObservation) => void
  ) {
    Object.values(this.observationTypeLayers).forEach((layer) =>
      layer.clearLayers()
    );
    this.baseMaps = {
      OpenTopoMap: new TileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
          className: "leaflet-layer-grayscale",
          minZoom: 12.5,
          maxZoom: 17,
          attribution:
            'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        }
      ),
      AlbinaBaseMap: new TileLayer(
        "https://static.avalanche.report/tms/{z}/{x}/{y}.png",
        {
          minZoom: 5,
          maxZoom: 12,
          tms: false,
          attribution: "",
        }
      ),
    };

    this.overlayMaps = {
      // overlay to show micro regions without elevation (only outlines)
      regions: new GeoJSON(this.regionsService.getRegions(), {
        onEachFeature: this.onEachAggregatedRegionsFeature,
      }),

      // overlay to show selected regions
      activeSelection: new GeoJSON(
        this.regionsService.getRegionsWithElevation()
      ),

      // overlay to select regions (when editing an aggregated region)

      editSelection: new GeoJSON(this.regionsService.getRegionsEuregio(), {
        onEachFeature: this.onEachFeatureClosure(
          this,
          this.regionsService,
          this.overlayMaps
        ),
      }),

      // // overlay to show aggregated regions
      aggregatedRegions: new GeoJSON(
        this.regionsService.getRegionsWithElevation()
      ),
    };

    const map = new Map(el, {
      zoomAnimation: false,
      zoomControl: false,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      touchZoom: true,
      center: new LatLng(
        this.authenticationService.getUserLat(),
        this.authenticationService.getUserLng()
      ),
      zoom: 8,
      minZoom: 4,
      maxZoom: 17,
      layers: [
        ...Object.values(this.baseMaps),
        //...Object.values(this.observationTypeLayers)
      ],
    });

    //this.initLayer(map, this.observationTypeLayers, document.getElementById("typesDiv"), onObservationClick);
    map.addLayer(this.overlayMaps.regions);
    map.addLayer(this.overlayMaps.activeSelection);
    map.addLayer(this.overlayMaps.editSelection);
    //map.addLayer(this.overlayMaps.aggregatedRegions);
    Object.values(this.observationTypeLayers).forEach((aLayer) => {
      //aLayer.pane = "markerPane";
      aLayer.addTo(map);
    });
    this.resetAll();
    this.map = map;
  }

  addControls() {
    new Control.Zoom({ position: "topleft" }).addTo(this.map);
    new Control.Scale().addTo(this.map);
  }

  addInfo() {
    const info = L.control();
    info.onAdd = function () {
      this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
      this.update();
      return this._div;
    };
    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
      this._div.innerHTML = props ? "<b>" + props.name_de + "</b>" : " ";
    };
    info.addTo(this.map);
  }

  clickRegion(regionIds: Array<String>) {
    //console.log("clickRegion", this.overlayMaps.regions);
    for (const entry of this.overlayMaps.regions.getLayers()) {
      entry.feature.properties.selected = regionIds.includes(
        entry.feature.properties.id
      );
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
      if (entry.feature.properties.selected)
        selected.push(entry.feature.properties);
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
      fillOpacity: 0.0,
    };
  }

  private getActiveSelectionBaseStyle() {
    return {
      fillColor: this.constantsService.getDangerRatingColor("missing"),
      weight: this.constantsService.lineWeight,
      opacity: 0.0,
      color: this.constantsService.lineColor,
      fillOpacity: 0.0,
    };
  }

  private getEditSelectionBaseStyle() {
    return {
      fillColor: this.constantsService.getDangerRatingColor("missing"),
      weight: this.constantsService.lineWeight,
      opacity: 0.0,
      color: this.constantsService.lineColor,
      fillOpacity: 0.0,
    };
  }

  resetRegions() {
    for (const entry of this.overlayMaps.regions.getLayers()) {
      entry.setStyle(
        this.getUserDependentRegionStyle(entry.feature.properties.id)
      );
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
      click: function (e) {
        console.log("onEachAggregatedRegionsFeature", feature.properties.id);
        feature.properties.selected = true;
      },
      mouseover: function (e) {
        e.originalEvent.currentTarget.children[1].childNodes[1].children[0].innerHTML =
          e.target.feature.properties.name;
        const l = e.target;
        l.setStyle({
          weight: 3,
        });
        if (!Browser.ie && !Browser.opera12 && !Browser.edge) {
          l.bringToFront();
        }
      },
      mouseout: function (e) {
        e.originalEvent.currentTarget.children[1].childNodes[1].children[0].innerHTML =
          " ";
        const l = e.target;
        l.setStyle({
          weight: 1,
        });
        if (!Browser.ie && Browser.opera12 && !Browser.edge) {
          l.bringToFront();
        }
      },
    });
  }

  private onEachFeatureClosure(mapService, regionsService, overlayMaps) {
    return function onEachFeature(feature, layer) {
      //console.log("onEachFeatureClosure op map", overlayMaps);
      layer.on({
        click: function (e) {
          if (
            feature.properties.selected &&
            feature.properties.selected === true
          ) {
            if (e.originalEvent.ctrlKey) {
              const regions = regionsService.getLevel1Regions(
                feature.properties.id
              );
              for (const entry of overlayMaps.editSelection.getLayers()) {
                if (regions.includes(entry.feature.properties.id)) {
                  entry.feature.properties.selected = false;
                }
              }
            } else if (e.originalEvent.altKey) {
              const regions = regionsService.getLevel2Regions(
                feature.properties.id
              );
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
              const regions = regionsService.getLevel1Regions(
                feature.properties.id
              );
              for (const entry of overlayMaps.editSelection.getLayers()) {
                if (regions.includes(entry.feature.properties.id)) {
                  entry.feature.properties.selected = true;
                }
              }
            } else if (e.originalEvent.altKey) {
              const regions = regionsService.getLevel2Regions(
                feature.properties.id
              );
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
        mouseover: function (e) {
          // TODO get current language
          e.originalEvent.currentTarget.children[1].childNodes[1].children[0].innerHTML =
            e.target.feature.properties.name;
          const l = e.target;
          l.setStyle({
            weight: 3,
          });
          if (!L.Browser.ie && !L.Browser.opera12 && !L.Browser.edge) {
            l.bringToFront();
          }
        },
        mouseout: function (e) {
          e.originalEvent.currentTarget.children[1].childNodes[1].children[0].innerHTML =
            " ";
          const l = e.target;
          l.setStyle({
            weight: 1,
          });
          if (!L.Browser.ie && !L.Browser.opera12 && !L.Browser.edge) {
            l.bringToFront();
          }
        },
      });
    };
  }

  removeObservationLayers() {
    Object.values(this.observationTypeLayers).forEach((layer) =>
      this.map.removeLayer(layer)
    );
  }

  removeMarkerLayer(name) {
    this.map.removeLayer(this.layers[name]);
  }

  removeMarkerLayers() {
    for (const layer of Object.values(this.layers)) {
      this.map.removeLayer(layer);
    }
  }

  addMarkerLayer(name) {
    this.map.addLayer(this.layers[name]);
  }

  addMarker(
    marker: CircleMarker | Marker,
    layerName: string,
    attribution: string | undefined = undefined
  ) {
    marker.options.pane = "markerPane";

    if (this.layers[layerName] === undefined) {
      this.layers[layerName] = new LayerGroup([], { attribution });
      this.layers[layerName].addTo(this.map);
    }

    marker.addTo(this.layers[layerName]);
  }

  style(observation: GenericObservation): MarkerOptions | CircleMarkerOptions {
    return this.observationMapService.style(observation);
  }

  highlightStyle(
    observation: GenericObservation
  ): MarkerOptions | CircleMarkerOptions {
    return this.observationMapService.highlightStyle(observation);
  }
}
