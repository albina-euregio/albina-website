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
  public statusMap: Map<Date, Enums.BulletinStatus>;

  constructor(
    private translate: TranslateService,
    private bulletinsService: BulletinsService,
    private route: ActivatedRoute,
    private router: Router)
  {
    this.bulletinList = new Array<BulletinModel>();
    this.dates = new Array<Date>();
    this.statusMap = new Map<Date, Enums.BulletinStatus>();
  }

  ngOnInit() {
    for (let i = 0; i <= 10; i++) {
      let date = new Date();
      date.setDate(date.getDate() + 3 - i);
      date.setHours(17, 0, 0, 0);
      this.dates.push(date);
      this.bulletinsService.getStatus("IT-32-TN", date).subscribe(
        data => {
          let response = data.json();
          this.statusMap.set(date, Enums.BulletinStatus[<string>response.status]);
        },
        error => {
          console.error("Status could not be loaded!");
        }
      );
    }
  }

  editBulletin(date: Date) {
    this.bulletinsService.setActiveDate(date);
    let test = this.statusMap.get(date);
    debugger
    if (this.statusMap.get(date) === Enums.BulletinStatus.published)
      this.bulletinsService.setIsEditable(false);
    else
      this.bulletinsService.setIsEditable(true);
    this.router.navigate(['/bulletins/new']);
  }
}
