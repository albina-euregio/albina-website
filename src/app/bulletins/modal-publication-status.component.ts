import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { BulletinsService } from "../providers/bulletins-service/bulletins.service";

@Component({
  selector: "app-modal-publication-status",
  templateUrl: "modal-publication-status.component.html"
})

export class ModalPublicationStatusComponent {
  json;
  date;
  component;

  constructor(
    public bsModalRef: BsModalRef,
    public authenticationService: AuthenticationService,
    public bulletinsService: BulletinsService,
    public constantsService: ConstantsService) {
  }

  publicationStatusModalConfirm(): void {
    this.component.publicationStatusModalConfirm(this.date);
  }

  createCaaml(event) {
    event.stopPropagation();
    this.bulletinsService.createCaaml(this.date).subscribe(
      data => {
        console.info("CAAML created");
      },
      error => {
        console.error("CAAML could not be created!");
      }
    );
  }

  createPdf(event) {
    event.stopPropagation();
    this.bulletinsService.createPdf(this.date).subscribe(
      data => {
        console.info("PDF created");
      },
      error => {
        console.error("PDF could not be created!");
      }
    );
  }

  createHtml(event) {
    event.stopPropagation();
    this.bulletinsService.createHtml(this.date).subscribe(
      data => {
        console.info("HTML created");
      },
      error => {
        console.error("HTML could not be created!");
      }
    );
  }

  createMap(event) {
    event.stopPropagation();
    this.bulletinsService.createMap(this.date).subscribe(
      data => {
        console.info("Map created");
      },
      error => {
        console.error("Map could not be created!");
      }
    );
  }

  createStaticWidget(event) {
    event.stopPropagation();
    this.bulletinsService.createStaticWidget(this.date).subscribe(
      data => {
        console.info("Static widget created");
      },
      error => {
        console.error("Static widget could not be created!");
      }
    );
  }

  sendEmail(event, language: string = "") {
    event.stopPropagation();
    this.bulletinsService.sendEmail(this.date, this.authenticationService.activeRegion, language).subscribe(
      data => {
        console.info("Emails sent for %s in %s", this.authenticationService.activeRegion, language);
      },
      error => {
        console.error("Emails could not be sent for %s in %s!", this.authenticationService.activeRegion, language);
      }
    );
  }

  sendTestEmail(event, language: string = "") {
    event.stopPropagation();
    this.bulletinsService.sendTestEmail(this.date, this.authenticationService.activeRegion, language).subscribe(
      data => {
        console.info("Test emails sent for %s in %s", this.authenticationService.activeRegion, language);
      },
      error => {
        console.error("Test emails could not be sent for %s in %s!", this.authenticationService.activeRegion, language);
      }
    );
  }

  triggerTelegramChannel(event, language: string = "") {
    event.stopPropagation();
    this.bulletinsService.triggerTelegramChannel(this.date, this.authenticationService.activeRegion, language).subscribe(
      data => {
        console.info("Telegram channel triggered for %s in %s", this.authenticationService.activeRegion, language);
      },
      error => {
        console.error("Telegram channel could not be triggered for %s in %s!", this.authenticationService.activeRegion, language);
      }
    );
  }

  triggerPushNotifications(event, language: string = "") {
    event.stopPropagation();

    this.bulletinsService.triggerPushNotifications(this.date, this.authenticationService.activeRegion, language).subscribe(
      data => {
        console.info("Push notifications triggered for %s in %s", this.authenticationService.activeRegion, language);
      },
      error => {
        console.error("Push notifications could not be triggered for %s in %s!", this.authenticationService.activeRegion, language);
      }
    );
  }

}
