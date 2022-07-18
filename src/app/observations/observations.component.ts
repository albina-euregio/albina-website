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
  toObservationTable,
  LocalFilterTypes,
  ChartsData
} from "./models/generic-observation.model";


import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { saveAs } from "file-saver";

import { Map, LatLng, Control, Marker, LayerGroup } from "leaflet";

import { ObservationTableComponent } from "./observation-table.component";
import { ObservationFilterService } from "./observation-filter.service";
//import { BarChart } from "./charts/bar-chart/bar-chart.component";
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
  public readonly dropdownSettings: IDropdownSettings;
  public selectedItems: [];
  public toMarkerColor = toMarkerColor;
  public chartsData: ChartsData = {Elevation: {}, Aspects: {}, AvalancheProblem: {}, Stability: {}, DangerPattern: {}};

  @ViewChild("observationsMap") mapDiv: ElementRef<HTMLDivElement>;
  @ViewChild("observationTable") observationTableComponent: ObservationTableComponent;


  public get LocalFilterTypes(): typeof LocalFilterTypes {
    return LocalFilterTypes; 
  }

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

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      //itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  ngAfterContentInit() {
    this.filter.days = 3;
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

  onRegionSelect(item: any) {
    this.filter.regions.push(item.id);
  }
  onRegionDeSelect(item: any) {
    this.filter.regions = this.filter.regions.filter(e => e !== item.id);
    console.log("onRegionDeSelect", this.filter.regions);
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
    console.log("loadObservations ##1", this.activeSources);
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
          //console.log("loadObservations ##4", observation); 
          return;
        }
        //console.log("loadObservations ADDDD ##4", observation); 
        this.addObservation(observation)
      })
      .catch((e) => console.error(e))
      .finally(() => {
        this.loading = false;
        this.buildChartsData();
      });
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



  applyLocalFilter(data: any = {}) {
    console.log("applyLocalFilter ##1", data);

    if(data?.type) this.filter.toggleFilter(data);
    //console.log("applyLocalFilter ##2", this.filter.filterSelection);

    Object.values(this.mapService.observationTypeLayers).forEach((layer) => layer.clearLayers());
    this.observations = this.observations.map(observation => {
      observation.filterType = ObservationFilterType.Global;
      //console.log("applyLocalFilter ##3.0", observation.filterType);
      if (this.filter.isSelected(observation)) {
        console.log("applyLocalFilter ##3.1", observation);
        observation.filterType = ObservationFilterType.Local;
      } 
      observation.isHighlighted = this.filter.isHighlighted(observation);

      return observation;
    });

    console.log("applyLocalFilter ##3.99", this.observations);
    this.observations.forEach(observation => {
      const ll = observation.latitude && observation.longitude ? new LatLng(observation.latitude, observation.longitude) : undefined;

      if(!ll) {
        return;
      }
      //if(observation.aspect || observation.elevation) console.log("applyLocalFilter ##3", observation);
      if(observation.filterType === ObservationFilterType.Local || observation.isHighlighted) this.drawMarker(observation, ll);
    });
    this.buildChartsData();
  }

  buildChartsData() {

    this.chartsData.Elevation = this.filter.getElevationDataset(this.observations);

    this.chartsData.Aspects = this.filter.getAspectDataset(this.observations)

    this.chartsData.Stability = this.filter.getStabilityDataset(this.observations)

    this.chartsData.AvalancheProblem = this.filter.getAvalancheProblemDataset(this.observations)

    this.chartsData.DangerPattern = this.filter.getDangerPatternDataset(this.observations)
      
    console.log("buildChartsData", this.chartsData);




  }

  private drawMarker(observation, ll) {
    const styledObservation = observation.isHighlighted ? this.mapService.highlightStyle(observation) : this.mapService.style(observation);
    const marker = new Marker(ll, styledObservation);
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
      !this.filter.isSelected(observation)
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
