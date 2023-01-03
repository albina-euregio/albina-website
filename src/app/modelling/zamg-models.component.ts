import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ModellingService, ZamgModelPoint } from "./modelling.service";
import { BaseMapService } from "../providers/map-service/base-map.service";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";

import { Map, CircleMarkerOptions, CircleMarker, LatLng, Control } from "leaflet";
import { ConstantsService } from "../providers/constants-service/constants.service";

@Component({
  templateUrl: "./zamg-models.component.html"
})
export class ZamgModelsComponent implements OnInit, AfterViewInit, OnDestroy {
  modelPoints: ZamgModelPoint[];
  selectedModelPoint: ZamgModelPoint;
  showMap: boolean;
  showTable: boolean;
  zamgType: "" | "eps_ecmwf" | "eps_claef";

  @ViewChild("select") select: ElementRef<HTMLSelectElement>;
  @ViewChild("zamgModelsMap") mapDiv: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private modellingService: ModellingService,
    public translate: TranslateService,
    private authenticationService: AuthenticationService,
    private mapService: BaseMapService,
    private constantsService: ConstantsService
  ) {}

  ngOnInit() {
    this.showMap = true;
    this.showTable = false;
    this.route.data.subscribe(({ zamgType }) => {
      this.zamgType = zamgType;
      this.modellingService.getZamgModelPoints({ zamgType }).subscribe((zamgModelPoints) => {
        this.modelPoints = zamgModelPoints;
        this.initMaps();
      });
    });
  }

  ngAfterViewInit() {
    this.select.nativeElement.focus();
  }

  ngOnDestroy() {
    if (this.mapService.map) {
      this.mapService.map.remove();
      this.mapService.map = undefined;
    }
  }

  onSelectedModelPointKeydown(event: KeyboardEvent) {
    if (this.zamgType !== "eps_ecmwf" && this.zamgType !== "eps_claef") {
      return;
    }
    const lengthPoints = this.modelPoints.length;
    const lengthTypes = this.modellingService.getZamgEcmwfTypes().length;
    const change =
      event.key === "ArrowLeft" || event.keyCode === 37
        ? (2 * lengthPoints) / lengthTypes
        : event.key === "ArrowRight" || event.keyCode === 39
        ? (1 * lengthPoints) / lengthTypes
        : 0;
    if (change === 0) {
      return;
    }
    const index = this.modelPoints.indexOf(this.selectedModelPoint);
    this.selectedModelPoint = this.modelPoints[(index + change) % lengthPoints];
    event.preventDefault();
  }

  onSelectedModelPointChange(event) {
    this.mapDiv.nativeElement.style.height = "0";
    this.showTable = false;
  }

  setShowTable() {
    this.selectedModelPoint = undefined;
    this.mapDiv.nativeElement.style.height = "0";
    this.showTable = true;
  }

  setShowMap() {
    this.selectedModelPoint = undefined;
    this.showTable = false;
    this.mapDiv.nativeElement.style.height = "500px";
  }

  get currentLang() {
    return this.translate.currentLang;
  }

  selectModelPoint(modelPoint) {
    this.selectedModelPoint = modelPoint;
    this.showTable = false;
    this.mapDiv.nativeElement.style.height = "0";
  }

  createZamgModelPointOptions(): CircleMarkerOptions {
    return {
      radius: 8,
      fillColor: this.constantsService.colorBrand,
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }

  private initMaps() {
    const map = new Map(this.mapDiv.nativeElement, {
      zoomControl: false,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      touchZoom: true,
      center: new LatLng(this.authenticationService.getUserLat(), this.authenticationService.getUserLng()),
      zoom: 8,
      minZoom: 7,
      maxZoom: 12,
      zoomSnap: 0.25,
      layers: [this.mapService.baseMaps.AlbinaBaseMap, this.mapService.layers.zamgModelPoints]
    });

    new Control.Zoom({ position: "topleft" }).addTo(map);
    new Control.Scale().addTo(map);

    this.mapService.map = map;
    this.mapService.layers.zamgModelPoints.clearLayers();

    for (let i = this.modelPoints.length - 1; i >= 0; i--) {
      const modelPoint = this.modelPoints[i];
      new CircleMarker(new LatLng(modelPoint.lat, modelPoint.lng), this.createZamgModelPointOptions())
      .on({ click: () => this.selectModelPoint(modelPoint)})
        .addTo(this.mapService.layers.zamgModelPoints);
    }
  }
}
