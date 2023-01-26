import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, HostListener } from "@angular/core";
import { BaseMapService } from "../../providers/map-service/base-map.service";
import { AvalancheWarningServiceObservedProfiles, ModellingService, ZamgModelPoint } from "../modelling.service";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import { QfaService } from "app/providers/qfa-service/qfa.service";
import { ParamService } from "app/providers/qfa-service/param.service";
import { CircleMarker, LatLngLiteral } from "leaflet";
import { TranslateService } from "@ngx-translate/core";
import { formatDate } from "@angular/common";

type ModelType = "multimodel" | "eps_ecmwf" | "eps_claef" | "qfa" | "observed_profile";

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
  zamgTypes = ["multimodel", "eps_ecmwf", "eps_claef"] as const;
  fullModelNames = {
    "multimodel": "ZAMG Multimodel",
    "qfa": "QFA",
    "eps_ecmwf": "ZAMG ECMWF-EPS",
    "eps_claef": "ZAMG CLAEF-EPS"
  };
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
    observed_profile: []
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
      name: this.translateService.instant("observationType.Profile")
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
    private translateService: TranslateService
  ) {}

  files = {};

  async ngAfterViewInit() {
    this.initMaps();
    this.files = await this.qfaService.getFiles();
    this.allSources.forEach((source) => {
      this.mapService.addMarkerLayer(source.id);
    });
  }

  async initMaps() {
    this.mapService.initMaps(this.observationsMap.nativeElement, () => {});
    this.mapService.addInfo();
    this.mapService.addControls();

    this.mapService.removeObservationLayers();

    this.zamgTypes.forEach((zamgType) => {
      this.modellingService.getZamgModelPoints({ zamgType }).subscribe((zamgModelPoints) => {
        this.dropDownOptions[zamgType] = zamgModelPoints;
        zamgModelPoints.forEach((point) => {
          const ll: LatLngLiteral = {
            lat: zamgType === "eps_claef" ? point.lat + 0.01 : point.lat,
            lng: zamgType === "eps_claef" ? point.lng - 0.002 : point.lng
          };
          const callback = () => {
            this.selectedModelPoint = point;
            this.selectedModelType = zamgType;
            this.observationPopupVisible = true;
          };
          const tooltip = `${this.fullModelNames[zamgType]}: ${point.regionName}`;
          this.mapService.drawMarker(ll, this.getModelPointOptions(zamgType), zamgType, tooltip, callback);
        });
      });
    });

    this.modellingService.getObservedProfiles().subscribe((profiles) => {
      this.dropDownOptions.observed_profile = profiles.map((profile) => {
        const date = formatDate(profile.eventDate, "yyyy-MM-dd", "de");
        const modelPoint = new ZamgModelPoint(
          profile.$externalURL,
          date,
          profile.locationName,
          [],
          profile.$externalURL,
          profile.latitude,
          profile.longitude
        );
        const ll = { lat: profile.latitude, lng: profile.longitude };
        const callback = () => {
          this.selectedModelPoint = modelPoint;
          this.selectedModelType = "observed_profile";
          this.observationPopupVisible = true;
        };
        const tooltip = `${date}: ${profile.locationName}`;
        this.mapService.drawMarker(ll, this.getModelPointOptions("observed_profile"), "observed_profile", tooltip, callback);
        return modelPoint;
      });
    });

    await this.qfaService.loadDustParams();
    for (const [cityName, coords] of Object.entries(this.qfaService.coords)) {
      const ll = coords as LatLngLiteral;
      const callback = () => {
        this.setQfa(this.files[cityName][0], 0);
        this.selectedModelPoint = undefined;
        this.selectedModelType = "qfa";
        this.observationPopupVisible = true;
      };
      const tooltip = `QFA: ${cityName}`;
      this.mapService.drawMarker(ll, this.getModelPointOptions("qfa"), "qfa", tooltip, callback);
    }
    this.loading = false;
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
      const index = this.dropDownOptions[this.selectedModelType].findIndex((point) => point.id === this.selectedModelPoint.id);
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
