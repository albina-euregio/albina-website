import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';

@Component({
  templateUrl: 'bulletins.component.html'
})
export class BulletinsComponent {

  private bulletinsService : BulletinsService;

  constructor(
  	translate: TranslateService,
  	bulletinsService: BulletinsService)
  {
  	this.bulletinsService = bulletinsService;
  }


}
