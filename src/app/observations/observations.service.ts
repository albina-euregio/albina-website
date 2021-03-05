import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthenticationService } from "app/providers/authentication-service/authentication.service";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import { convertObservationToGeneric, Observation } from "./models/observation.model";
import { convertNatlefsToGeneric, Natlefs } from "./models/natlefs.model";
import { convertAvaObsToGeneric, Observation as AvaObservation, SimpleObservation, SnowProfile } from "./models/avaobs.model";
import { convertLoLaToGeneric, LoLaSafetyApi } from "./models/lola-safety.model";
import { Profile, Incident, IncidentDetails, parseLawisDate, toLawisIncidentTable, ProfileDetails } from "./models/lawis.model";
import { GenericObservation, ObservationSource, toAspect } from "./models/generic-observation.model";
import {
  ArcGisLayer,
  convertLwdKipBeobachtung,
  convertLwdKipLawinenabgang,
  convertLwdKipSprengerfolg,
  LwdKipBeobachtung,
  LwdKipLawinenabgang,
  LwdKipSprengerfolg
} from "./models/lwdkip.model";
import { TranslateService } from "@ngx-translate/core";
import { FeatureCollection, Point } from "geojson";
import { Observable } from "rxjs";

@Injectable()
export class ObservationsService {
  public startDate = new Date();
  public endDate = new Date();
  private lwdKipLayers: Observable<ArcGisLayer[]>;
  private natlefsToken: Observable<string>;

  constructor(
    public http: HttpClient,
    public authenticationService: AuthenticationService,
    public translateService: TranslateService,
    public constantsService: ConstantsService
  ) {}

  getObservation(id: number): Observable<GenericObservation<Observation>> {
    const url = this.constantsService.getServerUrl() + "observations/" + id;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http.get<Observation>(url, options).map((o) => convertObservationToGeneric(o));
  }

  private getLwdKipLayer<T>(name: string, params: Record<string, string>) {
    if (!this.lwdKipLayers) {
      const url = this.constantsService.getServerUrl() + "observations/lwdkip/layers?f=json";
      const headers = this.authenticationService.newAuthHeader();
      this.lwdKipLayers = this.http
        .get<{ layers: ArcGisLayer[] }>(url, { headers })
        .map((data) => data.layers);
    }
    const lwdKipLayers = this.lwdKipLayers.last();
    return lwdKipLayers.flatMap((layers) => {
      const layer = layers.find((l) => l.name === name && l.type === "Feature Layer");
      const url = this.constantsService.getServerUrl() + "observations/lwdkip/" + layer.id;
      const headers = this.authenticationService.newAuthHeader();
      return this.http.get<T>(url, { headers, params });
    });
  }

  getLwdKipObservations(): Observable<GenericObservation> {
    const params: Record<string, string> = {
      where: "BEOBDATUM > (SYSDATE - 7)",
      outFields: "*",
      datumTransformation: "5891",
      f: "geojson"
    };
    const o0 = this.getLwdKipLayer<LwdKipBeobachtung>("Beobachtungen", params)
      .flatMap((featureCollection) => featureCollection.features)
      .map((feature) => convertLwdKipBeobachtung(feature));
    const o1 = this.getLwdKipLayer<LwdKipSprengerfolg>("Sprengerfolg", params)
      .flatMap((featureCollection) => featureCollection.features)
      .map((feature) => convertLwdKipSprengerfolg(feature));
    const o2 = this.getLwdKipLayer<LwdKipLawinenabgang>("Lawinenabgänge", params)
      .flatMap((featureCollection) => featureCollection.features)
      .map((feature) => convertLwdKipLawinenabgang(feature));
    return Observable.merge(o0, o1, o2);
  }

  getObservations(): Observable<GenericObservation<Observation>> {
    const url = this.constantsService.getServerUrl() + "observations?startDate=" + this.startDateString + "&endDate=" + this.endDateString;
    const headers = this.authenticationService.newAuthHeader();
    return this.http
      .get<Observation[]>(url, { headers })
      .mergeAll()
      .map((o) => convertObservationToGeneric(o));
  }

  postObservation(observation: Observation): Observable<GenericObservation<Observation>> {
    observation = this.serializeObservation(observation);
    const url = this.constantsService.getServerUrl() + "observations";
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http.post<Observation>(url, observation, options).map((o) => convertObservationToGeneric(o));
  }

  putObservation(observation: Observation): Observable<GenericObservation<Observation>> {
    observation = this.serializeObservation(observation);
    const url = this.constantsService.getServerUrl() + "observations/" + observation.id;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http.put<Observation>(url, observation, options).map((o) => convertObservationToGeneric(o));
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

  private getNatlefsAuthToken(): Observable<string> {
    const username = this.constantsService.getNatlefsUsername();
    const password = this.constantsService.getNatlefsPassword();
    const url = this.constantsService.getNatlefsServerUrl() + "authentication";
    const body = JSON.stringify({ username, password });
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    const options = { headers: headers };
    return this.http.post<{ token: string }>(url, body, options).map((data) => data.token);
  }

  getNatlefs(): Observable<GenericObservation> {
    if (!this.natlefsToken) {
      this.natlefsToken = this.getNatlefsAuthToken();
    }
    return this.natlefsToken
      .last()
      .flatMap((token) => {
        const url = this.constantsService.getNatlefsServerUrl() + "quickReports?from=" + this.startDateString;
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token
        });
        const options = { headers: headers };
        return this.http.get<Natlefs[]>(url, options);
      })
      .mergeAll()
      .map((natlefs) => convertNatlefsToGeneric(natlefs));
  }

  getAvaObs(): Observable<GenericObservation> {
    const { observationApi: api, observationWeb: web } = this.constantsService;
    const timeframe = this.startDateString + "/" + this.endDateString;
    const observations = this.http
      .get<AvaObservation[]>(api.AvaObsObservations + timeframe)
      .mergeAll()
      .map((obs) => convertAvaObsToGeneric(obs, ObservationSource.AvaObsObservations, web.AvaObsObservations));
    const simpleObservations = this.http
      .get<SimpleObservation[]>(api.AvaObsSimpleObservations + timeframe)
      .mergeAll()
      .map((obs) => convertAvaObsToGeneric(obs, ObservationSource.AvaObsSimpleObservations, web.AvaObsSimpleObservations));
    const snowProfiles = this.http
      .get<SnowProfile[]>(api.AvaObsSnowProfiles + timeframe)
      .mergeAll()
      .map((obs) => convertAvaObsToGeneric(obs, ObservationSource.AvaObsSnowProfiles, web.AvaObsSnowProfiles));
    return Observable.merge(observations, simpleObservations, snowProfiles);
  }

  getLoLaSafety(): Observable<GenericObservation> {
    const { observationApi: api } = this.constantsService;
    const timeframe = this.startDateString + "/" + this.endDateString;
    const data = this.http.get<LoLaSafetyApi>(api.LoLaSafetyAvalancheReports + timeframe);
    return data.flatMap(({ avalancheReports, snowProfiles }) => {
      const o1 = Observable.from(avalancheReports).map((report) => convertLoLaToGeneric(report));
      const o2 = Observable.from(snowProfiles).map((obs) =>
        convertAvaObsToGeneric(obs, ObservationSource.LoLaSafetySnowProfiles)
      );
      return Observable.merge<GenericObservation>(o1, o2);
    });
  }

  getLawisProfiles(): Observable<GenericObservation> {
    const { observationApi: api, observationWeb: web } = this.constantsService;
    return this.http
      .get<Profile[]>(api.LawisSnowProfiles)
      .mergeAll()
      .map<Profile, GenericObservation<Profile>>((lawis) => ({
        $data: lawis,
        $externalURL: web.LawisSnowProfiles.replace("{{id}}", String(lawis.profil_id)),
        $source: ObservationSource.LawisSnowProfiles,
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
      .filter((observation) => this.inDateRange(observation) && this.inMapBounds(observation))
      .flatMap((profile) =>
        Observable.fromPromise(this.getCachedOrFetch<ProfileDetails>(api.LawisSnowProfiles + profile.$data.profil_id))
          .map<ProfileDetails, GenericObservation>((lawisDetails) => ({
            ...profile,
            authorName: lawisDetails.name,
            content: lawisDetails.bemerkungen
          }))
          .catch(() => Observable.of(profile))
      );
  }

  getLawisIncidents(): Observable<GenericObservation> {
    const { observationApi: api } = this.constantsService;
    return this.http
      .get<Incident[]>(api.LawisIncidents)
      .mergeAll()
      .map<Incident, GenericObservation<Incident>>((lawis) => ({
        $data: lawis,
        $source: ObservationSource.LawisIncidents,
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
      .filter((observation) => this.inDateRange(observation) && this.inMapBounds(observation))
      .flatMap((incident) =>
        Observable.fromPromise(this.getCachedOrFetch<IncidentDetails>(api.LawisIncidents + incident.$data.incident_id))
          .map<IncidentDetails, GenericObservation>((lawisDetails) => ({
            ...incident,
            $extraDialogRows: (t) => toLawisIncidentTable(lawisDetails, t),
            authorName: lawisDetails.name,
            content: lawisDetails.comments,
            reportDate: parseLawisDate(lawisDetails.reporting_date)
          }))
          .catch(() => Observable.of(incident))
      );
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

  inDateRange({ eventDate }: GenericObservation): boolean {
    return this.startDate <= eventDate && eventDate <= this.endDate;
  }

  inMapBounds({ latitude, longitude }: GenericObservation): boolean {
    if (!latitude || !longitude) {
      return true;
    }
    const { mapBoundaryS, mapBoundaryN, mapBoundaryW, mapBoundaryE } = this.constantsService;
    return mapBoundaryS < latitude && latitude < mapBoundaryN && mapBoundaryW < longitude && longitude < mapBoundaryE;
  }

  searchLocation(query: string, limit = 8): Observable<FeatureCollection<Point, GeocodingProperties>> {
    // https://nominatim.org/release-docs/develop/api/Search/
    const { osmNominatimApi, osmNominatimCountries } = this.constantsService;
    const params: Record<string, string> = {
      "accept-language": this.translateService.currentLang,
      countrycodes: osmNominatimCountries,
      format: "geojson",
      limit: String(limit),
      q: query
    };
    return this.http.get<FeatureCollection<Point, GeocodingProperties>>(osmNominatimApi, { params });
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
