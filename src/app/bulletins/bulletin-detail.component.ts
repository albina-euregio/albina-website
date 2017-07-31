import { Component, Input, ViewChild } from '@angular/core';
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
  aspect = Enums.Aspect;

  constructor(
  	private translate: TranslateService)
  {
  }

  ngAfterViewInit() {
    for (let a of this.bulletinElevationDescription.aspects) {
      document.getElementById(a.toString()).style.fill = "#000000";
      document.getElementById(a.toString()).focus();
    }
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

  selectAspect(aspect) {
    if (this.bulletinElevationDescription.containsAspect(Enums.Aspect[aspect])) {
      this.bulletinElevationDescription.removeAspect(Enums.Aspect[aspect]);
      document.getElementById(Enums.Aspect[aspect]).style.fill = "#FFFFFF";
      document.getElementById(Enums.Aspect[aspect]).focus();
    } else {
  		this.bulletinElevationDescription.addAspect(Enums.Aspect[aspect]);
      document.getElementById(Enums.Aspect[aspect]).style.fill = "#000000";
      document.getElementById(Enums.Aspect[aspect]).focus();
    }
  }
}
