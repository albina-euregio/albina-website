import { Component } from "@angular/core";
import { QfaFile } from "./models/qfa-file.model";
import { Markers } from "./models/markers.model";
import { GetQfaFilesService } from "../providers/qfa-service/getQfaFiles.service";
import { QfaMapService } from '../providers/map-service/qfa-map.service';
import { OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as types from "./types/QFA";

declare var L: any;
@Component({
  templateUrl: "qfa.component.html",
  styleUrls: ["qfa.component.scss", "table.scss"]
})
export class QfaComponent implements OnInit {
  qfaPopupVisible = true;
  selectedQfa = {} as types.data;
  date = "";
  dates = [];
  parameters = [] as string[];
  parameterClasses = {};
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
    const files = markers.getFilenames({
      lat: 11.33,
      lon: 46.47
    })
    const tempQfa = new QfaFile(this.http);
    console.log(files);
    await tempQfa.loadFromURL(files[0]);
    console.log(files[0]);
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
  }

  ngAfterViewInit() {
    this.mapService.initMaps(this.mapDiv.nativeElement);

    const info = L.control();
    info.onAdd = function() {
      this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
      this.update();
      return this._div;
    };
    // method that we will use to update the control based on feature properties passed
    info.update = function(props) {
      this._div.innerHTML = (props ?
        "<b>" + props.name_de + "</b>" : " ");
    };
    info.addTo(this.mapService.qfaMap);
  }

  ngOnDestroy() {
    if (this.mapService.qfaMap) {
      this.mapService.qfaMap.remove();
      this.mapService.qfaMap = undefined;
    }
  }
}
