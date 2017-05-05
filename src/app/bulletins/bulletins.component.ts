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

  public bulletinList: BulletinModel[];
  public bulletinStatus = Enums.BulletinStatus;
  public dates: Date[];

  constructor(
  	private translate: TranslateService,
  	private bulletinsService: BulletinsService,
  	private route: ActivatedRoute,
    private router: Router)
  {
  	this.bulletinList = new Array<BulletinModel>();
    this.dates = new Array<Date>();
    for (let i = 0; i <= 10; i++) {
      let date = new Date();
      date.setDate(date.getDate() + 3 - i)
      this.dates.push(date);
    }

    // TODO use real dates
    let from = new Date();
    from.setDate(from.getDate() - 5);

    let to = new Date();
    to.setDate(to.getDate() + 3);

  	this.bulletinsService.loadBulletins(from, to).subscribe(
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

  createBulletin(date?: Date) {
    this.bulletinsService.reset();

    if (date)
      this.bulletinsService.addBulletins(date);

    this.router.navigate(['/bulletins/new']);
  }

  getStatusTrentino(date: Date) : Enums.BulletinStatus {
    return this.getStatus(date, 'IT-32-TN');
  }

  private getStatus(date: Date, region: string) : Enums.BulletinStatus {
    return this.bulletinsService.getStatus(region, date);
  }
}
