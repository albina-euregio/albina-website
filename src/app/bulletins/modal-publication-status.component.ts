import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
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
        const response = data.json();
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
        const response = data.json();
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
        const response = data.json();
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
        const response = data.json();
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
        const response = data.json();
        console.info("Static widget created");
      },
      error => {
        console.error("Static widget could not be created!");
      }
    );
  }

  sendEmail(event) {
    event.stopPropagation();
    this.bulletinsService.sendEmail(this.date, this.authenticationService.activeRegion).subscribe(
      data => {
        const response = data.json();
        console.info("Email sent");
      },
      error => {
        console.error("Emails could not be sent!");
      }
    );
  }

  triggerMessengerpeople(event) {
    event.stopPropagation();
    this.bulletinsService.triggerMessengerpeople(this.date, this.authenticationService.activeRegion).subscribe(
      data => {
        const response = data.json();
        console.info("Messengerpeople triggered");
      },
      error => {
        console.error("Messengerpeople could not be triggered!");
      }
    );
  }
}
