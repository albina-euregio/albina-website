import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { BulletinsService } from "../providers/bulletins-service/bulletins.service";
import { AlertComponent } from "ngx-bootstrap/alert";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-modal-publication-status",
  templateUrl: "modal-publication-status.component.html"
})

export class ModalPublicationStatusComponent {
  json;
  date;
  component;

  public alerts: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    public authenticationService: AuthenticationService,
    public bulletinsService: BulletinsService,
    public constantsService: ConstantsService,
    public translateService: TranslateService) {
  }

  publicationStatusModalConfirm(): void {
    this.component.publicationStatusModalConfirm(this.date);
  }

  createCaaml(event) {
    event.stopPropagation();
    this.bulletinsService.createCaaml(this.date).subscribe(
      data => {
        console.info("CAAML created");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "success",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.caaml.success", {prefix: ""}),
          timeout: 5000
        });
      },
      error => {
        console.error("CAAML could not be created!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.caaml.error", {prefix: ""}),
          timeout: 5000
        });
      }
    );
  }

  createPdf(event) {
    event.stopPropagation();
    this.bulletinsService.createPdf(this.date).subscribe(
      data => {
        console.info("PDF created");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "success",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.pdf.success", {prefix: ""}),
          timeout: 5000
        });
      },
      error => {
        console.error("PDF could not be created!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.pdf.error", {prefix: ""}),
          timeout: 5000
        });
      }
    );
  }

  createHtml(event) {
    event.stopPropagation();
    this.bulletinsService.createHtml(this.date).subscribe(
      data => {
        console.info("HTML created");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "success",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.html.success", {prefix: ""}),
          timeout: 5000
        });
      },
      error => {
        console.error("HTML could not be created!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.html.error", {prefix: ""}),
          timeout: 5000
        });
      }
    );
  }

  createMap(event) {
    event.stopPropagation();
    this.bulletinsService.createMap(this.date).subscribe(
      data => {
        console.info("Map created");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "success",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.map.success", {prefix: ""}),
          timeout: 5000
        });
      },
      error => {
        console.error("Map could not be created!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.map.error", {prefix: ""}),
          timeout: 5000
        });
      }
    );
  }

  sendEmail(event, language: string = "") {
    event.stopPropagation();
    this.bulletinsService.sendEmail(this.date, this.authenticationService.getActiveRegionId(), language).subscribe(
      data => {
        console.info("Emails sent for %s in %s", this.authenticationService.getActiveRegionId(), language);
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "success",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.email.success", {prefix: ""}),
          timeout: 5000
        });
      },
      error => {
        console.error("Emails could not be sent for %s in %s!", this.authenticationService.getActiveRegionId(), language);
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.email.error", {prefix: ""}),
          timeout: 5000
        });
      }
    );
  }

  triggerTelegramChannel(event, language: string = "") {
    event.stopPropagation();
    this.bulletinsService.triggerTelegramChannel(this.date, this.authenticationService.getActiveRegionId(), language).subscribe(
      data => {
        console.info("Telegram channel triggered for %s in %s", this.authenticationService.getActiveRegionId(), language);
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "success",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.telegram.success", {prefix: ""}),
          timeout: 5000
        });
      },
      error => {
        console.error("Telegram channel could not be triggered for %s in %s!", this.authenticationService.getActiveRegionId(), language);
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.telegram.error", {prefix: ""}),
          timeout: 5000
        });
      }
    );
  }

  triggerPushNotifications(event, language: string = "") {
    event.stopPropagation();

    this.bulletinsService.triggerPushNotifications(this.date, this.authenticationService.getActiveRegionId(), language).subscribe(
      data => {
        console.info("Push notifications triggered for %s in %s", this.authenticationService.getActiveRegionId(), language);
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "success",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.push.success", {prefix: ""}),
          timeout: 5000
        });
      },
      error => {
        console.error("Push notifications could not be triggered for %s in %s!", this.authenticationService.getActiveRegionId(), language);
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("bulletins.table.publicationStatusDialog.push.error", {prefix: ""}),
          timeout: 5000
        });
      }
    );
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
