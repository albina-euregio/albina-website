import { Component, AfterContentInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ObservationsService } from "./observations.service";
import { RegionsService, RegionProperties } from "../providers/regions-service/regions.service";
import { ObservationsMapService } from "../providers/map-service/observations-map.service";
import { GenericObservation, ObservationSource, ObservationSourceColors, ObservationTableRow, ObservationType, toObservationTable } from "./models/generic-observation.model";

import { saveAs } from "file-saver";

import { Map, LatLng, Control, Marker, LayerGroup } from "leaflet";

import { ObservationTableComponent } from "./observation-table.component";
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
    this.days = 7;
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

  set days(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 0, 0);
    this.dateRange = [startDate, endDate];
  }

  loadObservations({ days }: { days?: number } = {}) {
    this.observationsWithoutCoordinates = 0;
    if (typeof days === "number") {
      this.days = days;
    }
    this.loading = true;
    this.observations.length = 0;
    // Object.values(this.mapService.observationSourceLayers).forEach((layer) => layer.clearLayers());
    Object.values(this.mapService.observationTypeLayers).forEach((layer) => layer.clearLayers());
    this.observationsService.loadAll(this.dateRange[0], this.dateRange[1])
      .forEach((observation) => this.addObservation(observation))
      .catch((e) => console.error(e))
      .finally(() => (this.loading = false));
  }

  exportObservations() {
    const features = this.observations.map(
      (o): GeoJSON.Feature => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [o.longitude ?? 0.0, o.latitude ?? 0.0, o.elevation ?? 0.0]
        },
        properties: {
          ...o,
          ...(o.$data || {}),
          $data: undefined
        }
      })
    );
    const collection: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features
    };
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
      layers: [this.mapService.observationsMaps.AlbinaBaseMap, this.mapService.observationsMaps.OpenTopoMap, ...Object.values(this.mapService.observationTypeLayers)]
    });

    // add data source controls
    Object.keys(ObservationSource).forEach(source => {
      if (!this.mapService.USE_CANVAS_LAYER) return;
      this.mapService.observationSourceLayers[source].addOnClickListener(function (e, data) {
        data[0].data.component.onObservationClick(data[0].data.observation)
      });
    });

    const layers = new Control.Layers(null, this.mapService.observationSourceLayers, { collapsed: false });
    layers.addTo(map);

    // Call the getContainer routine.
    let htmlObject = layers.getContainer();
    // Get the desired parent node.
    let a = document.getElementById("sourcesDiv");

    // Finally append that node to the new parent, recursively searching out and re-parenting nodes.
    function setParent(el, newParent) {
        newParent.appendChild(el);
    }
    setParent(htmlObject, a);

    // add data type controls
    Object.keys(ObservationType).forEach(type => {
      if (!this.mapService.USE_CANVAS_LAYER) return;
      this.mapService.observationTypeLayers[type].addOnClickListener(function (e, data) {
        data[0].data.component.onObservationClick(data[0].data.observation)
      });
    });

    const types = new Control.Layers(null, this.mapService.observationTypeLayers, { collapsed: false });
    types.addTo(map);

    // Call the getContainer routine.
    htmlObject = types.getContainer();
    // Get the desired parent node.
    a = document.getElementById("typesDiv");

    setParent(htmlObject, a);
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
    const ll = observation.latitude && observation.longitude ? new LatLng(observation.latitude, observation.longitude) : undefined;
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
      this.observationsWithoutCoordinates++;
      return;
    }

    const marker = new Marker(ll, this.mapService.style(observation));
    if (this.mapService.USE_CANVAS_LAYER) {
      // @ts-ignore
      marker.observation = observation;
      // @ts-ignore
      marker.component = this;
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

  private inRegions({ region }: GenericObservation) {
    return !this.regions.length || (typeof region === "string" && this.regions.includes(region));
  }

  private inElevationRange({ elevation }: GenericObservation) {
    return elevation === undefined || (this.elevationRange[0] <= elevation && elevation <= this.elevationRange[1]);
  }

  private inAspects({ aspect }: GenericObservation) {
    return !this.aspects.length || (typeof aspect === "string" && this.aspects.includes(aspect.toUpperCase()));
  }
}
