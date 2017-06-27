import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';
import 'rxjs/add/observable/forkJoin';

@Component({
  templateUrl: 'bulletins.component.html'
})
export class BulletinsComponent {

  public bulletinStatus = Enums.BulletinStatus;

  public dates: Date[];

  public loading: boolean;

  constructor(
    private translate: TranslateService,
    private bulletinsService: BulletinsService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router,
    private confirmationService: ConfirmationService)
  {
    this.dates = new Array<Date>();
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;

    let observableBatch = [];

    for (let i = 0; i <= 10; i++) {
      let date = new Date();
      date.setDate(date.getDate() + 3 - i);
      date.setHours(0, 0, 0, 0);
      this.dates.push(date);
      observableBatch.push(this.bulletinsService.getStatus("IT-32-TN", date));
    }

    Observable.forkJoin(observableBatch).subscribe(
      data => {
        for (var i = this.dates.length - 1; i >= 0; i--)
          this.bulletinsService.statusMap.set(this.dates[i], Enums.BulletinStatus[<string>(<Response>data[i]).json()['status']]);
        this.loading = false;
      },
      error => {
        console.error("Status could not be loaded!");
        this.loading = false;
      }
    );
  }

  editBulletin(date: Date) {
    this.bulletinsService.setActiveDate(date);
    if (this.bulletinsService.statusMap.get(date) === Enums.BulletinStatus.published)
      this.bulletinsService.setIsEditable(false);
    else
      this.bulletinsService.setIsEditable(true);
    this.router.navigate(['/bulletins/new']);
  }

  showCaaml(date: Date) {
    this.bulletinsService.setActiveDate(date);
    this.router.navigate(['/bulletins/caaml']);
  }

  publish(event, date: Date) {

    // TODO check if all values are set

    event.stopPropagation();

    this.confirmationService.confirm({
      header: this.translateService.instant("bulletins.table.publishBulletinDialog.header"),
      message: this.translateService.instant("bulletins.table.publishBulletinDialog.message"),
      accept: () => {
        this.bulletinsService.publishBulletins(date).subscribe(
          data => {
            console.log("Bulletins published.");
            this.bulletinsService.statusMap.set(date, Enums.BulletinStatus.published);
          },
          error => {
            console.error("Bulletins could not be published!");
          }
        );
      },
      reject: () => {
      }
    });
  }
}
