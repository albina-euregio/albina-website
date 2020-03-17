import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SettingsService } from "./providers/settings-service/settings.service";
import { ObservationsService } from "./providers/observations-service/observations.service";


@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: "<router-outlet></router-outlet>"
})
export class AppComponent {
  constructor(
    settingsService: SettingsService,
    observationsService: ObservationsService,
    translate: TranslateService) {
  }
}
