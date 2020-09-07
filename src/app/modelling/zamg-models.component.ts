import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ModellingService, ZamgModelPoint } from "./modelling.service";
import { MapService } from "../providers/map-service/map.service";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";

declare var L: any;

@Component({
  templateUrl: "./zamg-models.component.html"
})
export class ZamgModelsComponent implements OnInit, AfterViewInit {
  modelPoints: ZamgModelPoint[];
  selectedModelPoint: ZamgModelPoint;
  showMap: boolean;
  showTable: boolean;

  @ViewChild("select") select;
  @ViewChild("map") mapDiv;

  constructor(
    private modellingService: ModellingService,
    public translate: TranslateService,
    private authenticationService: AuthenticationService,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.showMap = true;
    this.showTable = false;
    this.modellingService.getZamgModelPoints().subscribe(zamgModelPoints => {
      this.modelPoints = zamgModelPoints;
      this.initMaps();
    });
  }

  ngAfterViewInit() {
    this.select.nativeElement.focus();
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

  private initMaps() {
    if (this.mapService.zamgModelsMap) {
      this.mapService.zamgModelsMap.remove();
    }

    const map = L.map("map", {
      zoomControl: false,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      touchZoom: true,
      center: L.latLng(this.authenticationService.getUserLat(), this.authenticationService.getUserLng()),
      zoom: 8,
      minZoom: 7,
      maxZoom: 12,
      zoomSnap: 0.25,
      layers: [this.mapService.zamgModelsMaps.AlbinaBaseMap, this.mapService.layers.zamgModelPoints]
    });

    L.control.zoom({ position: "topleft" }).addTo(map);
    L.control.scale().addTo(map);

    this.mapService.zamgModelsMap = map;
    this.mapService.layers.zamgModelPoints.clearLayers();

    for (let i = this.modelPoints.length - 1; i >= 0; i--) {
      const modelPoint = this.modelPoints[i];
      new L.Marker(new L.LatLng(modelPoint.lat, modelPoint.lng), { icon: this.mapService.createZamgModelPointMarker() })
      .on({ click: () => this.selectModelPoint(modelPoint)})
      .addTo(this.mapService.layers.zamgModelPoints);
    }
  }
}
