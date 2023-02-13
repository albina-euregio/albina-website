import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, HostListener } from "@angular/core";
import { BaseMapService } from "app/providers/map-service/base-map.service";
import { ModellingService } from "./modelling.service";
import { QfaResult, QfaService } from "app/providers/qfa-service/qfa.service";
import { ParamService } from "app/providers/qfa-service/param.service";
import { CircleMarker, LatLngLiteral, LatLng } from "leaflet";
import { TranslateService } from "@ngx-translate/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { RegionsService, RegionProperties } from "app/providers/regions-service/regions.service";
import { ForecastSource, GenericObservation } from "app/observations/models/generic-observation.model";
import { formatDate } from "@angular/common";

export interface MultiselectDropdownData {
  id: ForecastSource;
  name: string;
  fillColor: string;
}

@Component({
  templateUrl: "./forecast.component.html",
  styleUrls: ["./qfa.component.scss", "./qfa.table.scss", "./qfa.params.scss"]
})
export class ForecastComponent implements AfterViewInit, OnDestroy {
  layout = "map" as const;
  observationPopupVisible = false;
  selectedModelPoint: GenericObservation;
  selectedModelType: ForecastSource;
  selectedCity: string;
  qfa: QfaResult;
  qfaStartDay: number;
  loading = true;
  dropDownOptions: Record<ForecastSource, GenericObservation<unknown>[]> = {
    multimodel: [],
    meteogram: [],
    qfa: [],
    observed_profile: [],
    alpsolut_profile: []
  };
  public readonly allSources: MultiselectDropdownData[] = [
    {
      id: "multimodel",
      fillColor: "green",
      name: this.translateService.instant("sidebar.modellingZamg")
    },
    {
      id: "meteogram",
      fillColor: "MediumVioletRed",
      name: this.translateService.instant("sidebar.modellingZamgMeteogram")
    },
    {
      id: "qfa",
      fillColor: "red",
      name: this.translateService.instant("sidebar.qfa")
    },
    {
      id: "observed_profile",
      fillColor: "#f8d229",
      name: this.translateService.instant("sidebar.modellingSnowpack")
    },
    {
      id: "alpsolut_profile",
      fillColor: "#d95f0e",
      name: this.translateService.instant("sidebar.modellingSnowpackMeteo")
    }
  ];

  public allRegions: RegionProperties[];
  private regionalMarkers = {};

  private swipeCoord?: [number, number];
  private swipeTime?: number;

  public selectedRegions: any[];
  private selectedSources: string[] = [];
  private modelPoints: GenericObservation[] = [];

  @ViewChild("observationsMap") observationsMap: ElementRef<HTMLDivElement>;
  @ViewChild("qfaSelect") qfaSelect: ElementRef<HTMLSelectElement>;

  constructor(
    private regionsService: RegionsService,
    public mapService: BaseMapService,
    private modellingService: ModellingService,
    private qfaService: QfaService,
    public paramService: ParamService,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService
  ) {}

  files = {};

  ngAfterViewInit() {
    this.allRegions = this.regionsService
      .getRegionsEuregio()
      .features.map((f) => f.properties)
      .sort((r1, r2) => r1.id.localeCompare(r2.id));

    this.allRegions.forEach((region) => {
      this.regionalMarkers[region.id] = [];
    });

    this.initMaps();
    this.mapService.map.on("click", () => {
      this.selectedRegions = this.mapService.getSelectedRegions().map((aRegion) => aRegion.id);
      this.applyFilter();
    });
    this.mapService.addMarkerLayer("forecast");
    this.load();
  }

  async load() {
    this.modelPoints = [];
    this.loading = true;
    this.loadAll();
    await this.loadQfa();
    this.loading = false;
  }

  applyFilter() {
    Object.values(this.mapService.layers).forEach((layer) => layer.clearLayers());

    const filtered = this.modelPoints.filter((el) => {
      const correctRegion = this.selectedRegions.length === 0 || this.selectedRegions.includes(el.region);
      const correctSource = this.selectedSources.length === 0 || this.selectedSources.includes(el.$source);
      return correctRegion && correctSource;
    });

    filtered.forEach((point) => {
      this.drawMarker(point);
    });
  }

  drawMarker(point: GenericObservation) {
    const { $source, region, locationName, latitude, longitude, eventDate } = point;
    const callback = () => {
      if ($source === "qfa") this.setQfa(this.files[locationName][0], 0);
      this.selectedModelPoint = $source === "qfa" ? undefined : point;
      this.selectedModelType = $source as ForecastSource;
      this.observationPopupVisible = true;
    };

    const tooltip = [
      `<i class="fa fa-calendar"></i> ${
        eventDate instanceof Date ? formatDate(eventDate, "yyyy-MM-dd HH:mm", "en-US") : undefined
      }`,
      `<i class="fa fa-asterisk"></i> ${region || undefined}`,
      `<i class="fa fa-globe"></i> ${locationName || undefined}`,
      this.allSources.find((s) => s.id === $source)?.name,
      `<div hidden>${region}</div>`
    ]
      .filter((s) => !/undefined/.test(s))
      .join("<br>");

    const marker = new CircleMarker(
      { lat: latitude, lng: longitude },
      this.getModelPointOptions($source as ForecastSource)
    )
      .on("click", callback)
      .bindTooltip(tooltip);

    const fullSource = this.allSources.find((el) => el.id === $source);
    const attribution = `<span style="color: ${fullSource.fillColor}">●</span> ${fullSource.name}`;
    this.mapService.addMarker(marker, "forecast", attribution);
  }

  loadAll() {
    this.allSources.forEach((source) => {
      if (source.id === "qfa") return;
      this.modellingService.get(source.id).subscribe((points) => {
        this.dropDownOptions[source.id] = points;
        points.forEach((point) => {
          // const region = this.regionsService.getRegionForLatLng(new LatLng(point.latitude, point.lon));
          try {
            this.drawMarker(point);
            this.modelPoints.push(point);
          } catch (e) {
            console.error(e);
          }
        });
      });
    });
  }

  async loadQfa() {
    await this.qfaService.loadDustParams();
    for (const [cityName, coords] of Object.entries(this.qfaService.coords)) {
      const ll = coords as LatLngLiteral;
      const point = {
        $source: "qfa",
        latitude: ll.lat,
        longitude: ll.lng,
        region: this.regionsService.getRegionForLatLng(new LatLng(ll.lat, ll.lng))?.id,
        locationName: cityName
      } as GenericObservation;
      this.drawMarker(point);
      this.modelPoints.push(point);
    }
    this.files = await this.qfaService.getFiles();
  }

  initMaps() {
    this.mapService.initMaps(this.observationsMap.nativeElement, () => {});
    this.mapService.map.on("click", () => {
      this.selectedRegions = this.mapService.getSelectedRegions().map((aRegion) => aRegion.id);
      // this.filterRegions();
    });
    this.mapService.addInfo();
    this.mapService.addControls();

    this.mapService.removeObservationLayers();
  }

  ngOnDestroy() {
    if (this.mapService.map) {
      this.mapService.map.remove();
      this.mapService.map = undefined;
    }
  }

  getModelPointOptions(type: ForecastSource): L.CircleMarkerOptions {
    return {
      radius: 8,
      fillColor: this.allSources.find((s) => s.id === type)?.fillColor,
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    };
  }

  get observationPopupIframe(): SafeResourceUrl {
    if (this.observationPopupVisible && /dashboard.alpsolut.eu/.test(this.selectedModelPoint?.$externalURL)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedModelPoint?.$externalURL);
    }
  }

  onDropdownSelect(type, event) {
    if (type === "source") this.selectedSources = event.value;
    if (type === "regions") {
      this.selectedRegions = event.value;
      this.mapService.clickRegion(event.value);
    }
    this.applyFilter();
  }

  async setQfa(file, startDay = 0) {
    this.qfaStartDay = startDay;
    const fileMap = typeof file === "string" ? { filename: file } : file;
    const city = fileMap.filename.split("_")[3];
    const first = this.files[city][0].filename === fileMap.filename;
    this.qfa = await this.qfaService.getRun(fileMap, startDay, first);
    this.selectedCity = this.qfa.data.metadata.location.split(" ").pop().toLowerCase();
    this.paramService.setParameterClasses(this.qfa.parameters);
  }

  // Source: https://stackoverflow.com/a/44511007/9947071
  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === "start") {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === "end") {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (
        duration < 1000 && //
        Math.abs(direction[0]) > 30 && // Long enough
        Math.abs(direction[0]) > Math.abs(direction[1] * 3)
      ) {
        // Horizontal enough
        const swipe = direction[0] < 0 ? "next" : "previous";
        // Do whatever you want with swipe
        this.changeRun(swipe);
      }
    }
  }

  changeRun(type: "next" | "previous") {
    if (this.selectedModelType === "qfa") {
      const filenames = this.files[this.selectedCity].map((file) => file.filename);
      const index = filenames.indexOf(this.qfa.file.filename);
      if (type === "next") {
        const newIndex = index + 1 < filenames.length - 1 ? index + 1 : 0;
        this.setQfa(filenames[newIndex], 0);
      } else if (type === "previous") {
        const newIndex = index === 0 ? filenames.length - 1 : index - 1;
        this.setQfa(filenames[newIndex], 0);
      }
    } else if (this.selectedModelPoint) {
      const index = this.dropDownOptions[this.selectedModelType].findIndex(
        (point) => point.region === this.selectedModelPoint.region
      );
      if (type === "next") {
        const newIndex = index + 1 < this.dropDownOptions[this.selectedModelType].length - 1 ? index + 1 : 0;
        this.selectedModelPoint = this.dropDownOptions[this.selectedModelType][newIndex];
      } else if (type === "previous") {
        const newIndex = index === 0 ? this.dropDownOptions[this.selectedModelType].length - 1 : index - 1;
        this.selectedModelPoint = this.dropDownOptions[this.selectedModelType][newIndex];
      }
    }
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyBoardEvent(event: KeyboardEvent) {
    if (!this.observationPopupVisible) {
      return;
    }

    if (event.key === "ArrowRight") this.changeRun("next");
    if (event.key === "ArrowLeft") this.changeRun("previous");
  }
}
