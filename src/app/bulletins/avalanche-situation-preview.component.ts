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

  @Input() bulletinDaytimeDescription: BulletinDaytimeDescriptionModel;
  @Input() avalancheSituation: AvalancheSituationModel;
  @Input() count: number;
  @Input() check: boolean;
  @Input() disabled: boolean;

  avalancheSituationEnum = Enums.AvalancheSituation;
  directionEnum = Enums.Direction;

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
      return true;
    } else {
      return false
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
        if (this.bulletinDaytimeDescription.avalancheSituation2 !== undefined) {
          return false;
        } else {
          return true;
        }
      case 2:
        if (this.bulletinDaytimeDescription.avalancheSituation3 !== undefined) {
          return false;
        } else {
          return true;
        }
      case 3:
        if (this.bulletinDaytimeDescription.avalancheSituation4 !== undefined) {
          return false;
        } else {
          return true;
        }
      case 4:
        if (this.bulletinDaytimeDescription.avalancheSituation5 !== undefined) {
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

  deleteAvalancheSituation(event) {
    event.stopPropagation();
    switch (this.count) {
      case 1:
        this.bulletinDaytimeDescription.setAvalancheSituation1(undefined);
        break;
      case 2:
        this.bulletinDaytimeDescription.setAvalancheSituation2(undefined);
        break;
      case 3:
        this.bulletinDaytimeDescription.setAvalancheSituation3(undefined);
        break;
      case 4:
        this.bulletinDaytimeDescription.setAvalancheSituation4(undefined);
        break;
      case 5:
        this.bulletinDaytimeDescription.setAvalancheSituation5(undefined);
        break;
      default:
        break;
    }
    this.reorderAvalancheSituation(this.count);
  }

  reorderAvalancheSituation(count) {
    for (let i = count; i <= 4; i++) {
      switch (i) {
        case 1:
          if (this.bulletinDaytimeDescription.avalancheSituation2) {
            this.bulletinDaytimeDescription.setAvalancheSituation1(new AvalancheSituationModel(this.bulletinDaytimeDescription.avalancheSituation2));
          } else {
            this.bulletinDaytimeDescription.setAvalancheSituation1(undefined);
          }
          break;
        case 2:
          if (this.bulletinDaytimeDescription.avalancheSituation3) {
            this.bulletinDaytimeDescription.setAvalancheSituation2(new AvalancheSituationModel(this.bulletinDaytimeDescription.avalancheSituation3));
          } else {
            this.bulletinDaytimeDescription.setAvalancheSituation2(undefined);
          }
          break;
        case 3:
          if (this.bulletinDaytimeDescription.avalancheSituation4) {
            this.bulletinDaytimeDescription.setAvalancheSituation3(new AvalancheSituationModel(this.bulletinDaytimeDescription.avalancheSituation4));
          } else {
            this.bulletinDaytimeDescription.setAvalancheSituation3(undefined);
          }
          break;
        case 4:
          if (this.bulletinDaytimeDescription.avalancheSituation5) {
            this.bulletinDaytimeDescription.setAvalancheSituation4(new AvalancheSituationModel(this.bulletinDaytimeDescription.avalancheSituation5));
          } else {
            this.bulletinDaytimeDescription.setAvalancheSituation4(undefined);
          }
          break;
        default:
          break;
      }
    }
    this.bulletinDaytimeDescription.updateDangerRating();
  }

  moveUpAvalancheSituation(event) {
    event.stopPropagation();
    let tmpAvalancheSituation = undefined;
    switch (this.count) {
      case 2:
        tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.bulletinDaytimeDescription.avalancheSituation1);
        this.bulletinDaytimeDescription.setAvalancheSituation2(this.avalancheSituation);
        this.bulletinDaytimeDescription.setAvalancheSituation1(tmpAvalancheSituation);
        break;
      case 3:
        tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.bulletinDaytimeDescription.avalancheSituation2);
        this.bulletinDaytimeDescription.setAvalancheSituation3(this.avalancheSituation);
        this.bulletinDaytimeDescription.setAvalancheSituation2(tmpAvalancheSituation);
        break;
      case 4:
        tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.bulletinDaytimeDescription.avalancheSituation3);
        this.bulletinDaytimeDescription.setAvalancheSituation4(this.avalancheSituation);
        this.bulletinDaytimeDescription.setAvalancheSituation3(tmpAvalancheSituation);
        break;
      case 5:
        tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.bulletinDaytimeDescription.avalancheSituation4);
        this.bulletinDaytimeDescription.setAvalancheSituation5(this.avalancheSituation);
        this.bulletinDaytimeDescription.setAvalancheSituation4(tmpAvalancheSituation);
        break;

      default:
        break;
    }
    this.bulletinDaytimeDescription.updateDangerRating();
  }

  moveDownAvalancheSituation(event) {
    event.stopPropagation();
    let tmpAvalancheSituation = undefined;
    switch (this.count) {
      case 1:
        tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.bulletinDaytimeDescription.avalancheSituation2);
        this.bulletinDaytimeDescription.setAvalancheSituation1(this.avalancheSituation);
        this.bulletinDaytimeDescription.setAvalancheSituation2(tmpAvalancheSituation);
        break;
      case 2:
        tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.bulletinDaytimeDescription.avalancheSituation3);
        this.bulletinDaytimeDescription.setAvalancheSituation2(this.avalancheSituation);
        this.bulletinDaytimeDescription.setAvalancheSituation3(tmpAvalancheSituation);
        break;
      case 3:
        tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.bulletinDaytimeDescription.avalancheSituation4);
        this.bulletinDaytimeDescription.setAvalancheSituation3(this.avalancheSituation);
        this.bulletinDaytimeDescription.setAvalancheSituation4(tmpAvalancheSituation);
        break;
      case 4:
        tmpAvalancheSituation = new AvalancheSituationModel(this.avalancheSituation);
        this.avalancheSituation = new AvalancheSituationModel(this.bulletinDaytimeDescription.avalancheSituation5);
        this.bulletinDaytimeDescription.setAvalancheSituation4(this.avalancheSituation);
        this.bulletinDaytimeDescription.setAvalancheSituation5(tmpAvalancheSituation);
        break;

      default:
        break;
    }
    this.bulletinDaytimeDescription.updateDangerRating();
  }

  isDangerRatingDirection(dir) {
    if (this.avalancheSituation && this.avalancheSituation.getDangerRatingDirection() === dir) {
      return true;
    }
    return false;
  }

  setDangerRatingDirection(event, dir: string) {
    event.stopPropagation();
    this.avalancheSituation.setDangerRatingDirection(Enums.Direction[dir]);
    this.bulletinDaytimeDescription.updateDangerRating();
  }
}