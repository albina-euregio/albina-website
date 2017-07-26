import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Map } from "leaflet";
import { BulletinModel } from "../../models/bulletin.model";
import { BulletinInputModel } from "../../models/bulletin-input.model";
import { RegionsService } from '../regions-service/regions.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import * as Enums from '../../enums/enums';

var L = require('leaflet');

@Injectable()
export class MapService {
    public map: Map;
    public baseMaps: any;
    public overlayMaps: any;

    constructor(
        private http: Http,
        private regionsService: RegionsService,
        private authenticationService: AuthenticationService)
    {
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
                style: this.getActiveSelectionBaseStyle
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
    }

    resetAggregatedRegions() {
        for (let entry of this.overlayMaps.aggregatedRegions.getLayers())
            entry.setStyle(this.getUserDependendBaseStyle(entry.feature.properties.id));
    }

    resetActiveSelection() {
        for (let entry of this.overlayMaps.activeSelection.getLayers())
            entry.setStyle(this.getUserDependendBaseStyle(entry.feature.properties.id));
    }

    resetEditSelection() {
        for (let entry of this.overlayMaps.editSelection.getLayers())
            entry.setStyle(this.getUserDependendBaseStyle(entry.feature.properties.id));
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
                    entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRating, Enums.RegionStatus.saved));
            }
            for (let j = bulletinInputModel.suggestedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.suggestedRegions[j])
                    entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRating, Enums.RegionStatus.suggested));
            }
            for (let j = bulletinInputModel.publishedRegions.length - 1; j >= 0; j--) {
                if (entry.feature.properties.id == bulletinInputModel.publishedRegions[j])
                    entry.setStyle(this.getDangerRatingStyle(entry.feature.properties.id, dangerRating, Enums.RegionStatus.published));
            }
        }
    }

    selectAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        this.map.addLayer(this.overlayMaps.activeSelection);
        for (let entry of this.overlayMaps.activeSelection.getLayers()) {
            entry.feature.properties.selected = false;
            entry.setStyle(this.getUserDependendBaseStyle(entry.feature.properties.id));
            for (let region of bulletinInputModel.savedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getHighestDangerRating(), Enums.RegionStatus.saved));
                }
            }
            for (let region of bulletinInputModel.suggestedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getHighestDangerRating(), Enums.RegionStatus.suggested));
                }
            }
            for (let region of bulletinInputModel.publishedRegions) {
                if (entry.feature.properties.id == region) {
                    entry.feature.properties.selected = true;
                    entry.setStyle(this.getActiveSelectionStyle(entry.feature.properties.id, bulletinInputModel.getHighestDangerRating(), Enums.RegionStatus.published));
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
            entry.setStyle(this.getBaseStyle());
        }
        this.map.removeLayer(this.overlayMaps.editSelection);
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
                // TODO allow selection of aggregated region in map (create method with this parameter?)
                feature.properties.selected = true;
            }
        });
    }

    private getBaseStyle(feature?) {
        return {
            fillColor: 'black',
            weight: 1,
            opacity: 0.3,
            color: 'black',
            fillOpacity: 0.0
        };
    }

    private getUserDependendBaseStyle(region) {
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
            weight: 0,
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
            fillOpacity = 0.3;
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
            fillColor: color,
            fillOpacity: fillOpacity
        }
    }

    private getDangerRatingStyle(region, dangerRating, status) {
        let fillOpacity = 1.0;

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
            fillColor: color,
            fillOpacity: fillOpacity
        }
    }
}