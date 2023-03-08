import { Injectable } from "@angular/core";
import { Map, TileLayer, GeoJSON, Browser } from "leaflet";
import { BulletinModel } from "../../models/bulletin.model";
import { RegionsService, RegionWithElevationProperties } from "../regions-service/regions.service";
import { AuthenticationService } from "../authentication-service/authentication.service";
import { ConstantsService } from "../constants-service/constants.service";
import * as Enums from "../../enums/enums";

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
export class MapService {
  public map: Map;
  public afternoonMap: Map;
  public baseMaps: Record<string, TileLayer>;
  public afternoonBaseMaps: Record<string, TileLayer>;
  public overlayMaps: {
    // Micro  regions without elevation
    regions: GeoJSON<SelectableRegionProperties>;
    activeSelection: GeoJSON<SelectableRegionProperties>;
    editSelection: GeoJSON<SelectableRegionProperties>;
    aggregatedRegions: GeoJSON<SelectableRegionProperties>;
  };
  public afternoonOverlayMaps: {
    // Micro  regions without elevation
    regions: GeoJSON<SelectableRegionProperties>;
    activeSelection: GeoJSON<SelectableRegionProperties>;
    editSelection: GeoJSON<SelectableRegionProperties>;
    aggregatedRegions: GeoJSON<SelectableRegionProperties>;
  };

  constructor(
    private regionsService: RegionsService,
    private authenticationService: AuthenticationService,
    private constantsService: ConstantsService) {
    this.initMaps();
  }

  initMaps() {

      this.baseMaps = {
        AlbinaBaseMap: this.getAlbinaBaseMap()
      };

      this.afternoonBaseMaps = {
        AlbinaBaseMap: this.getAlbinaBaseMap()
      };

      this.overlayMaps = {
        // overlay to show micro regions without elevation (only outlines)
        regions: new GeoJSON(this.regionsService.getRegions(), {
          onEachFeature: this.onEachAggregatedRegionsFeatureAM
        }),

        // overlay to show selected regions
        activeSelection: new GeoJSON(this.regionsService.getRegionsWithElevation()),

        // overlay to select regions (when editing an aggregated region)
        editSelection: new GeoJSON(this.regionsService.getActiveRegion(this.authenticationService.getActiveRegionId()), {
          onEachFeature: this.onEachFeatureClosure(this, this.regionsService, this.overlayMaps)
        }),

        // overlay to show aggregated regions
        aggregatedRegions: new GeoJSON(this.regionsService.getRegionsWithElevation())
      };

      this.afternoonOverlayMaps = {
        // overlay to show micro regions without elevation (only outlines)
        regions: new GeoJSON(this.regionsService.getRegions(), {
          onEachFeature: this.onEachAggregatedRegionsFeaturePM
        }),

        // overlay to show selected regions
        activeSelection: new GeoJSON(this.regionsService.getRegionsWithElevation()),

        // overlay to select regions (when editing an aggregated region)
        editSelection: new GeoJSON(this.regionsService.getActiveRegion(this.authenticationService.getActiveRegionId()), {
          onEachFeature: this.onEachFeatureClosure(this, this.regionsService, this.overlayMaps)
        }),

        // overlay to show aggregated regions
        aggregatedRegions: new GeoJSON(this.regionsService.getActiveRegionWithElevation(this.authenticationService.getActiveRegionId()))
      };

    this.resetAll();
  }

  getAlbinaBaseMap(): TileLayer {
    return new TileLayer("https://static.avalanche.report/tms/{z}/{x}/{y}.png", {
      tms: false,
      attribution: ""
    });
  }

  getClickedRegion(): String {
    for (const entry of this.overlayMaps.regions.getLayers()) {
      if (entry.feature.properties.selected) {
        entry.feature.properties.selected = false;
        return entry.feature.properties.id;
      }
    }
    return null;
  }

  resetAggregatedRegions() {
    for (const entry of this.overlayMaps.aggregatedRegions.getLayers()) {
      entry.setStyle(this.getUserDependentBaseStyle(entry.feature.properties.id));
    }
    for (const entry of this.afternoonOverlayMaps.aggregatedRegions.getLayers()) {
      entry.setStyle(this.getUserDependentBaseStyle(entry.feature.properties.id));
    }
  }

  resetRegions() {
    for (const entry of this.overlayMaps.regions.getLayers()) {
      entry.setStyle(this.getUserDependentRegionStyle(entry.feature.properties.id));
    }
    for (const entry of this.afternoonOverlayMaps.regions.getLayers()) {
      entry.setStyle(this.getUserDependentRegionStyle(entry.feature.properties.id));
    }
  }

  resetActiveSelection() {
    for (const entry of this.overlayMaps.activeSelection.getLayers()) {
      entry.setStyle(this.getActiveSelectionBaseStyle());
    }
    for (const entry of this.afternoonOverlayMaps.activeSelection.getLayers()) {
      entry.setStyle(this.getActiveSelectionBaseStyle());
    }
  }

  resetEditSelection() {
    for (const entry of this.overlayMaps.editSelection.getLayers()) {
      entry.setStyle(this.getEditSelectionBaseStyle());
    }
    for (const entry of this.afternoonOverlayMaps.editSelection.getLayers()) {
      entry.setStyle(this.getEditSelectionBaseStyle());
    }
  }

  resetAll() {
    this.resetRegions();
    this.resetActiveSelection();
    this.resetAggregatedRegions();
    this.resetEditSelection();
  }

  updateAggregatedRegion(bulletin: BulletinModel) {
    const dangerRatingAbove = bulletin.getForenoonDangerRatingAbove();
    const dangerRatingBelow = bulletin.getForenoonDangerRatingBelow();
    for (const entry of this.overlayMaps.aggregatedRegions.getLayers()) {
      for (let j = bulletin.savedRegions.length - 1; j >= 0; j--) {
        if (entry.feature.properties.id === bulletin.savedRegions[j]) {
          if (entry.feature.properties.elevation === this.constantsService.microRegionsElevationHigh || entry.feature.properties.elevation === this.constantsService.microRegionsElevationLowHigh) {
            entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingAbove, Enums.RegionStatus.saved));
          } else {
            entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingBelow, Enums.RegionStatus.saved));
          }
        }
      }
      for (let j = bulletin.suggestedRegions.length - 1; j >= 0; j--) {
        if (entry.feature.properties.id === bulletin.suggestedRegions[j]) {
          if (entry.feature.properties.elevation === this.constantsService.microRegionsElevationHigh || entry.feature.properties.elevation === this.constantsService.microRegionsElevationLowHigh) {
            entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingAbove, Enums.RegionStatus.suggested));
          } else {
            entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingBelow, Enums.RegionStatus.suggested));
          }
        }
      }
      for (let j = bulletin.publishedRegions.length - 1; j >= 0; j--) {
        if (entry.feature.properties.id === bulletin.publishedRegions[j]) {
          if (entry.feature.properties.elevation === this.constantsService.microRegionsElevationHigh || entry.feature.properties.elevation === this.constantsService.microRegionsElevationLowHigh) {
            entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingAbove, Enums.RegionStatus.published));
          } else {
            entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingBelow, Enums.RegionStatus.published));
          }
        }
      }
    }

    const afternoonDangerRatingAbove = bulletin.getAfternoonDangerRatingAbove();
    const afternoonDangerRatingBelow = bulletin.getAfternoonDangerRatingBelow();
    for (const entry of this.afternoonOverlayMaps.aggregatedRegions.getLayers()) {
      for (let j = bulletin.savedRegions.length - 1; j >= 0; j--) {
        if (entry.feature.properties.id === bulletin.savedRegions[j]) {
          if (entry.feature.properties.elevation === this.constantsService.microRegionsElevationHigh || entry.feature.properties.elevation === this.constantsService.microRegionsElevationLowHigh) {
            entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingAbove, Enums.RegionStatus.saved));
          } else {
            entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingBelow, Enums.RegionStatus.saved));
          }
        }
      }
      for (let j = bulletin.suggestedRegions.length - 1; j >= 0; j--) {
        if (entry.feature.properties.id === bulletin.suggestedRegions[j]) {
          if (entry.feature.properties.elevation === this.constantsService.microRegionsElevationHigh || entry.feature.properties.elevation === this.constantsService.microRegionsElevationLowHigh) {
            entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingAbove, Enums.RegionStatus.suggested));
          } else {
            entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingBelow, Enums.RegionStatus.suggested));
          }
        }
      }
      for (let j = bulletin.publishedRegions.length - 1; j >= 0; j--) {
        if (entry.feature.properties.id === bulletin.publishedRegions[j]) {
          if (entry.feature.properties.elevation === this.constantsService.microRegionsElevationHigh || entry.feature.properties.elevation === this.constantsService.microRegionsElevationLowHigh) {
            entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingAbove, Enums.RegionStatus.published));
          } else {
            entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingBelow, Enums.RegionStatus.published));
          }
        }
      }
    }
  }

  addAggregatedRegion(bulletin: BulletinModel) {
    this.updateAggregatedRegion(bulletin);
    if (this.map) {
      this.selectAggregatedRegion(bulletin);
    }
    this.updateAggregatedRegion(bulletin);
  }

  selectAggregatedRegion(bulletin: BulletinModel) {
    this.map.removeLayer(this.overlayMaps.regions);
    this.afternoonMap.removeLayer(this.afternoonOverlayMaps.regions);
    this.map.addLayer(this.overlayMaps.activeSelection);
    this.afternoonMap.addLayer(this.afternoonOverlayMaps.activeSelection);

    for (const entry of this.overlayMaps.activeSelection.getLayers()) {
      entry.feature.properties.selected = false;
      entry.setStyle(this.getActiveSelectionBaseStyle());
      for (const region of bulletin.savedRegions) {
        if (entry.feature.properties.id === region) {
          entry.feature.properties.selected = true;
          if (entry.feature.properties.elevation === this.constantsService.microRegionsElevationHigh || entry.feature.properties.elevation === this.constantsService.microRegionsElevationLowHigh) {
            entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getForenoonDangerRatingAbove(), Enums.RegionStatus.saved));
          } else {
            entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getForenoonDangerRatingBelow(), Enums.RegionStatus.saved));
          }
        }
      }
      for (const region of bulletin.suggestedRegions) {
        if (entry.feature.properties.id === region) {
          entry.feature.properties.selected = true;
          if (entry.feature.properties.elevation === this.constantsService.microRegionsElevationHigh || entry.feature.properties.elevation === this.constantsService.microRegionsElevationLowHigh) {
            entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getForenoonDangerRatingAbove(), Enums.RegionStatus.suggested));
          } else {
            entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getForenoonDangerRatingBelow(), Enums.RegionStatus.suggested));
          }
        }
      }
      for (const region of bulletin.publishedRegions) {
        if (entry.feature.properties.id === region) {
          entry.feature.properties.selected = true;
          if (entry.feature.properties.elevation === this.constantsService.microRegionsElevationHigh || entry.feature.properties.elevation === this.constantsService.microRegionsElevationLowHigh) {
            entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getForenoonDangerRatingAbove(), Enums.RegionStatus.published));
          } else {
            entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getForenoonDangerRatingBelow(), Enums.RegionStatus.published));
          }
        }
      }
    }

    for (const entry of this.afternoonOverlayMaps.activeSelection.getLayers()) {
      entry.feature.properties.selected = false;
      entry.setStyle(this.getActiveSelectionBaseStyle());
      for (const region of bulletin.savedRegions) {
        if (entry.feature.properties.id === region) {
          entry.feature.properties.selected = true;
          if (entry.feature.properties.elevation === this.constantsService.microRegionsElevationHigh || entry.feature.properties.elevation === this.constantsService.microRegionsElevationLowHigh) {
            entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getAfternoonDangerRatingAbove(), Enums.RegionStatus.saved));
          } else {
            entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getAfternoonDangerRatingBelow(), Enums.RegionStatus.saved));
          }
        }
      }
      for (const region of bulletin.suggestedRegions) {
        if (entry.feature.properties.id === region) {
          entry.feature.properties.selected = true;
          if (entry.feature.properties.elevation === this.constantsService.microRegionsElevationHigh || entry.feature.properties.elevation === this.constantsService.microRegionsElevationLowHigh) {
            entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getAfternoonDangerRatingAbove(), Enums.RegionStatus.suggested));
          } else {
            entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getAfternoonDangerRatingBelow(), Enums.RegionStatus.suggested));
          }
        }
      }
      for (const region of bulletin.publishedRegions) {
        if (entry.feature.properties.id === region) {
          entry.feature.properties.selected = true;
          if (entry.feature.properties.elevation === this.constantsService.microRegionsElevationHigh || entry.feature.properties.elevation === this.constantsService.microRegionsElevationLowHigh) {
            entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getAfternoonDangerRatingAbove(), Enums.RegionStatus.published));
          } else {
            entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getAfternoonDangerRatingBelow(), Enums.RegionStatus.published));
          }
        }
      }
    }
    this.map.addLayer(this.overlayMaps.regions);
    this.afternoonMap.addLayer(this.afternoonOverlayMaps.regions);
  }

  deselectAggregatedRegion() {
    this.map.removeLayer(this.overlayMaps.activeSelection);
    this.afternoonMap.removeLayer(this.afternoonOverlayMaps.activeSelection);
    // this.map.addLayer(this.overlayMaps.aggregatedRegions);
    // this.afternoonMap.addLayer(this.afternoonOverlayMaps.aggregatedRegions);
  }

  editAggregatedRegion(bulletin: BulletinModel) {
    this.map.removeLayer(this.overlayMaps.activeSelection);
    this.map.addLayer(this.overlayMaps.editSelection);

    for (const entry of this.overlayMaps.editSelection.getLayers()) {
      for (const region of bulletin.savedRegions) {
        if (entry.feature.properties.id === region) {
          entry.feature.properties.selected = true;
          entry.setStyle(this.getEditSelectionStyle(Enums.RegionStatus.saved));
        }
      }
      for (const region of bulletin.publishedRegions) {
        if (entry.feature.properties.id === region) {
          entry.feature.properties.selected = true;
          entry.setStyle(this.getEditSelectionStyle(Enums.RegionStatus.saved));
        }
      }
      for (const region of bulletin.suggestedRegions) {
        if (entry.feature.properties.id === region) {
          entry.feature.properties.selected = true;
          entry.setStyle(this.getEditSelectionStyle(Enums.RegionStatus.suggested));
        }
      }
    }
  }

  discardAggregatedRegion() {
    for (const entry of this.overlayMaps.editSelection.getLayers()) {
      entry.feature.properties.selected = false;
      entry.setStyle(this.getEditSelectionBaseStyle());
    }

    for (const entry of this.afternoonOverlayMaps.editSelection.getLayers()) {
      entry.feature.properties.selected = false;
      entry.setStyle(this.getEditSelectionBaseStyle());
    }

    this.map.removeLayer(this.overlayMaps.editSelection);
    this.afternoonMap.removeLayer(this.afternoonOverlayMaps.editSelection);
  }

  deselectRegions(bulletin: BulletinModel) {
    for (const entry of this.overlayMaps.aggregatedRegions.getLayers()) {
      for (const region of bulletin.savedRegions) {
        if (entry.feature.properties.id === region) {
          entry.setStyle(this.getUserDependentBaseStyle(region));
        }
      }
      for (const region of bulletin.suggestedRegions) {
        if (entry.feature.properties.id === region) {
          entry.setStyle(this.getUserDependentBaseStyle(region));
        }
      }
      for (const region of bulletin.publishedRegions) {
        if (entry.feature.properties.id === region) {
          entry.setStyle(this.getUserDependentBaseStyle(region));
        }
      }
    }

    for (const entry of this.afternoonOverlayMaps.aggregatedRegions.getLayers()) {
      for (const region of bulletin.savedRegions) {
        if (entry.feature.properties.id === region) {
          entry.setStyle(this.getUserDependentBaseStyle(region));
        }
      }
      for (const region of bulletin.suggestedRegions) {
        if (entry.feature.properties.id === region) {
          entry.setStyle(this.getUserDependentBaseStyle(region));
        }
      }
      for (const region of bulletin.publishedRegions) {
        if (entry.feature.properties.id === region) {
          entry.setStyle(this.getUserDependentBaseStyle(region));
        }
      }
    }

    for (const entry of this.overlayMaps.activeSelection.getLayers()) {
      entry.feature.properties.selected = false;
      entry.setStyle(this.getActiveSelectionBaseStyle());
    }

    for (const entry of this.afternoonOverlayMaps.activeSelection.getLayers()) {
      entry.feature.properties.selected = false;
      entry.setStyle(this.getActiveSelectionBaseStyle());
    }

    this.map.removeLayer(this.overlayMaps.activeSelection);
    this.afternoonMap.removeLayer(this.afternoonOverlayMaps.activeSelection);
  }

  getSelectedRegions(): String[] {
    const result = new Array<String>();
    for (const entry of this.overlayMaps.editSelection.getLayers()) {
      if (entry.feature.properties.selected) {
        result.push(entry.feature.properties.id);
      }
    }
    return result;
  }

  getSelectedRegion(): string {
    for (const entry of this.overlayMaps.aggregatedRegions.getLayers()) {
      if (entry.feature.properties.selected) {
        return entry.feature.properties.id;
      }
    }
  }

  deselectAggregatedRegions() {
    for (const entry of this.overlayMaps.aggregatedRegions.getLayers()) {
      entry.feature.properties.selected = false;
    }
    for (const entry of this.afternoonOverlayMaps.aggregatedRegions.getLayers()) {
      entry.feature.properties.selected = false;
    }
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

  private onEachFeatureClosure(mapService, regionsService, overlayMaps) {
    return function onEachFeature(feature, layer) {
      console.log("onEachFeature", overlayMaps);
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

  private onEachAggregatedRegionsFeatureAM(feature, layer) {
    layer.on({
      click: function(e) {
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

  private onEachAggregatedRegionsFeaturePM(feature, layer) {
    layer.on({
      click: function(e) {
        feature.properties.selected = true;
      }
    });
  }

  private getUserDependentBaseStyle(region) {
    return {
      fillColor: this.constantsService.getDangerRatingColor("missing"),
      weight: this.constantsService.lineWeight,
      opacity: 0.0,
      color: this.constantsService.lineColor,
      fillOpacity: 0.0
    };
  }

  private getUserDependentRegionStyle(region) {
    let opacity = this.constantsService.lineOpacityForeignRegion;
    if (region.startsWith(this.authenticationService.getActiveRegionId())) {
      opacity = this.constantsService.lineOpacityOwnRegion;
    }

    return {
      fillColor: this.constantsService.getDangerRatingColor("missing"),
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

  private getEditSelectionBaseStyle() {
    return {
      fillColor: this.constantsService.getDangerRatingColor("missing"),
      weight: this.constantsService.lineWeight,
      opacity: 0.0,
      color: this.constantsService.lineColor,
      fillOpacity: 0.0
    };
  }

  private getEditSelectionStyle(status) {
    let fillOpacity = this.constantsService.fillOpacityEditSuggested;
    if (status === Enums.RegionStatus.saved) {
      fillOpacity = this.constantsService.fillOpacityEditSelected;
    } else if (status === Enums.RegionStatus.suggested) {
      fillOpacity = this.constantsService.fillOpacityEditSuggested;
    }

    return {
      fillColor: this.constantsService.colorActiveSelection,
      weight: this.constantsService.lineWeight,
      opacity: 1,
      color: this.constantsService.colorActiveSelection,
      fillOpacity: fillOpacity
    };
  }

  private getActiveSelectionStyle(region, dangerRating, status) {
    let fillOpacity = this.constantsService.fillOpacityOwnSelected;
    const opacity = 0.0;
    const fillColor = this.constantsService.getDangerRatingColor(dangerRating);

    // own area
    if (region.startsWith(this.authenticationService.getActiveRegionId())) {
      if (status === Enums.RegionStatus.published) {
        fillOpacity = this.constantsService.fillOpacityOwnSelected;
      } else if (status === Enums.RegionStatus.suggested) {
        fillOpacity = this.constantsService.fillOpacityOwnSelectedSuggested;
      } else if (status === Enums.RegionStatus.saved) {
        fillOpacity = this.constantsService.fillOpacityOwnSelected;
      }

    // foreign area
    } else {
      if (status === Enums.RegionStatus.published) {
        fillOpacity = this.constantsService.fillOpacityForeignSelected;
      } else if (status === Enums.RegionStatus.suggested) {
        fillOpacity = this.constantsService.fillOpacityForeignSelectedSuggested;
      } else if (status === Enums.RegionStatus.saved) {
        fillOpacity = this.constantsService.fillOpacityForeignSelected;
      }
    }

    return {
      color: this.constantsService.lineColor,
      opacity: opacity,
      fillColor: fillColor,
      fillOpacity: fillOpacity
    };
  }

  private getDangerRatingStyle(region, dangerRating, status) {
    let fillOpacity = this.constantsService.fillOpacityOwnDeselected;
    const opacity = 0.0;

    // own area
    if (region.startsWith(this.authenticationService.getActiveRegionId())) {
      if (status === Enums.RegionStatus.published) {
        fillOpacity = this.constantsService.fillOpacityOwnDeselected;
      } else if (status === Enums.RegionStatus.suggested) {
        fillOpacity = this.constantsService.fillOpacityOwnDeselectedSuggested;
      } else if (status === Enums.RegionStatus.saved) {
        fillOpacity = this.constantsService.fillOpacityOwnDeselected;
      }

      // foreign area
    } else {
      if (status === Enums.RegionStatus.published) {
        fillOpacity = this.constantsService.fillOpacityForeignDeselected;
      } else if (status === Enums.RegionStatus.suggested) {
        fillOpacity = this.constantsService.fillOpacityForeignDeselectedSuggested;
      } else if (status === Enums.RegionStatus.saved) {
        fillOpacity = this.constantsService.fillOpacityForeignDeselected;
      }
    }

    const color = this.constantsService.getDangerRatingColor(dangerRating);
    return {
      color: this.constantsService.lineColor,
      opacity: opacity,
      fillColor: color,
      fillOpacity: fillOpacity
    };
  }
}
