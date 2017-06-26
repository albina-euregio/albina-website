import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';

@Component({
  templateUrl: 'bulletins.component.html'
})
export class BulletinsComponent {

  public bulletinList: BulletinModel[];
  public bulletinStatus = Enums.BulletinStatus;

  public dates: Date[];
  public statusMap: Map<Date, Enums.BulletinStatus>;

  public loading: boolean;

  constructor(
    private translate: TranslateService,
    private bulletinsService: BulletinsService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router,
    private confirmationService: ConfirmationService)
  {
    this.bulletinList = new Array<BulletinModel>();
    this.dates = new Array<Date>();
    this.statusMap = new Map<Date, Enums.BulletinStatus>();
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    for (let i = 0; i <= 10; i++) {
      let date = new Date();
      date.setDate(date.getDate() + 3 - i);
      date.setHours(0, 0, 0, 0);
      this.dates.push(date);
      this.bulletinsService.getStatus("IT-32-TN", date).subscribe(
        data => {
          let response = data.json();
          this.statusMap.set(date, Enums.BulletinStatus[<string>response.status]);
          this.loading = false;
        },
        error => {
          console.error("Status could not be loaded!");
          this.loading = false;
        }
      );
    }
  }

  editBulletin(date: Date) {
    this.bulletinsService.setActiveDate(date);
    if (this.statusMap.get(date) === Enums.BulletinStatus.published)
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
    // TODO implement
    // disable row
    // check if all values are set
    // set status of all bulletins to published

    event.stopPropagation();
    this.confirmationService.confirm({
      header: this.translateService.instant("bulletins.table.publishingErrorDialog.header"),
      message: this.translateService.instant("bulletins.table.publishingErrorDialog.message"),
      accept: () => {
      }
    });
  }
}
