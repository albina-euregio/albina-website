import { Component, HostListener, OnInit } from "@angular/core";
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

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    // up arrow
    if (event.keyCode === 38) {
      var newIndex = this.modelPoints.indexOf(this.selectedModelPoint);
      if (newIndex > 0) {
        newIndex -= 1;
      }
      this.selectedModelPoint = this.modelPoints[newIndex];
    // down arrow
    } else if (event.keyCode === 40) {
      var newIndex = this.modelPoints.indexOf(this.selectedModelPoint);
      if (newIndex < this.modelPoints.length - 1) {
        newIndex += 1;
      }
      this.selectedModelPoint = this.modelPoints[newIndex];
    }
  }
}
