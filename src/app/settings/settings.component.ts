import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { SettingsService } from "../providers/settings-service/settings.service";
import { AlertComponent } from "ngx-bootstrap/alert";
import { UserService } from "app/providers/user-service/user.service";

@Component({
  templateUrl: "settings.component.html"
})
export class SettingsComponent {

  public changePasswordLoading: boolean;

  public oldPassword: string;
  public newPassword1: string;
  public newPassword2: string;

  public alerts: any[] = [];

  constructor(
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private settingsService: SettingsService,
    private constantsService: ConstantsService) {
    this.changePasswordLoading = false;
  }

  changePassword() {
    this.changePasswordLoading = true;
    this.userService.checkPassword(this.oldPassword).subscribe(
      data => {
        this.userService.changePassword(this.oldPassword, this.newPassword1).subscribe(
          data2 => {
            this.oldPassword = "";
            this.newPassword1 = "";
            this.newPassword2 = "";
            this.changePasswordLoading = false;
            window.scrollTo(0, 0);
            this.alerts.push({
              type: "success",
              msg: this.translateService.instant("settings.changePassword.passwordChanged"),
              timeout: 5000
            });
          },
          error => {
            console.error("Password could not be changed: " + JSON.stringify(error._body));
            this.changePasswordLoading = false;
            window.scrollTo(0, 0);
            this.alerts.push({
              type: "danger",
              msg: this.translateService.instant("settings.changePassword.passwordChangeError"),
              timeout: 5000
            });
          }
        );
      },
      error => {
        console.warn("Password incorrect: " + JSON.stringify(error._body));
        this.changePasswordLoading = false;
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("settings.changePassword.passwordIncorrect"),
          timeout: 5000
        });
      }
    );
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  isAdmin() {
    if (this.authenticationService.isCurrentUserInRole(this.constantsService.roleAdmin)) {
      return true;
    } else {
      return false;
    }
  }
}
