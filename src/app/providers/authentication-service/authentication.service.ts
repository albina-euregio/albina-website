import { Injectable, SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ConstantsService } from "../constants-service/constants.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthorModel } from "../../models/author.model";
import { ServerModel } from "../../models/server.model";
import { RegionConfiguration } from "../configuration-service/configuration.service";

@Injectable()
export class AuthenticationService {

  private currentAuthor: AuthorModel;
  private externalServers: ServerModel[];
  private jwtHelper: JwtHelperService;
  private activeRegion: RegionConfiguration;

  constructor(
    public http: HttpClient,
    public constantsService: ConstantsService,
    private sanitizer: DomSanitizer
  ) {
    this.externalServers = [];
    try {
      this.setCurrentAuthor(JSON.parse(localStorage.getItem("currentAuthor")));
    } catch (e) {
      localStorage.removeItem("currentAuthor");
    }
    try {
      this.setActiveRegion(JSON.parse(localStorage.getItem("activeRegion")));
    } catch (e) {
      localStorage.removeItem("activeRegion");
    }
    try {
      this.setExternalServers(JSON.parse(localStorage.getItem("externalServers")));
    } catch (e) {
      localStorage.removeItem("externalServers");
    }
    this.jwtHelper = new JwtHelperService();
  }

  isUserLoggedIn(): boolean {
    if (this.currentAuthor && this.currentAuthor.accessToken) {
      return !this.jwtHelper.isTokenExpired(this.currentAuthor.accessToken);
    } else {
      return false;
    }
  }

  public logout() {
    localStorage.removeItem("currentAuthor");
    console.debug("[" + this.currentAuthor.name + "] Logged out!");
    this.currentAuthor = null;
    this.activeRegion = undefined;
    localStorage.removeItem("activeRegion");
    localStorage.removeItem("externalServers");
    this.externalServers = [];
  }

  public getAuthor() {
    return this.currentAuthor;
  }

  public getUsername(): string {
    return this.currentAuthor?.name;
  }

  public getEmail(): string {
    return this.currentAuthor?.email;
  }

  public getAccessToken() {
    return this.currentAuthor?.accessToken;
  }

  public newAuthHeader(mime = "application/json"): HttpHeaders {
    const authHeader = "Bearer " + this.getAccessToken();
    return new HttpHeaders({
      "Content-Type": mime,
      "Accept": mime,
      "Authorization": authHeader
    });
  }

  public newFileAuthHeader(mime = "application/json"): HttpHeaders {
    const authHeader = "Bearer " + this.getAccessToken();
    return new HttpHeaders({
      "Accept": mime,
      "Authorization": authHeader
    });
  }

  public newExternalServerAuthHeader(externalAuthor, mime = "application/json"): HttpHeaders {
    const authHeader = "Bearer " + externalAuthor.accessToken;
    return new HttpHeaders({
      "Content-Type": mime,
      "Accept": mime,
      "Authorization": authHeader
    });
  }

  public getRefreshToken() {
    return this.currentAuthor?.refreshToken;
  }

  public getUserImage() {
    return this.currentAuthor?.image;
  }

  public getUserImageSanitized() {
    if (this.currentAuthor && this.currentAuthor.image) {
      return this.sanitizer.sanitize(SecurityContext.URL, "data:image/jpg;base64," + this.currentAuthor.image);
    } else {
      return null;
    }
  }

  public getActiveRegion(): RegionConfiguration {
    return this.activeRegion;
  }

  public getActiveRegionId(): string {
    return this.activeRegion.id;
  }

  public setActiveRegion(region: RegionConfiguration) {
    if (this.currentAuthor.getRegions().map(region => region.id).includes(region.id)) {
      this.activeRegion = region;
      localStorage.setItem("activeRegion", JSON.stringify(this.activeRegion));
    } else {
      this.logout();
    }
  }

  // region
  // lang (code used for textcat)
  public getActiveRegionCode(): number {
    switch (this.activeRegion.id) {
      case this.constantsService.codeTyrol:
        return 2;
      case this.constantsService.codeSouthTyrol:
        return 3;
      case this.constantsService.codeTrentino:
        return 3;

      default:
        return 1;
    }
  }

  // region
  // lang (code used for textcat-ng)
  public getTextcatRegionCode(): string {
    switch (this.activeRegion.id) {
      case this.constantsService.codeSwitzerland:
        return "Switzerland";
      case this.constantsService.codeTyrol:
        return "Tyrol";
      case this.constantsService.codeSouthTyrol:
        return "South Tyrol";
      case this.constantsService.codeTrentino:
        return "Trentino";
      case this.constantsService.codeAran:
        return "Aran";
      case this.constantsService.codeAndorra:
        return "Andorra";

      default:
        return "Switzerland";
    }
  }

  public isEuregio(): boolean {
    return (
      this.getActiveRegionId() === this.constantsService.codeTyrol ||
      this.getActiveRegionId() === this.constantsService.codeSouthTyrol ||
      this.getActiveRegionId() === this.constantsService.codeTrentino
    );
  }

  public getUserLat() {
    return this.activeRegion.mapCenterLat ?? 47.1;
  }

  public getUserLng() {
    return this.activeRegion.mapCenterLng ?? 11.44;
  }

  public isCurrentUserInRole(role: string): boolean {
    return this.currentAuthor?.getRoles?.()?.includes(role);
  }

  // region
  public getChatId(region: string) {
    switch (region) {
      case this.constantsService.codeTyrol:
        switch (this.getActiveRegionId()) {
          case this.constantsService.codeTyrol:
            return 0;
          case this.constantsService.codeSouthTyrol:
            return 1;
          case this.constantsService.codeTrentino:
            return 2;
          default:
            return 0;
        }
      case this.constantsService.codeSouthTyrol:
        switch (this.getActiveRegionId()) {
          case this.constantsService.codeTyrol:
            return 1;
          case this.constantsService.codeSouthTyrol:
            return 0;
          case this.constantsService.codeTrentino:
            return 3;
          default:
            return 0;
        }
      case this.constantsService.codeTrentino:
        switch (this.getActiveRegionId()) {
          case this.constantsService.codeTyrol:
            return 2;
          case this.constantsService.codeSouthTyrol:
            return 3;
          case this.constantsService.codeTrentino:
            return 0;
          default:
            return 0;
        }
      default:
        return 0;
    }
  }

  public login(username: string, password: string): Observable<boolean> {
    const url = this.constantsService.getServerUrl() + "authentication";
    const body = JSON.stringify({username, password});
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    const options = { headers: headers };

    return this.http.post<AuthenticationResponse>(url, body, options)
    .pipe(map(data => {
      if ((data ).access_token) {
          this.setCurrentAuthor(data);
          if (this.getCurrentAuthorRegions().length > 0) {
            this.setActiveRegion(this.getCurrentAuthorRegions()[0]);
          }
          return true;
        } else {
          return false;
        }
      }));
  }

  public externalServerLogins() {
    this.loadExternalServerInstances().subscribe(
      data => {
        for (const entry of (data as any)) {
          this.externalServerLogin(entry.apiUrl, entry.userName, entry.password).subscribe(
            data => {
              if (data === true) {
                console.debug("[" + entry.name + "] Logged in!");
              } else {
                console.error("[" + entry.name + "] Login failed!");
              }
            },
            error => {
              console.error("[" + entry.name + "] Login failed: " + JSON.stringify(error._body));
            }
          );
        }
      },
      error => {
        console.error("External server instances could not be loaded: " + JSON.stringify(error._body));
      }
    )
  }

  public loadExternalServerInstances(): Observable<Response> {
    const url = this.constantsService.getServerUrl() + "server/external";
    const options = { headers: this.newAuthHeader() };

    return this.http.get<Response>(url, options);
  }

  public externalServerLogin(apiUrl: string, username: string, password: string): Observable<boolean> {
    const url = apiUrl + "authentication";
    const body = JSON.stringify({username, password});
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    const options = { headers: headers };

    return this.http.post<AuthenticationResponse>(url, body, options)
      .pipe(map(data => {
        if ((data ).access_token) {
          this.addExternalServer(data, apiUrl);
          localStorage.setItem("externalServers", JSON.stringify(this.externalServers));
          return true;
        } else {
          return false;
        }
      }));
  }

  public getCurrentAuthor() {
    return this.currentAuthor;
  }

  private setCurrentAuthor(json: Partial<AuthorModel>) {
    if (!json) {
      return;
    }
    this.currentAuthor = AuthorModel.createFromJson(json);
    localStorage.setItem("currentAuthor", JSON.stringify(this.currentAuthor));
  }

  public getCurrentAuthorRegions() {
    if (this.currentAuthor) {
      return this.currentAuthor.getRegions();
    } else {
      return [];
    }
  }

  public getExternalServers(): ServerModel[] {
    return this.externalServers;
  }

  private addExternalServer(json: Partial<AuthenticationResponse>, apiUrl: string) {
    if (!json) {
      return;
    }
    var server = ServerModel.createFromJson(json);
    server.setApiUrl(apiUrl);
    this.externalServers.push(server);
  }

  private setExternalServers(json: Partial<ServerModel>[]) {
    if (!json) {
      return;
    }
    for (const server of json)
      this.externalServers.push(ServerModel.createFromJson(server));
  }

  public isInSuperRegion(region: string) {
    if(region.startsWith(this.getActiveRegionId())) return true;
    if(this.activeRegion.neighborRegions.some(aNeighbor => region.startsWith(aNeighbor))) return true;
    return false;
  }

  public isExternalRegion(region: string) {
    if (this.constantsService.codeTyrol === region || this.constantsService.codeSouthTyrol === region || this.constantsService.codeTrentino === region)
      return false;
    for (const externalServer of this.externalServers) {
      if (externalServer.getRegions().indexOf(region) > -1)
        return true;
    }
    return false;
  }
}

export interface AuthenticationResponse {
  email: string;
  name: string;
  roles: string[];
  regions: any[];
  access_token: string;
  refresh_token: string;
  api_url: string;
}
