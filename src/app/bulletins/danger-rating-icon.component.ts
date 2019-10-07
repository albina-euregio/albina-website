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
    const dangerRating = this.bulletin.getForenoonDangerRatingAbove().toString();
    return this.getDangerRatingColor(dangerRating);
  }

  getForenoonColorBelow() {
    const dangerRating = this.bulletin.getForenoonDangerRatingBelow().toString();
    return this.getDangerRatingColor(dangerRating);
  }

  getAfternoonColorAbove() {
    const dangerRating = this.bulletin.getAfternoonDangerRatingAbove().toString();
    return this.getDangerRatingColor(dangerRating);
  }

  getAfternoonColorBelow() {
    const dangerRating = this.bulletin.getAfternoonDangerRatingBelow().toString();
    return this.getDangerRatingColor(dangerRating);
  }

  private getDangerRatingColor(dangerRating) {
    return this.constantsService.getDangerRatingColor(dangerRating);
  }
}
