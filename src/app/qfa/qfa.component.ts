import { Component } from "@angular/core";
import { QfaFile } from "./models/qfa-file.model";
import { Markers } from "./models/markers.model";
import { GetFilenamesService } from "../providers/qfa-service/get-filenames-service";
import { QfaMapService } from '../providers/map-service/qfa-map.service';
import { OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as types from "./types/QFA";

import { Marker, Icon } from "leaflet";

declare var L: any;
@Component({
  templateUrl: "qfa.component.html",
  styleUrls: ["qfa.component.scss", "table.scss"]
})
export class QfaComponent implements OnInit, OnDestroy {
  qfaPopupVisible = false;
  selectedQfa = {} as types.data;
  displaySelectedQfa = false;
  date = "";
  dates = [];
  parameters = [] as string[];
  parameterClasses = {};
  coordinates =  [] as types.coordinates[];
  markers = {} as types.markers;
  selectedFiles = [] as string[];
  @ViewChild("qfaMap") mapDiv: ElementRef<HTMLDivElement>;

  constructor(
    public getFilenamesService: GetFilenamesService,
    public mapService: QfaMapService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    const filenames = await this.getFilenamesService.getFilenames("https://static.avalanche.report/zamg_qfa");
    const markers = new Markers().markers;
    this.markers = markers;

    this.mapService.initMaps(this.mapDiv.nativeElement);

    for(const coord of this.coordinates) {
      this.drawMarker(coord);
    }
  }

  private drawMarker(ll) {
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

  private displayRuns(ll) {
    this.qfaPopupVisible = true;
    this.displaySelectedQfa = false;
    this.selectedFiles = this.markers.getFilenames(ll);
  }

  private async showRun(run) {
    const tempQfa = new QfaFile(this.http);
    await tempQfa.loadFromURL(run);
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
