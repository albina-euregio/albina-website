import { Component, Input } from "@angular/core";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { BulletinModel } from "../models/bulletin.model";

@Component({
  selector: "app-danger-rating-icon",
  templateUrl: "danger-rating-icon.component.html"
})
export class DangerRatingIconComponent {

  @Input() bulletin: BulletinModel;

  constructor(
    private constantsService: ConstantsService) {
  }

  getForenoonColorAbove() {
    var dangerRating = undefined;
    if (this.bulletin && this.bulletin !== undefined && this.bulletin.getForenoonDangerRatingAbove() && this.bulletin.getForenoonDangerRatingAbove() !== undefined) {
      dangerRating = this.bulletin.getForenoonDangerRatingAbove().toString();
    }
    return this.getDangerRatingColor(dangerRating);
  }

  getForenoonColorBelow() {
    var dangerRating = undefined;
    if (this.bulletin && this.bulletin !== undefined && this.bulletin.getForenoonDangerRatingBelow() && this.bulletin.getForenoonDangerRatingBelow() !== undefined) {
      dangerRating = this.bulletin.getForenoonDangerRatingBelow().toString();
    }
    return this.getDangerRatingColor(dangerRating);
  }

  getAfternoonColorAbove() {
    var dangerRating = undefined;
    if (this.bulletin && this.bulletin !== undefined && this.bulletin.getAfternoonDangerRatingAbove() && this.bulletin.getAfternoonDangerRatingAbove() !== undefined) {
      dangerRating = this.bulletin.getAfternoonDangerRatingAbove().toString();
    }
    return this.getDangerRatingColor(dangerRating);
  }

  getAfternoonColorBelow() {
    var dangerRating = undefined;
    if (this.bulletin && this.bulletin !== undefined && this.bulletin.getAfternoonDangerRatingBelow() && this.bulletin.getAfternoonDangerRatingBelow() !== undefined) {
      dangerRating = this.bulletin.getAfternoonDangerRatingBelow().toString();
    }
    return this.getDangerRatingColor(dangerRating);
  }

  private getDangerRatingColor(dangerRating) {
    return this.constantsService.getDangerRatingColor(dangerRating);
  }
}
