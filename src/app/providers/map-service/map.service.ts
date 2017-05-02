import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Map } from "leaflet";
import { RegionsAT } from "../../mock/regions.at";


@Injectable()
export class MapService {
    public map: Map;
    public baseMaps: any;
    public overlayMaps: any;
    private vtLayer: any;
    private profiles;

    private selectedRegions: String[];

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
            regionsAT : L.geoJSON(RegionsAT, { style: this.styleRegions, onEachFeature : this.onEachFeature })
        }

        this.selectedRegions = new Array<String>();
    }

    disableMouseEvent(elementId: string) {
        let element = <HTMLElement>document.getElementById(elementId);

        L.DomEvent.disableClickPropagation(element);
        L.DomEvent.disableScrollPropagation(element);
    }

    saveAggregatedRegion() {
        // TODO implement
    }

    onEachFeature(feature, layer) {
        layer.on({
            click: this.selectRegion
        });
    }

    selectRegion(layer, feature) {
        debugger

        // this.selectedRegions.push(feature.id);

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
    }

    styleRegions(feature) {
        return {
            fillColor: 'transient',
            weight: 2,
            opacity: 1,
            color: 'black',
            dashArray: '3',
            fillOpacity: 0.0
        };
    }
}