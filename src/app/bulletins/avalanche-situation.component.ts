import { Component, Input } from "@angular/core";
import { SettingsService } from "../providers/settings-service/settings.service";
import { BulletinModel } from "../models/bulletin.model";
import { BulletinDaytimeDescriptionModel } from "../models/bulletin-daytime-description.model";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-avalanche-situation",
  templateUrl: "avalanche-situation.component.html"
})
export class AvalancheSituationComponent {

  @Input() bulletinModel: BulletinModel;
  @Input() bulletinDaytimeDescription: BulletinDaytimeDescriptionModel;
  @Input() afternoon: boolean;
  @Input() disabled: boolean;

  showAspects: boolean;
  avalancheSituationEnum = Enums.AvalancheSituation;

  constructor(
    public settingsService: SettingsService) {
  }

  hasAvalancheSituation(count: number) {
    let avalancheSituation;
    switch (count) {
      case 1:
        avalancheSituation = this.bulletinDaytimeDescription.avalancheSituation1;
        break;
      case 2:
        avalancheSituation = this.bulletinDaytimeDescription.avalancheSituation2;
        break;
      case 3:
        avalancheSituation = this.bulletinDaytimeDescription.avalancheSituation3;
        break;
      case 4:
        avalancheSituation = this.bulletinDaytimeDescription.avalancheSituation4;
        break;
      case 5:
        avalancheSituation = this.bulletinDaytimeDescription.avalancheSituation5;
        break;

      default:
        break;
    }

    if (avalancheSituation !== undefined) {
      return true;
    } else {
      return false;
    }
  }
}
