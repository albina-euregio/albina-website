import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinElevationDescriptionModel } from '../models/bulletin-elevation-description.model';
import * as Enums from '../enums/enums';

@Component({
	selector: 'bulletin-detail',
  templateUrl: 'bulletin-detail.component.html'
})
export class BulletinDetailComponent {

	@Input() bulletinElevationDescription: BulletinElevationDescriptionModel;
  @Input() title: string;
  @Input() disabled: boolean;

  avalancheProblem = Enums.AvalancheProblem;
  dangerRating = Enums.DangerRating;

  constructor(
  	private translate: TranslateService)
  {
  }

  isDangerRating(dangerRating) {
    if (this.bulletinElevationDescription.dangerRating && this.bulletinElevationDescription.dangerRating.getValue() == dangerRating)
      return true;
    return false;
  }

  selectDangerRating(dangerRating) {
    this.bulletinElevationDescription.setDangerRating(Enums.DangerRating[dangerRating]);
  }

  isAvalancheProblem(problem) {
    if (this.bulletinElevationDescription.avalancheProblem && this.bulletinElevationDescription.avalancheProblem == problem)
      return true;
    return false;
  }

  selectAvalancheProblem(problem) {
    this.bulletinElevationDescription.setAvalancheProblem(Enums.AvalancheProblem[problem]);
  }
}
