import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { BulletinsService } from "../providers/bulletins-service/bulletins.service";
import { SettingsService } from "../providers/settings-service/settings.service";
import { RegionsService } from "../providers/regions-service/regions.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { ChatService } from "../providers/chat-service/chat.service";
import { Router } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal";
import { environment } from "../../environments/environment";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-dashboard",
  templateUrl: "./full-layout.component.html"
})
export class FullLayoutComponent {

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };
  public showChat: boolean;

  public message: string;

  public tmpRegion: string;

  public changeRegionModalRef: BsModalRef;
  @ViewChild("changeRegionTemplate") changeRegionTemplate: TemplateRef<any>;

  public config = {
    keyboard: true,
    class: "modal-sm"
  };

  constructor(
    public translateService: TranslateService,
    public authenticationService: AuthenticationService,
    public bulletinsService: BulletinsService,
    public chatService: ChatService,
    public settingsService: SettingsService,
    public regionsService: RegionsService,
    public constantsService: ConstantsService,
    public router: Router,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer) {
    this.message = "";
    this.tmpRegion = undefined;
    this.showChat = environment.showChat;
    if (this.showChat && this.authenticationService.isUserLoggedIn()) {
      this.chatService.connect();
    }
  }

  getStyle() {
    const style = `background-color: ${environment.headerBgColor}`;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }

  public showBadge(region?: string): boolean {
    return this.chatService.getNewMessageCount(region) > 0 && !this.status.isopen;
  }

  public toggled(): void {
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  public focusChat(region?: string) {
    this.chatService.resetNewMessageCount(region);
  }

  public logout() {
    if (this.bulletinsService.getActiveDate()) {
      this.bulletinsService.unlockRegion(this.bulletinsService.getActiveDate(), this.authenticationService.getActiveRegionId());
    }
    this.authenticationService.logout();
    this.chatService.disconnect();
  }

  sendChatMessage(region?: string) {
    this.chatService.resetNewMessageCount(region);
    if (this.message && this.message !== undefined && this.message !== "") {
      this.chatService.sendMessage(this.message, region);
    }
    this.message = "";
  }

  changeRegion(region) {
    if (!this.authenticationService.getActiveRegionId().startsWith(region)) {
      if (this.router.url === "/bulletins/new" && this.bulletinsService.getIsEditable()) {
        this.tmpRegion = region;
        this.openChangeRegionModal(this.changeRegionTemplate);
      } else {
        this.change(region);
      }
    }
  }

  openChangeRegionModal(template: TemplateRef<any>) {
    this.changeRegionModalRef = this.modalService.show(template, this.config);
  }

  changeRegionModalConfirm(): void {
    this.changeRegionModalRef.hide();
    this.change(this.tmpRegion);
    this.tmpRegion = undefined;
  }

  changeRegionModalDecline(): void {
    this.changeRegionModalRef.hide();
  }

  private change(region) {
    if (this.bulletinsService.getActiveDate()) {
      this.bulletinsService.unlockRegion(this.bulletinsService.getActiveDate(), this.authenticationService.getActiveRegionId());
    }
    this.authenticationService.setActiveRegion(region);
    this.bulletinsService.init();
    this.router.navigate(["/bulletins"]);
  }
}
