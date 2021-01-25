import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantsService } from "../constants-service/constants.service";
import { Observable } from "rxjs/Observable";


@Injectable()
export class ObservationsService {

  private natlefsToken: string;

  constructor(
    public http: HttpClient,
    public constantsService: ConstantsService) {
    this.authenticate(this.constantsService.getNatlefsUsername(), this.constantsService.getNatlefsPassword());
  }

  public authenticate(username, password) {
    const url = this.constantsService.getNatlefsServerUrl() + "authentication";

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
      .subscribe(data => {
        const token = (data as any).token;
        if (token) {
          this.natlefsToken = (data as any).token;
          return true;
        } else {
          return false;
        }
      });
  }

  getNatlefs(): Observable<Response> {
    const date = new Date();
    date.setDate(date.getDate() - this.constantsService.getTimeframe());
    const url = this.constantsService.getNatlefsServerUrl() + "quickReports?from=" + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    const authHeader = "Bearer " + this.natlefsToken;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": authHeader
    });
    const options = { headers: headers };

    return this.http.get<Response>(url, options);
  }
}

