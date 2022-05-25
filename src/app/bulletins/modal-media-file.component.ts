import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { BulletinsService } from "../providers/bulletins-service/bulletins.service";
import { AlertComponent } from "ngx-bootstrap/alert";
import { TranslateService } from "@ngx-translate/core";
import { MediaFileService } from "app/providers/media-file-service/media-file.service";

@Component({
  selector: "app-modal-media-file",
  templateUrl: "modal-media-file.component.html"
})

export class ModalMediaFileComponent {
  date;
  component;
  file;
  text;
  important;
  
  public alerts: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    public authenticationService: AuthenticationService,
    public bulletinsService: BulletinsService,
    public constantsService: ConstantsService,
    public mediaFileService: MediaFileService,
    public translateService: TranslateService) {
  }

  mediaFileModalConfirm(): void {
    this.uploadFile()
  }

  mediaFileModalDecline(): void {
    this.component.mediaFileModalConfirm();
  }

  selectFile(event) {
    this.file = event.target.files[0];
  }

  toggleImportant() {
    this.important ? this.important = false : this.important = true;
  }

  uploadFile() {
    if (this.text == null || this.text == "") {
      console.log("No text entered!");
      window.scrollTo(0, 0);
      this.alerts.push({
        type: "danger",
        msg: this.translateService.instant("bulletins.table.mediaFileDialog.missingText"),
        timeout: 5000
      });
      return;
    }
    if (this.file == null) {
      console.log("No file selected!");
      window.scrollTo(0, 0);
      this.alerts.push({
        type: "danger",
        msg: this.translateService.instant("bulletins.table.mediaFileDialog.missingFile"),
        timeout: 5000
      });
      return;
    }

    this.mediaFileService.uploadFile(this.date, this.file, this.text, this.important)
      .subscribe(
        data => {
          console.log("Upload complete!");
          this.component.mediaFileModalConfirm();
        },
        error => {
          console.log("Upload Error:", error);
          window.scrollTo(0, 0);
          this.alerts.push({
            type: "danger",
            msg: this.translateService.instant("bulletins.table.mediaFileDialog.uploadError"),
            timeout: 5000
          });
        }
      )
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
