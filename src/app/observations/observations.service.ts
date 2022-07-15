import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthenticationService } from "app/providers/authentication-service/authentication.service";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import { convertObservationToGeneric, Observation } from "./models/observation.model";
import { convertLoLaKronos, LolaKronosApi } from "./models/lola-kronos.model";
import { convertLoLaSafety, LoLaSafetyApi } from "./models/lola-safety.model";
import {
  Profile,
  Incident,
  IncidentDetails,
  ProfileDetails,
  LAWIS_FETCH_DETAILS,
  toLawisIncident,
  toLawisIncidentDetails,
  toLawisProfileDetails,
  toLawisProfile
} from "./models/lawis.model";
import { GenericObservation, ObservationSource, ObservationType, toAspect } from "./models/generic-observation.model";
import {
  ArcGisApi,
  ArcGisLayer,
  convertLwdKipBeobachtung,
  convertLwdKipLawinenabgang,
  convertLwdKipSperren,
  convertLwdKipSprengerfolg,
  LwdKipBeobachtung,
  LwdKipLawinenabgang,
  LwdKipSperren,
  LwdKipSprengerfolg
} from "./models/lwdkip.model";
import { ApiWikisnowECT, convertWikisnow, WikisnowECT } from "./models/wikisnow.model";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import BeobachterAT from "./data/Beobachter-AT.json";
import BeobachterIT from "./data/Beobachter-IT.json";
import { ObservationFilterService } from "./observation-filter.service";

@Injectable()
export class ObservationsService {
  private lwdKipLayers: Observable<ArcGisLayer[]>;

  constructor(
    public http: HttpClient,
    public filter: ObservationFilterService,
    public authenticationService: AuthenticationService,
    public translateService: TranslateService,
    public constantsService: ConstantsService
  ) {}

  loadAll(): Observable<GenericObservation<any>> {
    return Observable.merge<GenericObservation>(
      this.getAvalancheWarningService().catch((err) => this.warnAndContinue("Failed fetching AWS observers", err)),
      this.getLawisIncidents().catch((err) => this.warnAndContinue("Failed fetching lawis incidents", err)),
      this.getLawisProfiles().catch((err) => this.warnAndContinue("Failed fetching lawis profiles", err)),
      this.getLoLaKronos().catch((err) => this.warnAndContinue("Failed fetching LoLaKronos", err)),
      this.getLoLaSafety().catch((err) => this.warnAndContinue("Failed fetching LoLa safety observations", err)),
      this.getLwdKipObservations().catch((err) => this.warnAndContinue("Failed fetching LWDKIP observations", err)),
      this.getWikisnowECT().catch((err) => this.warnAndContinue("Failed fetching Wikisnow ECT", err)),
      this.getObservations().catch((err) => this.warnAndContinue("Failed fetching observations", err)),
    )
  }

  private warnAndContinue(message: string, err: any): Observable<GenericObservation> {
    console.error(message, err);
    return Observable.of();
  }

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
        .get<ArcGisApi>(url, { headers })
        .map((data) => {
          if ('error' in data) {
            throw new Error(data.error?.message);
          } else if (!data.layers?.length) {
            throw new Error("No LWDKIP layers found!");
          }
          return data.layers;
        });
    }
    const lwdKipLayers = this.lwdKipLayers.last();
    return lwdKipLayers.flatMap((layers) => {
      const layer = layers.find((l) => l.name.trim() === name && l.type === "Feature Layer");
      if (!layer) {
        throw new Error("No LWDKIP layer for " + name);
      }
      const url = this.constantsService.getServerUrl() + "observations/lwdkip/" + layer.id;
      const headers = this.authenticationService.newAuthHeader();
      return this.http
        .get<T | { error: { message: string } }>(url, { headers, params })
        .map((data) => {
          if ("error" in data) {
            console.error(
              "Failed fetching LWDKIP " + name,
              new Error(data.error?.message)
            );
            return { features: [] };
          }
          return data;
        });
    });
  }

  getLwdKipObservations(): Observable<GenericObservation> {
    const days = Math.ceil((Date.now() - this.filter.startDate.getTime()) / 24 / 60 / 60 / 1000);
    const params: Record<string, string> = {
      where: "BEOBDATUM > (SYSDATE - " + days + ")",
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
      const o3 = this.getLwdKipLayer<LwdKipSperren>("aktive_Sperren", {
        ...params,
        where: "1=1",
      })
        .flatMap((featureCollection) => featureCollection.features)
        .map((feature) => convertLwdKipSperren(feature));
    return Observable.merge(o0, o1, o2, o3);
  }

  getObservations(): Observable<GenericObservation<Observation>> {
    console.log("getObservations ##1", this.startDateString, this.endDateString);
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

  getAvalancheWarningService(): Observable<GenericObservation> {
    const eventDate = new Date();
    eventDate.setHours(0, 0, 0, 0);
    return Observable.of(BeobachterAT, BeobachterIT)
      .mergeAll()
      .map(
        (observer): GenericObservation => ({
          $data: observer,
          $externalURL: `https://wiski.tirol.gv.at/lawine/grafiken/800/beobachter/${observer["plot.id"]}.png`,
          $source: ObservationSource.AvalancheWarningService,
          $type: ObservationType.Observation,
          aspect: undefined,
          authorName: observer.name,
          content: "",
          elevation: undefined,
          eventDate,
          latitude: +observer.latitude,
          locationName: observer.name.replace("Beobachter", "").trim(),
          longitude: +observer.longitude,
          region: ""
        })
      );
  }

  getLoLaKronos(): Observable<GenericObservation> {
    const { lolaKronosApi } = this.constantsService;
    const timeframe = this.startDateString + "/" + this.endDateString;
    return this.http
      .get<LolaKronosApi>(lolaKronosApi + timeframe)
      .flatMap((kronos) => convertLoLaKronos(kronos));
  }

  getLoLaSafety(): Observable<GenericObservation> {
    const { observationApi: api } = this.constantsService;
    const timeframe = this.startDateString + "/" + this.endDateString;
    return this.http
      .get<LoLaSafetyApi>(api.LoLaSafetyAvalancheReports + timeframe)
      .flatMap(lola => convertLoLaSafety(lola));
  }

  getWikisnowECT(): Observable<GenericObservation> {
    const { observationApi: api } = this.constantsService;
    return this.http
      .get<ApiWikisnowECT>(api.WikisnowECT)
      .flatMap(api => api.data)
      .map<WikisnowECT, GenericObservation>((wikisnow) => convertWikisnow(wikisnow))
      .filter((observation) => this.filter.inDateRange(observation) && this.filter.inMapBounds(observation));
  }

  getLawisProfiles(): Observable<GenericObservation> {
    const { observationApi: api, observationWeb: web } = this.constantsService;
    return this.http
      .get<Profile[]>(
        api.LawisSnowProfiles +
          "?startDate=" +
          this.startDateString +
          "&endDate=" +
          this.endDateString +
          "&_=" +
          nowWithHourPrecision()
      )
      .mergeAll()
      .map<Profile, GenericObservation<Profile>>((lawis) => toLawisProfile(lawis, web.LawisSnowProfiles))
      .filter((observation) => this.filter.inMapBounds(observation))
      .flatMap((profile) => {
        if (!LAWIS_FETCH_DETAILS) {
          return Observable.of(profile);
        }
        return Observable.fromPromise(this.getCachedOrFetch<ProfileDetails>(api.LawisSnowProfiles + "/" + profile.$data.id))
          .map<ProfileDetails, GenericObservation>((lawisDetails) => toLawisProfileDetails(profile, lawisDetails))
          .catch(() => Observable.of(profile));
      });
  }

  getLawisIncidents(): Observable<GenericObservation> {
    const { observationApi: api, observationWeb: web } = this.constantsService;
    return this.http
      .get<Incident[]>(
        api.LawisIncidents +
          "?startDate=" +
          this.startDateString +
          "&endDate=" +
          this.endDateString +
          "&_=" +
          nowWithHourPrecision()
      )
      .mergeAll()
      .map<Incident, GenericObservation<Incident>>((lawis) => toLawisIncident(lawis, web.LawisIncidents))
      .filter((observation) => this.filter.inMapBounds(observation))
      .flatMap((incident) => {
        if (!LAWIS_FETCH_DETAILS) {
          return Observable.of(incident);
        }
        return Observable.fromPromise(this.getCachedOrFetch<IncidentDetails>(api.LawisIncidents + "/" + incident.$data.id))
          .map<IncidentDetails, GenericObservation>((lawisDetails) => toLawisIncidentDetails(incident, lawisDetails))
          .catch(() => Observable.of(incident));
      });
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
    return this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(this.filter.startDate);
  }

  private get endDateString(): string {
    return this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(this.filter.endDate);
  }

  getCsv(startDate: Date, endDate: Date): Observable<Blob> {
    const url = this.constantsService.getServerUrl() + "observations/export?startDate=" + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(startDate) + "&endDate=" + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(endDate);
    const headers = this.authenticationService.newAuthHeader("text/csv");

    return this.http.get(url, { headers: headers, responseType: "blob" });
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

function nowWithHourPrecision(): number {
  const now = new Date();
  now.setHours(now.getHours(), 0, 0, 0);
  return +now;
}
