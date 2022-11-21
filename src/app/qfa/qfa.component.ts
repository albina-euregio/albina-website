import { Component } from "@angular/core";
import { QfaFile } from "./models/qfa-file.model";
import { Markers } from "./models/markers.model";
import { GetQfaFilesService } from "../providers/qfa-service/getQfaFiles.service";
import { OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as types from "./types/QFA";

@Component({
  templateUrl: "qfa.component.html",
  styleUrls: ["qfa.component.scss"]
})
export class QfaComponent implements OnInit {
  qfaPopupVisible = true;
  selectedQfa = {} as types.data;
  date = "";
  dates = [];

  constructor(
    public getQfaFilesService: GetQfaFilesService,
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
    this.selectedQfa = tempQfa.data;
    this.date = tempQfa.date;
    this.dates = tempQfa.paramDates;
  }
}
