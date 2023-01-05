import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { BaseMapService } from "../../providers/map-service/base-map.service";
import { ModellingService, ZamgModelPoint } from "../modelling.service";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import { LatLngLiteral } from 'leaflet';

export interface MultiselectDropdownData {
  id: string;
  name: string;
}

@Component({
  templateUrl: "./modelling.component.html"
})
export class ModellingComponent implements AfterViewInit, OnDestroy {
  zamgTypes = ["", "eps_ecmwf"];
  modelPoints: ZamgModelPoint[];
  visibleLayers: string[] = [];
  public readonly allSources: MultiselectDropdownData[] = [
    {
      id: "qfa",
      name: "QFA"
    },
    {
      id: "eps_ecmwf",
      name: "eps_ecmwf"
    }
  ]
  qfaPoints = {
    "bozen": {
      lng: 11.33,
      lat: 46.47
    },
    "innsbruck": {
      lng: 11.35,
      lat: 47.27
    },
    "lienz": {
      lng: 12.80,
      lat: 46.83
    }
  };

  @ViewChild("mapDiv") mapDiv: ElementRef<HTMLDivElement>;

  constructor(
    public mapService: BaseMapService,
    private modellingService: ModellingService,
    private constantsService: ConstantsService,
  ) {}

  ngAfterViewInit() {
    this.initMaps();
  }

  initMaps() {
    this.mapService.initMaps(this.mapDiv.nativeElement, () => {});
    this.mapService.addControls();
    this.zamgTypes.forEach((zamgType: "" | "eps_ecmwf" | "eps_claef") => {
      this.modellingService.getZamgModelPoints({ zamgType }).subscribe((zamgModelPoints) => {
        this.modelPoints = zamgModelPoints;
        this.modelPoints.forEach(point => {
          const ll: LatLngLiteral = {
            lat: point.lat,
            lng: point.lng
          };
          const callback = {
            callback: this.onClickZamgModelPoint,
            parameters: point,
            context: this,
          }
          this.mapService.drawMarker(
            ll,
            this.getModelPointOptions(zamgType||"default"),
            zamgType || "default",
            callback);
        })
      });
    })

    for(const [cityName, coords] of Object.entries(this.qfaPoints)) {
      const ll: LatLngLiteral = coords;
      console.log(cityName,ll);
      const callback = {
        callback: this.onClickQfa,
        parameters: cityName,
        context: this
      }
      this.mapService.drawMarker(
        ll,
        this.getModelPointOptions("qfa"),
        "qfa",
        callback
      );
    }
  }

  ngOnDestroy() {
    if (this.mapService.map) {
      this.mapService.map.remove();
      this.mapService.map = undefined;
    }
  }

  getModelPointOptions(type) {
    const fillColors = {
      "default": this.constantsService.colorBrand,
      "qfa": "red",
      "zamg_ecmwf": "green",
      "eps_ecmwf": "yellow"
    }

    return {
      radius: 8,
      fillColor: fillColors[type],
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }

  onClickZamgModelPoint(ll: LatLngLiteral, params) {
    console.log(params);
  }

  onClickQfa(ll: LatLngLiteral, params) {
    console.log(params);
  }

  onDropdownSelect(id, event) {
    this.visibleLayers = event.values;
    this.mapService.removeMarkerLayers();
    if(this.visibleLayers.length) {
      this.visibleLayers.forEach(layerName => {
        this.mapService.addMarkerLayer(layerName);
      })
    } else {
      this.allSources.forEach(source => {
        this.mapService.addMarkerLayer(source.id);
      })
    }
  }
}
