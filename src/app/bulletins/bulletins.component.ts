import { Component, HostListener } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { ConstantsService } from '../providers/constants-service/constants.service';
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

  public loadingTrentino: boolean;
  public loadingSouthTyrol: boolean;
  public loadingTyrol: boolean;
  public publishing: Date;
  public copying: boolean;

  constructor(
    private translate: TranslateService,
    private bulletinsService: BulletinsService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private constantsService: ConstantsService,
    private router: Router,
    private confirmationService: ConfirmationService)
  {
    this.dates = new Array<Date>();
    this.loadingTrentino = false;
    this.loadingSouthTyrol = false;
    this.loadingTyrol = false;
    this.copying = false;
    this.publishing = undefined;
  }

  ngOnInit() {
    this.loadingTrentino = true;
    this.loadingSouthTyrol = true;
    this.loadingTyrol = true;

    let observableBatchTrentino = [];
    let observableBatchSouthTyrol = [];
    let observableBatchTyrol = [];

    for (let i = 0; i <= 10; i++) {
      let date = new Date();
      date.setDate(date.getDate() + 3 - i);
      date.setHours(0, 0, 0, 0);
      this.dates.push(date);
    }

    for (let date of this.dates) {
      observableBatchTrentino.push(this.bulletinsService.getStatus(this.constantsService.codeTrentino, date));
      observableBatchSouthTyrol.push(this.bulletinsService.getStatus(this.constantsService.codeSouthTyrol, date));
      observableBatchTyrol.push(this.bulletinsService.getStatus(this.constantsService.codeTyrol, date));
    }

    Observable.forkJoin(observableBatchTrentino).subscribe(
      data => {
        for (var i = this.dates.length - 1; i >= 0; i--)
          this.bulletinsService.statusMapTrentino.set(this.dates[i].getTime(), Enums.BulletinStatus[<string>(<Response>data[i]).json()['status']]);
        this.loadingTrentino = false;
      },
      error => {
        console.error("Status Trentino could not be loaded!");
        this.loadingTrentino = false;
      }
    );

    Observable.forkJoin(observableBatchSouthTyrol).subscribe(
      data => {
        for (var i = this.dates.length - 1; i >= 0; i--)
          this.bulletinsService.statusMapSouthTyrol.set(this.dates[i].getTime(), Enums.BulletinStatus[<string>(<Response>data[i]).json()['status']]);
        this.loadingSouthTyrol = false;
      },
      error => {
        console.error("Status South Tyrol could not be loaded!");
        this.loadingSouthTyrol = false;
      }
    );

    Observable.forkJoin(observableBatchTyrol).subscribe(
      data => {
        for (var i = this.dates.length - 1; i >= 0; i--)
          this.bulletinsService.statusMapTyrol.set(this.dates[i].getTime(), Enums.BulletinStatus[<string>(<Response>data[i]).json()['status']]);
        this.loadingTyrol = false;
      },
      error => {
        console.error("Status Tyrol could not be loaded!");
        this.loadingTyrol = false;
      }
    );
  }

  ngOnDestroy() {
    this.loadingTrentino = false;
    this.loadingSouthTyrol = false;
    this.loadingTyrol = false;
    this.copying = false;
  }

  editBulletin(date: Date, isUpdate: boolean) {
    if (!this.copying) {
      if (isUpdate)
        this.bulletinsService.setIsUpdate(true);
      else
        this.bulletinsService.setIsUpdate(false);

      this.bulletinsService.setActiveDate(date);

      if ((this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.published && !this.bulletinsService.getIsUpdate()) || this.bulletinsService.isLocked(date, this.authenticationService.getUserRegion())) {
        this.bulletinsService.setIsEditable(false);
        this.router.navigate(['/bulletins/new']);
      } else {
        if (this.bulletinsService.getActiveDate() && this.authenticationService.isUserLoggedIn()) {
          let result = this.bulletinsService.lockRegion(this.bulletinsService.getActiveDate(), this.authenticationService.getUserRegion());
  
          this.bulletinsService.setIsEditable(true);
          this.router.navigate(['/bulletins/new']);
        }
      }
    }
  }

  showCaaml(event, date: Date) {
    event.stopPropagation();
    this.bulletinsService.setActiveDate(date);
    this.router.navigate(['/bulletins/caaml']);
  }

  copy(event, date: Date) {
    event.stopPropagation();
    this.copying = true;
    this.bulletinsService.setCopyDate(date);
  }

  paste(event, date: Date) {
    event.stopPropagation();
    this.copying = false;
    this.editBulletin(date, false);
  }

  createUpdate(event, date: Date) {
    event.stopPropagation();
    this.bulletinsService.setCopyDate(date);
    this.editBulletin(date, true);
  }

  publish(event, date: Date) {
    event.stopPropagation();
    this.publishing = date;

    this.bulletinsService.checkBulletins(date, this.authenticationService.getUserRegion()).subscribe(
      data => {
        let result = data.json();

        let message = this.translateService.instant("bulletins.table.publishBulletinsDialog.message") + '<br><br>';

        for (let entry of result) {
          if (entry == 'missingDangerRating')
            message += '- ' + this.translateService.instant("bulletins.table.publishBulletinsDialog.missingDangerRating") + '<br>';
          if (entry == 'missingRegion')
            message += '- ' + this.translateService.instant("bulletins.table.publishBulletinsDialog.missingRegion") + '<br>';
          if (entry == 'duplicateRegion')
            message += '- ' + this.translateService.instant("bulletins.table.publishBulletinsDialog.duplicateRegion") + '<br>';
          if (entry == 'missingAvActivityHighlights')
            message += '- ' + this.translateService.instant("bulletins.table.publishBulletinsDialog.missingAvActivityHighlights") + '<br>';
          if (entry == 'missingAvActivityComment')
            message += '- ' + this.translateService.instant("bulletins.table.publishBulletinsDialog.missingAvActivityComment") + '<br>';
          if (entry == 'pendingSuggestions')
            message += '- ' + this.translateService.instant("bulletins.table.publishBulletinsDialog.pendingSuggestions");
        }

        this.confirmationService.confirm({
          key: "publishBulletinsDialog",
          header: this.translateService.instant("bulletins.table.publishBulletinsDialog.header"),
          message: message,
          accept: () => {
            this.bulletinsService.publishBulletins(date, this.authenticationService.getUserRegion()).subscribe(
              data => {
                console.log("Bulletins published.");
                this.bulletinsService.setUserRegionStatus(date, Enums.BulletinStatus.published);
                this.publishing = undefined;
              },
              error => {
                console.error("Bulletins could not be published!");
                this.confirmationService.confirm({
                  key: "publishBulletinsErrorDialog",
                  header: this.translate.instant("bulletins.table.publishBulletinsErrorDialog.header"),
                  message: this.translate.instant("bulletins.table.publishBulletinsErrorDialog.message"),
                  accept: () => {
                    this.publishing = undefined;
                  }
                });
              }
            );
          },
          reject: () => {
            this.publishing = undefined;
          }
        });
      },
      error => {
        console.error("Bulletins could not be checked!");
        this.confirmationService.confirm({
          key: "checkBulletinsErrorDialog",
          header: this.translate.instant("bulletins.table.checkBulletinsErrorDialog.header"),
          message: this.translate.instant("bulletins.table.checkBulletinsErrorDialog.message"),
          accept: () => {
            this.publishing = undefined;
          }
        });
      }
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.keyCode == 27 && this.copying) {
      this.copying = false;
    }
  }
}
