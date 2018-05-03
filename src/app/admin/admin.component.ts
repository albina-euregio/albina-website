import { Component, HostListener } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';

declare var L: any;

@Component({
  templateUrl: 'ADMIN.component.html'
})
export class AdminComponent {

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private confirmationService: ConfirmationService)
  {
  }

  ngOnInit() {
  }

}
