import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-modal-publish",
  templateUrl: "modal-publish.component.html"
})

export class ModalPublishComponent {
  text: string;
  date;
  component;

  constructor(public bsModalRef: BsModalRef) {
  }

  publishBulletinsModalConfirm(): void {
    this.component.publishBulletinsModalConfirm(this.date);
  }

  publishBulletinsModalDecline(): void {
    this.component.publishBulletinsModalDecline();
  }
}
