import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Map } from "leaflet";
import { BulletinModel } from "../../models/bulletin.model";
import { BulletinInputModel } from "../../models/bulletin-input.model";
import { RegionsService } from '../regions-service/regions.service';
import * as Enums from '../../enums/enums';

@Injectable()
export class MapService {
    public map: Map;
    public baseMaps: any;
    public overlayMaps: any;

    constructor(
        private http: Http,
        private regionsService: RegionsService
    ) {
        this.baseMaps = {
            Gdi_Winter: L.tileLayer('https://map3.mapservices.eu/gdi/gdi_base_winter/b6b4ce6df035dcfaa26f3bc32fb89e6a/{z}/{x}/{y}.jpg', {
                tms: true,
                printMapType: "gdi_winter"
            }),
            OpenMapSurfer_Grayscale: L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
                maxZoom: 19,
                attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }),
            Stamen_TonerLite: L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: 'abcd',
                minZoom: 0,
                maxZoom: 20,
                ext: 'png'
            })
        };

        this.overlayMaps = {
            // overlay to show selected regions
            activeSelection : L.geoJSON(this.regionsService.getRegionsEuregio(), {
                style: this.getBaseStyle
            }),

            // overlay to select regions (when editing an aggregated region)
            editSelection : L.geoJSON(this.regionsService.getRegionsEuregio(), {
                style: this.getBaseStyle,
                onEachFeature : this.onEachFeature
            }),

            // overlay to show aggregated regions
            aggregatedRegions : L.geoJSON(this.regionsService.getRegionsEuregio(), {
                style: this.getBaseStyle,
                onEachFeature : this.onEachAggregatedRegionsFeature
            })
        }

        for (let entry of this.overlayMaps.aggregatedRegions.getLayers())
            entry.setStyle(this.getBaseStyle());
    }

    resetAggregatedRegions() {
        for (let entry of this.overlayMaps.aggregatedRegions.getLayers())
            entry.setStyle(this.getBaseStyle());
    }

    resetActiveSelection() {
        for (let entry of this.overlayMaps.activeSelection.getLayers())
            entry.setStyle(this.getBaseStyle());
    }

    resetEditSelection() {
        for (let entry of this.overlayMaps.editSelection.getLayers())
            entry.setStyle(this.getBaseStyle());
    }

    resetAll() {
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
        let dangerRating = bulletinInputModel.getHighestDangerRating();
        for (let entry of this.overlayMaps.aggregatedRegions.getLayers()) {
            for (let j = bulletinInputModel.savedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.savedRegions[j])
                    entry.setStyle(this.getDangerRatingStyleSaved(dangerRating));
            }
            for (let j = bulletinInputModel.suggestedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.suggestedRegions[j])
                    entry.setStyle(this.getDangerRatingStyleSuggested(dangerRating));
            }
            for (let j = bulletinInputModel.publishedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.publishedRegions[j])
                    entry.setStyle(this.getDangerRatingStylePublished(dangerRating));
            }
        }
    }

    selectAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        this.map.addLayer(this.overlayMaps.activeSelection);
        for (let entry of this.overlayMaps.activeSelection.getLayers()) {
            entry.feature.properties.selected = false;
            entry.setStyle(this.getBaseStyle());
            for (let j = bulletinInputModel.savedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.savedRegions[j]) {
                    entry.feature.properties.selected = true;
                    entry.setStyle(this.getActiveSelectionStyleSaved(bulletinInputModel.getHighestDangerRating()));
                }
            }
            for (let j = bulletinInputModel.suggestedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.suggestedRegions[j]) {
                    entry.feature.properties.selected = true;
                    entry.setStyle(this.getActiveSelectionStyleSuggested(bulletinInputModel.getHighestDangerRating()));
                }
            }
            for (let j = bulletinInputModel.publishedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.publishedRegions[j]) {
                    entry.feature.properties.selected = true;
                    entry.setStyle(this.getActiveSelectionStylePublished(bulletinInputModel.getHighestDangerRating()));
                }
            }
        }
    }

    deselectAggregatedRegion() {
        this.map.removeLayer(this.overlayMaps.activeSelection);
    }

    editAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        this.map.removeLayer(this.overlayMaps.activeSelection);
        this.map.addLayer(this.overlayMaps.editSelection);
        for (let entry of this.overlayMaps.editSelection.getLayers()) {
            for (let j = bulletinInputModel.savedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.savedRegions[j]) {
                    entry.feature.properties.selected = true;
                    entry.setStyle(this.getEditSelectionStyleSaved());
                }
            }
            for (let j = bulletinInputModel.suggestedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.suggestedRegions[j]) {
                    entry.feature.properties.selected = true;
                    entry.setStyle(this.getEditSelectionStyleSuggested());
                }
            }
        }
    }

    discardAggregatedRegion() {
       for (let entry of this.overlayMaps.editSelection.getLayers()) {
            entry.feature.properties.selected = false;
            entry.setStyle(this.getBaseStyle());
        }
        this.map.removeLayer(this.overlayMaps.editSelection);
     }

    deselectRegions(bulletinInputModel: BulletinInputModel) {
        for (let entry of this.overlayMaps.aggregatedRegions.getLayers()) {
            for (let j = bulletinInputModel.savedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.savedRegions[j]) {
                    entry.setStyle(this.getBaseStyle());
                }
            }
            for (let j = bulletinInputModel.suggestedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.suggestedRegions[j]) {
                    entry.setStyle(this.getBaseStyle());
                }
            }
            for (let j = bulletinInputModel.publishedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.publishedRegions[j]) {
                    entry.setStyle(this.getBaseStyle());
                }
            }
        }

        for (let entry of this.overlayMaps.activeSelection.getLayers()) {
            entry.feature.properties.selected = false;
            entry.setStyle(this.getBaseStyle());
        }

        this.map.removeLayer(this.overlayMaps.activeSelection);
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
                // TODO allow selection of aggregated region in map
                feature.properties.selected = true;
            }
        });
    }

    private getEditSelectionStyleSaved() {
        return {
            fillColor: 'blue',
            weight: 1,
            opacity: 1,
            color: 'blue',
            fillOpacity: 0.5
        }
    }

    private getEditSelectionStyleSuggested() {
        return {
            fillColor: 'blue',
            weight: 1,
            opacity: 1,
            color: 'blue',
            fillOpacity: 0.3
        }
    }

    private getActiveSelectionStyleSaved(dangerRating) {
        if (dangerRating == "very_high") {
            return {
                fillColor: 'black',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 1.0
            }
        } else if (dangerRating == "high") {
            return {
                fillColor: 'red',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 1.0
            }
        } else if (dangerRating == "considerable") {
            return {
                fillColor: 'orange',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 1.0
            }
        } else if (dangerRating == "moderate") {
            return {
                fillColor: 'yellow',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 1.0
            }
        } else if (dangerRating == "low") {
            return {
                fillColor: 'green',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 1.0
            }
        } else {
            return {
                fillColor: 'grey',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 1.0
            }
        }
    }

    private getActiveSelectionStyleSuggested(dangerRating) {
        if (dangerRating == "very_high") {
            return {
                fillColor: 'black',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.3
            }
        } else if (dangerRating == "high") {
            return {
                fillColor: 'red',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.3
            }
        } else if (dangerRating == "considerable") {
            return {
                fillColor: 'orange',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.3
            }
        } else if (dangerRating == "moderate") {
            return {
                fillColor: 'yellow',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.3
            }
        } else if (dangerRating == "low") {
            return {
                fillColor: 'green',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.3
            }
        } else {
            return {
                fillColor: 'grey',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.3
            }
        }
    }

    // TODO define style
    private getActiveSelectionStylePublished(dangerRating) {
        if (dangerRating == "very_high") {
            return {
                fillColor: 'black',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 1.0
            }
        } else if (dangerRating == "high") {
            return {
                fillColor: 'red',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 1.0
            }
        } else if (dangerRating == "considerable") {
            return {
                fillColor: 'orange',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 1.0
            }
        } else if (dangerRating == "moderate") {
            return {
                fillColor: 'yellow',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 1.0
            }
        } else if (dangerRating == "low") {
            return {
                fillColor: 'green',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 1.0
            }
        } else {
            return {
                fillColor: 'grey',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 1.0
            }
        }
    }

    private getBaseStyle() {
        return {
            fillColor: 'black',
            weight: 1,
            opacity: 0.5,
            color: 'black',
            fillOpacity: 0.0
        };
    }

    private getDangerRatingStyleSaved(dangerRating) {
        if (dangerRating == "very_high") {
            return {
                fillColor: 'black',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.3
            }
        } else if (dangerRating == "high") {
            return {
                fillColor: 'red',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.3
            }
        } else if (dangerRating == "considerable") {
            return {
                fillColor: 'orange',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.3
            }
        } else if (dangerRating == "moderate") {
            return {
                fillColor: 'yellow',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.3
            }
        } else if (dangerRating == "low") {
            return {
                fillColor: 'green',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.3
            }
        } else {
            return {
                fillColor: 'grey',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.3
            }
        }
    }

    private getDangerRatingStyleSuggested(dangerRating) {
        if (dangerRating == "very_high") {
            return {
                fillColor: 'black',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.1
            }
        } else if (dangerRating == "high") {
            return {
                fillColor: 'red',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.1
            }
        } else if (dangerRating == "considerable") {
            return {
                fillColor: 'orange',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.1
            }
        } else if (dangerRating == "moderate") {
            return {
                fillColor: 'yellow',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.1
            }
        } else if (dangerRating == "low") {
            return {
                fillColor: 'green',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.1
            }
        } else {
            return {
                fillColor: 'grey',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.1
            }
        }
    }

    // TODO define style
    private getDangerRatingStylePublished(dangerRating) {
        if (dangerRating == "very_high") {
            return {
                fillColor: 'black',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.3
            }
        } else if (dangerRating == "high") {
            return {
                fillColor: 'red',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.3
            }
        } else if (dangerRating == "considerable") {
            return {
                fillColor: 'orange',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.3
            }
        } else if (dangerRating == "moderate") {
            return {
                fillColor: 'yellow',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.3
            }
        } else if (dangerRating == "low") {
            return {
                fillColor: 'green',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.3
            }
        } else {
            return {
                fillColor: 'grey',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.3
            }
        }
    }
}