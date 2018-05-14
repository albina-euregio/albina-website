import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';

@Component({
  templateUrl: 'json.component.html'
})
export class JsonComponent {

  public bulletins: string;
  public loading: boolean;

  constructor(
    private translate: TranslateService,
    public bulletinsService: BulletinsService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService)
  {
    this.bulletins = undefined;
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.bulletinsService.loadJsonBulletins(this.bulletinsService.getActiveDate()).subscribe(
      data => {
        if (data.status == 204) {
          this.confirmationService.confirm({
            key: "noJsonDialog",
            header: this.translateService.instant("bulletins.json.noJsonDialog.header"),
            message: this.translateService.instant("bulletins.json.noJsonDialog.message"),
            accept: () => {
              this.goBack();
            }
          });
        } else {
          let text = data.text();
          this.bulletins = text;
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.confirmationService.confirm({
          key: "jsonNotLoadedDialog",
          header: this.translateService.instant("bulletins.json.jsonNotLoadedDialog.header"),
          message: this.translateService.instant("bulletins.json.jsonNotLoadedDialog.message"),
          accept: () => {
            this.goBack();
          }
        });
      }
    );
  }

  goBack() {
    this.router.navigate(['/bulletins']);
  }    
}
