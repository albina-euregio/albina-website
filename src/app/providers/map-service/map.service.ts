import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Map } from "leaflet";
import { BulletinModel } from "../../models/bulletin.model";
import { RegionsService } from '../regions-service/regions.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { ConstantsService } from '../constants-service/constants.service';
import * as Enums from '../../enums/enums';

import "leaflet";
import "leaflet.markercluster";

declare var L: any;

@Injectable()
export class MapService {
    public map: Map;
    public afternoonMap: Map;
    public observationsMap: Map;
    public baseMaps: any;
    public afternoonBaseMaps: any;
    public observationsMaps: any;
    public overlayMaps: any;
    public afternoonOverlayMaps: any;
    public layerGroups: any;

    constructor(
        private http: Http,
        private regionsService: RegionsService,
        private authenticationService: AuthenticationService,
        private constantsService: ConstantsService)
    {
        this.baseMaps = {
            AlbinaBaseMap: L.tileLayer('https://data1.geo.univie.ac.at/TMS/ALBINA/EUREGIO-TMS/{z}/{x}/{y}.png', {
                tms: true,
                reuseTiles: true, 
                unloadInvisibleTiles: true,
                attribution: 'Map data &copy <a href="http://carto.univie.ac.at/">UNI-Wien Karto</a>',
                minZoom: 8,
                maxZoom: 10
            })
        };

        this.afternoonBaseMaps = {
            AlbinaBaseMap: L.tileLayer('https://data1.geo.univie.ac.at/TMS/ALBINA/EUREGIO-TMS/{z}/{x}/{y}.png', {
                tms: true,
                reuseTiles: true, 
                unloadInvisibleTiles: true,
                attribution: 'Map data &copy <a href="http://carto.univie.ac.at/">UNI-Wien Karto</a>',
                minZoom: 8,
                maxZoom: 10
            })
        };

        this.observationsMaps = {
            OpenTopoMap: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                maxZoom: 17,
                attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            })
        };

        this.layerGroups = {
            observations : L.markerClusterGroup([])
        };


        this.overlayMaps = {
            // overlay to show regions
            regions : L.geoJSON(this.regionsService.getRegionsEuregio(), {
                onEachFeature : this.onEachAggregatedRegionsFeature
            }),

            // overlay to show selected regions
            activeSelection : L.geoJSON(this.regionsService.getRegionsEuregioWithElevation()),

            // overlay to select regions (when editing an aggregated region)
            editSelection : L.geoJSON(this.regionsService.getRegionsEuregio(), {
                onEachFeature : this.onEachFeature
            }),

            // overlay to show aggregated regions
            aggregatedRegions : L.geoJSON(this.regionsService.getRegionsEuregioWithElevation())
        }

        this.afternoonOverlayMaps = {
            // overlay to show regions
            regions : L.geoJSON(this.regionsService.getRegionsEuregio(), {
                onEachFeature : this.onEachAggregatedRegionsFeature
            }),

            // overlay to show selected regions
            activeSelection : L.geoJSON(this.regionsService.getRegionsEuregioWithElevation()),

            // overlay to select regions (when editing an aggregated region)
            editSelection : L.geoJSON(this.regionsService.getRegionsEuregio(), {
                onEachFeature : this.onEachFeature
            }),

            // overlay to show aggregated regions
            aggregatedRegions : L.geoJSON(this.regionsService.getRegionsEuregioWithElevation())
        }
    }

    private onEachAggregatedRegionsFeature(feature, layer) {
        layer.on({
            click: function(e) {
                feature.properties.selected = true;
            }
        });
    }

    getClickedRegion() : String {
        for (let entry of this.overlayMaps.regions.getLayers())
            if (entry.feature.properties.selected) {
                entry.feature.properties.selected = false;
                return entry.feature.properties.id;
            }
        return null;
    }

    createSnowProfileMarker() {
        return new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }

    createHastyPitMarker() {
        return new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }

    createQuickReportMarker() {
        return new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }

    createNatlefsMarker() {
        return new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }

    resetAggregatedRegions() {
        for (let entry of this.overlayMaps.aggregatedRegions.getLayers())
            entry.setStyle(this.getUserDependendBaseStyle(entry.feature.properties.id));
        for (let entry of this.afternoonOverlayMaps.aggregatedRegions.getLayers())
            entry.setStyle(this.getUserDependendBaseStyle(entry.feature.properties.id));
    }

    resetRegions() {
        for (let entry of this.overlayMaps.regions.getLayers())
            entry.setStyle(this.getUserDependendRegionStyle(entry.feature.properties.id));
        for (let entry of this.afternoonOverlayMaps.regions.getLayers())
            entry.setStyle(this.getUserDependendRegionStyle(entry.feature.properties.id));
    }

    resetActiveSelection() {
        for (let entry of this.overlayMaps.activeSelection.getLayers())
            entry.setStyle(this.getActiveSelectionBaseStyle());
        for (let entry of this.afternoonOverlayMaps.activeSelection.getLayers())
            entry.setStyle(this.getActiveSelectionBaseStyle());
    }

    resetEditSelection() {
        for (let entry of this.overlayMaps.editSelection.getLayers())
            entry.setStyle(this.getEditSelectionBaseStyle());
        for (let entry of this.afternoonOverlayMaps.editSelection.getLayers())
            entry.setStyle(this.getEditSelectionBaseStyle());
    }

    resetAll() {
        this.resetRegions();
        this.resetActiveSelection();
        this.resetAggregatedRegions();
        this.resetEditSelection();
    }

    centerObservationsMap(lat, lon) {
        this.observationsMap.panTo(L.latLng(lat, lon))
    }

    addAggregatedRegion(bulletin: BulletinModel) {
        bulletin.forenoon.dangerRatingBelow.subscribe(dangerRating => {
            this.updateAggregatedRegion(bulletin);
            if (this.map)
                this.selectAggregatedRegion(bulletin);
        });
        bulletin.forenoon.dangerRatingAbove.subscribe(dangerRating => {
            this.updateAggregatedRegion(bulletin);
            if (this.map)
                this.selectAggregatedRegion(bulletin);
        });
        bulletin.afternoon.dangerRatingBelow.subscribe(dangerRating => {
            this.updateAggregatedRegion(bulletin);
            if (this.map)
                this.selectAggregatedRegion(bulletin);
        });
        bulletin.afternoon.dangerRatingAbove.subscribe(dangerRating => {
            this.updateAggregatedRegion(bulletin);
            if (this.map)
                this.selectAggregatedRegion(bulletin);
        });
        this.updateAggregatedRegion(bulletin);
    }

    updateAggregatedRegion(bulletin: BulletinModel) {
        let dangerRatingAbove = bulletin.getForenoonDangerRatingAbove();
        let dangerRatingBelow = bulletin.getForenoonDangerRatingBelow();
        for (let entry of this.overlayMaps.aggregatedRegions.getLayers()) {
            for (let j = bulletin.savedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletin.savedRegions[j]) {
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingAbove, Enums.RegionStatus.saved));
                    else
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingBelow, Enums.RegionStatus.saved));
                }
            }
            for (let j = bulletin.suggestedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletin.suggestedRegions[j]) {
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingAbove, Enums.RegionStatus.suggested));
                    else
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingBelow, Enums.RegionStatus.suggested));
                }
            }
            for (let j = bulletin.publishedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletin.publishedRegions[j]) {
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingAbove, Enums.RegionStatus.published));
                    else
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingBelow, Enums.RegionStatus.published));
                }
            }
        }

        let afternoonDangerRatingAbove = bulletin.getAfternoonDangerRatingAbove();
        let afternoonDangerRatingBelow = bulletin.getAfternoonDangerRatingBelow();
        for (let entry of this.afternoonOverlayMaps.aggregatedRegions.getLayers()) {
            for (let j = bulletin.savedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletin.savedRegions[j]) {
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingAbove, Enums.RegionStatus.saved));
                    else
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingBelow, Enums.RegionStatus.saved));
                }
            }
            for (let j = bulletin.suggestedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletin.suggestedRegions[j]) {
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingAbove, Enums.RegionStatus.suggested));
                    else
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingBelow, Enums.RegionStatus.suggested));
                }
            }
            for (let j = bulletin.publishedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletin.publishedRegions[j]) {
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingAbove, Enums.RegionStatus.published));
                    else
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingBelow, Enums.RegionStatus.published));
                }
            }
        }
    }

    selectAggregatedRegion(bulletin: BulletinModel) {
        this.map.removeLayer(this.overlayMaps.regions);
        this.afternoonMap.removeLayer(this.afternoonOverlayMaps.regions);
        //this.map.removeLayer(this.overlayMaps.aggregatedRegions);
        //this.afternoonMap.removeLayer(this.afternoonOverlayMaps.aggregatedRegions);
        this.map.addLayer(this.overlayMaps.activeSelection);
        this.afternoonMap.addLayer(this.afternoonOverlayMaps.activeSelection);

        for (let entry of this.overlayMaps.activeSelection.getLayers()) {
            entry.feature.properties.selected = false;
            entry.setStyle(this.getActiveSelectionBaseStyle());
            for (let region of bulletin.savedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getForenoonDangerRatingAbove(), Enums.RegionStatus.saved));
                    else
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getForenoonDangerRatingBelow(), Enums.RegionStatus.saved));
                }
            }
            for (let region of bulletin.suggestedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getForenoonDangerRatingAbove(), Enums.RegionStatus.suggested));
                    else
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getForenoonDangerRatingBelow(), Enums.RegionStatus.suggested));
                }
            }
            for (let region of bulletin.publishedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getForenoonDangerRatingAbove(), Enums.RegionStatus.published));
                    else
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getForenoonDangerRatingBelow(), Enums.RegionStatus.published));
                }
            }
        }

        for (let entry of this.afternoonOverlayMaps.activeSelection.getLayers()) {
            entry.feature.properties.selected = false;
            entry.setStyle(this.getActiveSelectionBaseStyle());
            for (let region of bulletin.savedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getAfternoonDangerRatingAbove(), Enums.RegionStatus.saved));
                    else
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getAfternoonDangerRatingBelow(), Enums.RegionStatus.saved));
                }
            }
            for (let region of bulletin.suggestedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getAfternoonDangerRatingAbove(), Enums.RegionStatus.suggested));
                    else
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getAfternoonDangerRatingBelow(), Enums.RegionStatus.suggested));
                }
            }
            for (let region of bulletin.publishedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getAfternoonDangerRatingAbove(), Enums.RegionStatus.published));
                    else
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletin.getAfternoonDangerRatingBelow(), Enums.RegionStatus.published));
                }
            }
        }
        this.map.addLayer(this.overlayMaps.regions);
        this.afternoonMap.addLayer(this.afternoonOverlayMaps.regions);
    }

    deselectAggregatedRegion() {
        this.map.removeLayer(this.overlayMaps.activeSelection);
        this.afternoonMap.removeLayer(this.afternoonOverlayMaps.activeSelection);
        //this.map.addLayer(this.overlayMaps.aggregatedRegions);
        //this.afternoonMap.addLayer(this.afternoonOverlayMaps.aggregatedRegions);
    }

    editAggregatedRegion(bulletin: BulletinModel) {
        this.map.removeLayer(this.overlayMaps.activeSelection);

        this.map.addLayer(this.overlayMaps.editSelection);

        for (let entry of this.overlayMaps.editSelection.getLayers()) {
            for (let region of bulletin.savedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    entry.setStyle(this.getEditSelectionStyle(Enums.RegionStatus.saved));
                }
            }
            for (let region of bulletin.suggestedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    entry.setStyle(this.getEditSelectionStyle(Enums.RegionStatus.suggested));
                }
            }
        }
    }

    discardAggregatedRegion() {
       for (let entry of this.overlayMaps.editSelection.getLayers()) {
            entry.feature.properties.selected = false;
            entry.setStyle(this.getEditSelectionBaseStyle());
        }

       for (let entry of this.afternoonOverlayMaps.editSelection.getLayers()) {
            entry.feature.properties.selected = false;
            entry.setStyle(this.getEditSelectionBaseStyle());
        }

        this.map.removeLayer(this.overlayMaps.editSelection);
        this.afternoonMap.removeLayer(this.afternoonOverlayMaps.editSelection);
     }

    deselectRegions(bulletin: BulletinModel) {
        for (let entry of this.overlayMaps.aggregatedRegions.getLayers()) {
            for (let region of bulletin.savedRegions)
                if (entry.feature.properties.id == region)
                    entry.setStyle(this.getUserDependendBaseStyle(region));
            for (let region of bulletin.suggestedRegions)
                if (entry.feature.properties.id == region)
                    entry.setStyle(this.getUserDependendBaseStyle(region));
            for (let region of bulletin.publishedRegions)
                if (entry.feature.properties.id == region)
                    entry.setStyle(this.getUserDependendBaseStyle(region));
        }

        for (let entry of this.afternoonOverlayMaps.aggregatedRegions.getLayers()) {
            for (let region of bulletin.savedRegions)
                if (entry.feature.properties.id == region)
                    entry.setStyle(this.getUserDependendBaseStyle(region));
            for (let region of bulletin.suggestedRegions)
                if (entry.feature.properties.id == region)
                    entry.setStyle(this.getUserDependendBaseStyle(region));
            for (let region of bulletin.publishedRegions)
                if (entry.feature.properties.id == region)
                    entry.setStyle(this.getUserDependendBaseStyle(region));
        }

        for (let entry of this.overlayMaps.activeSelection.getLayers()) {
            entry.feature.properties.selected = false;
            entry.setStyle(this.getActiveSelectionBaseStyle());
        }

        for (let entry of this.afternoonOverlayMaps.activeSelection.getLayers()) {
            entry.feature.properties.selected = false;
            entry.setStyle(this.getActiveSelectionBaseStyle());
        }

        this.map.removeLayer(this.overlayMaps.activeSelection);
        this.afternoonMap.removeLayer(this.afternoonOverlayMaps.activeSelection);
    }

    getSelectedRegions() : String[] {
        let result = new Array<String>();
        for (let entry of this.overlayMaps.editSelection.getLayers())
            if (entry.feature.properties.selected)
                result.push(entry.feature.properties.id);
        return result;
    }

    getSelectedRegion() : string {
        for (let entry of this.overlayMaps.aggregatedRegions.getLayers())
            if (entry.feature.properties.selected)
                return entry.feature.properties.id;
    }

    deselectAggregatedRegions() {
        for (let entry of this.overlayMaps.aggregatedRegions.getLayers())
            entry.feature.properties.selected = false;
        for (let entry of this.afternoonOverlayMaps.aggregatedRegions.getLayers())
            entry.feature.properties.selected = false;
    }

    private onEachFeature(feature, layer) {
        layer.on({
            click: function(e) {
                if (feature.properties.selected && feature.properties.selected == true) {
                    feature.properties.selected = false;
                    // TODO use constantsService
                    layer.setStyle({fillColor: '#000000', fillOpacity: 0.0});
                } else {
                    feature.properties.selected = true;
                    // TODO use constantsService
                    layer.setStyle({fillColor: '#3852A4', fillOpacity: 0.5});
                }
            }
        });
    }

    private getBaseStyle(feature?) {
        return {
            fillColor: this.constantsService.getDangerRatingColor("missing"),
            weight: this.constantsService.lineWeight,
            opacity: 0.0,
            color: this.constantsService.lineColor,
            fillOpacity: 0.0
        };
    }

    private getAggregatedRegionsBaseStyle(feature?) {
        return {
            fillColor: this.constantsService.getDangerRatingColor("missing"),
            weight: this.constantsService.lineWeight,
            opacity: 0.0,
            color: this.constantsService.lineColor,
            fillOpacity: 0.0
        };
    }

    private getUserDependendBaseStyle(region) {
        return {
            fillColor: this.constantsService.getDangerRatingColor("missing"),
            weight: this.constantsService.lineWeight,
            opacity: 0.0,
            color: this.constantsService.lineColor,
            fillOpacity: 0.0
        };
    }

    private getUserDependendRegionStyle(region) {
        let opacity = this.constantsService.lineOpacityForeignRegion;
        if (region.startsWith(this.authenticationService.getUserRegion()))
            opacity = this.constantsService.lineOpacityOwnRegion;

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
        if (status == Enums.RegionStatus.saved)
            fillOpacity = this.constantsService.fillOpacityEditSelected;
        else if (status == Enums.RegionStatus.suggested)
            fillOpacity = this.constantsService.fillOpacityEditSuggested;

        return {
            fillColor: this.constantsService.colorActiveSelection,
            weight: this.constantsService.lineWeight,
            opacity: 1,
            color: this.constantsService.colorActiveSelection,
            fillOpacity: fillOpacity
        }
    }

    private getActiveSelectionStyle(region, dangerRating, status) {
        let fillOpacity = this.constantsService.fillOpacityOwnSelected;
        let opacity = 0.0;

        // own area
        if (region.startsWith(this.authenticationService.getUserRegion())) {
            if (status == Enums.RegionStatus.published) {
                fillOpacity = this.constantsService.fillOpacityOwnSelected;
            } else if (status == Enums.RegionStatus.suggested) {
                fillOpacity = this.constantsService.fillOpacityOwnSelectedSuggested;
            } else if (status == Enums.RegionStatus.saved) {
                fillOpacity = this.constantsService.fillOpacityOwnSelected;
            }

        // foreign area
        } else {
            if (status == Enums.RegionStatus.published) {
                fillOpacity = this.constantsService.fillOpacityForeignSelected;
            } else if (status == Enums.RegionStatus.suggested) {
                fillOpacity = this.constantsService.fillOpacityForeignSelectedSuggested;
            } else if (status == Enums.RegionStatus.saved) {
                fillOpacity = this.constantsService.fillOpacityForeignSelected;
            }
        }

        let fillColor = this.constantsService.getDangerRatingColor(dangerRating);

        return {
            color: this.constantsService.lineColor,
            opacity: opacity,
            fillColor: fillColor,
            fillOpacity: fillOpacity
        }
    }

    private getDangerRatingStyle(region, dangerRating, status) {
        let fillOpacity = this.constantsService.fillOpacityOwnDeselected;
        let opacity = 0.0;

        // own area
        if (region.startsWith(this.authenticationService.getUserRegion())) {
            if (status == Enums.RegionStatus.published) {
                fillOpacity = this.constantsService.fillOpacityOwnDeselected;
            } else if (status == Enums.RegionStatus.suggested) {
                fillOpacity = this.constantsService.fillOpacityOwnDeselectedSuggested;
            } else if (status == Enums.RegionStatus.saved) {
                fillOpacity = this.constantsService.fillOpacityOwnDeselected;
            }

        // foreign area
        } else {
            if (status == Enums.RegionStatus.published) {
                fillOpacity = this.constantsService.fillOpacityForeignDeselected;
            } else if (status == Enums.RegionStatus.suggested) {
                fillOpacity = this.constantsService.fillOpacityForeignDeselectedSuggested;
            } else if (status == Enums.RegionStatus.saved) {
                fillOpacity = this.constantsService.fillOpacityForeignDeselected;
            }
        }

        let color = this.constantsService.getDangerRatingColor(dangerRating);
        return {
            color: this.constantsService.lineColor,
            opacity: opacity,
            fillColor: color,
            fillOpacity: fillOpacity
        }
    }
}