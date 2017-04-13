import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConstantsService } from '../constants-service/constants.service';


@Injectable()
export class AuthenticationService {

  private token: String;
  private username: String;
  private constantsService: ConstantsService;

  constructor(
    public http: Http,
    public constants: ConstantsService)
  {
    this.constantsService = constants;
    this.token = null;
    this.username = null;
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
  }

  public getUsername() {
    return this.username;
  }

  public setUser(token, username) {
    this.token = token;
    this.username = username;
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

