import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";

@Component({
  selector: "app-modal-publish-all",
  templateUrl: "modal-publish-all.component.html"
})

export class ModalPublishAllComponent {
  date;
  component;

  constructor(public bsModalRef: BsModalRef) {
  }

  publishAllModalConfirm(): void {
    this.component.publishAllModalConfirm(this.date);
  }

  publishAllModalDecline(): void {
    this.component.publishAllModalDecline();
  }
}
