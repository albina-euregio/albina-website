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
    if (this.bulletinElevationDescription.aspects.length == 1) {
      let a : any = Enums.Aspect[this.bulletinElevationDescription.aspects[0]];

      if (a == aspect || a == aspect + 1) {
        for (var i = 0; i < 8; i++) {
          this.bulletinElevationDescription.addAspect(Enums.Aspect[i]);
          document.getElementById(Enums.Aspect[i]).style.fill = "#000000";
          document.getElementById(Enums.Aspect[i]).focus();
        }
      } else {
        for (var i = 0; i < 8; i++) {
          document.getElementById(Enums.Aspect[i]).style.fill = "#FFFFFF";
          document.getElementById(Enums.Aspect[i]).focus();
        }

        let end = (aspect + 1) % 8;
        while (a != end) {
          this.bulletinElevationDescription.addAspect(Enums.Aspect[a]);
          document.getElementById(Enums.Aspect[a]).style.fill = "#000000";
          document.getElementById(Enums.Aspect[a]).focus();
          a = (a + 1) % 8;
        }
      }
    } else {
      this.bulletinElevationDescription.setAspects(new Array<Enums.Aspect>());
      for (var i = 0; i < 8; i++) {
        document.getElementById(Enums.Aspect[i]).style.fill = "#FFFFFF";
        document.getElementById(Enums.Aspect[i]).focus();
      }

      this.bulletinElevationDescription.addAspect(Enums.Aspect[aspect]);
      document.getElementById(Enums.Aspect[aspect]).style.fill = "#000000";
      document.getElementById(Enums.Aspect[aspect]).focus();
    }

    console.log("Aspects:");
    for (let a of this.bulletinElevationDescription.aspects)
      console.log(a);
  }
}
