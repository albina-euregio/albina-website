import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-modal-submit",
  templateUrl: "modal-submit.component.html"
})

export class ModalSubmitComponent {
  text: string;
  date;
  component;

  constructor(public bsModalRef: BsModalRef) {
  }

  submitBulletinsModalConfirm(): void {
    this.component.submitBulletinsModalConfirm(this.date);
  }

  submitBulletinsModalDecline(): void {
    this.component.submitBulletinsModalDecline();
  }
}
