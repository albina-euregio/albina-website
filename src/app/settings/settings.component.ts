import { Component, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertComponent } from 'ngx-bootstrap';

declare var L: any;

@Component({
  templateUrl: 'settings.component.html'
})
export class SettingsComponent {

  private changePasswordLoading: boolean;

  private oldPassword: string;
  private newPassword1: string;
  private newPassword2: string;

  public alerts: any[] = [];

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private router: Router)
  {
    this.changePasswordLoading = false;
  }

  ngOnInit() {
  }

  changePassword() {
    this.changePasswordLoading = true;
    if (this.newPassword1 == this.newPassword2) {
      this.authenticationService.checkPassword(this.oldPassword).subscribe(
        data => {
          this.authenticationService.changePassword(this.oldPassword, this.newPassword1).subscribe(
            data => {
              this.oldPassword = "";
              this.newPassword1 = "";
              this.newPassword2 = "";
              this.changePasswordLoading = false;
              this.alerts.push({
                type: 'success',
                msg: this.translateService.instant("settings.changePassword.passwordChanged"),
                timeout: 5000
              });
            },
            error => {
              console.error("Password could not be changed: " + JSON.stringify(error._body));
              this.changePasswordLoading = false;
              this.alerts.push({
                type: 'danger',
                msg: this.translateService.instant("settings.changePassword.passwordChangeError"),
                timeout: 5000
              });
            }
          );
        },
        error => {
          console.warn("Password incorrect: " + JSON.stringify(error._body));
          this.changePasswordLoading = false;
          this.alerts.push({
            type: 'danger',
            msg: this.translateService.instant("settings.changePassword.passwordIncorrect"),
            timeout: 5000
          });
        }
      );
    } else {
      console.warn("Passwords not matching");
      this.changePasswordLoading = false;
      this.alerts.push({
        type: 'danger',
        msg: this.translateService.instant("settings.changePassword.passwordsNotMatching"),
        timeout: 5000
      });
    }
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
