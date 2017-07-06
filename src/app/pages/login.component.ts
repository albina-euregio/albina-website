import { Component, OnInit, HostListener } from '@angular/core';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { MapService } from '../providers/map-service/map.service';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  public username: string;
  public password: string;
  public returnUrl: String;
  public loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private mapService: MapService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService)
  {
    this.loading = false;
  }

  ngOnInit() {
    // reset login status
    // this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    // console.log("Return URL: " + this.route.snapshot.queryParams['returnUrl']);
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.returnUrl = '/bulletins';
  }

  login() {
    this.loading = true;

    this.authenticationService.login(this.username, this.password).subscribe(
      data => {
        if (data === true) {
          console.log("[" + this.username + "] Logged in!");
          this.mapService.resetAll();
          console.log("Navigate to " + this.returnUrl);
          this.router.navigate([this.returnUrl]);
          this.loading = false;
        } else {
          console.error("[" + this.username + "] Login failed!");
          this.confirmationService.confirm({
            header: this.translateService.instant("login.errorDialog.header"),
            message: this.translateService.instant("login.errorDialog.message"),
            accept: () => {
              this.loading = false;
            }
          });
        }
      },
      error => {
        console.error("[" + this.username + "] Login failed: " + JSON.stringify(error._body));
        this.confirmationService.confirm({
          header: this.translateService.instant("login.errorDialog.header"),
          message: this.translateService.instant("login.errorDialog.message"),
          accept: () => {
            this.loading = false;
          }
        });
      }
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.keyCode == 13 && !this.loading) {
      this.login();
    }
  }
}
