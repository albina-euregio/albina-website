import { Component } from "@angular/core";
import { QfaService } from "../providers/qfa-service/qfa.service";
import { QfaMarkerService } from "../providers/qfa-service/markers.service";
import { GetQfaFilesService } from "../providers/qfa-service/getQfaFiles.service";
import { OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as types from "./types/QFA";

@Component({
  templateUrl: "qfa.component.html"
})
export class QfaComponent implements OnInit {
  qfaPopupVisible = true;
  selectedQfa = {} as types.data;

  constructor(
    public getQfaFilesService: GetQfaFilesService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    const filenames = await this.getQfaFilesService.getFilenames("https://static.avalanche.report/zamg_qfa");
    const markerData = new QfaMarkerService();
    console.log("loading...");
    markerData.load();
    for(const filename of filenames) {
      const qfa = new QfaService(this.http);
      const data = await qfa.loadFromURL(filename);
      markerData.add({
        name: filename,
        coordinates: qfa.coordinates
      });
    }
    markerData.save();
    console.log("done!");
    console.log(markerData.data);
    const tempQfa = new QfaService(this.http);
    this.selectedQfa = await tempQfa.loadFromURL(filenames[0]);
  }
}
