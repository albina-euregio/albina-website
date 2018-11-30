import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { SettingsService } from '../providers/settings-service/settings.service';
import { BulletinModel } from '../models/bulletin.model';
import * as Enums from '../enums/enums';

@Component({
	selector: 'bulletin-detail',
  templateUrl: 'bulletin-detail.component.html'
})
export class BulletinDetailComponent {

	@Input() bulletin: BulletinModel;
  @Input() below: boolean;
  @Input() disabled: boolean;

  dangerRating = Enums.DangerRating;

  constructor(
  	private translate: TranslateService,
    public settingsService: SettingsService)
  {
  }
}
