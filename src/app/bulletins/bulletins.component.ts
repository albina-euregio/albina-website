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

    // TODO sommerzeit/winterzeit?
    let from = new Date();
    from.setDate(from.getDate() - 5);
    from.setHours(17, 0, 0);

    let to = new Date();
    to.setDate(to.getDate() + 3);
    to.setHours(17, 0, 0);
  }

  ngOnInit() {
    for (let i = 0; i <= 10; i++) {
      let date = new Date();
      date.setDate(date.getDate() + 3 - i)
      date.setHours(17, 0, 0);
      this.dates.push(date);
    }
  }

  editBulletin(date: Date) {
    this.bulletinsService.setActiveDate(date);
    this.router.navigate(['/bulletins/new']);
  }

  getStatusTrentino(date: Date) : Enums.BulletinStatus {
    return this.getStatus(date, 'IT-32-TN');
  }

  private getStatus(date: Date, region: string) : Enums.BulletinStatus {
    return this.bulletinsService.getStatus(region, date);
  }
}
