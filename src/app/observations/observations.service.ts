import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthenticationService } from "app/providers/authentication-service/authentication.service";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import { convertObservationToGeneric, Observation } from "app/models/observation.model";
import { convertNatlefsToGeneric, Natlefs } from "app/models/natlefs.model";
import { AvaObs, convertAvaObsToGeneric, Observation as AvaObservation, SimpleObservation, SnowProfile } from "app/models/avaobs.model";
import { convertLoLaToGeneric, LoLaSafety, LoLaSafetyApi } from "app/models/lola-safety.model";
import { Lawis, Profile, Incident, IncidentDetails, parseLawisDate, toLawisIncidentTable, ProfileDetails } from "app/models/lawis.model";
import { GenericObservation, Source, toAspect } from "app/models/generic-observation.model";
import { TranslateService } from "@ngx-translate/core";
import { FeatureCollection, Point } from "geojson";

@Injectable()
export class ObservationsService {
  public startDate = new Date();
  public endDate = new Date();
  private natlefsToken: Promise<string>;

  constructor(
    public http: HttpClient,
    public authenticationService: AuthenticationService,
    public translateService: TranslateService,
    public constantsService: ConstantsService
  ) {}

  async getObservation(id: number): Promise<GenericObservation<Observation>> {
    const url = this.constantsService.getServerUrl() + "observations/" + id;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return convertObservationToGeneric(await this.http.get<Observation>(url, options).toPromise());
  }

  async getObservations(): Promise<GenericObservation<Observation>[]> {
    const url = this.constantsService.getServerUrl() + "observations?startDate=" + this.startDateString + "&endDate=" + this.endDateString;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return (await this.http.get<Observation[]>(url, options).toPromise()).map((o) => convertObservationToGeneric(o));
  }

  async postObservation(observation: Observation): Promise<GenericObservation<Observation>> {
    observation = this.serializeObservation(observation);
    const url = this.constantsService.getServerUrl() + "observations";
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return convertObservationToGeneric(await this.http.post<Observation>(url, observation, options).toPromise());
  }

  async putObservation(observation: Observation): Promise<GenericObservation<Observation>> {
    observation = this.serializeObservation(observation);
    const url = this.constantsService.getServerUrl() + "observations/" + observation.id;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return convertObservationToGeneric(await this.http.put<Observation>(url, observation, options).toPromise());
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
    const body = JSON.stringify({ username, password });
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    const options = { headers: headers };

    const data = await this.http.post<{ token: string }>(url, body, options).toPromise();
    return data.token;
  }

  async getNatlefs(): Promise<GenericObservation<Natlefs>[]> {
    if (!this.natlefsToken) {
      this.natlefsToken = this.getNatlefsAuthToken();
    }
    const token = await this.natlefsToken;
    const url = this.constantsService.getNatlefsServerUrl() + "quickReports?from=" + this.startDateString;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token
    });
    const options = { headers: headers };

    const reports = await this.http.get<Natlefs[]>(url, options).toPromise();
    return reports.map<GenericObservation<Natlefs>>((natlefs) => convertNatlefsToGeneric(natlefs));
  }

  async getAvaObs(): Promise<AvaObs> {
    const { avaObsApi } = this.constantsService;
    const timeframe = this.startDateString + "/" + this.endDateString;
    const observations = await this.http.get<AvaObservation[]>(avaObsApi.observations + timeframe).toPromise();
    const simpleObservations = await this.http.get<SimpleObservation[]>(avaObsApi.simpleObservations + timeframe).toPromise();
    const snowProfiles = await this.http.get<SnowProfile[]>(avaObsApi.snowProfiles + timeframe).toPromise();
    return {
      observations: observations.map((obs) => convertAvaObsToGeneric(obs, "#018571", avaObsApi.observationWeb)),
      simpleObservations: simpleObservations.map((obs) => convertAvaObsToGeneric(obs, "#80cdc1", avaObsApi.simpleObservationWeb)),
      snowProfiles: snowProfiles.map((obs) => convertAvaObsToGeneric(obs, "#2c7bb6", avaObsApi.snowProfileWeb))
    };
  }

  async getLoLaSafety(): Promise<LoLaSafety> {
    const { lolaSafety } = this.constantsService;
    const timeframe = this.startDateString + "/" + this.endDateString;
    const { avalancheReports, snowProfiles } = await this.http.get<LoLaSafetyApi>(lolaSafety + timeframe).toPromise();
    return {
      avalancheReports: avalancheReports.map((report) => convertLoLaToGeneric(report)),
      snowProfiles: snowProfiles.map((obs) => convertAvaObsToGeneric(obs, "#a6d96a"))
    };
  }

  async getLawis(): Promise<Lawis> {
    const { lawisApi } = this.constantsService;
    const profiles = (await this.http.get<Profile[]>(lawisApi.profile).toPromise())
      .map<GenericObservation<Profile>>((lawis) => ({
        $data: lawis,
        $externalURL: lawisApi.profilePDF.replace("{{id}}", String(lawis.profil_id)),
        $markerColor: "#44a9db",
        $source: Source.lawis,
        aspect: toAspect(lawis.exposition_id),
        authorName: "",
        content: "(LAWIS snow profile)",
        elevation: lawis.seehoehe,
        eventDate: parseLawisDate(lawis.datum),
        latitude: lawis.latitude,
        locationName: lawis.ort,
        longitude: lawis.longitude,
        region: String(lawis.subregion_id) // todo
      }))
      .filter(({ eventDate }) => this.inDateRange(eventDate));
    profiles.forEach(async (profile) => {
      const lawisDetails = await this.getCachedOrFetch<ProfileDetails>(lawisApi.profile + profile.$data.profil_id);
      profile.authorName = lawisDetails.name;
      profile.content = lawisDetails.bemerkungen;
    });
    const incidents = (await this.http.get<Incident[]>(lawisApi.incident).toPromise())
      .map<GenericObservation<Incident>>((lawis) => ({
        $data: lawis,
        $markerColor: "#b76bd9",
        $source: Source.lawis,
        aspect: toAspect(lawis.aspect_id),
        authorName: "",
        content: "(LAWIS incident)",
        elevation: lawis.elevation,
        eventDate: parseLawisDate(lawis.datum),
        latitude: lawis.latitude,
        locationName: lawis.ort,
        longitude: lawis.longitude,
        region: String(lawis.subregion_id) // todo
      }))
      .filter(({ eventDate }) => this.inDateRange(eventDate));
    incidents.forEach(async (incident) => {
      const lawisDetails = await this.getCachedOrFetch<IncidentDetails>(lawisApi.incident + incident.$data.incident_id);
      incident.$extraDialogRows = async (_, t) => toLawisIncidentTable(lawisDetails, t);
      incident.authorName = lawisDetails.name;
      incident.content = lawisDetails.comments;
      incident.reportDate = parseLawisDate(lawisDetails.reporting_date);
    });
    return { profiles, incidents };
  }

  async getCachedOrFetch<T>(url: string): Promise<T> {
    let cache: Cache;
    try {
      cache = await caches.open("observations");
      const cached = await cache.match(url);
      if (cached) {
        return cached.json();
      }
    } catch (ignore) {}
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    if (cache) {
      cache.put(url, response);
    }
    return response.json();
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

  async searchLocation(query: string, limit = 8): Promise<FeatureCollection<Point, GeocodingProperties>> {
    // https://nominatim.org/release-docs/develop/api/Search/
    const { osmNominatimApi, osmNominatimCountries } = this.constantsService;
    const params: Record<string, string> = {
      "accept-language": this.translateService.currentLang,
      countrycodes: osmNominatimCountries,
      format: "geojson",
      limit: String(limit),
      q: query
    };
    return this.http
      .get<FeatureCollection<Point, GeocodingProperties>>(osmNominatimApi, { params })
      .toPromise();
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

export interface GeocodingProperties {
  place_id: number;
  osm_type: string;
  osm_id: number;
  display_name: string;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
}
