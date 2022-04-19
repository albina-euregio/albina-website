import { Component, AfterContentInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ObservationsService } from "./observations.service";
import { RegionsService, RegionProperties } from "../providers/regions-service/regions.service";
import { ObservationsMapService } from "../providers/map-service/observations-map.service";
import {
  GenericObservation,
  ObservationFilterType,
  ObservationSource,
  ObservationSourceColors,
  ObservationTableRow,
  toGeoJSON,
  toMarkerColor,
  toObservationTable
} from "./models/generic-observation.model";

import { saveAs } from "file-saver";

import { Map, LatLng, Control, Marker, LayerGroup } from "leaflet";

import { ObservationTableComponent } from "./observation-table.component";
import { ObservationFilterService } from "./observation-filter.service";
@Component({
  templateUrl: "observations.component.html"
})
export class ObservationsComponent implements AfterContentInit, AfterViewInit, OnDestroy {
  public loading = false;
  public showTable = false;
  public observations: GenericObservation[] = [];
  public observationsWithoutCoordinates: number = 0;
  public observationPopup: {
    observation: GenericObservation;
    table: ObservationTableRow[];
    iframe: SafeResourceUrl;
  };
  public activeSources: Record<ObservationSource, boolean> = {} as any;
  public readonly observationColors = ObservationSourceColors;
  public readonly allRegions: RegionProperties[];
  public toMarkerColor = toMarkerColor;

  @ViewChild("observationsMap") mapDiv: ElementRef<HTMLDivElement>;
  @ViewChild("observationTable") observationTableComponent: ObservationTableComponent;

  constructor(
    public filter: ObservationFilterService,
    private translateService: TranslateService,
    private observationsService: ObservationsService,
    private sanitizer: DomSanitizer,
    private regionsService: RegionsService,
    public mapService: ObservationsMapService
  ) {
    Object.keys(ObservationSource).forEach(source => this.activeSources[source] = true);
    this.allRegions = this.regionsService
      .getRegionsEuregio()
      .features.map((f) => f.properties)
      .sort((r1, r2) => r1.id.localeCompare(r2.id));
  }

  ngAfterContentInit() {
    this.filter.days = 7;
  }

  ngAfterViewInit() {
    this.mapService.initMaps(this.mapDiv.nativeElement, o => this.onObservationClick(o));
    this.loadObservations();
  }

  ngOnDestroy() {
    if (this.mapService.observationsMap) {
      this.mapService.observationsMap.remove();
      this.mapService.observationsMap = undefined;
    }
  }

  onSidebarChange(e: Event) {
    if (e.type === "opening") {
      this.showTable = false;
    }
  }

  newObservation() {
    this.showTable = true;
    this.observationTableComponent.newObservation();
  }

  loadObservations({ days }: { days?: number } = {}) {
    this.observationsWithoutCoordinates = 0;
    if (typeof days === "number") {
      this.filter.days = days;
    }
    this.loading = true;
    this.observations.length = 0;
    // Object.values(this.mapService.observationSourceLayers).forEach((layer) => layer.clearLayers());
    Object.values(this.mapService.observationTypeLayers).forEach((layer) => layer.clearLayers());
    this.observationsService.loadAll()
      .forEach((observation) => {

        if (!this.activeSources[observation.$source] ||
          !this.filter.inDateRange(observation)) {
          return;
        }
        this.addObservation(observation)
      })
      .catch((e) => console.error(e))
      .finally(() => (this.loading = false));
  }

  exportObservations() {
    const collection: GeoJSON.FeatureCollection = toGeoJSON(this.observations);
    const json = JSON.stringify(collection, undefined, 2);
    const blob = new Blob([json], {type: 'application/geo+json'});
    saveAs(blob, "observations.geojson");
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

  applyLocalFilter() {
    Object.values(this.mapService.observationTypeLayers).forEach((layer) => layer.clearLayers());
    this.observations = this.observations.map(observation => {
      observation.filterType = ObservationFilterType.Global;
      if (this.filter.test(observation)) {
        observation.filterType = ObservationFilterType.Local;
      }

      return observation;
    });

    this.observations.forEach(observation => {
      const ll = observation.latitude && observation.longitude ? new LatLng(observation.latitude, observation.longitude) : undefined;

      if(!ll) {
        return;
      }

      this.drawMarker(observation, ll);
    });
  }

  private drawMarker(observation, ll) {
    const marker = new Marker(ll, this.mapService.style(observation));
    if (this.mapService.USE_CANVAS_LAYER) {
      // @ts-ignore
      marker.observation = observation;
    } else {
      marker.on("click", () => this.onObservationClick(observation));
    }
    marker.bindTooltip(observation.locationName + " " + observation.filterType);
    // marker.addTo(this.mapService.observationSourceLayers[observation.$source]);
    marker.addTo(this.mapService.observationTypeLayers[observation.$type]);
  }

  private addObservation(observation: GenericObservation): void {
    const ll = observation.latitude && observation.longitude ? new LatLng(observation.latitude, observation.longitude) : undefined;
    observation.filterType = ObservationFilterType.Local;

    if (ll) {
      observation.region = this.regionsService.getRegionForLatLng(ll)?.id;
    }
    if (
      !this.activeSources[observation.$source] ||
      !this.filter.test(observation)
    ) {
      observation.filterType = ObservationFilterType.Global;
    }
    this.observations.push(observation);
    this.observations.sort((o1, o2) => (+o1.eventDate === +o2.eventDate ? 0 : +o1.eventDate < +o2.eventDate ? 1 : -1));

    if (!ll) {
      this.observationsWithoutCoordinates++;
      return;
    }

    this.drawMarker(observation, ll);
  }

  onObservationClick(observation: GenericObservation): void {
    if (observation.$externalURL) {
      const iframe = this.sanitizer.bypassSecurityTrustResourceUrl(observation.$externalURL);
      this.observationPopup = { observation, table: [], iframe };
    } else {
      const extraRows = observation.$extraDialogRows ? observation.$extraDialogRows((key) => this.translateService.instant(key)) : [];
      const rows = toObservationTable(observation, (key) => this.translateService.instant(key)); // call toObservationTable after $extraDialogRows
      const table = [...rows, ...extraRows];
      this.observationPopup = { observation, table, iframe: undefined };
    }
  }
}
