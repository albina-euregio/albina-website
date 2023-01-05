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

  @ViewChild("mapDiv") mapDiv: ElementRef<HTMLDivElement>;

  constructor(
    public mapService: BaseMapService,
    private modellingService: ModellingService,
    private constantsService: ConstantsService,
  ) {}

  ngAfterViewInit() {
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
    this.mapService.initMaps(this.mapDiv.nativeElement, () => {});
    this.mapService.addControls();
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

  onClickZamgModelPoint(ll: LatLngLiteral, params) {
    console.log(params);
  }
}
