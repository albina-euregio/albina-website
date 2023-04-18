import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthenticationService } from "app/providers/authentication-service/authentication.service";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import {
  convertObservationToGeneric,
  Observation,
} from "./models/observation.model";
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
  toLawisProfile,
} from "./models/lawis.model";
import {
  GenericObservation,
  ObservationSource,
  ObservationType,
  Aspect,
} from "./models/generic-observation.model";
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
  LwdKipSprengerfolg,
} from "./models/lwdkip.model";
import {
  ApiWikisnowECT,
  convertWikisnow,
  WikisnowECT,
} from "./models/wikisnow.model";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin, from, merge, Observable, of, onErrorResumeNext } from "rxjs";
import {
  catchError,
  filter,
  last,
  map,
  mergeAll,
  mergeMap,
  flatMap,
} from "rxjs/operators";
import BeobachterAT from "./data/Beobachter-AT.json";
import BeobachterIT from "./data/Beobachter-IT.json";
import { ObservationFilterService } from "./observation-filter.service";
import { RegionsService } from "../providers/regions-service/regions.service";
import { ElevationService } from "../providers/map-service/elevation.service";
import { LatLng } from "leaflet";

interface FotoWebcamEU {
  id: string;
  name: string;
  title: string;
  keywords: string;
  offline: boolean;
  hidden: boolean;
  imgurl: string;
  link: string;
  localLink: string;
  modtime: number;
  details: number;
  sortscore: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number;
  direction: number;
  focalLen: number;
  radius_km: number;
  sector: number;
  partner: boolean;
  captureInterval: number;
}

interface FotoWebcamEUResponse {
  cams: FotoWebcamEU[];
}

interface PanomaxCam {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  zeroDirection: number;
  viewAngle: number;
  iconUrl: string;
  mapMarkerGravity: string;
  nightVision: boolean;
  types?: any[];
  elevation?: number;
  tourCam?: boolean;
  country?: string;
  countryName?: string;
  firstPano?: string;
  lastPano?: string;
}

interface PanomaxInstance {
  id: number;
  name: string;
  frontentryUrl?: string;
  logo?: string;
  initialDirection: number;
  cam: PanomaxCam;
}

interface PanomaxThumbnailResponse {
  mode: string;
  name: string;
  url: string;
  tourCam: boolean;
  zeroDirection: number;
  viewAngle: number;
  initialDirection: number;
  clipping: any;
  logo: string;
  images: any;
  instance: PanomaxInstance;
  culture: any;
  country: string;
  position: {
    latitude: number;
    longitude: number;
  };
}

interface PanomaxCamResponse {
  id: string;
  slug: string;
  type: string;
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
  otherInstances: any[];
  instanceLogos: any[];
  hotSpots: any[];
  categories: any[];
  sources: any[];
  clusteringZoomLevel: number;
  refreshInterval: number;
  instances: {
    [key: string]: PanomaxInstance;
  };
}

@Injectable()
export class ObservationsService {
  private lwdKipLayers: Observable<ArcGisLayer[]>;

  constructor(
    public http: HttpClient,
    public filter: ObservationFilterService,
    public authenticationService: AuthenticationService,
    public translateService: TranslateService,
    public constantsService: ConstantsService,
    public regionsService: RegionsService,
    public elevationService: ElevationService
  ) {}

  loadAll(): Observable<GenericObservation<any>> {
    return onErrorResumeNext(
      this.getObservers(),
      this.getLawisIncidents(),
      this.getLawisProfiles(),
      this.getLoLaKronos(ObservationSource.LoLaKronos),
      this.getLoLaKronos(ObservationSource.LoLaAvalancheFeedbackAT5),
      this.getLoLaKronos(ObservationSource.LoLaAvalancheFeedbackAT8),
      this.getLoLaSafety(),
      this.getLwdKipObservations(),
      this.getWikisnowECT(),
      this.getObservations(),
      // this.getFotoWebcamsEU(),
      this.getPanomax()
    );
  }

  getObservation(id: number): Observable<GenericObservation<Observation>> {
    const url = this.constantsService.getServerUrl() + "observations/" + id;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http
      .get<Observation>(url, options)
      .pipe(map((o) => convertObservationToGeneric(o)));
  }

  private getLwdKipLayer<T>(name: string, params: Record<string, string>) {
    if (!this.lwdKipLayers) {
      const url =
        this.constantsService.getServerUrl() +
        "observations/lwdkip/layers?f=json";
      const headers = this.authenticationService.newAuthHeader();
      this.lwdKipLayers = this.http.get<ArcGisApi>(url, { headers }).pipe(
        map((data) => {
          if ("error" in data) {
            throw new Error(data.error?.message);
          } else if (!data.layers?.length) {
            throw new Error("No LWDKIP layers found!");
          }
          return data.layers;
        })
      );
    }
    const lwdKipLayers = this.lwdKipLayers.pipe(last());
    return lwdKipLayers.pipe(
      mergeMap((layers) => {
        const layer = layers.find(
          (l) => l.name.trim() === name && l.type === "Feature Layer"
        );
        if (!layer) {
          throw new Error("No LWDKIP layer for " + name);
        }
        const url =
          this.constantsService.getServerUrl() +
          "observations/lwdkip/" +
          layer.id;
        const headers = this.authenticationService.newAuthHeader();
        return this.http
          .get<T | { error: { message: string } }>(url, { headers, params })
          .pipe(
            map((data) => {
              if ("error" in data) {
                console.error(
                  "Failed fetching LWDKIP " + name,
                  new Error(data.error?.message)
                );
                return { features: [] };
              }
              return data;
            })
          );
      })
    );
  }

  getLwdKipObservations(): Observable<GenericObservation> {
    const startDate = this.filter.startDate
      .toISOString()
      .slice(0, "2006-01-02T15:04:05".length)
      .replace("T", " ");
    const endDate = this.filter.endDate
      .toISOString()
      .slice(0, "2006-01-02T15:04:05".length)
      .replace("T", " ");
    const params: Record<string, string> = {
      where: `BEOBDATUM > TIMESTAMP '${startDate}' AND BEOBDATUM < TIMESTAMP '${endDate}'`,
      outFields: "*",
      datumTransformation: "5891",
      f: "geojson",
    };
    const o0 = this.getLwdKipLayer<LwdKipBeobachtung>(
      "Beobachtungen",
      params
    ).pipe(
      mergeMap((featureCollection) => featureCollection.features),
      map((feature) => convertLwdKipBeobachtung(feature))
    );
    const o1 = this.getLwdKipLayer<LwdKipSprengerfolg>(
      "Sprengerfolg",
      params
    ).pipe(
      mergeMap((featureCollection) => featureCollection.features),
      map((feature) => convertLwdKipSprengerfolg(feature))
    );
    const o2 = this.getLwdKipLayer<LwdKipLawinenabgang>(
      "Lawinenabgänge",
      params
    ).pipe(
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
    const url =
      this.constantsService.getServerUrl() +
      "observations?startDate=" +
      this.startDateString +
      "&endDate=" +
      this.endDateString;
    const headers = this.authenticationService.newAuthHeader();
    return this.http.get<Observation[]>(url, { headers }).pipe(
      mergeAll(),
      map((o) => convertObservationToGeneric(o))
    );
  }

  postObservation(
    observation: Observation
  ): Observable<GenericObservation<Observation>> {
    observation = this.serializeObservation(observation);
    const url = this.constantsService.getServerUrl() + "observations";
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http
      .post<Observation>(url, observation, options)
      .pipe(map((o) => convertObservationToGeneric(o)));
  }

  putObservation(
    observation: Observation
  ): Observable<GenericObservation<Observation>> {
    observation = this.serializeObservation(observation);
    const url =
      this.constantsService.getServerUrl() + "observations/" + observation.id;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    return this.http
      .put<Observation>(url, observation, options)
      .pipe(map((o) => convertObservationToGeneric(o)));
  }

  private serializeObservation(observation: Observation): Observation {
    return {
      ...observation,
      eventDate:
        typeof observation.eventDate === "object"
          ? getISOString(observation.eventDate)
          : observation.eventDate,
      reportDate:
        typeof observation.reportDate === "object"
          ? getISOString(observation.reportDate)
          : observation.reportDate,
    };
  }

  async deleteObservation(observation: Observation): Promise<void> {
    const url =
      this.constantsService.getServerUrl() + "observations/" + observation.id;
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers };
    await this.http.delete(url, options).toPromise();
  }

  getObservers(): Observable<GenericObservation> {
    const eventDate = new Date();
    eventDate.setHours(0, 0, 0, 0);
    return of(BeobachterAT, BeobachterIT).pipe(
      mergeAll(),
      map(
        (observer): GenericObservation => ({
          $data: observer,
          $externalURL: `https://wiski.tirol.gv.at/lawine/grafiken/800/beobachter/${observer["plot.id"]}.png`,
          $source: ObservationSource.Observer,
          $type: ObservationType.TimeSeries,
          aspect: undefined,
          authorName: observer.name,
          content: "",
          elevation: undefined,
          eventDate,
          latitude: +observer.latitude,
          locationName: observer.name.replace("Beobachter", "").trim(),
          longitude: +observer.longitude,
          region: "",
        })
      )
    );
  }

  getLoLaKronos(
    source:
      | ObservationSource.LoLaKronos
      | ObservationSource.LoLaAvalancheFeedbackAT5
      | ObservationSource.LoLaAvalancheFeedbackAT8
  ): Observable<GenericObservation> {
    const { observationApi: api, observationWeb: web } = this.constantsService;
    const timeframe = this.startDateString + "/" + this.endDateString;
    return this.http
      .get<LolaKronosApi>(api[source] + timeframe)
      .pipe(mergeMap((kronos) => convertLoLaKronos(kronos, web[source])));
  }

  getLoLaSafety(): Observable<GenericObservation> {
    const { observationApi: api } = this.constantsService;
    const timeframe = this.startDateString + "/" + this.endDateString;
    return this.http
      .get<LoLaSafetyApi>(api.LoLaSafety + timeframe)
      .pipe(mergeMap((lola) => convertLoLaSafety(lola)));
  }

  getWikisnowECT(): Observable<GenericObservation> {
    const { observationApi: api } = this.constantsService;
    return this.http.get<ApiWikisnowECT>(api.WikisnowECT).pipe(
      mergeMap((api) => api.data),
      map<WikisnowECT, GenericObservation>((wikisnow) =>
        convertWikisnow(wikisnow)
      ),
      filter(
        (observation) =>
          this.filter.inDateRange(observation) &&
          this.filter.inMapBounds(observation)
      )
    );
  }

  getLawisProfiles(): Observable<GenericObservation> {
    const { observationApi: api, observationWeb: web } = this.constantsService;
    return this.http
      .get<Profile[]>(
        api.Lawis +
          "profile" +
          "?startDate=" +
          this.startDateString +
          "&endDate=" +
          this.endDateString +
          "&_=" +
          nowWithHourPrecision()
      )
      .pipe(
        mergeAll(),
        map<Profile, GenericObservation<Profile>>((lawis) =>
          toLawisProfile(lawis, web["Lawis-Profile"])
        ),
        filter((observation) => this.filter.inMapBounds(observation)),
        mergeMap((profile) => {
          if (!LAWIS_FETCH_DETAILS) {
            return of(profile);
          }
          return from(
            this.getCachedOrFetchLowPriority<ProfileDetails>(
              api.Lawis + "profile/" + profile.$data.id
            )
          ).pipe(
            map<ProfileDetails, GenericObservation>((lawisDetails) =>
              toLawisProfileDetails(profile, lawisDetails)
            ),
            catchError(() => of(profile))
          );
        })
      );
  }

  getLawisIncidents(): Observable<GenericObservation> {
    const { observationApi: api, observationWeb: web } = this.constantsService;
    return this.http
      .get<Incident[]>(
        api.Lawis +
          "incident" +
          "?startDate=" +
          this.startDateString +
          "&endDate=" +
          this.endDateString +
          "&_=" +
          nowWithHourPrecision()
      )
      .pipe(
        mergeAll(),
        map<Incident, GenericObservation<Incident>>((lawis) =>
          toLawisIncident(lawis, web["Lawis-Incident"])
        ),
        filter((observation) => this.filter.inMapBounds(observation)),
        mergeMap((incident) => {
          if (!LAWIS_FETCH_DETAILS) {
            return of(incident);
          }
          return from(
            this.getCachedOrFetchLowPriority<IncidentDetails>(
              api.Lawis + "incident/" + incident.$data.id
            )
          ).pipe(
            map<IncidentDetails, GenericObservation>((lawisDetails) =>
              toLawisIncidentDetails(incident, lawisDetails)
            ),
            catchError(() => of(incident))
          );
        })
      );
  }

  degreeToAspect(degree: number): Aspect {
    const aspects = Object.values(Aspect);

    const n = (Math.round((degree * 8) / 360) + 8) % 8;
    return aspects[n];
  }

  getLolaCads(cam: GenericObservation): Observable<any> {
    const lolaCadsApi =
      "https://api.avalanche.report/www.lola-cads.info/LWDprocessPhotoURL";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2xhQWNjZXNzIjpmYWxzZSwibHdkQWNjZXNzIjp0cnVlLCJpYXQiOjE2Nzk1ODA3NjYsImV4cCI6MTcxMTExNjc2Nn0.IpZ4Nkkmvw0IiEi3Hvh9Pt4RvtJv7KktMLQCwdhVtBU";

    //get url from latest image
    const imgurl = cam.$data["latest"];

    //make url safe
    const imgurlSafe = encodeURIComponent(imgurl);
    const fullUrl = lolaCadsApi + "?imageurl=" + imgurlSafe;

    const headers = new HttpHeaders({
      Authorization: token,
    });

    const options = { headers: headers };

    // console.log(fullUrl);

    //create post request to lolaCadsApi with imageurl: imgurl as parameter and token as authorization header
    return this.http.post<any>(fullUrl, {}, options);
  }

  //get panomax cams and fetch lola cads data for each
  getPanomax(): Observable<GenericObservation> {
    const { observationApi: api } = this.constantsService;
    const baseURL =
      "https://api.avalanche.report/api.panomax.com/1.0/instances/thumbnails/";

    // make request to observationApi.panomax and make a request to the thumbnail url for each result.instance.id
    return this.http.get<PanomaxCamResponse>(api.Panomax).pipe(
      mergeMap((res: PanomaxCamResponse) => {
        const cams = Object.values(res.instances)

          // make request to each thumbnail url
          .filter((webcam: PanomaxInstance) => {
            const region = this.regionsService.getRegionForLatLng(
              new LatLng(webcam.cam.latitude, webcam.cam.longitude)
            );
            return region !== undefined;
          })
          .map((webcam: PanomaxInstance) => {
            return this.http

              .get<PanomaxThumbnailResponse[]>(baseURL + webcam.id)
              .pipe(
                map((res: PanomaxThumbnailResponse[]) => {
                  const cam = res[0].instance.cam;
                  //set res[0].latest to the latest image from res[0].images
                  res[0]["latest"] =
                    res[0].images[Object.keys(res[0].images).sort().pop()];
                  res[0]["latest"] = res[0]["latest"].small;
                  const latlng = new LatLng(cam.latitude, cam.longitude);
                  const response: GenericObservation = {
                    $data: res[0],
                    $externalURL: res[0].url,
                    $source: ObservationSource.Panomax,
                    $type: ObservationType.Webcam,
                    authorName: "panomax.com",
                    content: cam.name,
                    elevation: cam.elevation,
                    eventDate: new Date(Date.now()),
                    latitude: cam.latitude,
                    longitude: cam.longitude,
                    locationName: res[0].instance.name,
                    region: this.regionsService.getRegionForLatLng(latlng)?.id,
                    aspect:
                      cam.viewAngle !== 360
                        ? this.degreeToAspect(cam.zeroDirection)
                        : undefined,
                  };
                  return response;
                })
              );
          });

        const observables = from(cams);
        return observables.pipe(mergeAll());
      })
    );
  }

  getFotoWebcamsEU(): Observable<GenericObservation> {
    const { observationApi: api } = this.constantsService;

    return this.http.get<FotoWebcamEUResponse>(api.FotoWebcamsEU).pipe(
      mergeMap((res: FotoWebcamEUResponse) => {
        const cams = res.cams
          .map((webcam: FotoWebcamEU) => {
            const latlng = new LatLng(webcam.latitude, webcam.longitude);

            webcam["latest"] = webcam.imgurl;
            const cam: GenericObservation = {
              $data: webcam,
              $externalURL: webcam.link,
              $source: ObservationSource.FotoWebcamsEU,
              $type: ObservationType.Webcam,
              authorName: "foto-webcam.eu",
              content: webcam.title,
              elevation: webcam.elevation,
              eventDate: new Date(webcam.modtime * 1000),
              latitude: webcam.latitude,
              longitude: webcam.longitude,
              locationName: webcam.name,
              region: this.regionsService.getRegionForLatLng(latlng)?.id,
              aspect: this.degreeToAspect(webcam.direction),
            };
            return cam;
          })
          .filter((observation) => observation.$data.offline === false)
          .filter((observation) => observation.region !== undefined);

        const observables = from(cams);
        // get lola-cads data for each webcam
        return observables;
      }),
      mergeMap((cam: GenericObservation) => {
        if (cam.$data["latest"].includes("foto-webcam.eu")) {
          // console.log(cam.$data["latest"]);
          return this.getLolaCads(cam).pipe(
            map((lolaCadsData) => {
              // console.log(lolaCadsData);
              if (lolaCadsData.length === 0) return cam;

              const response: GenericObservation = {
                $data: cam,
                $externalURL: cam.$externalURL,
                $source: ObservationSource.FotoWebcamsEU,
                $type: ObservationType.Avalanche,
                authorName: `foto-webcam.eu, ${
                  lolaCadsData[0].label
                }, ${Math.round(lolaCadsData[0].conf * 100)}%`,
                content: cam.content,
                elevation: cam.elevation,
                eventDate: new Date(Date.now()),
                latitude: cam.latitude,
                longitude: cam.longitude,
                locationName: cam.locationName,
                region: cam.region,
                aspect: cam.aspect,
              };
              return response;
            })
          );
        } else {
          return of(cam);
        }
      })
    );
  }

  async getCachedOrFetchLowPriority<T>(url: string): Promise<T> {
    let cache: Cache;
    try {
      cache = await caches.open("observations");
      const cached = await cache.match(url);
      if (cached) {
        return cached.json();
      }
    } catch (ignore) {}
    const response = await fetch(url, {
      mode: "cors",
      priority: "low",
      // https://developer.mozilla.org/en-US/docs/Web/API/Request/priority
    } as RequestInit & { priority: "high" | "low" | "auto" });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    if (cache) {
      cache.put(url, response);
    }
    return response.json();
  }

  private get startDateString(): string {
    return this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(
      this.filter.startDate
    );
  }

  private get endDateString(): string {
    return this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(
      this.filter.endDate
    );
  }

  getCsv(startDate: Date, endDate: Date): Observable<Blob> {
    const url =
      this.constantsService.getServerUrl() +
      "observations/export?startDate=" +
      this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(
        startDate
      ) +
      "&endDate=" +
      this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(endDate);
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
