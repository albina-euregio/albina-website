import { Component } from "@angular/core";
import { QfaFile } from "./models/qfa-file.model";
import { GetFilenamesService } from "../providers/qfa-service/filenames.service";
import { GetDustParamService } from "app/providers/qfa-service/dust.service";
import { QfaMapService } from '../providers/map-service/qfa-map.service';
import { AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as types from "./types/QFA";

import { Marker, Icon } from "leaflet";
@Component({
  templateUrl: "qfa.component.html",
  styleUrls: ["qfa.component.scss", "table.scss", "params.scss"]
})
export class QfaComponent implements AfterViewInit, OnDestroy {
  qfaPopupVisible = false;
  selectedQfa = {} as types.data;
  displaySelectedQfa = false;
  date = "";
  dates = [];
  parameters = [] as string[];
  parameterClasses = {};
  markers = {
    "bozen": {
      lng: 11.33,
      lat: 46.47
    },
    "innsbruck": {
      lng: 11.35,
      lat: 47.27
    },
    "linz": {
      lng: 12.80,
      lat: 46.83
    }
  } as types.markers;
  parsedFiles = [];
  selectedFile = {};
  selectedFiles = [];
  baseUrl = "https://static.avalanche.report/zamg_qfa/";
  @ViewChild("qfaMap") mapDiv: ElementRef<HTMLDivElement>;

  constructor(
    public filenamesService: GetFilenamesService,
    public dustParamService: GetDustParamService,
    public mapService: QfaMapService,
    private http: HttpClient,
  ) {}

  async ngAfterViewInit() {
    this.mapService.initMaps(this.mapDiv.nativeElement);

    for(const coord of Object.values(this.markers)) {
      this.drawMarker(coord);
    }
  }

  private getCityName(ll: types.coordinates) {
    return Object.keys(this.markers).find(key => this.markers[key] === ll);
  }

  private drawMarker(ll: types.coordinates) {
    const icon = new Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
      iconSize: [25, 41],
      iconAnchor: [12.5, 41]
    });
    const marker = new Marker(ll, {
      icon: icon,
    });

    marker.on("click", () => this.displayRuns(ll));

    marker.options.pane = "markerPane";
    marker.addTo(this.mapService.qfaMap);
  }

  private async displayRuns(ll) {
    this.qfaPopupVisible = true;
    this.displaySelectedQfa = false;
    const city = this.getCityName(ll);
    const filenames = await this.filenamesService.getFilenames(this.baseUrl, city);
    for(const file of filenames) {
      this.parsedFiles.push(this.filenamesService.parseFilename(file.name));
    }
    this.selectedFiles = this.parsedFiles.filter(el => el.startDay === "00");
  }

  private getCellClass(param: string, value: string): string {
    let params = ["N", "Nh", "Nm", "Nl", "N_CU"];
    if(params.includes(this.parameterClasses[param])) {
      const parsedVal = Number(value);
      if (parsedVal >= 7) return "darkest";
      if (parsedVal >= 5) return "darker";
      if (parsedVal >= 3) return "dark";
      if (parsedVal == 0) return "opacity-0";
    }

    params = ["RF_300", "RF_400", "RF_500", "RF_700", "RF_850", "RF_925"];
    if(params.includes(this.parameterClasses[param])) {
      const parsedVal = Number(value);
      if (parsedVal >= 90) return "darkest";
      if (parsedVal >= 80) return "darker";
      if (parsedVal >= 70) return "dark";
    }

    params = ["WX_CUF"];
    if(params.includes(this.parameterClasses[param])) {
      if (value === "NIL") return "opacity-0";
      if (value === "TS") return "yellow";
      if (value === "XXTS") return "orange";
    }

    params = ["SN_RA"];
    if(params.includes(this.parameterClasses[param])) {
      const parsedVal = Number(value);
      if(parsedVal <= 1000) return "sn-rf-color";
    }

    params = ["RR, RR_24h, SN"];
    if(params.includes(this.parameterClasses[param])) {
      if(value === "0.0" || value === "---") return "opacity-0";
    }

    params = ["QANmax"];
    if(params.includes(this.parameterClasses[param])) {
      const parsedVal = Number(value);
      if(parsedVal >= 15) return "orange";
    }

    return "";
  }

  private getWParam(value: string): string {
    const parsedVal = Number(value);
    if (parsedVal <= -1000) return `-----${value}`;
    if (parsedVal <= -25) return `---${value}`;
    if (parsedVal <= -9) return `--${value}`;
    if (parsedVal <= -3) return `-${value}`;
    if (parsedVal <= 3) return value;
    if (parsedVal <= 15) return `+${value}`;
    if (parsedVal <= 30) return `++${value}`;
    if (parsedVal <= 100) return `+++${value}`;
    return `++++${value}`;
  }

  private async showRun(run) {
    this.selectedFile = run;
    const tempQfa = new QfaFile(this.http);
    await tempQfa.loadFromURL(run.filename);
    Promise.all(this.dustParamService.getDustParams())
      .then((values) => {
        console.log(values);
      });
    this.selectedQfa = tempQfa.data;
    this.date = tempQfa.date;
    this.dates = tempQfa.paramDates;
    this.parameters = Object.keys(this.selectedQfa.parameters);
    for(const param of this.parameters) {
      this.parameterClasses[param] = param
        .replace("--", "_")
        .replace(" -", "_")
        .replace(" cm", "")
        .replace(" --", "")
        .replace(" s", "")
        .replace("-", "_")
        .replace(".", "_")
        .replace(" ", "_")
    }
    this.displaySelectedQfa = true;
  }

  ngOnDestroy() {
    if (this.mapService.qfaMap) {
      this.mapService.qfaMap.remove();
      this.mapService.qfaMap = undefined;
    }
  }
}
