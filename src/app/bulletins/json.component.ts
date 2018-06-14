import { Component, ViewChild, TemplateRef } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  templateUrl: 'json.component.html'
})
export class JsonComponent {

  public bulletins: string;
  public loading: boolean;

  public noJsonModalRef: BsModalRef;
  @ViewChild('noJsonTemplate') noJsonTemplate: TemplateRef<any>;

  public jsonNotLoadedModalRef: BsModalRef;
  @ViewChild('jsonNotLoadedTemplate') jsonNotLoadedTemplate: TemplateRef<any>;

  public config = {
    keyboard: true,
    class: 'modal-sm'
  };

  constructor(
    private translate: TranslateService,
    public bulletinsService: BulletinsService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService)
  {
    this.bulletins = undefined;
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.bulletinsService.loadJsonBulletins(this.bulletinsService.getActiveDate()).subscribe(
      data => {
        this.loading = false;
        if (data.status == 204)
          this.openNoJsonModal(this.noJsonTemplate);
        else {
          let text = data.text();
          this.bulletins = text;
        }
      },
      error => {
        this.loading = false;
        this.openJsonNotLoadedModal(this.jsonNotLoadedTemplate);
      }
    );
  }

  goBack() {
    this.router.navigate(['/bulletins']);
  }    

  openNoJsonModal(template: TemplateRef<any>) {
    this.noJsonModalRef = this.modalService.show(template, this.config);
    this.modalService.onHide.subscribe((reason: string) => {
      this.goBack();
    })
  }

  noJsonModalConfirm(): void {
    this.noJsonModalRef.hide();
    this.goBack();
  }

  openJsonNotLoadedModal(template: TemplateRef<any>) {
    this.jsonNotLoadedModalRef = this.modalService.show(template, this.config);
    this.modalService.onHide.subscribe((reason: string) => {
      this.goBack();
    })
  }

  jsonNotLoadedModalConfirm(): void {
    this.jsonNotLoadedModalRef.hide();
    this.goBack();
  }
}
