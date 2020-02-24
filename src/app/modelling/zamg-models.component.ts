import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { ModellingService, ZamgModelPoint } from "./modelling.service";

@Component({
  templateUrl: "./zamg-models.component.html"
})
export class ZamgModelsComponent implements OnInit, AfterViewInit {
  modelPoints: ZamgModelPoint[];
  selectedModelPoint: ZamgModelPoint;

  @ViewChild("select") select;

  constructor(private modellingService: ModellingService) {}

  ngOnInit() {
    this.modellingService.getZamgModelPoints().subscribe(zamgModelPoints => {
      this.modelPoints = zamgModelPoints;
      this.selectedModelPoint = zamgModelPoints[0];
    });
  }

  ngAfterViewInit() {
    this.select.nativeElement.focus();
  }
}
