import { Component, Input } from "@angular/core";
import { BulletinDaytimeDescriptionModel } from "../models/bulletin-daytime-description.model";
import { SettingsService } from "../providers/settings-service/settings.service";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-danger-rating",
  templateUrl: "danger-rating.component.html"
})
export class DangerRatingComponent {

  dangerRating = Enums.DangerRating;

  @Input() bulletinDaytimeDescription: BulletinDaytimeDescriptionModel;
  @Input() below: boolean;
  @Input() disabled: boolean;

  constructor(
    public settingsService: SettingsService) {
  }

  isDangerRating(dangerRating) {
    if (this.below) {
      if (this.bulletinDaytimeDescription.dangerRatingBelow && this.bulletinDaytimeDescription.dangerRatingBelow === dangerRating) {
        return true;
      }
      return false;
    } else {
      if (this.bulletinDaytimeDescription.dangerRatingAbove && this.bulletinDaytimeDescription.dangerRatingAbove === dangerRating) {
        return true;
      }
      return false;
    }
  }

  selectDangerRating(dangerRating) {
    if (this.below) {
      this.bulletinDaytimeDescription.setDangerRatingBelow(Enums.DangerRating[dangerRating]);
    } else {
      this.bulletinDaytimeDescription.setDangerRatingAbove(Enums.DangerRating[dangerRating]);
    }
  }
}
