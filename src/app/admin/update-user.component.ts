import { Component, AfterContentInit, Inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationService } from "../providers/configuration-service/configuration.service";
import { RegionsService } from "../providers/regions-service/regions.service";
import { UserService } from "../providers/user-service/user.service";
import { UserModel } from "../models/user.model";

import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";

import * as bcrypt from "bcryptjs";

@Component({
  templateUrl: "update-user.component.html",
  selector: "app-update-user"
})
export class UpdateUserComponent implements AfterContentInit {

  public updateUserLoading: boolean;
  public update: boolean;

  public alerts: any[] = [];
  public roles: any;
  public regions: any;

  public activeName: string;
  public activeEmail: string;
  public activePassword: string;
  public activePassword2: string;
  public activeOrganization: string;
  public activeRoles: any[] = [];
  public activeRegions: any[] = [];

  constructor(
    private translateService: TranslateService,
    private userService: UserService,
    public configurationService: ConfigurationService,
    public regionsService: RegionsService,
    private dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.update = data.update;
    if (data.user) {
      this.activeName = data.user.name;
      this.activeEmail = data.user.email;
      this.activeOrganization = data.user.organization;
      if (data.user.roles) {
        this.activeRoles = data.user.roles;
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

  onRoleSelectionChange(Role) {
    if (this.activeRoles.indexOf(Role) > -1) {
      this.activeRoles.splice(this.activeRoles.indexOf(Role), 1);
    } else {
      this.activeRoles.push(Role);
    }
  }

  onRegionSelectionChange(region) {
    if (this.activeRegions.indexOf(region) > -1) {
      this.activeRegions.splice(this.activeRegions.indexOf(region), 1);
    } else {
      this.activeRegions.push(region);
    }
  }

  public createUser() {
    this.updateUserLoading = true;

    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(this.activePassword, salt);

    const user = new UserModel();
    user.setName(this.activeName);
    user.setEmail(this.activeEmail);
    user.setOrganization(this.activeOrganization);
    user.setPassword(password);
    user.setRoles(this.activeRoles);
    user.setRegions(this.activeRegions);

    this.userService.createUser(user).subscribe(
      data => {
        this.updateUserLoading = false;
        console.debug("User created!");
        this.closeDialog({
          type: "success",
          msg: this.translateService.instant("admin.users.createUser.success"),
        });
      },
      error => {
        this.updateUserLoading = false;
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
    this.updateUserLoading = true;

    const user = new UserModel();
    user.setName(this.activeName);
    user.setEmail(this.activeEmail);
    user.setOrganization(this.activeOrganization);
    user.setRoles(this.activeRoles);
    user.setRegions(this.activeRegions);

    this.userService.updateUser(user).subscribe(
      data => {
        this.updateUserLoading = false;
        console.debug("User updated!");
        this.closeDialog({
          type: "success",
          msg: this.translateService.instant("admin.users.updateUser.success")
        });
      },
      error => {
        this.updateUserLoading = false;
        console.error("User could not be updated!");
        this.closeDialog({
          type: "danger",
          msg: this.translateService.instant("admin.users.updateUser.error")
        });
      }
    );
  }

  closeDialog(data) {
    this.dialogRef.close(data);
  }
}
