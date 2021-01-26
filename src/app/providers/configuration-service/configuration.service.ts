import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantsService } from "../constants-service/constants.service";
import { AuthenticationService } from "../authentication-service/authentication.service";
import { Observable } from "rxjs/Observable";

export interface Configuration {
  localImagesPath: string;
  localFontsPath: string;
  pdfDirectory: string;
  htmlDirectory: string;
  serverImagesUrl: string;
  serverImagesUrlLocalhost: string;
  mapsPath: string;
  mapProductionUrl: string;
  scriptsPath: string;
  createMaps: boolean;
  createPdf: boolean;
  createSimpleHtml: boolean;
  createStaticWidget: boolean;
  sendEmails: boolean;
  publishToMessengerpeople: boolean;
  publishToTelegramChannel: boolean;
  publishAt5PM: boolean;
  publishAt8AM: boolean;
  publishBulletinsTyrol: boolean;
  publishBulletinsSouthTyrol: boolean;
  publishBulletinsTrentino: boolean;
  publishBulletinsAran: boolean;
  publishBlogsTyrol: boolean;
  publishBlogsSouthTyrol: boolean;
  publishBlogsTrentino: boolean;
}


@Injectable()
export class ConfigurationService {

  constructor(
    public http: HttpClient,
    private constantsService: ConstantsService,
    private authenticationService: AuthenticationService) {
  }

  public loadConfigurationProperties(): Observable<Configuration> {
    const url = this.constantsService.getServerUrl() + "configuration";
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.get<Configuration>(url, options);
  }

  public saveConfigurationProperties(json) {
    const url = this.constantsService.getServerUrl() + "configuration";
    const body = JSON.stringify(json);
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.post(url, body, options);
  }

  public loadSocialMediaConfiguration(regionId: String): Observable<Response> {
    const url = this.constantsService.getServerUrl() + "configuration/region?regionId=" + regionId;
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.get<Response>(url, options);
  }

  public saveSocialMediaConfiguration(regionConfiguration) {
    const url = this.constantsService.getServerUrl() + "configuration/region";
    const body = JSON.stringify(regionConfiguration);
    const options = { headers: this.authenticationService.newAuthHeader() };
    return this.http.post<Response>(url, body, options);
  }

  public loadSocialMediaChannels() {
    const url = this.constantsService.getServerUrl() + "configuration/channels";
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.get<Response>(url, options);
  }

  public loadRecipientList(regionId: String) {
    const url = this.constantsService.getServerUrl() + "social-media/rapidmail/recipient-list/" + regionId;
    const authHeader = "Bearer " + this.authenticationService.getAccessToken();
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/hal+json",
      "Authorization": authHeader
    });
    const options = { headers: headers };
    return this.http.get<Response>(url, options);
  }

  public loadShipments() {
    const url = this.constantsService.getServerUrl() + "social-media/shipments";
    const options = { headers: this.authenticationService.newAuthHeader() };
    return this.http.get<Response>(url, options);
  }
}
