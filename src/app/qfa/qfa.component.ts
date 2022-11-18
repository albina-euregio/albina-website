import { Component } from "@angular/core";
import { QfaService } from "../providers/qfa-service/qfa.service";
import { QfaMarkerService } from "../providers/qfa-service/markers.service";
import { GetQfaFilesService } from "../providers/qfa-service/getQfaFiles.service";
import { OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  templateUrl: "qfa.component.html"
})
export class QfaComponent implements OnInit {

  constructor(
    private qfaService: QfaService,
    private qfaMarkerService: QfaMarkerService,
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
      await qfa.loadFromURL(filename);
      markerData.add({
        name: filename,
        coordinates: qfa.coordinates
      });
    }
    markerData.save();
    console.log("done!");
    console.log(markerData.data);
  }
}
