import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ObservationsService {

  private natlefsToken: string;

  constructor(
    public http: Http,
    public constantsService: ConstantsService)
  {
    this.authenticate(this.constantsService.getNatlefsUsername(), this.constantsService.getNatlefsPassword());
  }

  public authenticate(username, password) {
    let url = this.constantsService.getNatlefsServerUrl() + 'authentication';

    var json = Object();
    if (username && username != undefined)
      json['username'] = username;
    if (password && password != undefined)
      json['password'] = password;

    let body = JSON.stringify(json);
    let headers = new Headers({
      'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(encodeURI(url), body, options)
      .subscribe((response: Response) => {
        let token = response.json() && response.json().token;
        if (token) {
          this.natlefsToken = response.json().token;
          return true;
        } else {
          return false;
        }
      });
  }

  getNatlefs() : Observable<Response> {
    let date = new Date();
    date.setDate(date.getDate() - this.constantsService.getTimeframe());
    let url = this.constantsService.getNatlefsServerUrl() + "quickReports?from=" + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    let authHeader = 'Bearer ' + this.natlefsToken;
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(encodeURI(url), options);
  }

  getSnowProfile(profileId) : Observable<Response> {
    let url = this.constantsService.getSnowObserverServerUrl() + 'profiles/' + profileId;
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(encodeURI(url), options);
  }

  getSnowProfiles() : Observable<Response> {
    return this.get("profiles");
  }

  getHastyPit(profileId) : Observable<Response> {
    let url = this.constantsService.getSnowObserverServerUrl() + 'hastyPits/' + profileId;
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(encodeURI(url), options);
  }

  getHastyPits() : Observable<Response> {
    return this.get("hastyPits");
  }

  getQuickReports() : Observable<Response> {
    return this.get("quickReports");
  }

  private get(type) : Observable<Response> {
    let date = new Date();
    date.setDate(date.getDate() - this.constantsService.getTimeframe());
    let url = this.constantsService.getSnowObserverServerUrl() + type + "?from=" + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(encodeURI(url), options);
  }
}

