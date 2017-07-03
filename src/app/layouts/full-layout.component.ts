import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { SettingsService } from '../providers/settings-service/settings.service';
import { ChatService } from '../providers/chat-service/chat.service';
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
    public chatService: ChatService,
    public settingsService: SettingsService,
    public router: Router)
  {
    this.message = "";

    this.chatService.getMessages().subscribe(
      data => {
        let response = data.json();
        for (let jsonChatMessage of response) {
          this.chatService.chatMessages.push(ChatMessageModel.createFromJson(jsonChatMessage));
          // this.chatService.newMessageCount += 1;
        }
        this.chatService.chatMessages.sort((a, b) : number => {
            if (a.time < b.time) return 1;
            if (a.time > b.time) return -1;
            return 0;
        });
      },
      error => {
        console.error("Chat messages could not be loaded!");
      }
    );
  }

  public showBadge(): boolean {
    return this.chatService.getNewMessageCount() > 0 && !this.status.isopen;
  }

  public toggled(open: boolean): void {
    if (open)
      this.chatService.resetNewMessageCount();
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  public focusChat($event) {
    this.chatService.resetNewMessageCount();
  }

  public logout() {
    this.authenticationService.logout();
  }

  ngOnInit(): void {}

  sendChatMessage() {
    this.chatService.resetNewMessageCount();
    if (this.message && this.message != undefined && this.message != "")
      this.chatService.sendMessage(this.message);
    this.message = "";
  }
}
