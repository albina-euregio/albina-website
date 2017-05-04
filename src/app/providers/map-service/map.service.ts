import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Map } from "leaflet";
import { RegionsTN } from "../../mock/regions.tn";
import { BulletinModel } from "../../models/bulletin.model";


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
            })
        };

        this.overlayMaps = {
            // overlay to select regions
            regionsTN : L.geoJSON(RegionsTN, {
                            style: this.styleRegions,
                            onEachFeature : this.onEachFeature
                        }),

            // overlay to show aggregated regions
            regionsBulletins : L.geoJSON(RegionsTN, {
                            style: this.styleRegions,
                            onEachFeature : this.onEachBulletinFeature
                        })

        }
    }

    createAggregatedRegion() {
        this.map.addLayer(this.overlayMaps.regionsTN);
    }

    discardAggregatedRegion() {
        this.map.removeLayer(this.overlayMaps.regionsTN);
    }

    deleteAggregatedRegion(bulletin: BulletinModel) {
        // TODO implement
    }

    selectAggregatedRegion(bulletin: BulletinModel) {
        // TODO implement
    }

    saveAggregatedRegion() {
        for (let layer in this.overlayMaps.regionsBulletins.getLayers()) {
            for (let i = this.getSelectedRegions().length - 1; i >= 0; i--) {
                if (this.overlayMaps.regionsBulletins.getLayers()[i].feature.properties.id == this.getSelectedRegions()[this.overlayMaps.regionsBulletins.getLayers()[layer]]) {
                    for (let k = this.getSelectedRegions().length - 1; k >= 0; k--) {
                        debugger
                        this.overlayMaps.regionsBulletins.getLayers()[i].feature.properties.aggregated[k] = this.getSelectedRegions()[k];
                    }
                }

            }
        }

        debugger

        for (let i = this.getSelectedRegions().length - 1; i >= 0; i--) {
            let region = this.getSelectedRegions()[i];
            let layer = this.overlayMaps.regionsBulletins.getLayers();
            debugger
        }

        this.deselectRegions();
        this.map.removeLayer(this.overlayMaps.regionsTN);
    }

    getRegions() {
        // TODO return regions for the current user
        return this.overlayMaps.regionsTN.getLayers();
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
                        debugger
                    }
                }
            }
        });
    }

    getSelectedRegions() : String[] {
        let result = new Array<String>();
        for (var i = this.overlayMaps.regionsTN.getLayers().length - 1; i >= 0; i--) {
            if (this.overlayMaps.regionsTN.getLayers()[i].feature.properties.selected)
                result.push(this.overlayMaps.regionsTN.getLayers()[i].feature.properties.id);
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
}