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
            // overlay to select regions (when editing an aggregated region)
            selection : L.geoJSON(RegionsTN, {
                            style: this.styleSelectedRegions,
                            onEachFeature : this.onEachFeature
                        }),

            // overlay to show aggregated regions
            regionsBulletins : L.geoJSON(RegionsTN, {
                            style: this.styleRegions,
                            onEachFeature : this.onEachBulletinFeature
                        })

        }
    }

    deleteAggregatedRegion(bulletin: BulletinModel) {
        // TODO implement
    }

    selectAggregatedRegion(aggregatedRegionId: string) {
        // TODO highlight all features within this aggregated region
    }

    editAggregatedRegion(bulletinInputModel: BulletinInputModel) {
        // TODO select all features with this id
        this.map.addLayer(this.overlayMaps.selection);

        for (let i = this.overlayMaps.selection.getLayers().length - 1; i >= 0; i--) {
            for (let j = bulletinInputModel.regions.length - 1; j >= 0; j--) {
                let id = this.overlayMaps.selection.getLayers()[i].feature.properties.id;
                let region = bulletinInputModel.regions[j];
                debugger
                if (this.overlayMaps.selection.getLayers()[i].feature.properties.id == bulletinInputModel.regions[j]) {
                    this.overlayMaps.selection.getLayers()[i].feature.properties.selected = true;
                    this.overlayMaps.selection.getLayers()[i].setStyle({fillOpacity: 0.5});
                }
            }
        }
    }

    discardAggregatedRegion() {
        for (let i = this.overlayMaps.selection.getLayers().length - 1; i >= 0; i--) {
            this.overlayMaps.selection.getLayers()[i].feature.properties.selected = false;
            this.overlayMaps.selection.getLayers()[i].setStyle({fillOpacity: 0.0});
        }
        debugger
        this.map.removeLayer(this.overlayMaps.selection);
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

    private onEachBulletinFeature(feature, layer) {
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
        for (var i = this.overlayMaps.selection.getLayers().length - 1; i >= 0; i--) {
            if (this.overlayMaps.selection.getLayers()[i].feature.properties.selected)
                result.push(this.overlayMaps.selection.getLayers()[i].feature.properties.id);
        }
        return result;
    }

    private styleRegions(feature) {
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