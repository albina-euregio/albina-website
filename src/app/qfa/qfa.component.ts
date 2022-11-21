import { Component } from "@angular/core";
import { QfaFile } from "./models/qfa-file.model";
import { Markers } from "./models/markers.model";
import { GetQfaFilesService } from "../providers/qfa-service/getQfaFiles.service";
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
  qfaPopupVisible = true;
  selectedQfa = {} as types.data;
  date = "";
  dates = [];
  parameters = [] as string[];
  parameterClasses = {};
  coordinates =  [] as types.coordinates[];
  @ViewChild("qfaMap") mapDiv: ElementRef<HTMLDivElement>;

  constructor(
    public getQfaFilesService: GetQfaFilesService,
    public mapService: QfaMapService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    const filenames = await this.getQfaFilesService.getFilenames("https://static.avalanche.report/zamg_qfa");
    const markers = new Markers();
    markers.load();
    console.log("loading...");
    for(const filename of filenames) {
      const qfa = new QfaFile(this.http);
      await qfa.loadFromURL(filename);
      markers.add({
        name: filename,
        coordinates: qfa.coordinates
      });
    }
    console.log("done");
    markers.save();
    this.coordinates = markers.coordinates;
    const files = markers.getFilenames({
      lng: 11.33,
      lat: 46.47
    })
    const tempQfa = new QfaFile(this.http);
    await tempQfa.loadFromURL(files[0]);
    this.selectedQfa = tempQfa.data;
    //prevent alphabetical sorting
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

    this.date = tempQfa.date;
    this.dates = tempQfa.paramDates;

    this.mapService.initMaps(this.mapDiv.nativeElement);

    for(const coord of this.coordinates) {
      this.drawMarker(coord);
    }
  }

  private drawMarker(ll) {
    const icon = new Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
      iconSize: [25, 41],
    });
    const marker = new Marker(ll, {
      icon: icon
    });

    marker.options.pane = "markerPane";
    marker.addTo(this.mapService.qfaMap);
  }

  ngOnDestroy() {
    if (this.mapService.qfaMap) {
      this.mapService.qfaMap.remove();
      this.mapService.qfaMap = undefined;
    }
  }
}
