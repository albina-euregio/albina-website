import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Map } from "leaflet";
import { BulletinModel } from "../../models/bulletin.model";
import { BulletinInputModel } from "../../models/bulletin-input.model";
import { RegionsService } from '../regions-service/regions.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import * as Enums from '../../enums/enums';

import "leaflet";
import "leaflet.markercluster";

var L = require('leaflet');

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
        private authenticationService: AuthenticationService)
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
            regions : L.geoJSON(this.regionsService.getRegionsEuregio()),

            // overlay to show selected regions
            activeSelection : L.geoJSON(this.regionsService.getRegionsEuregioWithElevation()),

            // overlay to select regions (when editing an aggregated region)
            editSelection : L.geoJSON(this.regionsService.getRegionsEuregio(), {
                onEachFeature : this.onEachFeature
            }),

            // overlay to show aggregated regions
            aggregatedRegions : L.geoJSON(this.regionsService.getRegionsEuregioWithElevation(), {
                onEachFeature : this.onEachAggregatedRegionsFeature
            })
        }

        this.afternoonOverlayMaps = {
            // overlay to show regions
            regions : L.geoJSON(this.regionsService.getRegionsEuregio()),

            // overlay to show selected regions
            activeSelection : L.geoJSON(this.regionsService.getRegionsEuregioWithElevation()),

            // overlay to select regions (when editing an aggregated region)
            editSelection : L.geoJSON(this.regionsService.getRegionsEuregio(), {
                onEachFeature : this.onEachFeature
            }),

            // overlay to show aggregated regions
            aggregatedRegions : L.geoJSON(this.regionsService.getRegionsEuregioWithElevation(), {
                onEachFeature : this.onEachAggregatedRegionsFeature
            })
        }
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

    addAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        bulletinInputModel.forenoonBelow.dangerRating.subscribe(dangerRating => {
            this.updateAggregatedRegion(bulletinInputModel);
            if (this.map)
                this.selectAggregatedRegion(bulletinInputModel);
        });
        bulletinInputModel.forenoonAbove.dangerRating.subscribe(dangerRating => {
            this.updateAggregatedRegion(bulletinInputModel);
            if (this.map)
                this.selectAggregatedRegion(bulletinInputModel);
        });
        bulletinInputModel.afternoonBelow.dangerRating.subscribe(dangerRating => {
            this.updateAggregatedRegion(bulletinInputModel);
            if (this.map)
                this.selectAggregatedRegion(bulletinInputModel);
        });
        bulletinInputModel.afternoonAbove.dangerRating.subscribe(dangerRating => {
            this.updateAggregatedRegion(bulletinInputModel);
            if (this.map)
                this.selectAggregatedRegion(bulletinInputModel);
        });
        this.updateAggregatedRegion(bulletinInputModel);
    }

    updateAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        let dangerRatingAbove = bulletinInputModel.getForenoonDangerRatingAbove();
        let dangerRatingBelow = bulletinInputModel.getForenoonDangerRatingBelow();
        for (let entry of this.overlayMaps.aggregatedRegions.getLayers()) {
            for (let j = bulletinInputModel.savedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.savedRegions[j]) {
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingAbove, Enums.RegionStatus.saved));
                    else
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingBelow, Enums.RegionStatus.saved));
                }
            }
            for (let j = bulletinInputModel.suggestedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.suggestedRegions[j]) {
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingAbove, Enums.RegionStatus.suggested));
                    else
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingBelow, Enums.RegionStatus.suggested));
                }
            }
            for (let j = bulletinInputModel.publishedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.publishedRegions[j]) {
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingAbove, Enums.RegionStatus.published));
                    else
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRatingBelow, Enums.RegionStatus.published));
                }
            }
        }

        let afternoonDangerRatingAbove = bulletinInputModel.getAfternoonDangerRatingAbove();
        let afternoonDangerRatingBelow = bulletinInputModel.getAfternoonDangerRatingBelow();
        for (let entry of this.afternoonOverlayMaps.aggregatedRegions.getLayers()) {
            for (let j = bulletinInputModel.savedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.savedRegions[j]) {
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingAbove, Enums.RegionStatus.saved));
                    else
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingBelow, Enums.RegionStatus.saved));
                }
            }
            for (let j = bulletinInputModel.suggestedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.suggestedRegions[j]) {
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingAbove, Enums.RegionStatus.suggested));
                    else
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingBelow, Enums.RegionStatus.suggested));
                }
            }
            for (let j = bulletinInputModel.publishedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.publishedRegions[j]) {
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingAbove, Enums.RegionStatus.published));
                    else
                        entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, afternoonDangerRatingBelow, Enums.RegionStatus.published));
                }
            }
        }
    }

    selectAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        this.map.removeLayer(this.overlayMaps.regions);
        this.afternoonMap.removeLayer(this.afternoonOverlayMaps.regions);
        //this.map.removeLayer(this.overlayMaps.aggregatedRegions);
        //this.afternoonMap.removeLayer(this.afternoonOverlayMaps.aggregatedRegions);
        this.map.addLayer(this.overlayMaps.activeSelection);
        this.afternoonMap.addLayer(this.afternoonOverlayMaps.activeSelection);

        for (let entry of this.overlayMaps.activeSelection.getLayers()) {
            entry.feature.properties.selected = false;
            entry.setStyle(this.getActiveSelectionBaseStyle());
            for (let region of bulletinInputModel.savedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getForenoonDangerRatingAbove(), Enums.RegionStatus.saved));
                    else
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getForenoonDangerRatingBelow(), Enums.RegionStatus.saved));
                }
            }
            for (let region of bulletinInputModel.suggestedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getForenoonDangerRatingAbove(), Enums.RegionStatus.suggested));
                    else
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getForenoonDangerRatingBelow(), Enums.RegionStatus.suggested));
                }
            }
            for (let region of bulletinInputModel.publishedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getForenoonDangerRatingAbove(), Enums.RegionStatus.published));
                    else
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getForenoonDangerRatingBelow(), Enums.RegionStatus.published));
                }
            }
        }

        for (let entry of this.afternoonOverlayMaps.activeSelection.getLayers()) {
            entry.feature.properties.selected = false;
            entry.setStyle(this.getActiveSelectionBaseStyle());
            for (let region of bulletinInputModel.savedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getAfternoonDangerRatingAbove(), Enums.RegionStatus.saved));
                    else
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getAfternoonDangerRatingBelow(), Enums.RegionStatus.saved));
                }
            }
            for (let region of bulletinInputModel.suggestedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getAfternoonDangerRatingAbove(), Enums.RegionStatus.suggested));
                    else
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getAfternoonDangerRatingBelow(), Enums.RegionStatus.suggested));
                }
            }
            for (let region of bulletinInputModel.publishedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    if (entry.feature.properties.elevation == "h")
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getAfternoonDangerRatingAbove(), Enums.RegionStatus.published));
                    else
                        entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getAfternoonDangerRatingBelow(), Enums.RegionStatus.published));
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

    editAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        this.map.removeLayer(this.overlayMaps.activeSelection);

        this.map.addLayer(this.overlayMaps.editSelection);

        for (let entry of this.overlayMaps.editSelection.getLayers()) {
            for (let region of bulletinInputModel.savedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    entry.setStyle(this.getEditSelectionStyle(Enums.RegionStatus.saved));
                }
            }
            for (let region of bulletinInputModel.suggestedRegions) {
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

    deselectRegions(bulletinInputModel: BulletinInputModel) {
        for (let entry of this.overlayMaps.aggregatedRegions.getLayers()) {
            for (let region of bulletinInputModel.savedRegions)
                if (entry.feature.properties.id == region)
                    entry.setStyle(this.getUserDependendBaseStyle(region));
            for (let region of bulletinInputModel.suggestedRegions)
                if (entry.feature.properties.id == region)
                    entry.setStyle(this.getUserDependendBaseStyle(region));
            for (let region of bulletinInputModel.publishedRegions)
                if (entry.feature.properties.id == region)
                    entry.setStyle(this.getUserDependendBaseStyle(region));
        }

        for (let entry of this.afternoonOverlayMaps.aggregatedRegions.getLayers()) {
            for (let region of bulletinInputModel.savedRegions)
                if (entry.feature.properties.id == region)
                    entry.setStyle(this.getUserDependendBaseStyle(region));
            for (let region of bulletinInputModel.suggestedRegions)
                if (entry.feature.properties.id == region)
                    entry.setStyle(this.getUserDependendBaseStyle(region));
            for (let region of bulletinInputModel.publishedRegions)
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
                    layer.setStyle({fillColor: 'black', fillOpacity: 0.0});
                } else {
                    feature.properties.selected = true;
                    layer.setStyle({fillColor: 'blue', fillOpacity: 0.5});
                }
            }
        });
    }

    private onEachAggregatedRegionsFeature(feature, layer) {
        layer.on({
            click: function(e) {
                // TODO allow selection of aggregated region in map (create method with this parameter?)
                feature.properties.selected = true;
            }
        });
    }

    private getBaseStyle(feature?) {
        return {
            fillColor: 'black',
            weight: 1,
            opacity: 0.0,
            color: 'black',
            fillOpacity: 0.0
        };
    }

    private getAggregatedRegionsBaseStyle(feature?) {
        return {
            fillColor: 'black',
            weight: 1,
            opacity: 0.0,
            color: 'black',
            fillOpacity: 0.0
        };
    }

    private getUserDependendBaseStyle(region) {
        let opacity = 0.0;
        if (region.startsWith(this.authenticationService.getUserRegion()))
            opacity = 0.0;

        return {
            fillColor: 'black',
            weight: 1,
            opacity: opacity,
            color: 'black',
            fillOpacity: 0.0
        };
    }

    private getUserDependendRegionStyle(region) {
        let opacity = 0.3;
        if (region.startsWith(this.authenticationService.getUserRegion()))
            opacity = 1.0;

        return {
            fillColor: 'black',
            weight: 1,
            opacity: opacity,
            color: 'black',
            fillOpacity: 0.0
        };
    }

    private getActiveSelectionBaseStyle() {
        return {
            fillColor: 'black',
            weight: 1,
            opacity: 0.0,
            color: 'black',
            fillOpacity: 0.0
        };
    }

    private getEditSelectionBaseStyle() {
        return {
            fillColor: 'black',
            weight: 1,
            opacity: 0.0,
            color: 'black',
            fillOpacity: 0.0
        };
    }

    private getEditSelectionStyle(status) {
        let fillOpacity = 0.3;
        if (status == Enums.RegionStatus.saved)
            fillOpacity = 0.5;
        else if (status == Enums.RegionStatus.suggested)
            fillOpacity = 0.3;

        return {
            fillColor: 'blue',
            weight: 1,
            opacity: 1,
            color: 'blue',
            fillOpacity: fillOpacity
        }
    }

    private getActiveSelectionStyle(region, dangerRating, status) {
        let fillOpacity = 1.0;
        let opacity = 0.0;

        // own area
        if (region.startsWith(this.authenticationService.getUserRegion())) {
            if (status == Enums.RegionStatus.published) {
                fillOpacity = 1.0;
            } else if (status == Enums.RegionStatus.suggested) {
                fillOpacity = 0.5;
            } else if (status == Enums.RegionStatus.saved) {
                fillOpacity = 1.0;
            }

        // foreign area
        } else {
            opacity = 0.0;
            fillOpacity = 0.3;
        }

        let fillColor = 'grey';
        if (dangerRating == "very_high")
            fillColor = 'black';
        else if (dangerRating == "high")
            fillColor = 'red';
        else if (dangerRating == "considerable")
            fillColor = 'orange';
        else if (dangerRating == "moderate")
            fillColor = 'yellow';
        else if (dangerRating == "low")
            fillColor = 'green';

        return {
            color: 'black',
            opacity: opacity,
            fillColor: fillColor,
            fillOpacity: fillOpacity
        }
    }

    private getDangerRatingStyle(region, dangerRating, status) {
        let fillOpacity = 1.0;
        let opacity = 0.0;

        // own area
        if (region.startsWith(this.authenticationService.getUserRegion())) {
            if (status == Enums.RegionStatus.published) {
                fillOpacity = 0.5;
            } else if (status == Enums.RegionStatus.suggested) {
                fillOpacity = 0.3;
            } else if (status == Enums.RegionStatus.saved) {
                fillOpacity = 0.5;
            }

        // foreign area
        } else {
            opacity = 0.0;
            fillOpacity = 0.1;
        }

        let color = 'grey';
        if (dangerRating == "very_high")
            color = 'black';
        else if (dangerRating == "high")
            color = 'red';
        else if (dangerRating == "considerable")
            color = 'orange';
        else if (dangerRating == "moderate")
            color = 'yellow';
        else if (dangerRating == "low")
            color = 'green';

        return {
            color: 'black',
            opacity: opacity,
            fillColor: color,
            fillOpacity: fillOpacity
        }
    }
}