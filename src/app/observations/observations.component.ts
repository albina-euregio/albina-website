import { Component, OnInit, AfterViewInit } from "@angular/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ObservationsService } from "../providers/observations-service/observations.service";
import { MapService } from "../providers/map-service/map.service";
import { Natlefs } from "../models/natlefs.model";

declare var L: any;

@Component({
  templateUrl: "observations.component.html"
})
export class ObservationsComponent  implements OnInit, AfterViewInit {

  public showNatlefs: boolean = false;
  public activeNatlefs: Natlefs;

  constructor(
    private observationsService: ObservationsService,
    private authenticationService: AuthenticationService,
    private mapService: MapService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMaps();
    this.mapService.layers.observations.clearLayers();
    this.loadNatlefs();
  }

  private initMaps() {
    if (this.mapService.observationsMap) {
      this.mapService.observationsMap.remove();
    }

    const map = L.map("map", {
      zoomControl: false,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      touchZoom: true,
      center: L.latLng(this.authenticationService.getUserLat(), this.authenticationService.getUserLng()),
      zoom: 8,
      minZoom: 8,
      maxZoom: 16,
      layers: [this.mapService.observationsMaps.AlbinaBaseMap, this.mapService.layers.observations]
    });

    L.control.zoom({ position: "topleft" }).addTo(map);
    L.control.scale().addTo(map);

    this.mapService.observationsMap = map;
  }

  private loadNatlefs() {
    this.observationsService.getNatlefs().subscribe(
      data => {
        for (let i = (data as any).length - 1; i >= 0; i--) {
          if ((data as any)[i].location && (data as any)[i].location.geo && (data as any)[i].location.geo.latitude && (data as any)[i].location.geo.longitude) {
            this.createNatlefsMarker((data as any)[i]);
            console.debug("NATLEFS added.");
          } else {
            console.debug("No coordinates in NATLEFS.");
          }
        }
      },
      error => {
        console.error("NATLEFS could not be loaded from server: " + JSON.stringify(error._body));
      }
    );
  }

  private createNatlefsMarker(natlefs: Natlefs) {
    new L.circleMarker(L.latLng(natlefs.location.geo.latitude, natlefs.location.geo.longitude), this.mapService.createNatlefsOptions())
      .on({ click: () => this.natlefsMarkerClicked(natlefs)})
      .addTo(this.mapService.layers.observations);
  }

  natlefsMarkerClicked(natlefs: Natlefs) {
    this.activeNatlefs = natlefs;

    const mapDiv = document.getElementById("mapDiv");
    mapDiv.classList.remove("col-md-12");
    mapDiv.classList.add("col-md-7");
    this.mapService.centerObservationsMap(this.activeNatlefs.location.geo.latitude, this.activeNatlefs.location.geo.longitude);

    this.showNatlefs = true;
  }
}
