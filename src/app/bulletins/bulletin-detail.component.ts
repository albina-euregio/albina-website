import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SettingsService } from "../providers/settings-service/settings.service";
import { BulletinModel } from "../models/bulletin.model";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-bulletin-detail",
  templateUrl: "bulletin-detail.component.html"
})
export class BulletinDetailComponent {

  @Input() bulletin: BulletinModel;
  @Input() below: boolean;
  @Input() disabled: boolean;

  dangerRating = Enums.DangerRating;

  constructor(
    private translate: TranslateService,
    public settingsService: SettingsService) {
  }
}
