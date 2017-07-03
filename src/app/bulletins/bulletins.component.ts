import { Component, HostListener } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
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
  public copying: boolean;
  public copyDate: Date;

  constructor(
    private translate: TranslateService,
    private bulletinsService: BulletinsService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private confirmationService: ConfirmationService)
  {
    this.dates = new Array<Date>();
    this.loading = false;
    this.copying = false;
    this.copyDate = undefined;
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

  ngOnDestroy() {
    this.loading = false;
    this.copying = false;
    this.copyDate = undefined;
  }

  editBulletin(date: Date, copyDate?: Date) {
    if (!this.copying) {
      this.bulletinsService.setActiveDate(date);
      if (this.bulletinsService.statusMap.get(date) === Enums.BulletinStatus.published) {
        this.bulletinsService.setIsEditable(false);
        this.router.navigate(['/bulletins/show']);
      } else {
        this.bulletinsService.setIsEditable(true);
        this.router.navigate(['/bulletins/new']);
      }
    }
  }

  showCaaml(date: Date) {
    this.bulletinsService.setActiveDate(date);
    this.router.navigate(['/bulletins/caaml']);
  }

  copy(event, date: Date) {
    this.copying = true;
    this.bulletinsService.setCopyDate(date);
  }

  paste(event, date: Date) {
    this.copying = false;
    this.editBulletin(date, this.copyDate);
  }

  publish(event, date: Date) {

    event.stopPropagation();

    this.bulletinsService.checkBulletins(date, this.authenticationService.getUserRegion()).subscribe(
      data => {
        // TODO create confirmation message
        let result = data.json();

        let message = this.translateService.instant("bulletins.table.publishBulletinDialog.message") + '<br><br>';

        for (let entry of result) {
          if (entry == 'missingRegion')
            message += '- ' + this.translateService.instant("bulletins.table.publishBulletinDialog.missingRegion") + '<br>';
          if (entry == 'duplicateRegion')
            message += '- ' + this.translateService.instant("bulletins.table.publishBulletinDialog.duplicateRegion") + '<br>';
          if (entry == 'missingAvActivityHighlights')
            message += '- ' + this.translateService.instant("bulletins.table.publishBulletinDialog.missingAvActivityHighlights") + '<br>';
          if (entry == 'missingAvActivityComment')
            message += '- ' + this.translateService.instant("bulletins.table.publishBulletinDialog.missingAvActivityComment") + '<br>';
          if (entry == 'pendingSuggestions')
            message += '- ' + this.translateService.instant("bulletins.table.publishBulletinDialog.pendingSuggestions");
        }

        this.confirmationService.confirm({
          header: this.translateService.instant("bulletins.table.publishBulletinDialog.header"),
          message: message,
          accept: () => {
            this.bulletinsService.publishBulletins(date, this.authenticationService.getUserRegion()).subscribe(
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
      },
      error => {
        console.error("Bulletins could not be checked!");
        debugger
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
