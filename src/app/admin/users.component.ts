import { AfterContentInit, Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationService } from "../providers/configuration-service/configuration.service";
import { AlertComponent } from "ngx-bootstrap/alert";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { UserService } from "../providers/user-service/user.service";
import { TemplateRef } from "@angular/core";
import { CreateUserComponent } from "./create-user.component";
import { UpdateUserComponent } from "./update-user.component";

import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MatLegacyDialogConfig as MatDialogConfig } from "@angular/material/legacy-dialog";

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
    this.updateUsers();
  }

  updateUsers() {
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
    this.showCreateDialog();
  }

  showCreateDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "calc(100% - 10px)";
    dialogConfig.maxHeight = "100%";
    dialogConfig.maxWidth = "100%";

    const dialogRef = this.dialog.open(CreateUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        window.scrollTo(0, 0);
        this.updateUsers();
        if (data !== undefined && data !== "") {
          this.alerts.push({
            type: data.type,
            msg: data.msg,
            timeout: 5000
          });
        }
      }
    )
  }

  showUpdateDialog(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "calc(100% - 10px)";
    dialogConfig.maxHeight = "100%";
    dialogConfig.maxWidth = "100%";
    dialogConfig.data = {
      user: user
    };

    const dialogRef = this.dialog.open(UpdateUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        window.scrollTo(0, 0);
        this.updateUsers();
        if (data !== undefined && data !== "") {
          this.alerts.push({
            type: data.type,
            msg: data.msg,
            timeout: 5000
          });
        }
      }
    )
  }

  editUser(event, user) {
    this.showUpdateDialog(user);
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
          this.updateUsers();
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
