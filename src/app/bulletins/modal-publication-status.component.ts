import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'modal-publication-status',
  templateUrl: 'modal-publication-status.component.html'
})
 
export class ModalPublicationStatusComponent {
  json;
  date;
  component;
 
  constructor(public bsModalRef: BsModalRef) {
  }

  publicationStatusModalConfirm(): void {
    this.component.publicationStatusModalConfirm(this.date);
  }
}