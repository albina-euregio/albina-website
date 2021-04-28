import { Component, AfterContentInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationService } from "../providers/configuration-service/configuration.service";
import { AlertComponent } from "ngx-bootstrap";
import { UserService } from "../providers/user-service/user.service";
import { UserModel } from "../models/user.model";

import * as bcrypt from "bcryptjs";

@Component({
  templateUrl: "create-user.component.html",
  selector: "app-create-user"
})
export class CreateUserComponent implements AfterContentInit {

  public createUserLoading: boolean;

  public alerts: any[] = [];
  public roles: any;
  public regions: any;

  public activeName: string;
  public activeEmail: string;
  public activePassword: string;
  public activeOrganization: string;
  public activeRole: string;
  public activeRegions: any[] = [];

  constructor(
    private translateService: TranslateService,
    private userService: UserService,
    public configurationService: ConfigurationService) {
  }

  ngAfterContentInit() {
    this.userService.getRoles().subscribe(
      data => {
        this.roles = data;
      },
      error => {
        console.error("Roles could not be loaded!");
      }
    );
    this.userService.getRegions().subscribe(
      data => {
        this.regions = data;
      },
      error => {
        console.error("Regions could not be loaded!");
      }
    );
  }

  onRoleSelectionChange(role) {
    this.activeRole = role;
  }

  onRegionSelectionChange(region) {
    if (this.activeRegions.indexOf(region) > -1) {
      this.activeRegions.splice(this.activeRegions.indexOf(region), 1);
    } else {
      this.activeRegions.push(region);
    }
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  public createUser() {
    this.createUserLoading = true;

    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(this.activePassword, salt);

    const user = new UserModel();
    user.setName(this.activeName);
    user.setEmail(this.activeEmail);
    user.setOrganization(this.activeOrganization);
    user.setPassword(password);
    user.addRole(this.activeRole);
    user.setRegions(this.activeRegions);

    this.userService.createUser(user).subscribe(
      data => {
        this.createUserLoading = false;
        console.debug("User created!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "success",
          msg: this.translateService.instant("admin.create-user.success"),
          timeout: 5000
        });
      },
      error => {
        this.createUserLoading = false;
        console.error("User could not be created!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("admin.create-user.error"),
          timeout: 5000
        });
      }
    );
  }
}
