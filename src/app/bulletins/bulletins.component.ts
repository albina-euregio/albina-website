import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinsService } from '../providers/mock-service/bulletins.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';

@Component({
  templateUrl: 'bulletins.component.html'
})
export class BulletinsComponent {

  private bulletinList: BulletinModel[];
  bulletinStatus = Enums.BulletinStatus;

  constructor(
  	private translate: TranslateService,
  	private bulletinsService: BulletinsService,
  	private route: ActivatedRoute,
    private router: Router)
  {
  	this.bulletinList = new Array<BulletinModel>();

  	this.bulletinsService.getEuregioBulletins().subscribe(
  	  data => {
        let response = data.json();
        for (let jsonBulletin of response) {
        	this.bulletinList.push(BulletinModel.createFromJson(jsonBulletin));
        }
        this.bulletinList.sort((a, b) : number => {
          if (a.getValidFrom() < b.getValidFrom()) return 1;
          if (a.getValidFrom() > b.getValidFrom()) return -1;
          return 0;
        });
      },
      error => {
        console.error("Bulletins could not be loaded!");
        // TODO
      }
  	);
  }

  createBulletin(item?: BulletinModel) {
    if (item)
      this.bulletinsService.setActiveBulletin(item);
    else
      this.bulletinsService.setActiveBulletin(undefined);
    this.router.navigate(['/bulletins/new']);
  }
}
