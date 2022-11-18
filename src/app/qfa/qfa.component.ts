import { Component } from "@angular/core";
import { QfaService } from "../providers/qfa-service/qfa.service";
import { QfaMarkerService } from "../providers/qfa-service/markers.service";
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

  constructor(
    public getQfaFilesService: GetQfaFilesService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    const filenames = await this.getQfaFilesService.getFilenames("https://static.avalanche.report/zamg_qfa");
    const markerData = new QfaMarkerService();
    markerData.load();
    for(const filename of filenames) {
      const qfa = new QfaService(this.http);
      await qfa.loadFromURL(filename);
      markerData.add({
        name: filename,
        coordinates: qfa.coordinates
      });
    }
    markerData.save();
    const files = markerData.getFilenames({
      lat: 11.33,
      lon: 46.47
    })
    const tempQfa = new QfaService(this.http);
    console.log(files);
    await tempQfa.loadFromURL(files[0]);
    this.selectedQfa = tempQfa.data;
  }
}
