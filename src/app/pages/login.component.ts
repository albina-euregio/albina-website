import { Component, OnInit, HostListener, TemplateRef, ViewChild } from "@angular/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { MapService } from "../providers/map-service/map.service";
import { ChatService } from "../providers/chat-service/chat.service";
import { TranslateService } from "@ngx-translate/core/src/translate.service";
import { Router, ActivatedRoute } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { environment } from "../../environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { ConstantsService } from "app/providers/constants-service/constants.service";

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
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private mapService: MapService,
    public constantsService: ConstantsService,
    private translateService: TranslateService,
    private modalService: BsModalService,
    private chatService: ChatService,
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
          this.chatService.connect();
          this.mapService.resetAll();
          console.debug("Navigate to " + this.returnUrl);
          this.router.navigate([this.returnUrl]);
          this.loading = false;
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
