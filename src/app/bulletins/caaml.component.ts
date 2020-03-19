import { Component, ViewChild, TemplateRef, OnInit } from "@angular/core";
import { BulletinsService } from "../providers/bulletins-service/bulletins.service";
import { Router } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal";

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
    public bulletinsService: BulletinsService,
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
        if ((data as any).status === 204) {
          this.openNoCaamlModal(this.noCaamlTemplate);
        } else {
          const text = (data as any).text();
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
