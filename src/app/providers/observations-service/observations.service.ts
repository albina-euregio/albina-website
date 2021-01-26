import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantsService } from "../constants-service/constants.service";
import { Natlefs } from "app/models/natlefs.model";


@Injectable()
export class ObservationsService {

  constructor(
    public http: HttpClient,
    public constantsService: ConstantsService) {
  }

  private async getAuthToken(): Promise<string> {
    const username = this.constantsService.getNatlefsUsername();
    const password = this.constantsService.getNatlefsPassword();
    const url = this.constantsService.getNatlefsServerUrl() + "authentication";
    const body = JSON.stringify({username, password});
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    const options = { headers: headers };

    const data = await this.http.post<{token: string}>(url, body, options).toPromise();
    return data.token;
  }

  async getNatlefs(): Promise<Natlefs[]> {
    const token = await this.getAuthToken();
    const date = new Date();
    date.setDate(date.getDate() - this.constantsService.getTimeframe());
    const url = this.constantsService.getNatlefsServerUrl() + "quickReports?from=" + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + token
    });
    const options = { headers: headers };

    return this.http.get<Natlefs[]>(url, options).toPromise();
  }
}

