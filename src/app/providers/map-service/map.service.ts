import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Map } from "leaflet";
import { RegionsTN } from "../../mock/regions.tn";
import { BulletinModel } from "../../models/bulletin.model";
import { BulletinInputModel } from "../../models/bulletin-input.model";
import { BulletinsService } from '../mock-service/bulletins.service';


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
                            style: this.styleSelectedRegions
                        }),

            // overlay to select regions (when editing an aggregated region)
            editSelection : L.geoJSON(RegionsTN, {
                            style: this.styleSelectedRegions,
                            onEachFeature : this.onEachFeature
                        }),

            // overlay to show aggregated regions
            aggregatedRegions : L.geoJSON(RegionsTN, {
                            style: this.styleAggregatedRegions,
                            onEachFeature : this.onEachAggregatedRegionsFeature
                        })

        }
    }

    deleteAggregatedRegion(bulletin: BulletinModel) {
        // TODO implement
    }

    selectAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        this.map.addLayer(this.overlayMaps.activeSelection);
        for (let i = this.overlayMaps.activeSelection.getLayers().length - 1; i >= 0; i--) {
            this.overlayMaps.activeSelection.getLayers()[i].feature.properties.selected = false;
            this.overlayMaps.activeSelection.getLayers()[i].setStyle({fillOpacity: 0.0});
            for (let j = bulletinInputModel.regions.length - 1; j >= 0; j--) {
                let id = this.overlayMaps.activeSelection.getLayers()[i].feature.properties.id;
                let region = bulletinInputModel.regions[j];
                if (this.overlayMaps.activeSelection.getLayers()[i].feature.properties.id == bulletinInputModel.regions[j]) {
                    this.overlayMaps.activeSelection.getLayers()[i].feature.properties.selected = true;
                    this.overlayMaps.activeSelection.getLayers()[i].setStyle({fillOpacity: 0.5});
                }
            }
        }
    }

    editAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        this.map.addLayer(this.overlayMaps.editSelection);
        for (let i = this.overlayMaps.editSelection.getLayers().length - 1; i >= 0; i--) {
            for (let j = bulletinInputModel.regions.length - 1; j >= 0; j--) {
                let id = this.overlayMaps.editSelection.getLayers()[i].feature.properties.id;
                let region = bulletinInputModel.regions[j];
                if (this.overlayMaps.editSelection.getLayers()[i].feature.properties.id == bulletinInputModel.regions[j]) {
                    this.overlayMaps.editSelection.getLayers()[i].feature.properties.selected = true;
                    this.overlayMaps.editSelection.getLayers()[i].setStyle({fillOpacity: 0.5});
                }
            }
        }
    }

    discardAggregatedRegion() {
        for (let i = this.overlayMaps.editSelection.getLayers().length - 1; i >= 0; i--) {
            this.overlayMaps.editSelection.getLayers()[i].feature.properties.selected = false;
            this.overlayMaps.editSelection.getLayers()[i].setStyle({fillOpacity: 0.0});
        }
        this.map.removeLayer(this.overlayMaps.editSelection);
     }

    private deselectRegions() {
        for (var i = this.overlayMaps.regionsTN.getLayers().length - 1; i >= 0; i--) {
            this.overlayMaps.regionsTN.getLayers()[i].feature.properties.selected = false;
            this.overlayMaps.regionsTN.getLayers()[i].setStyle({fillOpacity: 0.0});
        }
    }

    private onEachFeature(feature, layer) {
        layer.on({
            click: function(e) {
                if (feature.properties.selected && feature.properties.selected == true) {
                    feature.properties.selected = false;
                    layer.setStyle({fillOpacity: 0.0});
                } else {
                    feature.properties.selected = true;
                    layer.setStyle({fillOpacity: 0.5});
                }
            }
        });
    }

    private onEachAggregatedRegionsFeature(feature, layer) {
        layer.on({
            click: function(e) {
                if (feature.properties.aggregated) {
                    for (var i = feature.properties.aggregated.length - 1; i >= 0; i--) {
                        let test = feature.properties.aggregated[i];
                    }
                }
            }
        });
    }

    getSelectedRegions() : String[] {
        let result = new Array<String>();
        for (var i = this.overlayMaps.editSelection.getLayers().length - 1; i >= 0; i--) {
            if (this.overlayMaps.editSelection.getLayers()[i].feature.properties.selected)
                result.push(this.overlayMaps.editSelection.getLayers()[i].feature.properties.id);
        }
        return result;
    }

    private styleAggregatedRegions(feature) {
        if (feature.properties.id)
        return {
            fillColor: 'black',
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.0
        };
    }

    private styleSelectedRegions(feature) {
        if (feature.properties.selected)
            return {
                fillColor: 'black',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.0
            };
        else
            return {
                fillColor: 'black',
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.0
            };
    }
}