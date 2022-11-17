import { Component } from "@angular/core";
import { QfaService } from "../providers/qfa-service/qfa.service";
import { QfaMarkerService } from "../providers/qfa-service/markers.service";
import { GetQfaFilesService } from "../providers/qfa-service/getQfaFiles.service";
import { OnInit } from "@angular/core";
@Component({
  templateUrl: "qfa.component.html"
})
export class QfaComponent implements OnInit {

  constructor(
    private qfaService: QfaService,
    private qfaMarkerService: QfaMarkerService,
    private getQfaFilesService: GetQfaFilesService
  ) {}

  async ngOnInit() {
    const filenames = await this.getQfaFilesService.getFilenames("https://static.avalanche.report/qfa");
    console.log(filenames);
  }
}
