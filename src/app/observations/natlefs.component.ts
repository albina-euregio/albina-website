import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Natlefs } from "app/models/natlefs.model";

@Component({
  selector: "app-natlefs",
  templateUrl: "natlefs.component.html"
})
export class NatlefsComponent {

  @Input() natlefs: Natlefs;

  constructor(private translateService: TranslateService) {}

  hasCoordinates() {
    return (
      this.natlefs?.location?.geo?.latitude &&
      this.natlefs?.location?.geo?.longitude
    );
  }

  getSnowConditionsString() {
    return this.natlefs.snowConditions
      .map((c) => this.translateService.instant("snowConditions." + c))
      .join(", ");
  }

  getRodeString() {
    return this.natlefs.rode
      .map((r) => this.translateService.instant("terrainFeature." + r))
      .join(", ");
  }

  getAvoidedString() {
    return this.natlefs.avoided
      .map((t) => this.translateService.instant("terrainFeature." + t))
      .join(", ");
  }

  getAvalancheProblemsString() {
    return this.natlefs.avalancheProblems
      .map((p) => this.translateService.instant("avalancheProblemNatlefs." + p))
      .join(", ");
  }

  getAccuracy() {
    return Math.round(this.natlefs.location.accuracy);
  }
}
