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
  parseLawisDate,
  toLawisIncidentTable,
  ProfileDetails,
  LAWIS_FETCH_DETAILS
} from "./models/lawis.model";
import { GenericObservation, ObservationSource, toAspect } from "./models/generic-observation.model";
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
import { ApiWikisnowECT, WikisnowECT } from "./models/wikisnow.model";
import { TranslateService } from "@ngx-translate/core";
import { FeatureCollection, Point } from "geojson";
import { Observable } from "rxjs";
import BeobachterAT from "./data/Beobachter-AT.json";
import BeobachterIT from "./data/Beobachter-IT.json";

@Injectable()
export class ObservationsService {
  public startDate = new Date();
  public endDate = new Date();
  private lwdKipLayers: Observable<ArcGisLayer[]>;

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
      return this.http.get<T>(url, { headers, params });
    });
  }

  getLwdKipObservations(): Observable<GenericObservation> {
    const days = Math.ceil((Date.now() - this.startDate.getTime()) / 24 / 60 / 60 / 1000);
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
      .map<WikisnowECT, GenericObservation>((wikisnow) => ({
        $data: wikisnow,
        $source: ObservationSource.WikisnowECT,
        aspect: toAspect(+wikisnow.exposition / 45),
        authorName: wikisnow.UserName,
        content: [wikisnow.ECT_result, wikisnow.propagation, wikisnow.surface, wikisnow.weak_layer, wikisnow.description].join(" // "),
        elevation: +wikisnow.Sealevel,
        eventDate: new Date(wikisnow.createDate),
        latitude: +wikisnow?.latlong?.split(/,\s*/)?.[0],
        locationName: wikisnow.location,
        longitude: +wikisnow?.latlong?.split(/,\s*/)?.[1],
        region: ""
      }))
      .filter((observation) => this.inDateRange(observation) && this.inMapBounds(observation));
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
      .map<Profile, GenericObservation<Profile>>((lawis) => ({
        $data: lawis,
        $externalURL: web.LawisSnowProfiles.replace("{{id}}", String(lawis.id)),
        $source: ObservationSource.LawisSnowProfiles,
        aspect: toAspect(lawis.location.aspect?.text),
        authorName: "",
        content: "(LAWIS snow profile)",
        elevation: lawis.location.elevation,
        eventDate: parseLawisDate(lawis.date),
        latitude: lawis.location.latitude,
        locationName: lawis.location.name,
        longitude: lawis.location.longitude,
        region: lawis.location.region.text
      }))
      .filter((observation) => this.inMapBounds(observation))
      .flatMap((profile) => {
        if (!LAWIS_FETCH_DETAILS) {
          return Observable.of(profile);
        }
        return Observable.fromPromise(this.getCachedOrFetch<ProfileDetails>(api.LawisSnowProfiles + "/" + profile.$data.id))
          .map<ProfileDetails, GenericObservation>((lawisDetails) => ({
            ...profile,
            authorName: lawisDetails.reported?.name,
            content: lawisDetails.comments
          }))
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
      .map<Incident, GenericObservation<Incident>>((lawis) => ({
        $data: lawis,
        $externalURL: web.LawisIncidents.replace("{{id}}", String(lawis.id)),
        $source: ObservationSource.LawisIncidents,
        aspect: toAspect(lawis.location.aspect?.text),
        authorName: "",
        content: "(LAWIS incident)",
        elevation: lawis.location.elevation,
        eventDate: parseLawisDate(lawis.date),
        latitude: lawis.location.latitude,
        locationName: lawis.location.name,
        longitude: lawis.location.longitude,
        region: lawis.location.region.text
      }))
      .filter((observation) => this.inMapBounds(observation))
      .flatMap((incident) => {
        if (!LAWIS_FETCH_DETAILS) {
          return Observable.of(incident);
        }
        return Observable.fromPromise(this.getCachedOrFetch<IncidentDetails>(api.LawisIncidents + "/" + incident.$data.id))
          .map<IncidentDetails, GenericObservation>((lawisDetails) => ({
            ...incident,
            $extraDialogRows: (t) => toLawisIncidentTable(lawisDetails, t),
            authorName: lawisDetails.reported?.name,
            content: lawisDetails.comments,
            reportDate: parseLawisDate(lawisDetails.reported?.date)
          }))
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
    return this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(this.startDate);
  }

  private get endDateString(): string {
    return this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(this.endDate);
  }

  inDateRange({ $source, eventDate }: GenericObservation): boolean {
    if ($source === ObservationSource.LwdKipSperre) return true;
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
