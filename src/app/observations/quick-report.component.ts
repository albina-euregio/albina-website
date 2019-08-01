import { Component, Input, ViewChild, ElementRef, SimpleChange } from "@angular/core";
import { TranslateService } from "@ngx-translate/core/src/translate.service";
import { QuickReportModel } from "../models/quick-report.model";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-quick-report",
  templateUrl: "quick-report.component.html"
})
export class QuickReportComponent {

  @Input() quickReport;

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
    if (this.quickReport && this.quickReport.getInfo() && this.quickReport.getInfo().getLocation() && this.quickReport.getInfo().getLocation() && this.quickReport.getInfo().getLocation().getLatitude() && this.quickReport.getInfo().getLocation().getLongitude()) {
      return true;
    } else {
      return false;
    }
  }

  getSnowConditionsString() {
    let result = "";
    for (let i = this.quickReport.snowConditions.length - 1; i >= 0; i--) {
      result = result + this.translateService.instant("snowConditions." + Enums.SnowConditions[this.quickReport.snowConditions[i]]);
      if (i > 0) {
        result = result + ", ";
      }
    }
    return result;
  }

  getRodeString() {
    let result = "";
    for (let i = this.quickReport.rode.length - 1; i >= 0; i--) {
      result = result + this.translateService.instant("terrainFeature." + Enums.TerrainFeature[this.quickReport.rode[i]]);
      if (i > 0) {
        result = result + ", ";
      }
    }
    return result;
  }

  getAvoidedString() {
    let result = "";
    for (let i = this.quickReport.avoided.length - 1; i >= 0; i--) {
      result = result + this.translateService.instant("terrainFeature." + Enums.TerrainFeature[this.quickReport.avoided[i]]);
      if (i > 0) {
        result = result + ", ";
      }
    }
    return result;
  }

  getAvalancheProblemsString() {
    let result = "";
    for (let i = this.quickReport.avalancheProblems.length - 1; i >= 0; i--) {
      result = result + this.translateService.instant("avalancheProblem." + Enums.AvalancheSituation[this.quickReport.avalancheProblems[i]]);
      if (i > 0) {
        result = result + ", ";
      }
    }
    return result;
  }

  getAccuracy() {
    return Math.round(this.quickReport.getInfo().getLocation().getAccuracy());
  }
}
