import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpRequest, HttpEvent, HttpHeaders } from "@angular/common/http";
import { ConstantsService } from "../constants-service/constants.service";
import { SettingsService } from "../settings-service/settings.service";
import { AuthenticationService } from "../authentication-service/authentication.service";
import { Observable } from "rxjs";

@Injectable()
export class MediaFileService {

  constructor(
    public http: HttpClient,
    private constantsService: ConstantsService,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService) {
  }

  uploadFile(date: Date, file: File, text: string, important: boolean): Observable<HttpEvent<any>> {
    const url = this.constantsService.getServerUrl() + "media?date=" + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + "&region=" + this.authenticationService.getActiveRegionId() + "&lang=" + this.settingsService.getLangString() + "&important=" + important;

    let formData = new FormData();
    formData.append('file', file);
    formData.append("text", text);

    let params = new HttpParams();

    const headers = this.authenticationService.newFileAuthHeader("multipart/form-data");
    const options = {
      params: params,
      headers: headers
    };

    const req = new HttpRequest('POST', url, formData, options);
    return this.http.request(req);
  }
}
