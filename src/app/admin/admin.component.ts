import { Component, HostListener } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { ConstantsService } from '../providers/constants-service/constants.service';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';

declare var L: any;

@Component({
  templateUrl: 'admin.component.html'
})
export class AdminComponent {

  public statusMap: Map<number, Enums.BulletinStatus>;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private constantsService: ConstantsService,
    private bulletinsService: BulletinsService,
    private router: Router)
  {
  }

  ngOnInit() {
    if (this.authenticationService.isCurrentUserInRole(this.constantsService.roleAdmin)) {
      let startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);

      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 3);
      endDate.setHours(0, 0, 0, 0);

      // TODO use the information about the publciation process somewhere (maybe just as ADMIN?)
      this.bulletinsService.getPublicationStatus(this.authenticationService.getActiveRegion(), startDate, endDate).subscribe(
        data => {
          let json = data.json();
        },
        error => {
          console.error("Publication status could not be loaded!");
        }
      );
    }
  }

}
