import { Component, OnInit } from "@angular/core";
import { ModellingService, ZamgModelPoint } from "./modelling.service";

@Component({
  templateUrl: "./zamg-models.component.html"
})
export class ZamgModelsComponent implements OnInit {
  modelPoints: ZamgModelPoint[];
  selectedModelPoint: ZamgModelPoint;

  constructor(private modellingService: ModellingService) {}

  ngOnInit() {
    this.modellingService.getZamgModelPoints().subscribe(zamgModelPoints => {
      this.modelPoints = zamgModelPoints;
      this.selectedModelPoint = zamgModelPoints[0];
    });
  }
}
