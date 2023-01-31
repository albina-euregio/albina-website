import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, HostListener } from "@angular/core";
import { BaseMapService } from "../../providers/map-service/base-map.service";
import { ModellingService, ZamgModelPoint } from "../modelling.service";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import { QfaService } from "app/providers/qfa-service/qfa.service";
import { ParamService } from "app/providers/qfa-service/param.service";
import { CircleMarker, LatLngLiteral } from "leaflet";
import { TranslateService } from "@ngx-translate/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

type ModelType = "multimodel" | "eps_ecmwf" | "eps_claef" | "qfa" | "observed_profile" | "alpsolut_profile";

export interface MultiselectDropdownData {
  id: ModelType;
  name: string;
  fillColor: string;
}

@Component({
  templateUrl: "./forecast.component.html",
  styleUrls: ["./qfa.component.scss", "./table.scss", "./params.scss"]
})
export class ForecastComponent implements AfterViewInit, OnDestroy {
  layout = "map" as const;
  observationPopupVisible = false;
  selectedModelPoint: ZamgModelPoint;
  selectedModelType: ModelType;
  selectedCity: string;
  visibleLayers: string[] = [];
  qfa: any;
  qfaStartDay: number;
  loading = true;
  dropDownOptions: Record<ModelType, any[]> = {
    multimodel: [],
    qfa: [],
    eps_ecmwf: [],
    eps_claef: [],
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
      id: "qfa",
      fillColor: "red",
      name: this.translateService.instant("sidebar.qfa")
    },
    {
      id: "eps_ecmwf",
      fillColor: this.constantsService.colorBrand,
      name: this.translateService.instant("sidebar.modellingZamgECMWF")
    },
    {
      id: "eps_claef",
      fillColor: "violet",
      name: this.translateService.instant("sidebar.modellingZamgCLAEF")
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

  @ViewChild("observationsMap") observationsMap: ElementRef<HTMLDivElement>;
  @ViewChild("qfaSelect") qfaSelect: ElementRef<HTMLSelectElement>;

  constructor(
    public mapService: BaseMapService,
    private modellingService: ModellingService,
    private constantsService: ConstantsService,
    private qfaService: QfaService,
    private paramService: ParamService,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService
  ) {}

  files = {};

  ngAfterViewInit() {
    this.initMaps();
    this.load();
    this.allSources.forEach((source) => {
      this.mapService.addMarkerLayer(source.id);
    });
  }

  async load() {
    this.mapService.removeMarkerLayers();
    this.loading = true;
    this.loadAll();
    await this.loadQfa();
    this.loading = false;
  }

  loadAll() {
    this.allSources.forEach((source) => {
      if (source.id === "qfa") return;
      this.modellingService.get(source.id).subscribe((points) => {
        this.dropDownOptions[source.id] = points;
        points.forEach((point) => {
          const ll: LatLngLiteral = {
            lat:
              source.id === "eps_claef" ? point.lat + 0.01 : source.id === "eps_ecmwf" ? point.lat - 0.01 : point.lat,
            lng:
              source.id === "eps_claef" ? point.lng - 0.002 : source.id === "eps_ecmwf" ? point.lng + 0.002 : point.lng
          };
          const callback = () => {
            this.selectedModelPoint = point;
            this.selectedModelType = source.id;
            this.observationPopupVisible = true;
          };
          const tooltip = [
            `<i class="fa fa-asterisk"></i> ${point.regionCode || undefined}`,
            `<i class="fa fa-globe"></i> ${point.regionName || undefined}`,
            this.allSources.find((s) => s.id === source.id)?.name
          ]
            .filter((s) => !/undefined/.test(s))
            .join("<br>");
          const marker = new CircleMarker(ll, this.getModelPointOptions(source.id))
            .on("click", callback)
            .bindTooltip(tooltip);
          const attribution = `<span style="color: ${source.fillColor}">●</span> ${source.name}`;
          this.mapService.addMarker(marker, source.id, attribution);
          if (this.visibleLayers.includes(source.id) || this.visibleLayers.length === 0)
            this.mapService.addMarkerLayer(source.id);
        });
      });
    });
  }

  async loadQfa() {
    await this.qfaService.loadDustParams();
    for (const [cityName, coords] of Object.entries(this.qfaService.coords)) {
      const ll = coords as LatLngLiteral;
      const callback = () => {
        this.setQfa(this.files[cityName][0], 0);
        this.selectedModelPoint = undefined;
        this.selectedModelType = "qfa";
        this.observationPopupVisible = true;
      };
      const tooltip = `<i class="fa fa-globe"></i> ${cityName}<br>QFA`;
      const marker = new CircleMarker(ll, this.getModelPointOptions("qfa")).on("click", callback).bindTooltip(tooltip);
      this.mapService.addMarker(marker, "qfa");
    }
    this.files = await this.qfaService.getFiles();
    if (this.visibleLayers.includes("qfa") || this.visibleLayers.length === 0) this.mapService.addMarkerLayer("qfa");
  }

  initMaps() {
    this.mapService.initMaps(this.observationsMap.nativeElement, () => {});
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

  getModelPointOptions(type: ModelType): L.CircleMarkerOptions {
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
    if (this.observationPopupVisible && /dashboard.alpsolut.eu/.test(this.selectedModelPoint?.plotUrl)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedModelPoint?.plotUrl);
    }
  }

  onDropdownSelect(event) {
    this.visibleLayers = event.value;
    this.mapService.removeMarkerLayers();
    if (this.visibleLayers.length) {
      this.visibleLayers.forEach((layerName) => {
        this.mapService.addMarkerLayer(layerName);
      });
    } else {
      this.allSources.forEach((source) => {
        this.mapService.addMarkerLayer(source.id);
      });
    }
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

  @HostListener("document:keydown", ["$event"])
  handleKeyBoardEvent(event: KeyboardEvent) {
    if (!this.observationPopupVisible) {
      return;
    }
    if (this.selectedModelType === "qfa") {
      const filenames = this.files[this.selectedCity].map((file) => file.filename);
      const index = filenames.indexOf(this.qfa.file.filename);
      if (event.key === "ArrowRight") {
        const newIndex = index + 1 < filenames.length - 1 ? index + 1 : 0;
        this.setQfa(filenames[newIndex], 0);
      } else if (event.key === "ArrowLeft") {
        const newIndex = index === 0 ? filenames.length - 1 : index - 1;
        this.setQfa(filenames[newIndex], 0);
      }
    } else if (this.selectedModelPoint) {
      const index = this.dropDownOptions[this.selectedModelType].findIndex(
        (point) => point.id === this.selectedModelPoint.id
      );
      if (event.key === "ArrowRight") {
        const newIndex = index + 1 < this.dropDownOptions[this.selectedModelType].length - 1 ? index + 1 : 0;
        this.selectedModelPoint = this.dropDownOptions[this.selectedModelType][newIndex];
      } else if (event.key === "ArrowLeft") {
        const newIndex = index === 0 ? this.dropDownOptions[this.selectedModelType].length - 1 : index - 1;
        this.selectedModelPoint = this.dropDownOptions[this.selectedModelType][newIndex];
      }
    }
  }
}