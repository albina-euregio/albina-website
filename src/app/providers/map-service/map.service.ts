import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Map } from "leaflet";
import { RegionsTN } from "../../mock/regions.tn";
import { BulletinModel } from "../../models/bulletin.model";
import { BulletinInputModel } from "../../models/bulletin-input.model";
import { BulletinsService } from '../mock-service/bulletins.service';
import * as Enums from '../../enums/enums';


@Injectable()
export class MapService {
    public map: Map;
    public baseMaps: any;
    public overlayMaps: any;

    constructor(
        private http: Http
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
            activeSelection : L.geoJSON(RegionsTN, {
                style: this.getBaseStyle
            }),

            // overlay to select regions (when editing an aggregated region)
            editSelection : L.geoJSON(RegionsTN, {
                style: this.getBaseStyle,
                onEachFeature : this.onEachFeature
            }),

            // overlay to show aggregated regions
            aggregatedRegions : L.geoJSON(RegionsTN, {
                style: this.getBaseStyle,
                onEachFeature : this.onEachAggregatedRegionsFeature
            })

        }
    }

    reset() {
        for (let i = this.overlayMaps.aggregatedRegions.getLayers().length - 1; i >= 0; i--)
            this.overlayMaps.aggregatedRegions.getLayers()[i].setStyle(this.getBaseStyle());
        for (let i = this.overlayMaps.activeSelection.getLayers().length - 1; i >= 0; i--)
            this.overlayMaps.activeSelection.getLayers()[i].setStyle(this.getBaseStyle());
        for (let i = this.overlayMaps.editSelection.getLayers().length - 1; i >= 0; i--)
            this.overlayMaps.editSelection.getLayers()[i].setStyle(this.getBaseStyle());
    }

    addAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        let dangerRating = bulletinInputModel.getHighestDangerRating();
        for (let i = this.overlayMaps.aggregatedRegions.getLayers().length - 1; i >= 0; i--) {
            for (let j = bulletinInputModel.regions.length - 1; j >= 0; j--) {
                if (this.overlayMaps.aggregatedRegions.getLayers()[i].feature.properties.id == bulletinInputModel.regions[j]) {
                    this.overlayMaps.aggregatedRegions.getLayers()[i].setStyle(this.getDangerRatingStyle(dangerRating));
                }
            }
        }        
    }

    updateAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        let dangerRating = bulletinInputModel.getHighestDangerRating();
        for (let i = this.overlayMaps.aggregatedRegions.getLayers().length - 1; i >= 0; i--) {
            for (let j = bulletinInputModel.regions.length - 1; j >= 0; j--) {
                let id = this.overlayMaps.aggregatedRegions.getLayers()[i].feature.properties.id;
                let region = bulletinInputModel.regions[j];
                if (this.overlayMaps.aggregatedRegions.getLayers()[i].feature.properties.id == bulletinInputModel.regions[j])
                    this.overlayMaps.aggregatedRegions.getLayers()[i].setStyle(this.getDangerRatingStyle(dangerRating));
            }
        }
    }

    deleteAggregatedRegion(bulletin: BulletinModel) {
        // TODO implement
    }

    selectAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        this.map.addLayer(this.overlayMaps.activeSelection);
        for (let i = this.overlayMaps.activeSelection.getLayers().length - 1; i >= 0; i--) {
            this.overlayMaps.activeSelection.getLayers()[i].feature.properties.selected = false;
            this.overlayMaps.activeSelection.getLayers()[i].setStyle(this.getBaseStyle());
            for (let j = bulletinInputModel.regions.length - 1; j >= 0; j--) {
                if (this.overlayMaps.activeSelection.getLayers()[i].feature.properties.id == bulletinInputModel.regions[j]) {
                    this.overlayMaps.activeSelection.getLayers()[i].feature.properties.selected = true;
                    this.overlayMaps.activeSelection.getLayers()[i].setStyle(this.getActiveSelectionStyle());
                }
            }
        }
    }

    editAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        this.map.removeLayer(this.overlayMaps.activeSelection);
        this.map.addLayer(this.overlayMaps.editSelection);
        for (let i = this.overlayMaps.editSelection.getLayers().length - 1; i >= 0; i--) {
            for (let j = bulletinInputModel.regions.length - 1; j >= 0; j--) {
                if (this.overlayMaps.editSelection.getLayers()[i].feature.properties.id == bulletinInputModel.regions[j]) {
                    this.overlayMaps.editSelection.getLayers()[i].feature.properties.selected = true;
                    this.overlayMaps.editSelection.getLayers()[i].setStyle(this.getEditSelectionStyle());
                }
            }
        }
    }

    discardAggregatedRegion() {
        for (let i = this.overlayMaps.editSelection.getLayers().length - 1; i >= 0; i--) {
            this.overlayMaps.editSelection.getLayers()[i].feature.properties.selected = false;
            this.overlayMaps.editSelection.getLayers()[i].setStyle(this.getBaseStyle());
        }
        this.map.removeLayer(this.overlayMaps.editSelection);
     }

    deselectRegions(bulletinInputModel: BulletinInputModel) {
        for (let i = this.overlayMaps.aggregatedRegions.getLayers().length - 1; i >= 0; i--) {
            for (let j = bulletinInputModel.regions.length - 1; j >= 0; j--) {
                if (this.overlayMaps.aggregatedRegions.getLayers()[i].feature.properties.id == bulletinInputModel.regions[j]) {
                    this.overlayMaps.aggregatedRegions.getLayers()[i].setStyle(this.getBaseStyle());
                }
            }
        }

        for (let i = this.overlayMaps.activeSelection.getLayers().length - 1; i >= 0; i--) {
            this.overlayMaps.activeSelection.getLayers()[i].feature.properties.selected = false;
            this.overlayMaps.activeSelection.getLayers()[i].setStyle(this.getBaseStyle());
        }

        this.map.removeLayer(this.overlayMaps.activeSelection);
    }

    getSelectedRegions() : String[] {
        let result = new Array<String>();
        for (let i = this.overlayMaps.editSelection.getLayers().length - 1; i >= 0; i--) {
            if (this.overlayMaps.editSelection.getLayers()[i].feature.properties.selected)
                result.push(this.overlayMaps.editSelection.getLayers()[i].feature.properties.id);
        }
        return result;
    }

    private onEachFeature(feature, layer) {
        layer.on({
            click: function(e) {
                if (feature.properties.selected && feature.properties.selected == true) {
                    feature.properties.selected = false;
                    layer.setStyle({fillColor: 'black', fillOpacity: 0.0, color: 'black', opacity: 1, weight: 1});
                } else {
                    feature.properties.selected = true;
                    layer.setStyle({fillColor: 'blue', fillOpacity: 0.5, color: 'blue', opacity: 1, weight: 1});
                }
            }
        });
    }

    private onEachAggregatedRegionsFeature(feature, layer) {
        layer.on({
            click: function(e) {
                if (feature.properties.aggregated) {
                    for (let i = feature.properties.aggregated.length - 1; i >= 0; i--) {
                        let test = feature.properties.aggregated[i];
                    }
                }
            }
        });
    }

    private getEditSelectionStyle() {
        return {
            fillColor: 'blue',
            weight: 1,
            opacity: 1,
            color: 'blue',
            fillOpacity: 0.5
        }
    }

    private getActiveSelectionStyle() {
        return {
            fillOpacity: 1.0
        }
    }

    private getBaseStyle() {
        return {
            fillColor: 'black',
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.0
        };
    }

    private getDangerRatingStyle(dangerRating) {
        if (dangerRating == "very_high") {
            return {
                fillColor: 'black',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.5
            }
        } else if (dangerRating == "high") {
            return {
                fillColor: 'red',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.5
            }
        } else if (dangerRating == "considerable") {
            return {
                fillColor: 'orange',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.5
            }
        } else if (dangerRating == "moderate") {
            return {
                fillColor: 'yellow',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.5
            }
        } else if (dangerRating == "low") {
            return {
                fillColor: 'green',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.5
            }
        } else {
            return {
                fillColor: 'grey',
                weight: 1,
                opacity: 1,
                color: 'grey',
                fillOpacity: 0.5
            }
        }
    }
}