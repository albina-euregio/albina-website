import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ObservationsService {

  constructor(
    public http: Http,
    public constantsService: ConstantsService)
  {
  }

  getSnowProfile(profileId) : Observable<Response> {
    let url = this.constantsService.getSnowObserverServerUrl() + 'profiles/' + profileId;
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  sendSnowProfile(profile) : Observable<Response> {
    return this.send("profiles", profile);
  }

  deleteSnowProfile(profile) : Observable<Response> {
    return this.delete("profiles", profile);
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

    return this.http.get(url, options);
  }

  sendHastyPit(hastyPit) : Observable<Response> {
    return this.send("hastyPits", hastyPit);
  }

  deleteHastyPit(hastyPit) : Observable<Response> {
    return this.delete("hastyPits", hastyPit);
  }

  getHastyPits() : Observable<Response> {
    return this.get("hastyPits");
  }

  sendQuickReport(quickReport) : Observable<Response> {
    return this.send("quickReports", quickReport);
  }

  deleteQuickReport(quickReport) : Observable<Response> {
    return this.delete("quickReports", quickReport);
  }

  getQuickReports() : Observable<Response> {
    return this.get("quickReports");
  }

  private send(type, item) : Observable<Response> {
    let url = this.constantsService.getSnowObserverServerUrl() + type;
    console.log(url);
    let body = JSON.stringify(item.toJson());
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options);
  }

  private delete(type, item) : Observable<Response> {
    let url = this.constantsService.getSnowObserverServerUrl() + type + '/' + item.serverId;
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete(url, options);
  }

  private get(type) : Observable<Response> {
    let date = new Date();
    date.setDate(date.getDate() - this.constantsService.getTimeframe());
    let url = this.constantsService.getSnowObserverServerUrl() + type + "?from=" + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }
}

