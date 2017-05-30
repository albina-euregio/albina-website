import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
 
  private authenticationService: AuthenticationService;

  constructor(
      private router: Router,
      private authService: AuthenticationService)
  {
  }
 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (this.authService.isUserLoggedIn())
          return true;
 
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/pages/login'], { queryParams: { returnUrl: state.url }});
      return false;
  }
}