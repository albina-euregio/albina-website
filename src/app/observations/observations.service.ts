import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthenticationService } from "app/providers/authentication-service/authentication.service";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import { Observation } from "app/models/observation.model";
import { Natlefs } from "app/models/natlefs.model";
import { AvaObs, Observation as AvaObservation, SimpleObservation, SnowProfile } from "app/models/avaobs.model";
import { LoLaSafety } from "app/models/lola-safety.model";
import { Lawis, Profile, Incident, IncidentDetails, parseLawisDate } from "app/models/lawis.model";


@Injectable()
export class ObservationsService {

  public startDate = new Date();
  public endDate = new Date();
  private natlefsToken: Promise<string>;

  constructor(
    public http: HttpClient,
    public authenticationService: AuthenticationService,
    public constantsService: ConstantsService) {}

  async getObservation(id: number): Promise<Observation> {
    const url = this.constantsService.getServerUrl() + "observations/" + id;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http.get<Observation>(url, options).toPromise();
  }

  async getObservations(): Promise<Observation[]> {
    const url = this.constantsService.getServerUrl() + "observations?startDate=" + this.startDateString + "&endDate=" + this.endDateString;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http.get<Observation[]>(url, options).toPromise();
  }

  async postObservation(observation: Observation): Promise<Observation> {
    observation = this.serializeObservation(observation);
    const url = this.constantsService.getServerUrl() + "observations";
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http.post<Observation>(url, observation, options).toPromise();
  }

  async putObservation(observation: Observation): Promise<Observation> {
    observation = this.serializeObservation(observation);
    const url = this.constantsService.getServerUrl() + "observations/" + observation.id;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http.put<Observation>(url, observation, options).toPromise();
  }

  private serializeObservation(observation: Observation): Observation {
    return {
      ...observation,
      eventDate: typeof observation.eventDate === "object" ? getISOString(observation.eventDate) : observation.eventDate,
      reportDate: typeof observation.reportDate === "object" ? getISOString(observation.reportDate) : observation.reportDate
    };
  }

  async deleteObservation(observation: Observation): Promise<void> {
    const url = this.constantsService.getServerUrl() + "observations/" + observation.id;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    await this.http.delete(url, options).toPromise();
  }

  private async getNatlefsAuthToken(): Promise<string> {
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
    if (!this.natlefsToken) {
      this.natlefsToken = this.getNatlefsAuthToken();
    }
    const token = await this.natlefsToken;
    const url = this.constantsService.getNatlefsServerUrl() + "quickReports?from=" + this.startDateString;
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
    const timeframe = this.startDateString + "/" + this.endDateString;
    const observations = await this.http.get<AvaObservation[]>(avaObsApi.observations + timeframe).toPromise();
    const simpleObservations = await this.http.get<SimpleObservation[]>(avaObsApi.simpleObservations + timeframe).toPromise();
    const snowProfiles = await this.http.get<SnowProfile[]>(avaObsApi.snowProfiles + timeframe).toPromise();
    return { observations, simpleObservations, snowProfiles };
  }

  async getLoLaSafety(): Promise<LoLaSafety> {
    const { lolaSafety } = this.constantsService;
    const timeframe = this.startDateString + "/" + this.endDateString;
    return await this.http.get<LoLaSafety>(lolaSafety + timeframe).toPromise();
  }

  async getLawis(): Promise<Lawis> {
    const { lawisApi } = this.constantsService;
    let profiles = await this.http.get<Profile[]>(lawisApi.profile).toPromise();
    profiles = profiles.filter((profile) => this.inDateRange(parseLawisDate(profile.datum)));
    let incidents = await this.http.get<Incident[]>(lawisApi.incident).toPromise();
    incidents = incidents.filter((profile) => this.inDateRange(parseLawisDate(profile.datum)));
    return { profiles, incidents };
  }

  async getLawisIncidentDetails(id: number): Promise<IncidentDetails> {
    const { lawisApi } = this.constantsService;
    return await this.http.get<IncidentDetails>(lawisApi.incident + id).toPromise();
  }

  private get startDateString(): string {
    return this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(this.startDate);
  }

  private get endDateString(): string {
    return this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(this.endDate);
  }

  private inDateRange(date: Date): boolean {
    return this.startDate <= date && date <= this.endDate;
  }
}

function getISOString(date: Date) {
  // like Date.toISOString(), but not using UTC
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
  function pad(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }
}
