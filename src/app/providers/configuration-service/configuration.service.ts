import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantsService } from "../constants-service/constants.service";
import { AuthenticationService } from "../authentication-service/authentication.service";
import { Observable } from "rxjs";

export interface RegionConfiguration {
  id: string;
  microRegions: number;
  subRegions: string[];
  superRegions: string[];
  neighborRegions: string[];
  publishBulletins: boolean;
  publishBlogs: boolean;
  createCaamlV5: boolean;
  createCaamlV6: boolean;
  createJson: boolean;
  createMaps: boolean;
  createPdf: boolean;
  sendEmails: boolean;
  createSimpleHtml: boolean;
  sendTelegramMessages: boolean;
  sendPushNotifications: boolean;
  enableMediaFile: boolean;
  enableAvalancheProblemCornices: boolean;
  enableAvalancheProblemNoDistinctAvalancheProblem: boolean;
  showMatrix: boolean;
  serverInstance: ServerConfiguration;
  pdfColor: string;
  emailColor: string;
  pdfMapYAmPm: number;
  pdfMapYFd: number;
  pdfMapWidthAmPm: number;
  pdfMapWidthFd: number;
  pdfMapHeight: number;
  pdfFooterLogo: boolean;
  pdfFooterLogoColorPath: string;
  pdfFooterLogoBwPath: string;
  mapXmax: number;
  mapXmin: number;
  mapYmax: number;
  mapYmin: number;
  simpleHtmlTemplateName: string;
  geoDataDirectory: string;
  mapLogoColorPath: string;
  mapLogoBwPath: string;
  mapLogoPosition: string;
  mapCenterLat: number;
  mapCenterLng: number;
  imageColorbarColorPath: string;
  imageColorbarBwPath: string;
  isNew: boolean;
}

export interface ServerConfiguration {
  id: string;
  name: string;
  apiUrl: string;
  userName: string;
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
  isNew: boolean;
}


@Injectable()
export class ConfigurationService {

  constructor(
    public http: HttpClient,
    private constantsService: ConstantsService,
    private authenticationService: AuthenticationService) {
  }

  public loadLocalServerConfiguration(): Observable<ServerConfiguration> {
    const url = this.constantsService.getServerUrl() + "server";
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.get<ServerConfiguration>(url, options);
  }

  public loadExternalServerConfigurations(): Observable<ServerConfiguration[]> {
    const url = this.constantsService.getServerUrl() + "server/external";
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.get<ServerConfiguration[]>(url, options);
  }

  public updateServerConfiguration(json) {
    const url = this.constantsService.getServerUrl() + "server";
    const body = JSON.stringify(json);
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.put(url, body, options);
  }

  public createServerConfiguration(json) {
    const url = this.constantsService.getServerUrl() + "server";
    const body = JSON.stringify(json);
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.post(url, body, options);
  }

  public loadRegionConfiguration(region): Observable<RegionConfiguration> {
    const url = this.constantsService.getServerUrl() + "regions/region?region=" + region;
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.get<RegionConfiguration>(url, options);
  }

  public loadRegionConfigurations(): Observable<RegionConfiguration[]> {
    const url = this.constantsService.getServerUrl() + "regions";
    const options = { headers: this.authenticationService.newAuthHeader() };

    return this.http.get<RegionConfiguration[]>(url, options);
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
