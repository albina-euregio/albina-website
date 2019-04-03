import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { SettingsService } from '../providers/settings-service/settings.service';
import { WsChatService } from '../providers/ws-chat-service/ws-chat.service';
import { ConstantsService } from '../providers/constants-service/constants.service';
import { ChatService } from '../providers/chat-service/chat.service';
import { ChatMessageModel } from '../models/chat-message.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { environment } from '../../environments/environment';
import { DomSanitizer  } from '@angular/platform-browser';
import * as Enums from '../enums/enums';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

  public disabled: boolean = false;
  public status: {isopen: boolean} = {isopen: false};
  public showChat: boolean;

  public message: string;

  public tmpRegion: string;

  public changeRegionModalRef: BsModalRef;
  @ViewChild('changeRegionTemplate') changeRegionTemplate: TemplateRef<any>;

  public config = {
    keyboard: true,
    class: 'modal-sm'
  };

  constructor(
    public translateService: TranslateService,
    public authenticationService: AuthenticationService,
    public bulletinsService: BulletinsService,
    public wsChatService: WsChatService,
    public chatService: ChatService,
    public settingsService: SettingsService,
    public constantsService: ConstantsService,
    public router: Router,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer)
  {
    this.message = "";
    this.tmpRegion = undefined;
    this.showChat = environment.showChat;
  }

  getStyle() {
    const style = `background-color: ${environment.headerBgColor}`;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }

  public showBadge(region?: string): boolean {
    return this.chatService.getNewMessageCount(region) > 0 && !this.status.isopen;
  }

  public toggled(open: boolean): void {
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  public focusChat($event, region?: string) {
    this.chatService.resetNewMessageCount(region);
  }

  public logout() {
    if (this.bulletinsService.getActiveDate())
      this.bulletinsService.unlockRegion(this.bulletinsService.getActiveDate(), this.authenticationService.getActiveRegion());
    this.authenticationService.logout();
    this.chatService.disconnect();
  }

  ngOnInit(): void {}

  sendChatMessage(region?: string) {
    this.chatService.resetNewMessageCount(region);
    if (this.message && this.message != undefined && this.message != "")
      this.chatService.sendMessage(this.message, region);
    this.message = "";
  }

  changeRegion(region) {
    if (!this.authenticationService.getActiveRegion().startsWith(region)) {
      if (this.router.url === "/bulletins/new" && this.bulletinsService.getIsEditable()) {
        this.tmpRegion = region;
        this.openChangeRegionModal(this.changeRegionTemplate, region);
      } else {
        if (this.bulletinsService.getActiveDate())
          this.bulletinsService.unlockRegion(this.bulletinsService.getActiveDate(), this.authenticationService.getActiveRegion());
        this.authenticationService.setActiveRegion(region);
        this.bulletinsService.init();
        this.router.navigate(["/bulletins"]);
      }
    }
  }

  openChangeRegionModal(template: TemplateRef<any>, region: string) {
    this.changeRegionModalRef = this.modalService.show(template, this.config);
  }

  changeRegionModalConfirm(): void {
    this.changeRegionModalRef.hide();
    if (this.bulletinsService.getActiveDate())
      this.bulletinsService.unlockRegion(this.bulletinsService.getActiveDate(), this.authenticationService.getActiveRegion());
    this.authenticationService.setActiveRegion(this.tmpRegion);
    this.tmpRegion = undefined;
    this.bulletinsService.init();
    this.router.navigate(["/bulletins"]);
  }
 
  changeRegionModalDecline(): void {
    this.changeRegionModalRef.hide();
  }
}
