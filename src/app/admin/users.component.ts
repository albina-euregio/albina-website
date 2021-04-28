import { AfterContentInit, Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationService } from "../providers/configuration-service/configuration.service";
import { AlertComponent, BsModalRef, BsModalService } from "ngx-bootstrap";
import { UserService } from "../providers/user-service/user.service";
import { UserModel } from "../models/user.model";
import { TemplateRef } from "@angular/core";
import { CreateUserComponent } from "./create-user.component";

import { MatDialog, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { UpgradeAdapter } from "@angular/upgrade";

@Component({
  templateUrl: "users.component.html",
  selector: "app-users"
})
export class UsersComponent implements AfterContentInit {

  public alerts: any[] = [];
  public users: any;

  public deleteUserModalRef: BsModalRef;
  @ViewChild("deleteUserTemplate") deleteUserTemplate: TemplateRef<any>;

  public config = {
    keyboard: true,
    class: "modal-sm"
  };
  activeUser: any;

  constructor(
    private translateService: TranslateService,
    private dialog: MatDialog,
    private userService: UserService,
    private modalService: BsModalService,
    public configurationService: ConfigurationService) {
  }

  ngAfterContentInit() {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error("Users could not be loaded!");
      }
    );
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  createUser(event) {
    this.showDialog(false);
  }

  showDialog(update, user?) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "calc(100% - 10px)";
    dialogConfig.maxHeight = "100%";
    dialogConfig.maxWidth = "100%";
    dialogConfig.data = {
      update: update,
      user: user
    };

    this.dialog.open(CreateUserComponent, dialogConfig);
  }

  hideDialog() {
    this.dialog.closeAll();
  }

  editUser(event, user) {
    this.showDialog(true, user);
  }

  deleteUser(event, user) {
    this.activeUser = user;
    this.openDeleteUserModal(this.deleteUserTemplate);
  }

  openDeleteUserModal(template: TemplateRef<any>) {
    this.deleteUserModalRef = this.modalService.show(template, this.config);
  }

  deleteUserModalConfirm(event) {
    event.currentTarget.setAttribute("disabled", true);
    this.deleteUserModalRef.hide();
    if (this.activeUser) {
      this.userService.deleteUser(this.activeUser.email).subscribe(
        data => {
          console.debug("User deleted!");
          this.ngAfterContentInit();
          window.scrollTo(0, 0);
          this.alerts.push({
            type: "success",
            msg: this.translateService.instant("admin.users.deleteUser.success"),
            timeout: 5000
          });
        },
        error => {
          console.error("Users could not be deleted!");
          window.scrollTo(0, 0);
          this.alerts.push({
            type: "danger",
            msg: this.translateService.instant("admin.users.deleteUser.error"),
            timeout: 5000
          });
        }
      );
    }
    this.activeUser = undefined;
  }

  deleteUserModalDecline(event) {
    event.currentTarget.setAttribute("disabled", true);
    this.deleteUserModalRef.hide();
    this.activeUser = undefined;
  }
}
