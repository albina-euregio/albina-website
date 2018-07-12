import { Component, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { ConstantsService } from '../providers/constants-service/constants.service';
import { SocketService } from '../providers/socket-service/socket.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';
import 'rxjs/add/observable/forkJoin';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalSubmitComponent } from './modal-submit.component';
import { ModalPublishComponent } from './modal-publish.component';

@Component({
  templateUrl: 'bulletins.component.html'
})
export class BulletinsComponent {

  public bulletinStatus = Enums.BulletinStatus;

  public dates: Date[];

  public loading: boolean;
  public publishing: Date;
  public copying: boolean;

  public publishBulletinsModalRef: BsModalRef;
  @ViewChild('publishBulletinsTemplate') publishBulletinsTemplate: TemplateRef<any>;

  public publishBulletinsErrorModalRef: BsModalRef;
  @ViewChild('publishBulletinsErrorTemplate') publishBulletinsErrorTemplate: TemplateRef<any>;

  public submitBulletinsModalRef: BsModalRef;
  @ViewChild('submitBulletinsTemplate') submitBulletinsTemplate: TemplateRef<any>;

  public submitBulletinsErrorModalRef: BsModalRef;
  @ViewChild('submitBulletinsErrorTemplate') submitBulletinsErrorTemplate: TemplateRef<any>;

  public checkBulletinsErrorModalRef: BsModalRef;
  @ViewChild('checkBulletinsErrorTemplate') checkBulletinsErrorTemplate: TemplateRef<any>;

  public config = {
    keyboard: true,
    class: 'modal-sm'
  };

  constructor(
    private translate: TranslateService,
    private bulletinsService: BulletinsService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private constantsService: ConstantsService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private socketService: SocketService,
    private modalService: BsModalService)
  {
    this.dates = new Array<Date>();
    this.loading = false;
    this.copying = false;
    this.publishing = undefined;

    this.socketService.getSocket().on('bulletinUpdate', function(data) {
      console.log("SocketIO bulletin update event recieved: " + data);
      let json = JSON.parse(data)
      let region = json.region;
      if (region === this.authenticationService.getUserRegion())
        this.bulletinsService.statusMap.set(new Date(json.date).getTime(), Enums.BulletinStatus[json.status]);
    }.bind(this));
  }

  ngOnInit() {
    this.loading = true;

    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);
    endDate.setHours(0, 0, 0, 0);

    for (let i = 0; i <= 10; i++) {
      let date = new Date();
      date.setDate(date.getDate() + 3 - i);
      date.setHours(0, 0, 0, 0);
      this.dates.push(date);
    }

    this.bulletinsService.getStatus(this.authenticationService.getUserRegion(), startDate, endDate).subscribe(
      data => {
        let json = data.json();
        for (var i = json.length - 1; i >= 0; i--) 
          this.bulletinsService.statusMap.set(Date.parse(json[i].date), Enums.BulletinStatus[<string>json[i].status]);
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
  }

  isPast(date: Date) {
    let today = new Date();
    let hours = today.getHours();
    today.setHours(0,0,0,0);

    if (today.getTime() > date.getTime())
      return true;
    return false;
  }

  isToday(date: Date) {
    if (date != undefined) {
      let today = new Date();
      let hours = today.getHours();
      today.setHours(0, 0, 0, 0);
      if (today.getTime() == date.getTime())
        return true;
      if (hours >= 17) {
        today.setDate(today.getDate() + 1);
        if (today.getTime() == date.getTime())
          return true;
      }
    }
    return false;
  }

  showCreateButton(date) {
    if ((!this.isPast(date)) && 
        (!this.publishing || this.publishing.getTime() != date.getTime()) && 
        (
          this.bulletinsService.getUserRegionStatus(date) == this.bulletinStatus.missing
        ) && 
        !this.copying)
      return true;
    else
      return false;
  }

  showCopyButton(date) {
    if ((!this.publishing || this.publishing.getTime() != date.getTime()) && 
        this.bulletinsService.getUserRegionStatus(date) && 
        this.bulletinsService.getUserRegionStatus(date) != this.bulletinStatus.missing && 
        !this.copying && 
        !this.loading)
      return true;
    else
      return false;
  }

  showPasteButton(date) {
    if ((!this.publishing || this.publishing.getTime() != date.getTime()) && 
        this.bulletinsService.getUserRegionStatus(date) != this.bulletinStatus.published && 
        this.bulletinsService.getUserRegionStatus(date) != this.bulletinStatus.republished && 
        this.bulletinsService.getUserRegionStatus(date) != this.bulletinStatus.submitted && 
        this.bulletinsService.getUserRegionStatus(date) != this.bulletinStatus.resubmitted && 
        this.copying && 
        this.bulletinsService.getCopyDate() != date && 
        !this.isPast(date) && 
        !this.isToday(date))
      return true;
    else
      return false;
  }

  showSubmitButton(date) {
    if (/*!this.isPast(date) && */
        (!this.publishing || this.publishing.getTime() != date.getTime()) && 
        (
          this.bulletinsService.getUserRegionStatus(date) == this.bulletinStatus.draft || 
          this.bulletinsService.getUserRegionStatus(date) == this.bulletinStatus.updated
        ) && 
        !this.copying)
      return true;
    else
      return false;
  }

  showPublishButton(date) {
    if ((!this.publishing || this.publishing.getTime() != date.getTime()) && 
        (this.isToday(date) || this.isPast(date)) && 
        (
          this.bulletinsService.getUserRegionStatus(date) == this.bulletinStatus.resubmitted ||
          this.bulletinsService.getUserRegionStatus(date) == this.bulletinStatus.submitted
        ) &&
        !this.copying)
      return true;
    else
      return false;
  }

  showSpinningIconButton(date) {
    if (!this.copying && 
        this.publishing && 
        this.publishing.getTime() == date.getTime())
      return true;
    else
      return false;
  }

  showCaamlButton(date) {
    if ((!this.publishing || this.publishing.getTime() != date.getTime()) && 
        !this.copying)
      return true;
    else
      return false;
  }

  showJsonButton(date) {
    if ((!this.publishing || this.publishing.getTime() != date.getTime()) && 
        !this.copying)
      return true;
    else
      return false;
  }

  showEditButton(date) {
    if (/*(!this.isPast(date) ) && */
        (!this.publishing || this.publishing.getTime() != date.getTime()) && 
        (
          this.bulletinsService.getUserRegionStatus(date) == this.bulletinStatus.published || 
          this.bulletinsService.getUserRegionStatus(date) == this.bulletinStatus.republished
        ) && 
        !this.copying)
      return true;
    else
      return false;
  }

  showUpdateButton(date) {
    if (/*(!this.isPast(date)) &&*/
        (this.isToday(date) || this.isPast(date)) && 
        (!this.publishing || this.publishing.getTime() != date.getTime()) && 
        (
          this.bulletinsService.getUserRegionStatus(date) == this.bulletinStatus.published || 
          this.bulletinsService.getUserRegionStatus(date) == this.bulletinStatus.republished ||
          this.bulletinsService.getUserRegionStatus(date) == this.bulletinStatus.missing
        ) && 
        !this.copying)
      return true;
    else
      return false;
  }

  isOwnRegion(region) {
    let userRegion = this.authenticationService.getUserRegion();
    if (userRegion && userRegion != undefined)
      return this.authenticationService.getUserRegion().startsWith(region);
    else
      return false;
  }

  editBulletin(date: Date, isUpdate: boolean) {
    if (this.authenticationService.getUserRegion() && this.authenticationService.getUserRegion() != undefined) {
      if (!this.copying) {
        if (isUpdate)
          this.bulletinsService.setIsUpdate(true);
        else
          this.bulletinsService.setIsUpdate(false);

        this.bulletinsService.setActiveDate(date);

        if (!this.isEditable(date) && !isUpdate) {
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
    } else {
      this.bulletinsService.setActiveDate(date);
      this.bulletinsService.setIsUpdate(false);
      this.bulletinsService.setIsEditable(false);
      this.router.navigate(['/bulletins/new']);
    }
  }

  showBulletin(date: Date) {
    if (!this.copying) {
      this.bulletinsService.setIsUpdate(false);
      this.bulletinsService.setActiveDate(date);
      this.bulletinsService.setIsEditable(false);
      this.router.navigate(['/bulletins/new']);
    }
  }

  isEditable(date) {
    if (
        (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.published && !this.bulletinsService.getIsUpdate()) || 
        (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.republished && !this.bulletinsService.getIsUpdate()) || 
        this.bulletinsService.isLocked(date, this.authenticationService.getUserRegion()) || 
        this.isPast(date) ||
        this.isToday(date))
      return false;
    else
      return true;
  }

  showCaaml(event, date: Date) {
    event.stopPropagation();
    this.bulletinsService.setActiveDate(date);
    this.router.navigate(['/bulletins/caaml']);
  }

  showJson(event, date: Date) {
    event.stopPropagation();
    this.bulletinsService.setActiveDate(date);
    this.router.navigate(['/bulletins/json']);
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
    this.editBulletin(date, true);
  }

  /*
    Create a small change in the bulletin, no new publication
  */
  edit(event, date: Date) {
    event.stopPropagation();

    this.bulletinsService.setActiveDate(date);

    if (this.bulletinsService.isLocked(date, this.authenticationService.getUserRegion())) {
      this.bulletinsService.setIsEditable(false);
      this.router.navigate(['/bulletins/new']);
    } else {
      if (this.bulletinsService.getActiveDate() && this.authenticationService.isUserLoggedIn()) {
        let result = this.bulletinsService.lockRegion(this.bulletinsService.getActiveDate(), this.authenticationService.getUserRegion());

        this.bulletinsService.setIsEditable(true);
        this.bulletinsService.setIsSmallChange(true);
        this.router.navigate(['/bulletins/new']);
      }
    }
  }

  publish(event, date: Date) {
    event.stopPropagation();
    this.publishing = date;

    this.bulletinsService.checkBulletins(date, this.authenticationService.getUserRegion()).subscribe(
      data => {
        let result = data.json();

        let message = "<b>" + this.translateService.instant("bulletins.table.publishBulletinsDialog.message") + '</b><br><br>';

        for (let entry of result) {
          if (entry == 'missingDangerRating')
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.missingDangerRating") + '<br>';
          if (entry == 'missingRegion')
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.missingRegion") + '<br>';
          if (entry == 'duplicateRegion')
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.duplicateRegion") + '<br>';
          if (entry == 'missingAvActivityHighlights')
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.missingAvActivityHighlights") + '<br>';
          if (entry == 'missingAvActivityComment')
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.missingAvActivityComment") + '<br>';
          if (entry == 'missingSnowpackStructureHighlights')
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.missingSnowpackStructureHighlights") + '<br>';
          if (entry == 'missingSnowpackStructureComment')
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.missingSnowpackStructureComment") + '<br>';
          if (entry == 'pendingSuggestions')
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.pendingSuggestions");
        }

        this.openPublishBulletinsModal(this.publishBulletinsTemplate, message, date);
      },
      error => {
        console.error("Bulletins could not be checked!");
        this.openCheckBulletinsErrorModal(this.checkBulletinsErrorTemplate);
      }
    );
  }

  submit(event, date: Date) {
    event.stopPropagation();
    this.publishing = date;

    this.bulletinsService.checkBulletins(date, this.authenticationService.getUserRegion()).subscribe(
      data => {
        let result = data.json();

        let message = "<b>" + this.translateService.instant("bulletins.table.submitBulletinsDialog.message") + '</b><br><br>';

        for (let entry of result) {
          if (entry == 'missingDangerRating')
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.missingDangerRating") + '<br>';
          if (entry == 'missingRegion')
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.missingRegion") + '<br>';
          if (entry == 'duplicateRegion')
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.duplicateRegion") + '<br>';
          if (entry == 'missingAvActivityHighlights')
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.missingAvActivityHighlights") + '<br>';
          if (entry == 'missingAvActivityComment')
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.missingAvActivityComment") + '<br>';
          if (entry == 'missingSnowpackStructureHighlights')
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.missingSnowpackStructureHighlights") + '<br>';
          if (entry == 'missingSnowpackStructureComment')
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.missingSnowpackStructureComment") + '<br>';
          if (entry == 'pendingSuggestions')
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.pendingSuggestions");
        }

        this.openSubmitBulletinsModal(this.submitBulletinsTemplate, message, date);
      },
      error => {
        console.error("Bulletins could not be checked!");
        this.openCheckBulletinsErrorModal(this.checkBulletinsErrorTemplate);
      }
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.keyCode == 27 && this.copying) {
      this.copying = false;
      this.bulletinsService.setCopyDate(undefined);
    }
  }

  openPublishBulletinsModal(template: TemplateRef<any>, message: string, date: Date) {
    const initialState = {
      text: message,
      date: date,
      component: this
    };
    this.publishBulletinsModalRef = this.modalService.show(ModalPublishComponent, {initialState});
    
    this.modalService.onHide.subscribe((reason: string) => {
      this.publishing = undefined;
    })
  }

  publishBulletinsModalConfirm(date: Date): void {
    this.publishBulletinsModalRef.hide();
    this.bulletinsService.publishBulletins(date, this.authenticationService.getUserRegion()).subscribe(
      data => {
        console.log("Bulletins published.");
        if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.resubmitted)
          this.bulletinsService.setUserRegionStatus(date, Enums.BulletinStatus.republished);
        else if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.submitted)
          this.bulletinsService.setUserRegionStatus(date, Enums.BulletinStatus.published);
        this.publishing = undefined;
      },
      error => {
        console.error("Bulletins could not be published!");
        this.openPublishBulletinsErrorModal(this.publishBulletinsErrorTemplate);
      }
    );
  }
 
  publishBulletinsModalDecline(): void {
    this.publishBulletinsModalRef.hide();
    this.publishing = undefined;
  }

  openPublishBulletinsErrorModal(template: TemplateRef<any>) {
    this.publishBulletinsErrorModalRef = this.modalService.show(template, this.config);
  }

  publishBulletinsErrorModalConfirm(): void {
    this.publishBulletinsErrorModalRef.hide();
    this.publishing = undefined;
  }
 
  openSubmitBulletinsModal(template: TemplateRef<any>, message: string, date: Date) {
    const initialState = {
      text: message,
      date: date,
      component: this
    };
    this.submitBulletinsModalRef = this.modalService.show(ModalSubmitComponent, {initialState});

    this.modalService.onHide.subscribe((reason: string) => {
      this.publishing = undefined;
    })
  }

  submitBulletinsModalConfirm(date: Date): void {
    this.submitBulletinsModalRef.hide();
    this.bulletinsService.submitBulletins(date, this.authenticationService.getUserRegion()).subscribe(
      data => {
        console.log("Bulletins submitted.");
        if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.updated)
          this.bulletinsService.setUserRegionStatus(date, Enums.BulletinStatus.resubmitted);
        else if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.draft)
          this.bulletinsService.setUserRegionStatus(date, Enums.BulletinStatus.submitted);
        this.publishing = undefined;
      },
      error => {
        console.error("Bulletins could not be submitted!");
        this.openSubmitBulletinsErrorModal(this.submitBulletinsErrorTemplate);
      }
    );
  }
 
  submitBulletinsModalDecline(): void {
    this.submitBulletinsModalRef.hide();
    this.publishing = undefined;
  }

  openSubmitBulletinsErrorModal(template: TemplateRef<any>) {
    this.submitBulletinsErrorModalRef = this.modalService.show(template, this.config);
  }

  submitBulletinsErrorModalConfirm(): void {
    this.submitBulletinsErrorModalRef.hide();
    this.publishing = undefined;
  }

  openCheckBulletinsErrorModal(template: TemplateRef<any>) {
    this.checkBulletinsErrorModalRef = this.modalService.show(template, this.config);
  }

  checkBulletinsErrorModalConfirm(): void {
    this.checkBulletinsErrorModalRef.hide();
    this.publishing = undefined;
  }
}
