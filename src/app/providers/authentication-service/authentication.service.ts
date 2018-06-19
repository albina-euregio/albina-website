import { Injectable, Sanitizer, SecurityContext } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConstantsService } from '../constants-service/constants.service';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AuthorModel } from '../../models/author.model';

@Injectable()
export class AuthenticationService {

  public currentAuthor: AuthorModel;
  public jwtHelper: JwtHelper;

  constructor(
    public http: Http,
    public constantsService: ConstantsService,
    private sanitizer: Sanitizer)
  {
    //this.currentAuthor = JSON.parse(localStorage.getItem('currentAuthor'));
    localStorage.removeItem('currentAuthor');
    localStorage.removeItem('accessToken');
    this.currentAuthor = null;
    this.jwtHelper = new JwtHelper();
  }

  isUserLoggedIn() : boolean {
    if (this.currentAuthor && this.currentAuthor.accessToken)
      return !this.jwtHelper.isTokenExpired(this.currentAuthor.accessToken);
    else
      return false;
  }

  public logout() {
    localStorage.removeItem('currentAuthor');
    localStorage.removeItem('accessToken');
    console.log("[" + this.currentAuthor.name + "] Logged out!");
    this.currentAuthor = null;
  }

  public getAuthor() {
    return this.currentAuthor;
  }

  public getUsername() : string {
    if (this.currentAuthor)
      return this.currentAuthor.name;
    else
      null;
  }

  public getEmail() : string {
    if (this.currentAuthor)
      return this.currentAuthor.email;
    else
      null;
  }

  public getAccessToken() {
    if (this.currentAuthor)
      return this.currentAuthor.accessToken;
    else
      null;
  }

  public getRefreshToken() {
    if (this.currentAuthor)
      return this.currentAuthor.refreshToken;
    else
      null;
  }

  public getUserImage() {
    if (this.currentAuthor)
      return this.currentAuthor.image;
    else
      null;
  }

  public getUserRegion() {
    if (this.currentAuthor)
      return this.currentAuthor.region;
    else
      null;
  }

  public getUserImageSanitized() {
    if (this.currentAuthor && this.currentAuthor.image)
      return this.sanitizer.sanitize(SecurityContext.URL, 'data:image/jpg;base64,' + this.currentAuthor.image);
    else
      null;
  }

  public getUserLat() {
    return this.constantsService.getLat(this.getUserRegion());
  }

  public getUserLng() {
    return this.constantsService.getLng(this.getUserRegion());
  }

  public isCurrentUserInRole(role) {
    if (this.currentAuthor && this.currentAuthor.getRoles() && this.currentAuthor.getRoles() != undefined) {
      if (this.currentAuthor.getRoles().indexOf(role) > -1)
        return true;
    }
    return false;
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
        let accessToken = response.json() && response.json().access_token;
        if (accessToken) {
          this.currentAuthor = AuthorModel.createFromJson(response.json());
          this.currentAuthor.accessToken = response.json().access_token;
          this.currentAuthor.refreshToken = response.json().refresh_token;
          localStorage.setItem('currentAuthor', JSON.stringify({ username: response.json().username, accessToken: response.json().access_token, refreshToken: response.json().refresh_token, image: response.json().image, region: response.json().region, roles: response.json().roles }));
          localStorage.setItem('accessToken', response.json().access_token);
          return true;
        } else {
          return false;
        }
      });
  }

  public checkPassword(password: string) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'authentication/check';
    let authHeader = 'Bearer ' + this.getAccessToken();

    var json = Object();
    if (password && password != undefined)
      json['password'] = password;

    let body = JSON.stringify(json);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(url, body, options);
  }

  public changePassword(oldPassword: string, newPassword: string) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'authentication/change';
    let authHeader = 'Bearer ' + this.getAccessToken();

    var json = Object();
    if (oldPassword && oldPassword != undefined)
      json['oldPassword'] = oldPassword;
    if (newPassword && newPassword != undefined)
      json['newPassword'] = newPassword;

    let body = JSON.stringify(json);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(url, body, options);
  }

}
