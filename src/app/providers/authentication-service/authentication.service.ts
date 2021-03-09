import { Injectable, SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { ConstantsService } from "../constants-service/constants.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthorModel } from "../../models/author.model";

@Injectable()
export class AuthenticationService {

  public currentAuthor: AuthorModel;
  public jwtHelper: JwtHelperService;
  public activeRegion: string;

  constructor(
    public http: HttpClient,
    public constantsService: ConstantsService,
    private sanitizer: DomSanitizer
  ) {
    try {
      this.setCurrentAuthor(JSON.parse(localStorage.getItem("currentAuthor")));
    } catch (e) {
      localStorage.removeItem("currentAuthor");
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
  }

  public getAuthor() {
    return this.currentAuthor;
  }

  public getUsername(): string {
    if (this.currentAuthor) {
      return this.currentAuthor.name;
    } else {
      return null;
    }
  }

  public getEmail(): string {
    if (this.currentAuthor) {
      return this.currentAuthor.email;
    } else {
      return null;
    }
  }

  public getAccessToken() {
    if (this.currentAuthor) {
      return this.currentAuthor.accessToken;
    } else {
      return null;
    }
  }

  public newAuthHeader(mime = "application/json"): HttpHeaders {
    const authHeader = "Bearer " + this.getAccessToken();
    return new HttpHeaders({
      "Content-Type": mime,
      "Accept": mime,
      "Authorization": authHeader
    });
  }

  public getRefreshToken() {
    if (this.currentAuthor) {
      return this.currentAuthor.refreshToken;
    } else {
      return null;
    }
  }

  public getUserImage() {
    if (this.currentAuthor) {
      return this.currentAuthor.image;
    } else {
      return null;
    }
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

  public isEuregio() {
    if (this.getActiveRegion() === this.constantsService.codeTyrol || this.getActiveRegion() === this.constantsService.codeSouthTyrol || this.getActiveRegion() === this.constantsService.codeTrentino) {
      return true;
    } else {
      return false;
    }
  }

  public getUserLat() {
    return this.constantsService.lat.get(this.getActiveRegion() ?? "");
  }

  public getUserLng() {
    return this.constantsService.lng.get(this.getActiveRegion() ?? "");
  }

  public isCurrentUserInRole(role) {
    if (this.currentAuthor && this.currentAuthor.getRoles() && this.currentAuthor.getRoles() !== undefined) {
      if (this.currentAuthor.getRoles().indexOf(role) > -1) {
        return true;
      }
    }
    return false;
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

  private setCurrentAuthor(json: Partial<AuthorModel>) {
    if (!json) {
      return;
    }
    this.currentAuthor = AuthorModel.createFromJson(json);
    this.activeRegion = this.currentAuthor.getRegions()[0];
  }

  public checkPassword(password: string): Observable<Response> {
    const url = this.constantsService.getServerUrl() + "authentication/check";
    const body = JSON.stringify({password});
    const headers = this.newAuthHeader();
    const options = { headers: headers };

    return this.http.put<Response>(url, body, options);
  }

  public changePassword(oldPassword: string, newPassword: string): Observable<Response> {
    const url = this.constantsService.getServerUrl() + "authentication/change";
    const body = JSON.stringify({oldPassword, newPassword});
    const headers = this.newAuthHeader();
    const options = { headers: headers };

    return this.http.put<Response>(url, body, options);
  }

  public getCurrentAuthorRegions() {
    return this.currentAuthor.getRegions();
  }
}

export interface AuthenticationResponse {
  email: string;
  name: string;
  roles: string[];
  regions: string[];
  access_token: string;
  refresh_token: string;
}
