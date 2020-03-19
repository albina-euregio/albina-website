import { Component, HostListener, ViewChild, TemplateRef, OnInit, OnDestroy } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BulletinUpdateModel } from "../models/bulletin-update.model";
import { BulletinsService } from "../providers/bulletins-service/bulletins.service";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { WsUpdateService } from "../providers/ws-update-service/ws-update.service";
import { SettingsService } from "../providers/settings-service/settings.service";
import { Subject } from "rxjs/Rx";
import { Router, ActivatedRoute } from "@angular/router";
import * as Enums from "../enums/enums";
import { ConfirmationService } from "primeng/api";
import "rxjs/add/observable/forkJoin";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ModalSubmitComponent } from "./modal-submit.component";
import { ModalPublishComponent } from "./modal-publish.component";
import { ModalCheckComponent } from "./modal-check.component";
import { ModalPublicationStatusComponent } from "./modal-publication-status.component";
import { ModalPublishAllComponent } from "./modal-publish-all.component";

@Component({
  templateUrl: "bulletins.component.html"
})
export class BulletinsComponent implements OnInit, OnDestroy {

  public bulletinStatus = Enums.BulletinStatus;

  public updates: Subject<BulletinUpdateModel>;

  public loadingTrentino: boolean;
  public loadingSouthTyrol: boolean;
  public loadingTyrol: boolean;
  public publishing: Date;
  public copying: boolean;

  public publishBulletinsModalRef: BsModalRef;
  @ViewChild("publishBulletinsTemplate") publishBulletinsTemplate: TemplateRef<any>;

  public publicationStatusModalRef: BsModalRef;
  @ViewChild("publicationStatusTemplate") publicationStatusTemplate: TemplateRef<any>;

  public publishBulletinsErrorModalRef: BsModalRef;
  @ViewChild("publishBulletinsErrorTemplate") publishBulletinsErrorTemplate: TemplateRef<any>;

  public submitBulletinsModalRef: BsModalRef;
  @ViewChild("submitBulletinsTemplate") submitBulletinsTemplate: TemplateRef<any>;

  public submitBulletinsErrorModalRef: BsModalRef;
  @ViewChild("submitBulletinsErrorTemplate") submitBulletinsErrorTemplate: TemplateRef<any>;

  public submitBulletinsDuplicateRegionModalRef: BsModalRef;
  @ViewChild("submitBulletinsDuplicateRegionTemplate") submitBulletinsDuplicateRegionTemplate: TemplateRef<any>;

  public checkBulletinsModalRef: BsModalRef;
  @ViewChild("checkBulletinsTemplate") checkBulletinsTemplate: TemplateRef<any>;

  public checkBulletinsErrorModalRef: BsModalRef;
  @ViewChild("checkBulletinsErrorTemplate") checkBulletinsErrorTemplate: TemplateRef<any>;

  public publishAllModalRef: BsModalRef;
  @ViewChild("publishAllTemplate") publishAllTemplate: TemplateRef<any>;

  public config = {
    keyboard: true,
    class: "modal-sm"
  };

  constructor(
    public translate: TranslateService,
    public bulletinsService: BulletinsService,
    public route: ActivatedRoute,
    public translateService: TranslateService,
    public authenticationService: AuthenticationService,
    public constantsService: ConstantsService,
    public settingsService: SettingsService,
    public router: Router,
    public confirmationService: ConfirmationService,
    public modalService: BsModalService,
    public wsUpdateService: WsUpdateService) {
    this.loadingTrentino = false;
    this.loadingSouthTyrol = false;
    this.loadingTyrol = false;
    this.copying = false;
    this.publishing = undefined;

    this.bulletinsService.init();
  }

  ngOnInit() {
    this.loadingTrentino = false;
    this.loadingSouthTyrol = false;
    this.loadingTyrol = false;

    this.wsUpdateConnect();
  }

  ngOnDestroy() {
    this.loadingTrentino = false;
    this.loadingSouthTyrol = false;
    this.loadingTyrol = false;
    this.copying = false;
    this.wsUpdateDisconnect();
  }

  private wsUpdateConnect() {
    this.updates = <Subject<BulletinUpdateModel>>this.wsUpdateService
      .connect(this.constantsService.getWsUpdateUrl() + this.authenticationService.getUsername())
      .map((response: any): BulletinUpdateModel => {
        const data = JSON.parse(response.data);
        const bulletinUpdate = BulletinUpdateModel.createFromJson(data);
        console.debug("Bulletin update received: " + bulletinUpdate.getDate().toLocaleDateString() + " - " + bulletinUpdate.getRegion() + " [" + bulletinUpdate.getStatus() + "]");
        if (bulletinUpdate.region === this.constantsService.codeTyrol) {
          this.bulletinsService.statusMapTyrol.set(new Date(bulletinUpdate.getDate()).getTime(), bulletinUpdate.getStatus());
        }
        if (bulletinUpdate.region === this.constantsService.codeSouthTyrol) {
          this.bulletinsService.statusMapSouthTyrol.set(new Date(bulletinUpdate.getDate()).getTime(), bulletinUpdate.getStatus());
        }
        if (bulletinUpdate.region === this.constantsService.codeTrentino) {
          this.bulletinsService.statusMapTrentino.set(new Date(bulletinUpdate.getDate()).getTime(), bulletinUpdate.getStatus());
        }
        return bulletinUpdate;
      });

    this.updates.subscribe(msg => {
    });
  }

  private wsUpdateDisconnect() {
    this.wsUpdateService.disconnect();
  }

  isPast(date: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today.getTime() > date.getTime()) {
      return true;
    }
    return false;
  }

  isToday(date: Date) {
    if (date !== undefined) {
      const today = new Date();
      const hours = today.getHours();
      today.setHours(0, 0, 0, 0);
      if (today.getTime() === date.getTime()) {
        return true;
      }
      if (hours >= 17) {
        today.setDate(today.getDate() + 1);
        if (today.getTime() === date.getTime()) {
          return true;
        }
      }
    }
    return false;
  }

  showCreateButton(date) {
    if (this.authenticationService.getActiveRegion() !== undefined &&
      (!this.isPast(date)) &&
      (!this.publishing || this.publishing.getTime() !== date.getTime()) &&
      (
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.missing
      ) &&
      !this.copying) {
      return true;
    } else {
      return false;
    }
  }

  showCopyButton(date) {
    if (this.authenticationService.getActiveRegion() !== undefined &&
      (!this.publishing || this.publishing.getTime() !== date.getTime()) &&
      this.bulletinsService.getUserRegionStatus(date) &&
      this.bulletinsService.getUserRegionStatus(date) !== this.bulletinStatus.missing &&
      !this.copying) {
      return true;
    } else {
      return false;
    }
  }

  showPasteButton(date) {
    if (this.authenticationService.getActiveRegion() !== undefined &&
      (!this.publishing || this.publishing.getTime() !== date.getTime()) &&
      this.bulletinsService.getUserRegionStatus(date) !== this.bulletinStatus.published &&
      this.bulletinsService.getUserRegionStatus(date) !== this.bulletinStatus.republished &&
      this.bulletinsService.getUserRegionStatus(date) !== this.bulletinStatus.submitted &&
      this.bulletinsService.getUserRegionStatus(date) !== this.bulletinStatus.resubmitted &&
      this.copying &&
      this.bulletinsService.getCopyDate() !== date &&
      !this.isPast(date) &&
      !this.isToday(date)) {
      return true;
    } else {
      return false;
    }
  }

  showSubmitButton(date) {
    if (this.authenticationService.getActiveRegion() !== undefined &&
      /*!this.isPast(date) && */
      (!this.publishing || this.publishing.getTime() !== date.getTime()) &&
      (
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.draft ||
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.updated
      ) &&
      !this.copying &&
      this.authenticationService.isCurrentUserInRole(this.constantsService.roleForecaster)) {
      return true;
    } else {
      return false;
    }
  }

  showPublishAllButton(date) {
    if (this.authenticationService.isCurrentUserInRole(this.constantsService.roleAdmin)) {
      return true;
    }
  }

  showPublishButton(date) {
    if (this.authenticationService.getActiveRegion() !== undefined &&
      (!this.publishing || this.publishing.getTime() !== date.getTime()) &&
      (this.isToday(date) || this.isPast(date)) &&
      (
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.resubmitted ||
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.submitted
      ) &&
      !this.copying &&
      this.authenticationService.isCurrentUserInRole(this.constantsService.roleForecaster)) {
      return true;
    } else {
      return false;
    }
  }

  showCheckButton(date) {
    if (this.authenticationService.getActiveRegion() !== undefined &&
      /*!this.isPast(date) && */
      (!this.publishing || this.publishing.getTime() !== date.getTime()) &&
      (
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.draft ||
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.updated
      ) &&
      !this.copying &&
      this.authenticationService.isCurrentUserInRole(this.constantsService.roleForeman)) {
      return true;
    } else {
      return false;
    }
  }

  showSpinningIconButton(date) {
    if (this.authenticationService.getActiveRegion() !== undefined &&
      !this.copying &&
      this.publishing &&
      this.publishing.getTime() === date.getTime()) {
      return true;
    } else {
      return false;
    }
  }

  showInfoButton(date) {
    if (this.authenticationService.getActiveRegion() !== undefined &&
      /*(!this.isPast(date) ) && */
      (!this.publishing || this.publishing.getTime() !== date.getTime()) &&
      (
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.published ||
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.republished
      ) &&
      !this.copying) {
      return true;
    } else {
      return false;
    }
  }

  showCaamlButton(date) {
    if (this.settingsService.showCaaml &&
      (!this.publishing || this.publishing.getTime() !== date.getTime()) &&
      !this.copying) {
      return true;
    } else {
      return false;
    }
  }

  showJsonButton(date) {
    if (this.settingsService.showJson &&
      (!this.publishing || this.publishing.getTime() !== date.getTime()) &&
      !this.copying) {
      return true;
    } else {
      return false;
    }
  }

  showEditButton(date) {
    if (this.authenticationService.getActiveRegion() !== undefined &&
      /*(!this.isPast(date) ) && */
      (!this.publishing || this.publishing.getTime() !== date.getTime()) &&
      (
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.published ||
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.republished
      ) &&
      !this.copying &&
      this.authenticationService.isCurrentUserInRole(this.constantsService.roleForecaster)) {
      return true;
    } else {
      return false;
    }
  }

  showUpdateButton(date) {
    if (this.authenticationService.getActiveRegion() !== undefined &&
      /*(!this.isPast(date)) &&*/
      (this.isToday(date) || this.isPast(date)) &&
      (!this.publishing || this.publishing.getTime() !== date.getTime()) &&
      (
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.published ||
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.republished ||
        this.bulletinsService.getUserRegionStatus(date) === this.bulletinStatus.missing ||
        this.bulletinsService.getUserRegionStatus(date) === undefined
      ) &&
      !this.copying) {
      return true;
    } else {
      return false;
    }
  }

  isOwnRegion(region) {
    const userRegion = this.authenticationService.getActiveRegion();
    if (userRegion && userRegion !== undefined) {
      return this.authenticationService.getActiveRegion().startsWith(region);
    } else {
      return false;
    }
  }

  editBulletin(date: Date, isUpdate: boolean) {
    if (this.authenticationService.getActiveRegion() && this.authenticationService.getActiveRegion() !== undefined) {
      if (!this.copying) {
        if (isUpdate) {
          this.bulletinsService.setIsUpdate(true);
        } else {
          this.bulletinsService.setIsUpdate(false);
        }

        this.bulletinsService.setActiveDate(date);

        if (!this.isEditable(date) && !isUpdate) {
          this.bulletinsService.setIsEditable(false);
          this.router.navigate(["/bulletins/new"]);
        } else {
          if (this.bulletinsService.getActiveDate() && this.authenticationService.isUserLoggedIn()) {
            this.bulletinsService.lockRegion(this.authenticationService.getActiveRegion(), this.bulletinsService.getActiveDate());
            this.bulletinsService.setIsEditable(true);
            this.router.navigate(["/bulletins/new"]);
          }
        }
      }
    } else {
      this.bulletinsService.setActiveDate(date);
      this.bulletinsService.setIsUpdate(false);
      this.bulletinsService.setIsEditable(false);
      this.router.navigate(["/bulletins/new"]);
    }
  }

  showBulletin(date: Date) {
    if (!this.copying) {
      this.bulletinsService.setIsUpdate(false);
      this.bulletinsService.setActiveDate(date);
      this.bulletinsService.setIsEditable(false);
      this.router.navigate(["/bulletins/new"]);
    }
  }

  isEditable(date) {
    if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.updated) {
      return true;
    }
    if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.draft) {
      return true;
    }
    if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.submitted) {
      return true;
    }
    if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.resubmitted) {
      return true;
    }
    if (this.bulletinsService.getIsUpdate()) {
      return true;
    }

    if (
      (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.published && !this.bulletinsService.getIsUpdate()) ||
      (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.republished && !this.bulletinsService.getIsUpdate()) ||
      this.bulletinsService.isLocked(date, this.authenticationService.getActiveRegion()) ||
      this.isPast(date) ||
      this.isToday(date)) {
      return false;
    } else {
      return true;
    }
  }

  showCaaml(event, date: Date) {
    event.stopPropagation();
    this.bulletinsService.setActiveDate(date);
    this.router.navigate(["/bulletins/caaml"]);
  }

  showJson(event, date: Date) {
    event.stopPropagation();
    this.bulletinsService.setActiveDate(date);
    this.router.navigate(["/bulletins/json"]);
  }

  showPublicationInfo(event, date: Date) {
    event.stopPropagation();
    this.bulletinsService.getPublicationStatus(this.authenticationService.activeRegion, date).subscribe(
      data => {
        this.openPublicationStatusModal(this.publicationStatusTemplate, (data as any), date);
      },
      error => {
        console.error("Publication status could not be loaded!");
      }
    );
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

    if (this.bulletinsService.isLocked(date, this.authenticationService.getActiveRegion())) {
      this.bulletinsService.setIsEditable(false);
      this.router.navigate(["/bulletins/new"]);
    } else {
      if (this.bulletinsService.getActiveDate() && this.authenticationService.isUserLoggedIn()) {
        this.bulletinsService.lockRegion(this.authenticationService.getActiveRegion(), this.bulletinsService.getActiveDate());
        this.bulletinsService.setIsEditable(true);
        this.bulletinsService.setIsSmallChange(true);
        this.router.navigate(["/bulletins/new"]);
      }
    }
  }

  publish(event, date: Date) {
    event.stopPropagation();
    this.publishing = date;

    this.bulletinsService.checkBulletins(date, this.authenticationService.getActiveRegion()).subscribe(
      data => {
        let message = "<b>" + this.translateService.instant("bulletins.table.publishBulletinsDialog.message") + "</b><br><br>";

        for (const entry of (data as any)) {
          if (entry === "missingDangerRating") {
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.missingDangerRating") + "<br>";
          }
          if (entry === "missingRegion") {
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.missingRegion") + "<br>";
          }
          if (entry === "duplicateRegion") {
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.duplicateRegion") + "<br>";
          }
          if (entry === "missingAvActivityHighlights") {
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.missingAvActivityHighlights") + "<br>";
          }
          if (entry === "missingAvActivityComment") {
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.missingAvActivityComment") + "<br>";
          }
          if (entry === "missingSnowpackStructureHighlights") {
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.missingSnowpackStructureHighlights") + "<br>";
          }
          if (entry === "missingSnowpackStructureComment") {
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.missingSnowpackStructureComment") + "<br>";
          }
          if (entry === "pendingSuggestions") {
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.pendingSuggestions") + "<br>";
          }
          if (entry === "incompleteTranslation") {
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.incompleteTranslation");
          }
        }

        this.openPublishBulletinsModal(this.publishBulletinsTemplate, message, date);
      },
      error => {
        console.error("Bulletins could not be checked!");
        this.openCheckBulletinsErrorModal(this.checkBulletinsErrorTemplate);
      }
    );
  }

  publishAll(event, date: Date) {
    event.stopPropagation();
    this.publishing = date;
    this.openPublishAllModal(this.publishAllTemplate, date);
  }

  submit(event, date: Date) {
    event.stopPropagation();
    this.publishing = date;

    this.bulletinsService.checkBulletins(date, this.authenticationService.getActiveRegion()).subscribe(
      data => {
        let duplicateRegion = false;

        let message = "<b>" + this.translateService.instant("bulletins.table.submitBulletinsDialog.message") + "</b><br><br>";

        for (const entry of (data as any)) {
          if (entry === "duplicateRegion") {
            duplicateRegion = true;
          }
          if (entry === "missingDangerRating") {
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.missingDangerRating") + "<br>";
          }
          if (entry === "missingRegion") {
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.missingRegion") + "<br>";
          }
          if (entry === "missingAvActivityHighlights") {
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.missingAvActivityHighlights") + "<br>";
          }
          if (entry === "missingAvActivityComment") {
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.missingAvActivityComment") + "<br>";
          }
          if (entry === "missingSnowpackStructureHighlights") {
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.missingSnowpackStructureHighlights") + "<br>";
          }
          if (entry === "missingSnowpackStructureComment") {
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.missingSnowpackStructureComment") + "<br>";
          }
          if (entry === "pendingSuggestions") {
            message += this.translateService.instant("bulletins.table.submitBulletinsDialog.pendingSuggestions") + "<br>";
          }
          if (entry === "incompleteTranslation") {
            message += this.translateService.instant("bulletins.table.publishBulletinsDialog.incompleteTranslation");
          }
        }

        if (duplicateRegion) {
          this.openSubmitBulletinsDuplicateRegionModal(this.submitBulletinsDuplicateRegionTemplate);
        } else {
          this.openSubmitBulletinsModal(this.submitBulletinsTemplate, message, date);
        }
      },
      error => {
        console.error("Bulletins could not be checked!");
        this.openCheckBulletinsErrorModal(this.checkBulletinsErrorTemplate);
      }
    );
  }

  check(event, date: Date) {
    event.stopPropagation();

    this.bulletinsService.checkBulletins(date, this.authenticationService.getActiveRegion()).subscribe(
      data => {
        let message = "<b>" + this.translateService.instant("bulletins.table.checkBulletinsDialog.message") + "</b><br><br>";

        if ((data as any).length === 0) {
          message += this.translateService.instant("bulletins.table.checkBulletinsDialog.ok");
        } else {
          for (const entry of (data as any)) {
            if (entry === "missingDangerRating") {
              message += this.translateService.instant("bulletins.table.checkBulletinsDialog.missingDangerRating") + "<br>";
            }
            if (entry === "missingRegion") {
              message += this.translateService.instant("bulletins.table.checkBulletinsDialog.missingRegion") + "<br>";
            }
            if (entry === "missingAvActivityHighlights") {
              message += this.translateService.instant("bulletins.table.checkBulletinsDialog.missingAvActivityHighlights") + "<br>";
            }
            if (entry === "missingAvActivityComment") {
              message += this.translateService.instant("bulletins.table.checkBulletinsDialog.missingAvActivityComment") + "<br>";
            }
            if (entry === "missingSnowpackStructureHighlights") {
              message += this.translateService.instant("bulletins.table.checkBulletinsDialog.missingSnowpackStructureHighlights") + "<br>";
            }
            if (entry === "missingSnowpackStructureComment") {
              message += this.translateService.instant("bulletins.table.checkBulletinsDialog.missingSnowpackStructureComment") + "<br>";
            }
            if (entry === "pendingSuggestions") {
              message += this.translateService.instant("bulletins.table.checkBulletinsDialog.pendingSuggestions") + "<br>";
            }
            if (entry === "incompleteTranslation") {
              message += this.translateService.instant("bulletins.table.checkBulletinsDialog.incompleteTranslation");
            }
          }
        }

        this.openCheckBulletinsModal(this.checkBulletinsTemplate, message, date);
      },
      error => {
        console.error("Bulletins could not be checked!");
        this.openCheckBulletinsErrorModal(this.checkBulletinsErrorTemplate);
      }
    );
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27 && this.copying) {
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
    this.publishBulletinsModalRef = this.modalService.show(ModalPublishComponent, { initialState });

    this.modalService.onHide.subscribe((reason: string) => {
      this.publishing = undefined;
    });
  }

  publishBulletinsModalConfirm(date: Date): void {
    this.publishBulletinsModalRef.hide();
    this.bulletinsService.publishBulletins(date, this.authenticationService.getActiveRegion()).subscribe(
      data => {
        console.log("Bulletins published.");
        if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.resubmitted) {
          this.bulletinsService.setUserRegionStatus(date, Enums.BulletinStatus.republished);
        } else if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.submitted) {
          this.bulletinsService.setUserRegionStatus(date, Enums.BulletinStatus.published);
        }
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

  openPublicationStatusModal(template: TemplateRef<any>, json, date: Date) {
    const initialState = {
      json: json,
      date: date,
      component: this
    };
    this.publicationStatusModalRef = this.modalService.show(ModalPublicationStatusComponent, { initialState });
  }

  publicationStatusModalConfirm(date: Date): void {
    this.publicationStatusModalRef.hide();
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
    this.submitBulletinsModalRef = this.modalService.show(ModalSubmitComponent, { initialState });

    this.modalService.onHide.subscribe((reason: string) => {
      this.publishing = undefined;
    });
  }

  submitBulletinsModalConfirm(date: Date): void {
    this.submitBulletinsModalRef.hide();
    this.bulletinsService.submitBulletins(date, this.authenticationService.getActiveRegion()).subscribe(
      data => {
        console.log("Bulletins submitted.");
        if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.updated) {
          this.bulletinsService.setUserRegionStatus(date, Enums.BulletinStatus.resubmitted);
        } else if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.draft) {
          this.bulletinsService.setUserRegionStatus(date, Enums.BulletinStatus.submitted);
        }
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

  openCheckBulletinsModal(template: TemplateRef<any>, message: string, date: Date) {
    const initialState = {
      text: message,
      date: date,
      component: this
    };
    this.checkBulletinsModalRef = this.modalService.show(ModalCheckComponent, { initialState });

    this.modalService.onHide.subscribe((reason: string) => {
      this.publishing = undefined;
    });
  }

  checkBulletinsModalConfirm(): void {
    this.checkBulletinsModalRef.hide();
  }

  openSubmitBulletinsDuplicateRegionModal(template: TemplateRef<any>) {
    this.submitBulletinsDuplicateRegionModalRef = this.modalService.show(template, this.config);
  }

  submitBulletinsDuplicateRegionModalConfirm(): void {
    this.submitBulletinsDuplicateRegionModalRef.hide();
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

  openPublishAllModal(template: TemplateRef<any>, date: Date) {
    const initialState = {
      date: date,
      component: this
    };
    this.publishAllModalRef = this.modalService.show(ModalPublishAllComponent, { initialState });

    this.modalService.onHide.subscribe((reason: string) => {
      this.publishing = undefined;
    });
  }

  publishAllModalConfirm(date: Date): void {
    this.publishAllModalRef.hide();
    this.bulletinsService.publishAllBulletins(date).subscribe(
      data => {
        console.log("All bulletins published.");
        if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.resubmitted) {
          this.bulletinsService.setUserRegionStatus(date, Enums.BulletinStatus.republished);
        } else if (this.bulletinsService.getUserRegionStatus(date) === Enums.BulletinStatus.submitted) {
          this.bulletinsService.setUserRegionStatus(date, Enums.BulletinStatus.published);
        }
        this.publishing = undefined;
      },
      error => {
        console.error("All bulletins could not be published!");
        this.openPublishBulletinsErrorModal(this.publishBulletinsErrorTemplate);
      }
    );
  }

  publishAllModalDecline(): void {
    this.publishAllModalRef.hide();
    this.publishing = undefined;
  }
}
