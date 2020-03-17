import { Injectable, Sanitizer, SecurityContext } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from "@angular/common/http";
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
    private sanitizer: DomSanitizer) {
    // this.currentAuthor = JSON.parse(localStorage.getItem('currentAuthor'));
    localStorage.removeItem("currentAuthor");
    localStorage.removeItem("accessToken");
    this.currentAuthor = null;
    this.activeRegion = undefined;
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
    localStorage.removeItem("accessToken");
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

  public getActiveRegionCode(): number {
    switch (this.activeRegion) {
      case "AT-07":
        return 2;
      case "IT-32-BZ":
        return 3;
      case "IT-32-TN":
        return 3;

      default:
        return 1;
    }
  }

  public getUserLat() {
    return this.constantsService.getLat(this.getActiveRegion());
  }

  public getUserLng() {
    return this.constantsService.getLng(this.getActiveRegion());
  }

  public isCurrentUserInRole(role) {
    if (this.currentAuthor && this.currentAuthor.getRoles() && this.currentAuthor.getRoles() !== undefined) {
      if (this.currentAuthor.getRoles().indexOf(role) > -1) {
        return true;
      }
    }
    return false;
  }

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
    console.debug(url);

    const json = Object();
    if (username && username !== undefined) {
      json["username"] = username;
    }
    if (password && password !== undefined) {
      json["password"] = password;
    }

    const body = JSON.stringify(json);
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    const options = { headers: headers };

    return this.http.post(url, body, options)
      .map(data => {
        const accessToken = (data as any).access_token;
        if (accessToken) {
          this.currentAuthor = AuthorModel.createFromJson((data as any));
          this.activeRegion = this.currentAuthor.getRegions()[0];
          this.currentAuthor.accessToken = (data as any).access_token;
          this.currentAuthor.refreshToken = (data as any).refresh_token;
          localStorage.setItem("currentAuthor", JSON.stringify({ username: (data as any).username, accessToken: (data as any).access_token, refreshToken: (data as any).refresh_token, image: (data as any).image, region: (data as any).region, roles: (data as any).roles }));
          localStorage.setItem("accessToken", (data as any).access_token);
          return true;
        } else {
          return false;
        }
      });
  }

  public checkPassword(password: string): Observable<Response> {
    const url = this.constantsService.getServerUrl() + "authentication/check";

    const json = Object();
    if (password && password !== undefined) {
      json["password"] = password;
    }

    const body = JSON.stringify(json);
    const headers = this.newAuthHeader();
    const options = { headers: headers };

    return this.http.put<Response>(url, body, options);
  }

  public changePassword(oldPassword: string, newPassword: string): Observable<Response> {
    const url = this.constantsService.getServerUrl() + "authentication/change";

    const json = Object();
    if (oldPassword && oldPassword !== undefined) {
      json["oldPassword"] = oldPassword;
    }
    if (newPassword && newPassword !== undefined) {
      json["newPassword"] = newPassword;
    }

    const body = JSON.stringify(json);
    const headers = this.newAuthHeader();
    const options = { headers: headers };

    return this.http.put<Response>(url, body, options);
  }

  public getCurrentAuthorRegions() {
    return this.currentAuthor.getRegions();
  }
}
