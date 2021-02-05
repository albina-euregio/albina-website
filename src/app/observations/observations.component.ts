import { Component, AfterContentInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ObservationsService } from "./observations.service";
import { MapService } from "../providers/map-service/map.service";
import { GenericObservation, ObservationTableRow, toObservationTable } from "app/models/generic-observation.model";

import * as L from "leaflet";

@Component({
  templateUrl: "observations.component.html"
})
export class ObservationsComponent implements AfterContentInit, AfterViewInit, OnDestroy {
  public loading = false;
  public showTable = false;
  public dateRange: Date[] = [];
  public elevationRange = [200, 4000];
  public aspects: string[] = [];
  public observations: GenericObservation[] = [];
  public observationPopup: {
    observation: GenericObservation;
    table: ObservationTableRow[];
    iframe: SafeResourceUrl;
  };

  @ViewChild("observationsMap") mapDiv: ElementRef<HTMLDivElement>;

  constructor(
    private translateService: TranslateService,
    private observationsService: ObservationsService,
    private authenticationService: AuthenticationService,
    private sanitizer: DomSanitizer,
    private mapService: MapService
  ) {}

  ngAfterContentInit() {
    this.loadObservations({days: 3});
  }

  ngAfterViewInit() {
    this.initMaps();
  }

  ngOnDestroy() {
    if (this.mapService.observationsMap) {
      this.mapService.observationsMap.remove();
      this.mapService.observationsMap = undefined;
    }
  }

  async loadObservations({days}: {days?: number} = {}) {
    if (typeof days === "number") {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (days - 1));
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setHours(23, 59, 0, 0);
      this.dateRange = [startDate, endDate];
    }
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
      this.observations.sort((o1, o2) => (+o1.eventDate === +o2.eventDate ? 0 : +o1.eventDate < +o2.eventDate ? 1 : -1));
      this.loading = false;
    }
  }

  private initMaps() {
    const map = L.map(this.mapDiv.nativeElement, {
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
      const observations = await this.observationsService.getObservations();
      observations.forEach((o) => this.addObservation(o, this.mapService.observationLayers.Albina));
    } catch (error) {
      console.error("Failed fetching ALBINA observations", error);
    }
  }

  private async loadAvaObs() {
    try {
      const { observations, simpleObservations, snowProfiles } = await this.observationsService.getAvaObs();
      observations.forEach((o) => this.addObservation(o, this.mapService.observationLayers.AvaObs));
      simpleObservations.forEach((o) => this.addObservation(o, this.mapService.observationLayers.AvaObs));
      snowProfiles.forEach((o) => this.addObservation(o, this.mapService.observationLayers.AvaObs));
    } catch (error) {
      console.log("AvaObs loading failed", error);
    }
  }

  private async loadLoLaSafety() {
    try {
      const { avalancheReports, snowProfiles } = await this.observationsService.getLoLaSafety();
      avalancheReports.forEach((o) => this.addObservation(o, this.mapService.observationLayers.LoLaSafety));
      snowProfiles.forEach((o) => this.addObservation(o, this.mapService.observationLayers.LoLaSafety));
    } catch (error) {
      console.log("LO.LA loading failed", error);
    }
  }

  private async loadNatlefs() {
    try {
      const data = await this.observationsService.getNatlefs();
      data.forEach((natlefs) => this.addObservation(natlefs, this.mapService.observationLayers.Natlefs));
    } catch (error) {
      console.error("NATLEFS loading failed", error);
    }
  }

  get observationPopupVisible(): boolean {
    return this.observationPopup !== undefined;
  }

  set observationPopupVisible(value: boolean) {
    if (value) {
      throw Error(String(value));
    }
    this.observationPopup = undefined;
  }

  private async loadLawis() {
    try {
      const { profiles, incidents } = await this.observationsService.getLawis();
      profiles.forEach((profile) => this.addObservation(profile, this.mapService.observationLayers.Lawis));
      incidents.forEach((incident) => this.addObservation(incident, this.mapService.observationLayers.Lawis));
    } catch (error) {
      console.error("Failed fetching lawis.at", error);
    }
  }

  private addObservation(observation: GenericObservation, layer: L.LayerGroup): void {
    if (!this.inElevationRange(observation.elevation) || !this.inAspects(observation.aspect)) {
      return;
    }
    this.observations.push(observation);

    if (!observation.latitude || !observation.longitude) {
      return;
    }
    const ll = L.latLng(observation.latitude, observation.longitude);
    L.circleMarker(ll, this.mapService.createNatlefsOptions(observation.$markerColor))
      .bindTooltip(observation.locationName)
      .on({ click: () => this.onObservationClick(observation) })
      .addTo(layer);
  }

  async onObservationClick(observation: GenericObservation): Promise<void> {
    const extraRows = observation.$extraDialogRows
      ? await observation.$extraDialogRows(observation, (key) => this.translateService.instant(key))
      : [];
    const rows = toObservationTable(observation, (key) => this.translateService.instant(key)); // call toObservationTable after $extraDialogRows
    const table = [...rows, ...extraRows];
    const iframe = observation.$externalURL ? this.sanitizer.bypassSecurityTrustResourceUrl(observation.$externalURL) : undefined;
    this.observationPopup = { observation, table, iframe };
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
