import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { ConstantsService } from "../constants-service/constants.service";
import { AuthenticationService } from "../authentication-service/authentication.service";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ConfigurationService {

  constructor(
    public http: Http,
    private constantsService: ConstantsService,
    private authenticationService: AuthenticationService) {
  }

  public loadConfigurationProperties(): Observable<Response> {
    const url = this.constantsService.getServerUrl() + "configuration";
    const authHeader = "Bearer " + this.authenticationService.getAccessToken();
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": authHeader
    });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  public saveConfigurationProperties(json) {
    const url = this.constantsService.getServerUrl() + "configuration";
    const authHeader = "Bearer " + this.authenticationService.getAccessToken();
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": authHeader
    });
    const body = JSON.stringify(json);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options);
  }

  public loadSocialMediaConfiguration(regionId: String): Observable<Response> {
    const url = this.constantsService.getServerUrl() + "configuration/region?regionId=" + regionId;
    const authHeader = "Bearer " + this.authenticationService.getAccessToken();
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": authHeader
    });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  public saveSocialMediaConfiguration(regionConfiguration) {
    const url = this.constantsService.getServerUrl() + "configuration/region";
    const authHeader = "Bearer " + this.authenticationService.getAccessToken();
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": authHeader
    });
    const body = JSON.stringify(regionConfiguration);
    const options = new RequestOptions({ headers: headers });
    return this.http.post(url, body, options);
  }

  public loadSocialMediaChannels() {
    const url = this.constantsService.getServerUrl() + "configuration/channels";
    const authHeader = "Bearer " + this.authenticationService.getAccessToken();
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": authHeader
    });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  public loadRecipientList(regionId: String) {
    const url = this.constantsService.getServerUrl() + "social-media/rapidmail/recipient-list/" + regionId;
    const authHeader = "Bearer " + this.authenticationService.getAccessToken();
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/hal+json",
      "Authorization": authHeader
    });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(url, options);
  }

  public loadShipments() {
    const url = this.constantsService.getServerUrl() + "social-media/shipments";
    const authHeader = "Bearer " + this.authenticationService.getAccessToken();
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": authHeader
    });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(url, options);
  }
}
