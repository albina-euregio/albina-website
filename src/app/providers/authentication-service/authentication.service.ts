import { Injectable, Sanitizer, SecurityContext } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConstantsService } from '../constants-service/constants.service';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { UserModel } from '../../models/user.model';

@Injectable()
export class AuthenticationService {

  public currentUser: UserModel;
  public jwtHelper: JwtHelper;

  constructor(
    public http: Http,
    public constantsService: ConstantsService,
    private sanitizer: Sanitizer)
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.jwtHelper = new JwtHelper();
  }

  isUserLoggedIn() : boolean {
    if (this.currentUser && this.currentUser.token)
      return !this.jwtHelper.isTokenExpired(this.currentUser.token);
    else
      return false;
  }

  public logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    console.log("[" + this.currentUser.username + "] Logged out!");
    this.currentUser = null;
  }

  public getUsername() : string {
    if (this.currentUser)
      return this.currentUser.username;
    else
      null;
  }

  public getToken() {
    if (this.currentUser)
      return this.currentUser.token;
    else
      null;
  }

  public getUserImage() {
    if (this.currentUser)
      return this.currentUser.image;
    else
      null;
  }

  public getUserRegion() {
    if (this.currentUser)
      return this.currentUser.region;
    else
      null;
  }

  public getUserImageSanitized() {
    if (this.currentUser && this.currentUser.image)
      return this.sanitizer.sanitize(SecurityContext.URL, 'data:image/jpg;base64,' + this.currentUser.image);
    else
      null;
  }

  public getUserLat() {
    return this.constantsService.getLat(this.getUserRegion());
  }

  public getUserLng() {
    return this.constantsService.getLng(this.getUserRegion());
  }

  public login(username: string, password: string): Observable<boolean> {
    let url = this.constantsService.getServerUrl() + 'authentication';
    console.log(url);

    var json = Object();
    if (username && username != undefined)
      json['username'] = username;
    if (password && password != undefined)
      json['password'] = password;

    let body = JSON.stringify(json);
    let headers = new Headers({
      'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options)
      .map((response: Response) => {
        let token = response.json() && response.json().token;
        if (token) {
          this.currentUser = new UserModel();
          this.currentUser.username = response.json().username;
          this.currentUser.token = response.json().token;
          this.currentUser.image = response.json().image;
          this.currentUser.region = response.json().region;
          localStorage.setItem('currentUser', JSON.stringify({ username: response.json().username, token: response.json().token, image: response.json().image, region: response.json().region }));
          localStorage.setItem('token', response.json().token);
          return true;
        } else {
          return false;
        }
      });
  }
}
