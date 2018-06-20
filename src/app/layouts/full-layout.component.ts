import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { SettingsService } from '../providers/settings-service/settings.service';
import { ChatService } from '../providers/chat-service/chat.service';
import { ConstantsService } from '../providers/constants-service/constants.service';
import { SocketService } from '../providers/socket-service/socket.service';
import { ChatMessageModel } from '../models/chat-message.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

  public disabled: boolean = false;
  public status: {isopen: boolean} = {isopen: false};

  public message: string;

  constructor(
    public translateService: TranslateService,
    public authenticationService: AuthenticationService,
    public bulletinsService: BulletinsService,
    public chatService: ChatService,
    public settingsService: SettingsService,
    public socketService: SocketService,
    public constantsService: ConstantsService,
    public router: Router)
  {
    this.message = "";
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
      this.bulletinsService.unlockRegion(this.bulletinsService.getActiveDate(), this.authenticationService.getUserRegion());
    this.authenticationService.logout();
    this.socketService.logout();
  }

  ngOnInit(): void {}

  sendChatMessage(region?: string) {
    this.chatService.resetNewMessageCount(region);
    if (this.message && this.message != undefined && this.message != "")
      this.chatService.sendMessage(this.message, region);
    this.message = "";
  }
}
