import { Component, Input, ViewChild, ElementRef, SimpleChange } from '@angular/core';
import { ConstantsService } from '../providers/constants-service/constants.service';
import { BulletinModel } from '../models/bulletin.model';

@Component({
	selector: 'danger-rating',
  templateUrl: 'danger-rating.component.html'
})
export class DangerRatingComponent {

	@Input() bulletin: BulletinModel;

  constructor(
    private constantsService: ConstantsService)
  {
  }

  getForenoonColorAbove() {
    let dangerRating = this.bulletin.getForenoonDangerRatingAbove().toString();
    return this.getDangerRatingColor(dangerRating);
  }

  getForenoonColorBelow() {
    let dangerRating = this.bulletin.getForenoonDangerRatingBelow().toString();
    return this.getDangerRatingColor(dangerRating);
  }

  getAfternoonColorAbove() {
    let dangerRating = this.bulletin.getAfternoonDangerRatingAbove().toString();
    return this.getDangerRatingColor(dangerRating);
  }

  getAfternoonColorBelow() {
    let dangerRating = this.bulletin.getAfternoonDangerRatingBelow().toString();
    return this.getDangerRatingColor(dangerRating);
  }

  private getDangerRatingColor(dangerRating) {
    return this.constantsService.getDangerRatingColor(dangerRating);
  }
}
