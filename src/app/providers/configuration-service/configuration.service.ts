import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, ResponseOptions } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfigurationService {

  constructor(
    public http: Http,
    private constantsService: ConstantsService,
    private authenticationService: AuthenticationService)
  {
  }

  public loadConfigurationProperties() : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'configuration';
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(encodeURI(url), options);
  }

  public saveConfigurationProperties(json) {
    let url = this.constantsService.getServerUrl() + 'configuration';
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify(json);
    let options = new RequestOptions({ headers: headers });

    return this.http.post(encodeURI(url), body, options);
  }


  public loadSocialMediaConfiguration(regionId:String) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'configuration/region?regionId='+regionId;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(encodeURI(url), options);
  }

  public saveSocialMediaConfiguration(regionConfiguration) {
    let url = this.constantsService.getServerUrl() + 'configuration/region';
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify(regionConfiguration);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(encodeURI(url), body, options);
  }
}