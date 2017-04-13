import { Component } from '@angular/core';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { TranslateService } from 'ng2-translate/src/translate.service';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  private authenticationService: AuthenticationService;
  private username: String;
  private password: String;

  constructor(
    private authService: AuthenticationService,
    public translateService: TranslateService)
  {
    this.authenticationService = authService;
  }

  login() {
  	//this.authenticationService.login(this.username, this.password);
    this.authenticationService.login("n.lanzanasto@gmail.com", "ijieGohx");
  }

}
