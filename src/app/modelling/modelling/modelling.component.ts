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

@Component({
  templateUrl: "./modelling.component.html"
})
export class ModellingComponent implements AfterViewInit, OnDestroy {
  zamgTypes = ["", "eps_ecmwf", "eps_ecmwf"];
  modelPoints: ZamgModelPoint[];
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
            this.zamgModelPointOptions,
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
        this.qfaPointOptions,
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

  get zamgModelPointOptions() {
    return {
      radius: 8,
      fillColor: this.constantsService.colorBrand,
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }

  get qfaPointOptions() {
    return {
      radius: 8,
      fillColor: "red",
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
}
