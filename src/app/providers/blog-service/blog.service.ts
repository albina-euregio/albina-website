import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ConstantsService } from "../constants-service/constants.service";
import { AuthenticationService } from "../authentication-service/authentication.service";

@Injectable()
export class BlogService {

  constructor(
    public http: HttpClient,
    private constantsService: ConstantsService,
    private authenticationService: AuthenticationService) {
  }

  sendLatestBlogPost(region: string, language: string, test: boolean): Observable<Response> {
    var url;
    if (test) {
      url = this.constantsService.getServerUrl() + "blogs/publish/latest/test?&region=" + region + "&lang=" + language;
    } else {
      url = this.constantsService.getServerUrl() + "blogs/publish/latest?&region=" + region + "&lang=" + language;
    }
    const headers = this.authenticationService.newAuthHeader();
    const body = JSON.stringify("");
    const options = { headers: headers };

    return this.http.post<Response>(url, body, options);
  }

  sendLatestBlogPostEmail(region: string, language: string, test: boolean): Observable<Response> {
    var url;
    if (test) {
      url = this.constantsService.getServerUrl() + "blogs/publish/latest/email/test?&region=" + region + "&lang=" + language;
    } else {
      url = this.constantsService.getServerUrl() + "blogs/publish/latest/email?&region=" + region + "&lang=" + language;
    }
    const headers = this.authenticationService.newAuthHeader();
    const body = JSON.stringify("");
    const options = { headers: headers };

    return this.http.post<Response>(url, body, options);
  }

  sendLatestBlogPostTelegram(region: string, language: string, test: boolean): Observable<Response> {
    var url;
    if (test) {
      url = this.constantsService.getServerUrl() + "blogs/publish/latest/telegram/test?&region=" + region + "&lang=" + language;
    } else {
      url = this.constantsService.getServerUrl() + "blogs/publish/latest/telegram?&region=" + region + "&lang=" + language;
    }
    const headers = this.authenticationService.newAuthHeader();
    const body = JSON.stringify("");
    const options = { headers: headers };

    return this.http.post<Response>(url, body, options);
  }

  sendLatestBlogPostPush(region: string, language: string, test: boolean): Observable<Response> {
    var url;
    if (test) {
      url = this.constantsService.getServerUrl() + "blogs/publish/latest/push/test?&region=" + region + "&lang=" + language;
    } else {
      url = this.constantsService.getServerUrl() + "blogs/publish/latest/push?&region=" + region + "&lang=" + language;
    }
    const headers = this.authenticationService.newAuthHeader();
    const body = JSON.stringify("");
    const options = { headers: headers };

    return this.http.post<Response>(url, body, options);
  }
}
