import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantsService } from "../constants-service/constants.service";
import { AuthenticationService } from "../authentication-service/authentication.service";
import { Observable } from "rxjs/Observable";

export interface RegionConfiguration {
  id: string;
  publishBulletins: boolean;
  publishBlogs: boolean;
  createCaamlV5: boolean;
  createCaamlV6: boolean;
  createMaps: boolean;
  createPdf: boolean;
  createSimpleHtml: boolean;
  sendEmails: boolean;
  sendTelegramMessages: boolean;
  sendPushNotifications: boolean;
  serverInstance: ServerInstanceConfiguration;
}

export interface ServerInstanceConfiguration {
  name: string;
  apiUrl: string;
  username: string;
  password: string;
  externalServer: boolean;
  publishAt5PM: boolean;
  publishAt8AM: boolean;
  pdfDirectory: string;
  htmlDirectory: string;
  mapsPath: string;
  mediaPath: string;
  mapProductionUrl: string;
  serverImagesUrl: string;
}


@Injectable()
export class ConfigurationService {

  constructor(
    public http: HttpClient,
    private constantsService: ConstantsService,
    private authenticationService: AuthenticationService) {
  }

  public loadRegionConfiguration(region): Observable<RegionConfiguration> {
    const url = this.constantsService.getServerUrl() + "regions/configuration?region=" + region;
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.get<RegionConfiguration>(url, options);
  }

  public updateRegionConfiguration(json) {
    const url = this.constantsService.getServerUrl() + "regions";
    const body = JSON.stringify(json);
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.put(url, body, options);
  }

  public createRegionConfiguration(json) {
    const url = this.constantsService.getServerUrl() + "regions";
    const body = JSON.stringify(json);
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.post(url, body, options);
  }
}
