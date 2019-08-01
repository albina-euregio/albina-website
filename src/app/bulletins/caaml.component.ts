import { Component, ViewChild, TemplateRef, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core/src/translate.service";
import { BulletinModel } from "../models/bulletin.model";
import { BulletinsService } from "../providers/bulletins-service/bulletins.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import * as Enums from "../enums/enums";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";

@Component({
  templateUrl: "caaml.component.html"
})
export class CaamlComponent implements OnInit {

  public bulletins: string;
  public loading: boolean;

  public noCaamlModalRef: BsModalRef;
  @ViewChild("noCaamlTemplate") noCaamlTemplate: TemplateRef<any>;

  public caamlNotLoadedModalRef: BsModalRef;
  @ViewChild("caamlNotLoadedTemplate") caamlNotLoadedTemplate: TemplateRef<any>;

  public config = {
    keyboard: true,
    class: "modal-sm"
  };

  constructor(
    private translate: TranslateService,
    public bulletinsService: BulletinsService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService) {
    this.bulletins = undefined;
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.bulletinsService.loadCaamlBulletins(this.bulletinsService.getActiveDate()).subscribe(
      data => {
        this.loading = false;
        if (data.status === 204) {
          this.openNoCaamlModal(this.noCaamlTemplate);
        } else {
          const text = data.text();
          this.bulletins = text;
        }
      },
      error => {
        this.loading = false;
        this.openCaamlNotLoadedModal(this.caamlNotLoadedTemplate);
      }
    );
  }

  goBack() {
    this.router.navigate(["/bulletins"]);
  }

  openNoCaamlModal(template: TemplateRef<any>) {
    this.noCaamlModalRef = this.modalService.show(template, this.config);
    this.modalService.onHide.subscribe((reason: string) => {
      this.goBack();
    });
  }

  noCaamlModalConfirm(): void {
    this.noCaamlModalRef.hide();
    this.goBack();
  }

  openCaamlNotLoadedModal(template: TemplateRef<any>) {
    this.caamlNotLoadedModalRef = this.modalService.show(template, this.config);
    this.modalService.onHide.subscribe((reason: string) => {
      this.goBack();
    });
  }

  caamlNotLoadedModalConfirm(): void {
    this.caamlNotLoadedModalRef.hide();
    this.goBack();
  }
}
