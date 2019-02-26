import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { SettingsService } from './providers/settings-service/settings.service';
import { ObservationsService } from './providers/observations-service/observations.service';


@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
	constructor(
    settingsService: SettingsService,
    observationsService: ObservationsService,
    translate: TranslateService)
  {
  }
}