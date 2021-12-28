import { Component, AfterContentInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ObservationsService } from "./observations.service";
import { RegionsService, RegionProperties } from "../providers/regions-service/regions.service";
import { MapService } from "../providers/map-service/map.service";
import { GenericObservation, ObservationSource, ObservationSourceColors, ObservationTableRow, toObservationTable } from "./models/generic-observation.model";

import { Observable } from "rxjs";
import * as L from "leaflet";

@Component({
  templateUrl: "observations.component.html"
})
export class ObservationsComponent implements AfterContentInit, AfterViewInit, OnDestroy {
  public loading = false;
  public showTable = false;
  public dateRange: Date[] = [];
  public elevationRange = [200, 4000];
  public regions: string[] = [];
  public aspects: string[] = [];
  public observations: GenericObservation[] = [];
  public observationPopup: {
    observation: GenericObservation;
    table: ObservationTableRow[];
    iframe: SafeResourceUrl;
  };
  public activeSources: Record<ObservationSource, boolean> = {} as any;
  public readonly observationColors = ObservationSourceColors;
  public readonly allRegions: RegionProperties[];

  @ViewChild("observationsMap") mapDiv: ElementRef<HTMLDivElement>;

  constructor(
    private translateService: TranslateService,
    private observationsService: ObservationsService,
    private authenticationService: AuthenticationService,
    private sanitizer: DomSanitizer,
    private regionsService: RegionsService,
    private mapService: MapService
  ) {
    Object.keys(ObservationSource).forEach(source => this.activeSources[source] = true);
    this.allRegions = this.regionsService
      .getRegionsEuregio()
      .features.map((f) => f.properties)
      .sort((r1, r2) => r1.id.localeCompare(r2.id));
  }

  ngAfterContentInit() {
    this.loadObservations({ days: 3 });
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

  loadObservations({ days }: { days?: number } = {}) {
    if (typeof days === "number") {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (days - 1));
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setHours(23, 59, 0, 0);
      this.dateRange = [startDate, endDate];
    }
    this.loading = true;
    this.observations.length = 0;
    this.observationsService.startDate = this.dateRange[0];
    this.observationsService.endDate = this.dateRange[1];
    Object.values(this.mapService.observationLayers).forEach((layer) => layer.clearLayers());
    Observable.merge<GenericObservation>(
      this.observationsService.getAvalancheWarningService().catch((err) => this.warnAndContinue("Failed fetching AWS observers", err)),
      this.observationsService.getLawisIncidents().catch((err) => this.warnAndContinue("Failed fetching lawis incidents", err)),
      this.observationsService.getLawisProfiles().catch((err) => this.warnAndContinue("Failed fetching lawis profiles", err)),
      this.observationsService.getLoLaKronos().catch((err) => this.warnAndContinue("Failed fetching LoLaKronos", err)),
      this.observationsService.getLoLaSafety().catch((err) => this.warnAndContinue("Failed fetching LoLa safety observations", err)),
      this.observationsService.getLwdKipObservations().catch((err) => this.warnAndContinue("Failed fetching LWDKIP observations", err)),
      this.observationsService.getWikisnowECT().catch((err) => this.warnAndContinue("Failed fetching Wikisnow ECT", err)),
      this.observationsService.getObservations().catch((err) => this.warnAndContinue("Failed fetching observations", err)),
    )
      .forEach((observation) => this.addObservation(observation))
      .finally(() => (this.loading = false));
  }

  private warnAndContinue(message: string, err: any): Observable<GenericObservation> {
    console.error(message, err);
    return Observable.of();
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
      layers: [this.mapService.observationsMaps.AlbinaBaseMap, this.mapService.observationsMaps.OpenTopoMap, ...Object.values(this.mapService.observationLayers)]
    });

    L.control.scale().addTo(map);
    L.control.layers(this.mapService.observationsMaps, this.mapService.observationLayers, { position: "bottomright" }).addTo(map);

    this.mapService.observationsMap = map;
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

  private addObservation(observation: GenericObservation): void {
    observation.$markerColor = ObservationSourceColors[observation.$source];
    const ll = observation.latitude && observation.longitude ? L.latLng(observation.latitude, observation.longitude) : undefined;
    if (ll) {
      observation.region = this.regionsService.getRegionForLatLng(ll)?.id;
    }
    if (
      !this.activeSources[observation.$source] ||
      !this.observationsService.inDateRange(observation) ||
      !this.observationsService.inMapBounds(observation) ||
      !this.inRegions(observation) ||
      !this.inElevationRange(observation) ||
      !this.inAspects(observation)
    ) {
      return;
    }
    this.observations.push(observation);
    this.observations.sort((o1, o2) => (+o1.eventDate === +o2.eventDate ? 0 : +o1.eventDate < +o2.eventDate ? 1 : -1));

    if (!ll) {
      return;
    }
    L.circleMarker(ll, this.mapService.createObservationMarkerOptions(observation.$markerColor))
      .bindTooltip(observation.locationName)
      .on({ click: () => this.onObservationClick(observation) })
      .addTo(this.mapService.observationLayers[observation.$source]);
  }

  onObservationClick(observation: GenericObservation): void {
    const extraRows = observation.$extraDialogRows ? observation.$extraDialogRows((key) => this.translateService.instant(key)) : [];
    const rows = toObservationTable(observation, (key) => this.translateService.instant(key)); // call toObservationTable after $extraDialogRows
    const table = [...rows, ...extraRows];
    const iframe = observation.$externalURL ? this.sanitizer.bypassSecurityTrustResourceUrl(observation.$externalURL) : undefined;
    this.observationPopup = { observation, table, iframe };
  }

  private inRegions({ region }: GenericObservation) {
    return !this.regions.length || (typeof region === "string" && this.regions.includes(region));
  }

  private inElevationRange({ elevation }: GenericObservation) {
    return elevation === undefined || (this.elevationRange[0] <= elevation && elevation <= this.elevationRange[1]);
  }

  private inAspects({ aspect }: GenericObservation) {
    return !this.aspects.length || (typeof aspect === "string" && this.aspects.includes(aspect.toUpperCase()));
  }

  get showMap(): boolean {
    return !this.showTable;
  }

  set showMap(value: boolean) {
    this.showTable = !value;
  }
}
