import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SettingsService } from "../providers/settings-service/settings.service";
import { BulletinDaytimeDescriptionModel } from "../models/bulletin-daytime-description.model";
import { AvalancheSituationModel } from "../models/avalanche-situation.model";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-avalanche-situation-preview",
  templateUrl: "avalanche-situation-preview.component.html"
})
export class AvalancheSituationPreviewComponent {

  @Input() daytimeDescriptionModel: BulletinDaytimeDescriptionModel;
  @Input() avalancheSituation: AvalancheSituationModel;
  @Input() count: number;
  @Input() check: boolean;
  @Input() disabled: boolean;

  avalancheSituationEnum = Enums.AvalancheSituation;

  constructor(
    public translateService: TranslateService,
    public settingsService: SettingsService) {
  }

  isAvalancheSituation(situation) {
    if (this.avalancheSituation && this.avalancheSituation.avalancheSituation === situation) {
      return true;
    }
    return false;
  }

  hasAspects() {
    if (this.avalancheSituation && this.avalancheSituation.aspects && this.avalancheSituation.aspects.length > 0) {
      true;
    } else {
      false
    }
  }

  isFirst() {
    if (this.count === 1) {
      return true;
    } else {
      return false;
    }
  }

  isLast() {
    switch (this.count) {
      case 1:
        if (this.daytimeDescriptionModel.avalancheSituation2 !== undefined) {
          return false;
        } else {
          return true;
        }
      case 2:
        if (this.daytimeDescriptionModel.avalancheSituation3 !== undefined) {
          return false;
        } else {
          return true;
        }
      case 3:
        if (this.daytimeDescriptionModel.avalancheSituation4 !== undefined) {
          return false;
        } else {
          return true;
        }
      case 4:
        if (this.daytimeDescriptionModel.avalancheSituation5 !== undefined) {
          return false;
        } else {
          return true;
        }
      default:
        return true;
    }
  }

  getElevationLowString() {
    if (this.avalancheSituation && this.avalancheSituation.getTreelineLow()) {
      return this.translateService.instant("bulletins.create.tooltip.treeline")
    } else if (this.avalancheSituation) {
      return this.avalancheSituation.getElevationLow() + "m";
    }
  }

  getElevationHighString() {
    if (this.avalancheSituation && this.avalancheSituation.getTreelineHigh()) {
      return this.translateService.instant("bulletins.create.tooltip.treeline")
    } else if (this.avalancheSituation) {
      return this.avalancheSituation.getElevationHigh() + "m";
    }
  }

  hasElevationHigh() {
    if (this.avalancheSituation && this.avalancheSituation.getTreelineHigh()) {
      return true;
    } else {
      if (this.avalancheSituation && this.avalancheSituation.getElevationHigh() && this.avalancheSituation.getElevationHigh() !== undefined) {
        return true
      } else {
        return false;
      }
    }
  }

  hasElevationLow() {
    if (this.avalancheSituation && this.avalancheSituation.getTreelineLow()) {
      return true;
    } else {
      if (this.avalancheSituation && this.avalancheSituation.getElevationLow() && this.avalancheSituation.getElevationLow() !== undefined) {
        return true
      } else {
        return false;
      }
    }
  }

  getHigherDangerRating() {
    if (this.avalancheSituation && this.avalancheSituation.matrixInformation) {
      const artificialDangerRating = Enums.DangerRating[this.avalancheSituation.matrixInformation.artificialDangerRating];
      const naturalDangerRating = Enums.DangerRating[this.avalancheSituation.matrixInformation.naturalDangerRating];
      if (artificialDangerRating !== undefined) {
        if (naturalDangerRating !== undefined) {
          if (Enums.DangerRating[this.avalancheSituation.matrixInformation.artificialDangerRating] < Enums.DangerRating[this.avalancheSituation.matrixInformation.naturalDangerRating]) {
            return this.avalancheSituation.matrixInformation.naturalDangerRating;
          } else {
            return this.avalancheSituation.matrixInformation.artificialDangerRating;
          }
        } else {
          return this.avalancheSituation.matrixInformation.artificialDangerRating;
        }
      } else {
        if (naturalDangerRating !== undefined) {
          return this.avalancheSituation.matrixInformation.naturalDangerRating
        }
      }
    } else {
      return "missing";
    }
  }

  isDangerRating(dangerRating) {
    if (this.getHigherDangerRating() === dangerRating)
      return true;
    else
      return false;
  }

  deleteAvalancheSituation(event) {
    event.stopPropagation();
    switch (this.count) {
      case 1:
        this.daytimeDescriptionModel.avalancheSituation1 = undefined;
        break;
      case 2:
        this.daytimeDescriptionModel.avalancheSituation2 = undefined;
        break;
      case 3:
        this.daytimeDescriptionModel.avalancheSituation3 = undefined;
        break;
      case 4:
        this.daytimeDescriptionModel.avalancheSituation4 = undefined;
        break;
      case 5:
        this.daytimeDescriptionModel.avalancheSituation5 = undefined;
        break;      
      default:
        break;
    }
  }

  moveUpAvalancheSituation(event) {
    event.stopPropagation();
    switch (this.count) {
      case 2:
        var tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.daytimeDescriptionModel.avalancheSituation1);
        this.daytimeDescriptionModel.avalancheSituation2 = this.avalancheSituation;
        this.daytimeDescriptionModel.avalancheSituation1 = tmpAvalancheSituation;
        break;
      case 3:
        var tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.daytimeDescriptionModel.avalancheSituation2);
        this.daytimeDescriptionModel.avalancheSituation3 = this.avalancheSituation;
        this.daytimeDescriptionModel.avalancheSituation2 = tmpAvalancheSituation;
        break;
      case 4:
        var tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.daytimeDescriptionModel.avalancheSituation3);
        this.daytimeDescriptionModel.avalancheSituation4 = this.avalancheSituation;
        this.daytimeDescriptionModel.avalancheSituation3 = tmpAvalancheSituation;
        break;
      case 5:
        var tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.daytimeDescriptionModel.avalancheSituation4);
        this.daytimeDescriptionModel.avalancheSituation5 = this.avalancheSituation;
        this.daytimeDescriptionModel.avalancheSituation4 = tmpAvalancheSituation;
        break;
      
      default:
        break;
    }    
  }

  moveDownAvalancheSituation(event) {
    debugger
    event.stopPropagation();
    switch (this.count) {
      case 1:
        var tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.daytimeDescriptionModel.avalancheSituation2);
        this.daytimeDescriptionModel.avalancheSituation1 = this.avalancheSituation;
        this.daytimeDescriptionModel.avalancheSituation2 = tmpAvalancheSituation;
        break;
      case 2:
        var tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.daytimeDescriptionModel.avalancheSituation3);
        this.daytimeDescriptionModel.avalancheSituation2 = this.avalancheSituation;
        this.daytimeDescriptionModel.avalancheSituation3 = tmpAvalancheSituation;
        break;
      case 3:
        var tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.daytimeDescriptionModel.avalancheSituation4);
        this.daytimeDescriptionModel.avalancheSituation3 = this.avalancheSituation;
        this.daytimeDescriptionModel.avalancheSituation4 = tmpAvalancheSituation;
        break;
      case 4:
        var tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.daytimeDescriptionModel.avalancheSituation5);
        this.daytimeDescriptionModel.avalancheSituation4 = this.avalancheSituation;
        this.daytimeDescriptionModel.avalancheSituation5 = tmpAvalancheSituation;
        break;
      
      default:
        break;
    }    
  }
}
