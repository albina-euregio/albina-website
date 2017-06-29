import { Component, OnInit, HostListener } from '@angular/core';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  public username: String;
  public password: String;
  public returnUrl: String;
  public loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
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

    this.authenticationService.authenticate(this.username, this.password).subscribe(
      data => {
        var result = data.json();
        this.authenticationService.setUser(result.token, result.username, result.image, result.region);
        console.log("[" + this.username + "] Logged in!");
        console.log("Navigate to " + this.returnUrl);
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.loading = false;
        console.error("[" + this.username + "] Login failed: " + JSON.stringify(error._body));
        this.confirmationService.confirm({
          header: this.translateService.instant("login.errorDialog.header"),
          message: this.translateService.instant("login.errorDialog.message"),
          accept: () => {
          }
        });
        // TODO show error on page
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
