import { Component, OnInit, HostListener, TemplateRef, ViewChild } from "@angular/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { environment } from "../../environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import { ConfigurationService } from "app/providers/configuration-service/configuration.service";

@Component({
  templateUrl: "login.component.html"
})
export class LoginComponent implements OnInit {

  public username: string;
  public password: string;
  public returnUrl: String;
  public loading: boolean;

  public errorModalRef: BsModalRef;
  @ViewChild("errorTemplate") errorTemplate: TemplateRef<any>;

  public config = {
    keyboard: true,
    class: "modal-sm"
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public constantsService: ConstantsService,
    public configurationService: ConfigurationService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer) {
    this.loading = false;
  }

  ngOnInit() {
    // reset login status
    // this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    // console.log("Return URL: " + this.route.snapshot.queryParams['returnUrl']);
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.returnUrl = "/bulletins";
  }

  getStyle() {
    const style = `background-color: ${environment.headerBgColor}`;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }

  login() {
    this.loading = true;

    this.authenticationService.login(this.username, this.password).subscribe(
      data => {
        if (data === true) {
          console.debug("[" + this.username + "] Logged in!");
          console.debug("Navigate to " + this.returnUrl);
          this.router.navigate([this.returnUrl]);
          this.loading = false;
          this.authenticationService.externalServerLogins();
        } else {
          console.error("[" + this.username + "] Login failed!");
          this.openErrorModal(this.errorTemplate);
        }
      },
      error => {
        console.error("[" + this.username + "] Login failed: " + JSON.stringify(error._body));
        this.openErrorModal(this.errorTemplate);
      }
    );
  }

  openErrorModal(template: TemplateRef<any>) {
    this.errorModalRef = this.modalService.show(template, this.config);
    this.modalService.onHide.subscribe((reason: string) => {
      this.loading = false;
    });
  }

  errorModalConfirm(): void {
    this.errorModalRef.hide();
    this.loading = false;
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 13 && !this.loading) {
      this.login();
    }
  }
}
