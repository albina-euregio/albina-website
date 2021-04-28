import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationService } from "../providers/configuration-service/configuration.service";
import { AlertComponent } from "ngx-bootstrap";
import { UserService } from "../providers/user-service/user.service";
import { UserModel } from "../models/user.model";

@Component({
  templateUrl: "users.component.html",
  selector: "app-users"
})
export class UsersComponent {

  public alerts: any[] = [];

  constructor(
    private translateService: TranslateService,
    private userService: UserService,
    public configurationService: ConfigurationService) {
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
