import { Component } from "@angular/core";
import { QfaFile } from "./models/qfa-file.model";
import { GetFilenamesService } from "../providers/qfa-service/filenames.service";
import { GetDustParamService } from "../providers/qfa-service/dust.service";
import { ParamService } from "../providers/qfa-service/param.service";
import { BaseMapService } from '../providers/map-service/base-map.service';
import { AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as types from "./types/QFA";

import { Marker, Icon, LatLngLiteral } from "leaflet";
@Component({
  templateUrl: "qfa.component.html",
  styleUrls: ["qfa.component.scss", "table.scss", "params.scss"]
})
export class QfaComponent implements AfterViewInit, OnDestroy {
  qfaPopupVisible = false;
  selectedQfa = {} as types.data;
  displaySelectedQfa = false;
  date = "";
  isLatestRun = false;
  dates = [];
  parameters = [] as string[];
  city = "";

  markers = {
    "bozen": {
      lng: 11.33,
      lat: 46.47
    },
    "innsbruck": {
      lng: 11.35,
      lat: 47.27
    },
    "lienz": {
      lng: 12.80,
      lat: 46.83
    }
  } as types.markers;
  parsedFiles = [];
  selectedFile = {};
  selectedFiles = [];
  baseUrl = "https://static.avalanche.report/zamg_qfa/";
  dustParams = {};
  selectedDayIndex = 0;
  @ViewChild("qfaMap") mapDiv: ElementRef<HTMLDivElement>;

  constructor(
    public filenamesService: GetFilenamesService,
    public dustParamService: GetDustParamService,
    public paramService: ParamService,
    public mapService: BaseMapService,
    private http: HttpClient,
  ) {}

  async ngAfterViewInit() {
    this.mapService.initMaps(this.mapDiv.nativeElement, () => {});

    for(const coord of Object.values(this.markers)) {
      this.mapService.drawMarker(coord, this.displayRuns, {first: true}, this);
    }

    const dustParams = this.dustParamService.getDustParams();
    for(const city of Object.keys(dustParams)) {
      Promise.all(dustParams[city])
        .then((rgbs: number[][]) => {
          const paramDays = [];
          const paramDay = [];
          for(let i = 0; i < rgbs.length; i+=4) {
            paramDay.push(rgbs.slice(i, i+4));
          }

          for(let i = 0; i < paramDay.length; i+=3) {
            paramDays.push(paramDay.slice(i, i+3));
          }
          this.dustParams[city] = paramDays;
        })
    }
  }

  private getCityName(ll: types.coordinates) {
    return Object.keys(this.markers).find(key => this.markers[key] === ll);
  }

  private async displayRuns(ll: types.coordinates, params) {
    this.qfaPopupVisible = true;
    this.displaySelectedQfa = false;
    const city = this.getCityName(ll);
    this.city = city;
    const filenames = await this.filenamesService.getFilenames(this.baseUrl, city);
    this.parsedFiles = [];
    for(const file of filenames) {
      const parsedFile = this.filenamesService.parseFilename(file.name);
      this.parsedFiles.push(parsedFile);
    }
    this.selectedFiles = this.parsedFiles.filter(el => el.startDay === "00");

    if(params.first) this.showRun(this.selectedFiles[0], 0);
  }

  private async resetRun() {
    this.displaySelectedQfa = false;
    this.selectedQfa = {} as types.data;
    this.selectedDayIndex = 0;
    this.selectedFile["startDay"] = "00";
  }

  private async showRun(run, startDayIndex: number) {
    this.selectedQfa = {} as types.data;
    this.selectedDayIndex = startDayIndex;
    this.selectedFile = run;
    const tempQfa = new QfaFile(this.http);
    await tempQfa.loadFromURL(run.filename);
    this.selectedQfa = tempQfa.data;

    this.date = tempQfa.date;
    const today = new Date()
    const date = new Intl.DateTimeFormat("de", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
      timeZoneName: "short"
    })
    const stringDate = date.format(today)
      .replace(/\./, "")
      .replace(" um", ",");
    this.isLatestRun = stringDate === this.date;

    this.dates = tempQfa.paramDates;
    this.parameters = Object.keys(this.selectedQfa.parameters);
    this.paramService.setParameterClasses(this.parameters);
    this.displaySelectedQfa = true;
  }

  ngOnDestroy() {
    if (this.mapService.map) {
      this.mapService.map.remove();
      this.mapService.map = undefined;
    }
  }
}
