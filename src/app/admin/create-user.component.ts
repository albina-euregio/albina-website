import { Component, AfterContentInit, Inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationService } from "../providers/configuration-service/configuration.service";
import { AlertComponent } from "ngx-bootstrap";
import { UserService } from "../providers/user-service/user.service";
import { UserModel } from "../models/user.model";

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";

import * as bcrypt from "bcryptjs";

@Component({
  templateUrl: "create-user.component.html",
  selector: "app-create-user"
})
export class CreateUserComponent implements AfterContentInit {

  public createUserLoading: boolean;
  public update: boolean;

  public alerts: any[] = [];
  public roles: any;
  public regions: any;

  public activeName: string;
  public activeEmail: string;
  public activePassword: string;
  public activePassword2: string;
  public activeOrganization: string;
  public activeRole: string;
  public activeRegions: any[] = [];

  constructor(
    private translateService: TranslateService,
    private userService: UserService,
    public configurationService: ConfigurationService,
    private dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.update = data.update;
    if (data.user) {
      this.activeName = data.user.name;
      this.activeEmail = data.user.email;
      this.activeOrganization = data.user.organization;
      if (data.user.roles && data.user.roles.length > 0) {
        this.activeRole = data.user.roles[0];
      }
      if (data.user.regions) {
        this.activeRegions = data.user.regions;
      }
    }
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
        this.closeDialog({
          type: "success",
          msg: this.translateService.instant("admin.users.createUser.success"),
        });
      },
      error => {
        this.createUserLoading = false;
        console.error("User could not be created!");
        window.scrollTo(0, 0);
        this.closeDialog({
          type: "danger",
          msg: this.translateService.instant("admin.users.createUser.error")
        });
      }
    );
  }

  public updateUser() {
    this.createUserLoading = true;

    const user = new UserModel();
    user.setName(this.activeName);
    user.setEmail(this.activeEmail);
    user.setOrganization(this.activeOrganization);
    user.addRole(this.activeRole);
    user.setRegions(this.activeRegions);

    this.userService.updateUser(user).subscribe(
      data => {
        this.createUserLoading = false;
        console.debug("User updated!");
        this.closeDialog({
          type: "success",
          msg: this.translateService.instant("admin.users.updateUser.success")
        });
      },
      error => {
        this.createUserLoading = false;
        console.error("User could not be updated!");
        this.closeDialog({
          type: "danger",
          msg: this.translateService.instant("admin.users.createUser.error")
        });
      }
    );
  }

  closeDialog(data) {
    this.dialogRef.close(data);
  }
}
