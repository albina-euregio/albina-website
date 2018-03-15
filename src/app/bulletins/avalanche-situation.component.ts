import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { SettingsService } from '../providers/settings-service/settings.service';
import { AvalancheSituationModel } from '../models/avalanche-situation.model';
import * as Enums from '../enums/enums';

@Component({
  selector: 'avalanche-situation',
  templateUrl: 'avalanche-situation.component.html'
})
export class AvalancheSituationComponent {

  @Input() avalancheSituationModel: AvalancheSituationModel;
  @Input() disabled: boolean;

  avalancheSituationEnum = Enums.AvalancheSituation;

  constructor(
    private translate: TranslateService,
    public settingsService: SettingsService)
  {
  }

  isAvalancheSituation(situation) {
    if (this.avalancheSituationModel && this.avalancheSituationModel.avalancheSituation == situation)
      return true;
    return false;
  }

  selectAvalancheSituation(situation) {
    this.avalancheSituationModel.setAvalancheSituation(Enums.AvalancheSituation[situation]);
  }
}
