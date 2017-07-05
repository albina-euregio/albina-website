import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';

@Component({
  templateUrl: 'caaml.component.html'
})
export class CaamlComponent {

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
    this.bulletinsService.loadCaamlBulletins(this.bulletinsService.getActiveDate()).subscribe(
      data => {
        let text = data.text();
        this.bulletins = text;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.confirmationService.confirm({
          key: "caamlNotLoadedDialog",
          header: this.translateService.instant("bulletins.caaml.caamlNotLoadedDialog.header"),
          message: this.translateService.instant("bulletins.caaml.caamlNotLoadedDialog.message"),
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
