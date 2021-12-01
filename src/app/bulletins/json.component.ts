import { Component, ViewChild, TemplateRef, OnInit } from "@angular/core";
import { BulletinsService } from "../providers/bulletins-service/bulletins.service";
import { Router } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  templateUrl: "json.component.html"
})
export class JsonComponent implements OnInit {

  public bulletins: string;
  public loading: boolean;

  public noJsonModalRef: BsModalRef;
  @ViewChild("noJsonTemplate") noJsonTemplate: TemplateRef<any>;

  public jsonNotLoadedModalRef: BsModalRef;
  @ViewChild("jsonNotLoadedTemplate") jsonNotLoadedTemplate: TemplateRef<any>;

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
    this.bulletinsService.loadJsonBulletins(this.bulletinsService.getActiveDate()).subscribe(
      data => {
        this.loading = false;
        if ((data as any).status === 204) {
          this.openNoJsonModal(this.noJsonTemplate);
        } else {
          const text = data as any;
          this.bulletins = JSON.stringify(text, undefined, 4);
        }
      },
      () => {
        this.loading = false;
        this.openJsonNotLoadedModal(this.jsonNotLoadedTemplate);
      }
    );
  }

  goBack() {
    this.router.navigate(["/bulletins"]);
  }

  openNoJsonModal(template: TemplateRef<any>) {
    this.noJsonModalRef = this.modalService.show(template, this.config);
    this.modalService.onHide.subscribe(() => {
      this.goBack();
    });
  }

  noJsonModalConfirm(): void {
    this.noJsonModalRef.hide();
    this.goBack();
  }

  openJsonNotLoadedModal(template: TemplateRef<any>) {
    this.jsonNotLoadedModalRef = this.modalService.show(template, this.config);
    this.modalService.onHide.subscribe(() => {
      this.goBack();
    });
  }

  jsonNotLoadedModalConfirm(): void {
    this.jsonNotLoadedModalRef.hide();
    this.goBack();
  }
}
