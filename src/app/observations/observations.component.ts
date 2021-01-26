import { Component, OnInit, AfterViewInit } from "@angular/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ObservationsService } from "../providers/observations-service/observations.service";
import { MapService } from "../providers/map-service/map.service";
import { Natlefs } from "../models/natlefs.model";

import * as L from "leaflet";

@Component({
  templateUrl: "observations.component.html"
})
export class ObservationsComponent  implements OnInit, AfterViewInit {

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

  private async loadNatlefs() {
    try {
    let data = await this.observationsService.getNatlefs();
    data = data.filter(natlefs => natlefs?.location?.geo?.latitude && natlefs?.location?.geo?.longitude);
    data.forEach(natlefs => this.createNatlefsMarker(natlefs))
    } catch (error) {
      console.error("NATLEFS could not be loaded from server: " + JSON.stringify(error._body));
    }
  }

  private createNatlefsMarker(natlefs: Natlefs) {
    L.circleMarker(L.latLng(natlefs.location.geo.latitude, natlefs.location.geo.longitude), this.mapService.createNatlefsOptions())
      .on({ click: () => this.setActiveNatlefs(natlefs)})
      .addTo(this.mapService.layers.observations);
  }

  setActiveNatlefs(natlefs: Natlefs | undefined) {
    this.activeNatlefs = natlefs;

    const mapDiv = document.getElementById("mapDiv");
    mapDiv.classList.remove(natlefs ? "col-md-12" : "col-md-7");
    mapDiv.classList.add(natlefs ? "col-md-7" : "col-md-12");

    this.mapService.observationsMap.invalidateSize();
    if (natlefs) {
      this.mapService.observationsMap.panTo([natlefs.location.geo.latitude, natlefs.location.geo.longitude]);
    }
  }
}
