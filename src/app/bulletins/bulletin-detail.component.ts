import { Component, Input } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinElevationDescriptionModel } from '../models/bulletin-elevation-description.model';
import * as Enums from '../enums/enums';

@Component({
	selector: 'bulletin-detail',
  templateUrl: 'bulletin-detail.component.html'
})
export class BulletinDetailComponent {

	@Input()
  bulletinElevationDescription: BulletinElevationDescriptionModel;

  @Input()
  title: string;

  constructor(
  	private translate: TranslateService)
  {
  }

  ngOnInit() {
  }
}
