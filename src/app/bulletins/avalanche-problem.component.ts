import { Component, Input } from "@angular/core";
import { SettingsService } from "../providers/settings-service/settings.service";
import { BulletinModel } from "../models/bulletin.model";
import { BulletinDaytimeDescriptionModel } from "../models/bulletin-daytime-description.model";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-avalanche-problem",
  templateUrl: "avalanche-problem.component.html"
})
export class AvalancheProblemComponent {

  @Input() bulletinModel: BulletinModel;
  @Input() bulletinDaytimeDescription: BulletinDaytimeDescriptionModel;
  @Input() afternoon: boolean;
  @Input() disabled: boolean;

  showAspects: boolean;
  avalancheProblemEnum = Enums.AvalancheProblem;

  constructor(
    public settingsService: SettingsService) {
  }

  hasAvalancheProblem(count: number) {
    let avalancheProblem;
    switch (count) {
      case 1:
        avalancheProblem = this.bulletinDaytimeDescription.avalancheProblem1;
        break;
      case 2:
        avalancheProblem = this.bulletinDaytimeDescription.avalancheProblem2;
        break;
      case 3:
        avalancheProblem = this.bulletinDaytimeDescription.avalancheProblem3;
        break;
      case 4:
        avalancheProblem = this.bulletinDaytimeDescription.avalancheProblem4;
        break;
      case 5:
        avalancheProblem = this.bulletinDaytimeDescription.avalancheProblem5;
        break;

      default:
        break;
    }

    if (avalancheProblem !== undefined) {
      return true;
    } else {
      return false;
    }
  }
}
