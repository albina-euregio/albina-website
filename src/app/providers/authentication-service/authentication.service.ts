import { Injectable, SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { ConstantsService } from "../constants-service/constants.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthorModel } from "../../models/author.model";
import { ServerModel } from "../../models/server.model";

@Injectable()
export class AuthenticationService {

  public currentAuthor: AuthorModel;
  public externalServers: ServerModel[];
  public jwtHelper: JwtHelperService;
  public activeRegion: string;

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

  public getActiveRegion(): string {
    return this.activeRegion;
  }

  public setActiveRegion(region: string) {
    if (this.currentAuthor.getRegions().includes(region)) {
      this.activeRegion = region;
    }
  }

  // region
  // lang (code used for textcat)
  public getActiveRegionCode(): number {
    switch (this.activeRegion) {
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
    switch (this.activeRegion) {
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
      this.getActiveRegion() === this.constantsService.codeTyrol ||
      this.getActiveRegion() === this.constantsService.codeSouthTyrol ||
      this.getActiveRegion() === this.constantsService.codeTrentino
    );
  }

  public getUserLat() {
    return this.constantsService.lat.get(this.getActiveRegion() ?? "");
  }

  public getUserLng() {
    return this.constantsService.lng.get(this.getActiveRegion() ?? "");
  }

  public isCurrentUserInRole(role: string): boolean {
    return this.currentAuthor?.getRoles?.()?.includes(role);
  }

  // region
  public getChatId(region: string) {
    switch (region) {
      case this.constantsService.codeTyrol:
        switch (this.getActiveRegion()) {
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
        switch (this.getActiveRegion()) {
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
        switch (this.getActiveRegion()) {
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
      .map(data => {
        if ((data ).access_token) {
          this.setCurrentAuthor(data);
          localStorage.setItem("currentAuthor", JSON.stringify(this.currentAuthor));
          return true;
        } else {
          return false;
        }
      });
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
    const url = this.constantsService.getServerUrl() + "regions/external";
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
      .map(data => {
        if ((data ).access_token) {
          this.addExternalServer(data, apiUrl);
          localStorage.setItem("externalServers", JSON.stringify(this.externalServers));
          return true;
        } else {
          return false;
        }
      });
  }

  private setCurrentAuthor(json: Partial<AuthorModel>) {
    if (!json) {
      return;
    }
    this.currentAuthor = AuthorModel.createFromJson(json);
    this.activeRegion = this.currentAuthor.getRegions()[0];
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
  regions: string[];
  access_token: string;
  refresh_token: string;
  api_url: string;
}
