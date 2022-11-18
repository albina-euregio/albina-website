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
    console.log(filenames);
    const qfa = new QfaService(this.http);
    await qfa.loadFromURL(filenames[0]);
    console.log(qfa.data);
  }
}
