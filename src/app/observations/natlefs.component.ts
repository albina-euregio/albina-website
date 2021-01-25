import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-natlefs",
  templateUrl: "natlefs.component.html"
})
export class NatlefsComponent {

  @Input() natlefs;

  ridingQuality = Enums.RidingQuality;
  snowConditions = Enums.SnowConditions;
  terrainFeature = Enums.TerrainFeature;
  alarmSigns = Enums.AlarmSignsFrequency;
  newSnow = Enums.NewSnow;
  driftingSnow = Enums.DriftingSnow;
  avalanches = Enums.Avalanches;
  penetrationDepth = Enums.PenetrationDepth;
  surfaceSnowWetness = Enums.SurfaceSnowWetness;
  avalancheSituation = Enums.AvalancheSituation;
  tracks = Enums.Tracks;

  constructor(
    private translateService: TranslateService) {
  }

  hasCoordinates() {
    if (this.natlefs && this.natlefs.getInfo() && this.natlefs.getInfo().getLocation() && this.natlefs.getInfo().getLocation() && this.natlefs.getInfo().getLocation().getLatitude() && this.natlefs.getInfo().getLocation().getLongitude()) {
      return true;
    } else {
      return false;
    }
  }

  getSnowConditionsString() {
    let result = "";
    for (let i = this.natlefs.snowConditions.length - 1; i >= 0; i--) {
      result = result + this.translateService.instant("snowConditions." + Enums.SnowConditions[this.natlefs.snowConditions[i]]);
      if (i > 0) {
        result = result + ", ";
      }
    }
    return result;
  }

  getRodeString() {
    let result = "";
    for (let i = this.natlefs.rode.length - 1; i >= 0; i--) {
      result = result + this.translateService.instant("terrainFeature." + Enums.TerrainFeature[this.natlefs.rode[i]]);
      if (i > 0) {
        result = result + ", ";
      }
    }
    return result;
  }

  getAvoidedString() {
    let result = "";
    for (let i = this.natlefs.avoided.length - 1; i >= 0; i--) {
      result = result + this.translateService.instant("terrainFeature." + Enums.TerrainFeature[this.natlefs.avoided[i]]);
      if (i > 0) {
        result = result + ", ";
      }
    }
    return result;
  }

  getAvalancheProblemsString() {
    let result = "";
    for (let i = this.natlefs.avalancheProblems.length - 1; i >= 0; i--) {
      result = result + this.translateService.instant("avalancheProblem." + Enums.AvalancheSituation[this.natlefs.avalancheProblems[i]]);
      if (i > 0) {
        result = result + ", ";
      }
    }
    return result;
  }

  getAccuracy() {
    return Math.round(this.natlefs.getInfo().getLocation().getAccuracy());
  }
}
