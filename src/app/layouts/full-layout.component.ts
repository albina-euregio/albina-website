import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { SettingsService } from '../providers/settings-service/settings.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

  public disabled: boolean = false;
  public status: {isopen: boolean} = {isopen: false};

  public authenticationService: AuthenticationService;

  constructor(
    public translateService: TranslateService,
    public authService: AuthenticationService,
    public settingsService: SettingsService
  )
  {
    this.authenticationService = authService;
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
}
