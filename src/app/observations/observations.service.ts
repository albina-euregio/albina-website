import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
import { from, merge, Observable, of, onErrorResumeNext } from "rxjs";
import { catchError, filter, last, map, mergeAll, mergeMap } from "rxjs/operators";
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
    return onErrorResumeNext(
      this.getAvalancheWarningService(),
      this.getLawisIncidents(),
      this.getLawisProfiles(),
      this.getLoLaKronos(),
      this.getLoLaSafety(),
      this.getLwdKipObservations(),
      this.getWikisnowECT(),
      this.getObservations()
    );
  }

  getObservation(id: number): Observable<GenericObservation<Observation>> {
    const url = this.constantsService.getServerUrl() + "observations/" + id;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http.get<Observation>(url, options).pipe(map((o) => convertObservationToGeneric(o)));
  }

  private getLwdKipLayer<T>(name: string, params: Record<string, string>) {
    if (!this.lwdKipLayers) {
      const url = this.constantsService.getServerUrl() + "observations/lwdkip/layers?f=json";
      const headers = this.authenticationService.newAuthHeader();
      this.lwdKipLayers = this.http
        .get<ArcGisApi>(url, { headers })
        .pipe(map((data) => {
          if ('error' in data) {
            throw new Error(data.error?.message);
          } else if (!data.layers?.length) {
            throw new Error("No LWDKIP layers found!");
          }
          return data.layers;
        }));
    }
    const lwdKipLayers = this.lwdKipLayers.pipe(last());
    return lwdKipLayers.pipe(mergeMap((layers) => {
      const layer = layers.find((l) => l.name.trim() === name && l.type === "Feature Layer");
      if (!layer) {
        throw new Error("No LWDKIP layer for " + name);
      }
      const url = this.constantsService.getServerUrl() + "observations/lwdkip/" + layer.id;
      const headers = this.authenticationService.newAuthHeader();
      return this.http
        .get<T | { error: { message: string } }>(url, { headers, params })
        .pipe(map((data) => {
          if ("error" in data) {
            console.error(
              "Failed fetching LWDKIP " + name,
              new Error(data.error?.message)
            );
            return { features: [] };
          }
          return data;
        }));
    }));
  }

  getLwdKipObservations(): Observable<GenericObservation> {
    const startDate = this.filter.startDate.toISOString().slice(0, "2006-01-02T15:04:05".length).replace("T", " ");
    const endDate = this.filter.endDate.toISOString().slice(0, "2006-01-02T15:04:05".length).replace("T", " ");
    const params: Record<string, string> = {
      where: `BEOBDATUM > TIMESTAMP '${startDate}' AND BEOBDATUM < TIMESTAMP '${endDate}'`,
      outFields: "*",
      datumTransformation: "5891",
      f: "geojson"
    };
    const o0 = this.getLwdKipLayer<LwdKipBeobachtung>("Beobachtungen", params).pipe(
      mergeMap((featureCollection) => featureCollection.features),
      map((feature) => convertLwdKipBeobachtung(feature))
    );
    const o1 = this.getLwdKipLayer<LwdKipSprengerfolg>("Sprengerfolg", params).pipe(
      mergeMap((featureCollection) => featureCollection.features),
      map((feature) => convertLwdKipSprengerfolg(feature))
    );
    const o2 = this.getLwdKipLayer<LwdKipLawinenabgang>("Lawinenabgänge", params).pipe(
      mergeMap((featureCollection) => featureCollection.features),
      map((feature) => convertLwdKipLawinenabgang(feature))
    );
    const o3 = this.getLwdKipLayer<LwdKipSperren>("aktive_Sperren", {
      ...params,
      where: "1=1",
    }).pipe(
      mergeMap((featureCollection) => featureCollection.features),
      map((feature) => convertLwdKipSperren(feature))
    );
    return merge(o0, o1, o2, o3);
  }

  getObservations(): Observable<GenericObservation<Observation>> {
//    console.log("getObservations ##1", this.startDateString, this.endDateString);
    const url = this.constantsService.getServerUrl() + "observations?startDate=" + this.startDateString + "&endDate=" + this.endDateString;
    const headers = this.authenticationService.newAuthHeader();
    return this.http
      .get<Observation[]>(url, { headers })
      .pipe(
        mergeAll(),
        map((o) => convertObservationToGeneric(o))
      );
  }

  postObservation(observation: Observation): Observable<GenericObservation<Observation>> {
    observation = this.serializeObservation(observation);
    const url = this.constantsService.getServerUrl() + "observations";
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http.post<Observation>(url, observation, options).pipe(map((o) => convertObservationToGeneric(o)));
  }

  putObservation(observation: Observation): Observable<GenericObservation<Observation>> {
    observation = this.serializeObservation(observation);
    const url = this.constantsService.getServerUrl() + "observations/" + observation.id;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http.put<Observation>(url, observation, options).pipe(map((o) => convertObservationToGeneric(o)));
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
    return of(BeobachterAT, BeobachterIT).pipe(
      mergeAll(),
      map(
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
      )
    );
  }

  getLoLaKronos(): Observable<GenericObservation> {
    const { lolaKronosApi } = this.constantsService;
    const timeframe = this.startDateString + "/" + this.endDateString;
    return this.http
      .get<LolaKronosApi>(lolaKronosApi + timeframe)
      .pipe(mergeMap((kronos) => convertLoLaKronos(kronos)));
  }

  getLoLaSafety(): Observable<GenericObservation> {
    const { observationApi: api } = this.constantsService;
    const timeframe = this.startDateString + "/" + this.endDateString;
    return this.http
      .get<LoLaSafetyApi>(api.LoLaSafetyAvalancheReports + timeframe)
      .pipe(mergeMap(lola => convertLoLaSafety(lola)));
  }

  getWikisnowECT(): Observable<GenericObservation> {
    const { observationApi: api } = this.constantsService;
    return this.http
      .get<ApiWikisnowECT>(api.WikisnowECT)
      .pipe(
        mergeMap(api => api.data),
        map<WikisnowECT, GenericObservation>((wikisnow) => convertWikisnow(wikisnow)),
        filter((observation) => this.filter.inDateRange(observation) && this.filter.inMapBounds(observation))
      );
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
      ).pipe(
        mergeAll(),
        map<Profile, GenericObservation<Profile>>((lawis) => toLawisProfile(lawis, web.LawisSnowProfiles)),
        filter((observation) => this.filter.inMapBounds(observation)),
        mergeMap((profile) => {
          if (!LAWIS_FETCH_DETAILS) {
            return of(profile);
          }
          return from(this.getCachedOrFetch<ProfileDetails>(api.LawisSnowProfiles + "/" + profile.$data.id))
            .pipe(
              map<ProfileDetails, GenericObservation>((lawisDetails) => toLawisProfileDetails(profile, lawisDetails)),
              catchError(() => of(profile))
            );
        })
      );
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
      ).pipe(
        mergeAll(),
        map<Incident, GenericObservation<Incident>>((lawis) => toLawisIncident(lawis, web.LawisIncidents)),
        filter((observation) => this.filter.inMapBounds(observation)),
        mergeMap((incident) => {
          if (!LAWIS_FETCH_DETAILS) {
            return of(incident);
          }
          return from(this.getCachedOrFetch<IncidentDetails>(api.LawisIncidents + "/" + incident.$data.id)).pipe(
            map<IncidentDetails, GenericObservation>((lawisDetails) => toLawisIncidentDetails(incident, lawisDetails)),
            catchError(() => of(incident))
          );
        })
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
