import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantsService } from "../constants-service/constants.service";
import { Natlefs } from "app/models/natlefs.model";
import { AvaObs, Observation, SimpleObservation, SnowProfile } from "app/models/avaobs.model";
import { Lawis } from "app/models/lawis.model";


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
    const url = this.constantsService.getNatlefsServerUrl() + "quickReports?from=" + this.fromDate;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + token
    });
    const options = { headers: headers };

    return this.http.get<Natlefs[]>(url, options).toPromise();
  }

  async getAvaObs(): Promise<AvaObs> {
    const { avaObsApi } = this.constantsService;
    const timeframe = this.fromDate + "/" + this.untilDate;
    const observations = await this.http.get<Observation[]>(avaObsApi.observations + timeframe).toPromise();
    const simpleObservations = await this.http.get<SimpleObservation[]>(avaObsApi.simpleObservations + timeframe).toPromise();
    const snowProfiles = await this.http.get<SnowProfile[]>(avaObsApi.snowProfiles + timeframe).toPromise();
    return { observations, simpleObservations, snowProfiles };
  }

  async getLawis(): Promise<Lawis> {
    const { fromDate } = this;
    const { lawisApi } = this.constantsService;
    const profiles = await this.http.get<Lawis>(lawisApi.profile).toPromise();
    return profiles.filter((profile) => profile.datum > fromDate);
  }

  private get fromDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - this.constantsService.getTimeframe());
    return this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
  }

  private get untilDate(): string {
    const date = new Date();
    return this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
  }
}

