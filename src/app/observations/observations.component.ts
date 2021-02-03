import { Component, OnInit, AfterContentInit } from "@angular/core";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ObservationsService } from "../providers/observations-service/observations.service";
import { MapService } from "../providers/map-service/map.service";
import { Observation } from "app/models/observation.model";
import { Natlefs } from "../models/natlefs.model";
import { SimpleObservation } from "app/models/avaobs.model";
import * as Enums from "../enums/enums";

import * as L from "leaflet";

@Component({
  templateUrl: "observations.component.html"
})
export class ObservationsComponent implements OnInit, AfterContentInit {
  public loading = false;
  public showTable = false;
  public dateRange: Date[] = [this.observationsService.startDate, this.observationsService.endDate];
  public elevationRange = [200, 4000];
  public aspects: string[] = [];
  public observations: Observation[] = [];
  public activeNatlefs: Natlefs;

  constructor(
    private constantsService: ConstantsService,
    private observationsService: ObservationsService,
    private authenticationService: AuthenticationService,
    private mapService: MapService
  ) {}

  ngOnInit() {}

  ngAfterContentInit() {
    this.initMaps();
    this.loadObservations();
  }

  async loadObservations() {
    try {
      this.loading = true;
      this.observations.length = 0;
      this.observationsService.startDate = this.dateRange[0];
      this.observationsService.endDate = this.dateRange[1];
      this.mapService.observationLayers.AvaObs.clearLayers();
      this.mapService.observationLayers.Natlefs.clearLayers();
      this.mapService.observationLayers.Lawis.clearLayers();
      await Promise.all([this.loadAlbina(), this.loadAvaObs(), this.loadLoLaSafety(), this.loadNatlefs(), this.loadLawis()]);
    } finally {
      this.loading = false;
    }
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
      layers: [this.mapService.observationsMaps.AlbinaBaseMap, ...Object.values(this.mapService.observationLayers)]
    });

    L.control.scale().addTo(map);
    L.control.layers(this.mapService.observationsMaps, this.mapService.observationLayers, { position: "bottomright" }).addTo(map);

    this.mapService.observationsMap = map;
  }

  private async loadAlbina() {
    try {
      this.observations = await this.observationsService.getObservations();
      this.observations.sort((o1, o2) => (o1.eventDate === o2.eventDate ? 0 : o1.eventDate < o2.eventDate ? 1 : -1));
    } catch (error) {
      console.error("Failed fetching ALBINA observations", error);
    }
  }

  private async loadAvaObs() {
    const { observations, simpleObservations, snowProfiles } = await this.observationsService.getAvaObs();
    observations.forEach((o) => this.createAvaObsMarker(o, "blue", "https://www.avaobs.info/observation/" + o.uuId));
    simpleObservations.forEach((o) => this.createAvaObsMarker(o, "green", "https://www.avaobs.info/simpleObservation/" + o.uuId));
    snowProfiles.forEach((o) => this.createAvaObsMarker(o, "red", "https://www.avaobs.info/snowprofile/" + o.uuId));
  }

  private async loadLoLaSafety() {
    const { avalancheReports, snowProfiles } = await this.observationsService.getLoLaSafety();
    avalancheReports.forEach((o) => {
      if (!o.latitude || !o.longitude) {
        return;
      }
      L.circleMarker(L.latLng(o.latitude, o.longitude), this.mapService.createNatlefsOptions("#eed839"))
        .bindTooltip(o.avalancheName)
        .addTo(this.mapService.observationLayers.LoLaSafety);
    });
    snowProfiles.forEach((o) => this.createAvaObsMarker(o, "#cc4221", undefined, this.mapService.observationLayers.LoLaSafety));
  }

  private createAvaObsMarker(o: SimpleObservation, color: string, url?: string, layer = this.mapService.observationLayers.AvaObs) {
    if (!o.positionLat || !o.positionLng) {
      return;
    }
    L.circleMarker(L.latLng(o.positionLat, o.positionLng), this.mapService.createNatlefsOptions(color))
      .bindTooltip(o.placeDescription)
      .on(url ? { click: () => window.open(url) } : {})
      .addTo(layer);
  }

  private async loadNatlefs() {
    try {
      const data = await this.observationsService.getNatlefs();
      data.forEach((natlefs) => this.createNatlefsMarker(natlefs));
    } catch (error) {
      console.error("NATLEFS could not be loaded from server: " + JSON.stringify(error._body));
    }
  }

  private createNatlefsMarker(natlefs: Natlefs) {
    const { latitude, longitude } = natlefs?.location?.geo ?? {};
    if (!latitude || !longitude || !this.inElevationRange(natlefs?.location?.elevation)) {
      return;
    }
    L.circleMarker(L.latLng(latitude, longitude), this.mapService.createNatlefsOptions())
      .on({ click: () => (this.activeNatlefs = natlefs) })
      .addTo(this.mapService.observationLayers.Natlefs);
  }

  get activeNatlefsDialog(): boolean {
    return this.activeNatlefs !== undefined;
  }

  set activeNatlefsDialog(value: boolean) {
    if (value) {
      throw Error(String(value));
    }
    this.activeNatlefs = undefined;
  }

  private async loadLawis() {
    try {
      const { profiles, incidents } = await this.observationsService.getLawis();
      profiles.forEach(({ latitude, longitude, seehoehe, exposition_id, ort, datum, profil_id }) => {
        const aspect = Enums.Aspect[exposition_id];
        if (!latitude || !longitude || !this.inElevationRange(seehoehe) || !this.inAspects(aspect)) {
          return;
        }
        L.circleMarker(L.latLng(latitude, longitude), this.mapService.createNatlefsOptions("#44a9db"))
          .bindTooltip(`${ort} (${datum})`)
          .on({ click: () => window.open(this.constantsService.lawisApi.profilePDF.replace("{{id}}", String(profil_id))) })
          .addTo(this.mapService.observationLayers.Lawis);
      });
      incidents.forEach(({ latitude, longitude, elevation, aspect_id, ort, datum, incident_id }) => {
        const aspect = Enums.Aspect[aspect_id];
        if (!latitude || !longitude || !this.inElevationRange(elevation) || !this.inAspects(aspect)) {
          return;
        }
        L.circleMarker(L.latLng(latitude, longitude), this.mapService.createNatlefsOptions("#b76bd9"))
          .bindTooltip(`${ort} (${datum})`)
          .on({ click: () => window.open(this.constantsService.lawisApi.incidentWeb.replace("{{id}}", String(incident_id))) })
          .addTo(this.mapService.observationLayers.Lawis);
      });
    } catch (error) {
      console.error("Failed fetching lawis.at", error);
    }
  }

  private inElevationRange(elevation: number | undefined) {
    return elevation === undefined || (this.elevationRange[0] <= elevation && elevation <= this.elevationRange[1]);
  }

  private inAspects(aspect: string) {
    return !this.aspects.length || (typeof aspect === "string" && this.aspects.includes(aspect.toUpperCase()));
  }

  get showMap(): boolean {
    return !this.showTable;
  }

  set showMap(value: boolean) {
    this.showTable = !value;
  }
}
