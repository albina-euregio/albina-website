import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { SettingsService } from '../providers/settings-service/settings.service';
import { ChatService } from '../providers/chat-service/chat.service';

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
    public chatService: ChatService
  )
  {
    this.message = "";
  }

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  public logout() {
    this.authenticationService.logout();
  }

  ngOnInit(): void {}

  sendChatMessage() {
    if (this.message && this.message != undefined && this.message != "")
      this.chatService.sendMessage(this.message);
    this.message = "";
  }
}
