import { Component, AfterContentInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ObservationsService } from "./observations.service";
import { RegionsService, RegionProperties } from "../providers/regions-service/regions.service";
import { ObservationsMapService } from "../providers/map-service/observations-map.service";
import { GenericObservation, ObservationSource, ObservationSourceColors, ObservationTableRow, toGeoJSON, toObservationTable } from "./models/generic-observation.model";

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

  @ViewChild("observationsMap") mapDiv: ElementRef<HTMLDivElement>;
  @ViewChild("observationTable") observationTableComponent: ObservationTableComponent;

  constructor(
    public filter: ObservationFilterService,
    private translateService: TranslateService,
    private observationsService: ObservationsService,
    private authenticationService: AuthenticationService,
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
    this.initMaps();
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
      .forEach((observation) => this.addObservation(observation))
      .catch((e) => console.error(e))
      .finally(() => (this.loading = false));
  }

  exportObservations() {
    const collection: GeoJSON.FeatureCollection = toGeoJSON(this.observations);
    const json = JSON.stringify(collection, undefined, 2);
    const blob = new Blob([json], {type: 'application/geo+json'});
    saveAs(blob, "observations.geojson");
  }

  private initMaps() {
    const map = new Map(this.mapDiv.nativeElement, {
      zoomAnimation: false,
      zoomControl: false,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      touchZoom: true,
      center: new LatLng(this.authenticationService.getUserLat(), this.authenticationService.getUserLng()),
      zoom: 8,
      minZoom: 4,
      maxZoom: 17,
      layers: [
        ...Object.values(this.mapService.observationsMaps),
        ...Object.values(this.mapService.observationTypeLayers)
      ]
    });

    // this.initLayer(map, this.mapService.observationSourceLayers);
    this.initLayer(map, this.mapService.observationTypeLayers);
    this.mapService.observationsMap = map;
  }

  private initLayer(map: Map, layersObj: Record<string, LayerGroup<any>>) {
    if (this.mapService.USE_CANVAS_LAYER) {
      Object.values(layersObj).forEach((l: any) =>
        l.addOnClickListener((e, data) =>
          this.onObservationClick(data[0].data.observation)
        )
      );
    }

    const layers = new Control.Layers(null, layersObj, { collapsed: false });
    layers.addTo(map);

    // Call the getContainer routine.
    let htmlObject = layers.getContainer();
    // Get the desired parent node.
    let sidebar = document.getElementById("sourcesDiv");
    // Finally append that node to the new parent, recursively searching out and re-parenting nodes.
    sidebar.appendChild(htmlObject);
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
    const ll = observation.latitude && observation.longitude ? new LatLng(observation.latitude, observation.longitude) : undefined;
    if (ll) {
      observation.region = this.regionsService.getRegionForLatLng(ll)?.id;
    }
    if (
      !this.activeSources[observation.$source] ||
      !this.filter.test(observation)
    ) {
      return;
    }
    this.observations.push(observation);
    this.observations.sort((o1, o2) => (+o1.eventDate === +o2.eventDate ? 0 : +o1.eventDate < +o2.eventDate ? 1 : -1));

    if (!ll) {
      this.observationsWithoutCoordinates++;
      return;
    }

    const marker = new Marker(ll, this.mapService.style(observation));
    if (this.mapService.USE_CANVAS_LAYER) {
      // @ts-ignore
      marker.observation = observation;
    } else {
      marker.on("click", () => this.onObservationClick(observation));
    }
    marker.bindTooltip(observation.locationName);
    // marker.addTo(this.mapService.observationSourceLayers[observation.$source]);
    marker.addTo(this.mapService.observationTypeLayers[observation.$type]);
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
