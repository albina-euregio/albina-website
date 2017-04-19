import { Injectable, Sanitizer, SecurityContext } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConstantsService } from '../constants-service/constants.service';


@Injectable()
export class AuthenticationService {

  private token: string;
  private username: string;
  private image: string;
  private constantsService: ConstantsService;

  constructor(
    public http: Http,
    public constants: ConstantsService,
    private sanitizer: Sanitizer)
  {
    this.constantsService = constants;
    this.token = null;
    this.username = null;
    this.image = null;
  }

  isUserLoggedIn() : boolean {
    if (this.token && this.token != undefined)
      return true;
    else
      return false;
  }

  public logout() {
    this.token = null;
    console.log("[" + this.username + "] Logged out!");
    this.username = null;
    this.image = null;
  }

  public getUsername() : string{
    return this.username;
  }

  public setUser(token, username, image) {
    this.token = token;
    this.username = username;
    this.image = image;
  }

  public getUserImage() {
    return this.image;
  }

  public getUserImageSanitized() {
    return this.sanitizer.sanitize(SecurityContext.URL, 'data:image/jpg;base64,' + this.image);
  }

  public authenticate(username, password) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'authentication';
    console.log(url);

    var json = Object();
    if (username && username != undefined)
      json['username'] = username;
    if (password && password != undefined)
      json['password'] = password;

    let body = JSON.stringify(json);
    console.log(body);
    let headers = new Headers({
      'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options);
  }
}
