import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { forkJoin, Observable } from "rxjs";
import { flatMap, last, map } from "rxjs/operators";
import * as Papa from "papaparse";
import { RegionsService } from "app/providers/regions-service/regions.service";
import { formatDate } from "@angular/common";

interface MultimodelPointCsv {
  statnr: string;
  lat: string;
  lon: string;
  elev: string;
  name: string;
  code: string;
}

export interface ZamgFreshSnow {
  hour: number;
  values: number[];
  min: number;
  max: number;
}

/**
 * Represents one ZAMG multi model point.
 */
export class ZamgModelPoint {
  constructor(
    public id: string,
    public regionCode: string,
    public regionName: string,
    public freshSnow: ZamgFreshSnow[],
    public plotUrl: string,
    public lat: number,
    public lng: number
  ) {}

  get label(): string {
    return this.regionCode + ": " + this.regionName;
  }
}

export interface SnowpackPlots {
  plotTypes: string[];
  aspects: string[];
  stations: string[];
}

export interface AvalancheWarningServiceObservedProfiles {
  latitude: number;
  longitude: number;
  elevation: number;
  aspect: string;
  eventDate: Date;
  locationName: string;
  $externalURL: string;
}

@Injectable()
export class ModellingService {
  constructor(
    public http: HttpClient,
    public constantsService: ConstantsService,
    public regionsService: RegionsService
  ) {}

  private parseCSV(text: string) {
    return Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      comments: "#"
    });
  }

  get(
    type: "multimodel" | "eps_ecmwf" | "eps_claef" | "observed_profile" | "alpsolut_profile"
  ): Observable<ZamgModelPoint[]> {
    if (type === "alpsolut_profile") {
      return this.getAlpsolutDashboardPoints();
    } else if (type === "observed_profile") {
      return this.getObservedProfiles();
    } else if (type === "eps_ecmwf") {
      return this.getZamgEcmwfModelPoints();
    } else if (type === "eps_claef") {
      return this.getZamgClaefModelPoints();
    } else if (type === "multimodel") {
      return this.getZamgMultiModelPoints();
    }
  }

  private getZamgMultiModelPoints(): Observable<ZamgModelPoint[]> {
    const urls = [
      "snowgridmultimodel_stationlist.txt",
      "snowgridmultimodel_modprog1400_HN.txt",
      "snowgridmultimodel_modprog910_HN.txt",
      "snowgridmultimodel_modprog990_HN.txt"
    ].map((file) => this.constantsService.zamgModelsUrl + file);
    return forkJoin(urls.map((url) => this.http.get(url, { responseType: "text" }))).pipe(
      map((responses) =>
        responses.map((r, index) => this.parseCSV(index === 0 ? r.toString().replace(/^#\s*/, "") : r.toString()))
      ),
      map(([points, hs1400, hn910, hn990]) =>
        points.data
          .map((row: MultimodelPointCsv) => {
            const id = row.statnr;
            const regionCode = row.code;
            const region = this.regionsService.getRegionForId(regionCode);
            const lat = parseFloat(row.lat);
            const lng = parseFloat(row.lon);

            const freshSnow: ZamgFreshSnow[] = [];
            try {
              [12, 24, 48, 72].map((hour) => {
                const values = [hs1400, hn910, hn990]
                  .map((csv) => {
                    const rowIndex = csv.data.findIndex((r) => r["-9999.0"] === `${hour}.0`);
                    return rowIndex >= 0 ? parseFloat(csv.data[rowIndex][`${id}.0`]) : undefined;
                  })
                  .filter((v) => isFinite(v));
                freshSnow.push({
                  hour,
                  values,
                  min: Math.min(...values),
                  max: Math.max(...values)
                });
              });
            } catch (e) {
              console.warn("Failed to build fresh snow", e);
            }

            return new ZamgModelPoint(
              id,
              regionCode,
              region?.name,
              freshSnow,
              `${this.constantsService.zamgModelsUrl}snowgridmultimodel_${id}.png`,
              lat,
              lng
            );
          })
          .sort((p1, p2) => p1.regionCode.localeCompare(p2.regionCode))
      )
    );
  }

  getZamgEcmwfTypes(): string[] {
    return ["HN", "HN_WOS", "HS"];
  }

  private getZamgEcmwfModelPoints(): Observable<ZamgModelPoint[]> {
    const { zamgModelsUrl } = this.constantsService;
    const url = `${zamgModelsUrl}eps_ecmwf/snowgrid_ECMWF_EPS_stationlist.txt`;
    return this.http.get(url, { responseType: "text" }).pipe(
      map((response) => this.parseCSV(response.toString().replace(/^#\s*/, ""))),
      map((parseResult) =>
        this.getZamgEcmwfTypes()
          .map((type) =>
            parseResult.data.map(
              ({ synop, lat, lon, name }) =>
                new ZamgModelPoint(
                  synop,
                  `${type} ${synop}`,
                  name,
                  [],
                  `${zamgModelsUrl}eps_ecmwf/snowgrid_ECMWF_EPS_${synop}_${type}.png`,
                  +lat,
                  +lon
                )
            )
          )
          .reduce((acc, x) => acc.concat(x))
      )
    );
  }

  private getZamgClaefModelPoints(): Observable<ZamgModelPoint[]> {
    const { zamgModelsUrl } = this.constantsService;
    const url = `${zamgModelsUrl}eps_claef/snowgrid_C-LAEF_EPS_stationlist.txt`;
    return this.http.get(url, { responseType: "text" }).pipe(
      map((response) => this.parseCSV(response.toString().replace(/^#\s*/, ""))),
      map((parseResult) =>
        this.getZamgEcmwfTypes()
          .map((type) =>
            parseResult.data.map(
              ({ synop, lat, lon, name }) =>
                new ZamgModelPoint(
                  synop,
                  `${type} ${synop}`,
                  name,
                  [],
                  `${zamgModelsUrl}eps_claef/snowgrid_C-LAEF_EPS_${synop}_${type}.png`,
                  +lat,
                  +lon
                )
            )
          )
          .reduce((acc, x) => acc.concat(x))
      )
    );
  }

  /**
   * Returns a data structure for the snowpack visualizations.
   */
  getSnowpackPlots(): SnowpackPlots {
    const plotTypes = ["LWC_stratigraphy", "wet_snow_instability", "Sk38_stratigraphy", "stratigraphy"];
    const aspects = ["flat", "north", "south"];
    const stations = [
      "AKLE2",
      "AXLIZ1",
      "BJOE2",
      "GGAL2",
      "GJAM2",
      "INAC2",
      "ISEE2",
      "KAUN2",
      "MIOG2",
      "NGAN2",
      "PESE2",
      "RHAN2",
      "SDAW2",
      "SSON2",
      "TRAU2"
    ];
    return { plotTypes, aspects, stations };
  }

  getSnowpackMeteoPlots(): string[] {
    return [
      "AT-7_new_snow_plot_3day",
      "AT-7_new_snow_plot_7day",
      "AT-7_new_snow_plot_1month",
      "AT-7_new_snow_plot_season",
      "AT-7_new_snow_plot_forecast",
      "AT-7_wet_snow_plot_3day",
      "AT-7_wet_snow_plot_7day",
      "AT-7_wet_snow_plot_1month",
      "AT-7_wet_snow_plot_season",
      "AT-7_wet_snow_plot_forecast",
      "AT-7_HS_table_24h",
      "AT-7_HS_table_72h",
      "AT-7_HS_table_season",
      "AT-7_HS_table_forecast",
      "AT-7_TA_table_24h",
      "AT-7_TA_table_72h",
      "AT-7_TA_table_season"
    ];
  }

  /**
   * SNOWPACK modelled snow profiles
   * https://gitlab.com/avalanche-warning
   */
  getObservedProfiles(): Observable<ZamgModelPoint[]> {
    const url = this.constantsService.observationApi.AvalancheWarningService;
    return this.http
      .get<AvalancheWarningServiceObservedProfiles[]>(url)
      .pipe(map((profiles) => profiles.map((profile) => toPoint(profile))));

    function toPoint(profile: AvalancheWarningServiceObservedProfiles) {
      const date = formatDate(profile.eventDate, "yyyy-MM-dd", "de");
      return new ZamgModelPoint(
        profile.$externalURL,
        date,
        profile.locationName,
        [],
        profile.$externalURL,
        profile.latitude,
        profile.longitude
      );
    }
  }

  getAlpsolutDashboardPoints(): Observable<ZamgModelPoint[]> {
    const dateStart = new Date();
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateStart.getDate());
    const params = {
      dateStart: dateStart.toISOString(),
      dateEnd: dateEnd.toISOString(),
      stage: "SNOWPACK",
      parameterCode: "HS_mod"
    };
    return this.http
      .get("https://admin.avalanche.report/dashboard.alpsolut.eu/", { observe: "response", responseType: "text" })
      .pipe(
        last(),
        flatMap((r) => {
          const apiKey = r.headers.get("X-API-KEY");
          const headers = { "X-API-KEY": apiKey };
          const url = "https://rest.alpsolut.eu/v1/geo/stations";
          return this.http
            .get<AlpsolutFeatureCollection>(url, { headers, params })
            .pipe(
              map((collection) =>
                collection.features
                  .map((f) => toPoint(f, f.properties.dataSets?.[0], apiKey, "cbc610ef-7b29-46c8-b070-333d339c2cd4"))
                  .filter((p) => p !== undefined)
              )
            );
        })
      );

    function toPoint(
      f: AlpsolutFeatureCollection["features"][0],
      d: DataSet,
      apiKey: string,
      configurationId: string
    ): ZamgModelPoint {
      if (!d) return;
      const configuration = {
        apiKey,
        configurationId,
        uiSettings: {
          aliasSelectionMode: "none"
        },
        externalParams: {
          datesPresetKey: "forecast",
          aliasId: d.dataSetId
        },
        datesPresets: {
          forecastBackDays: 5,
          forecastFwdDays: 5,
          options: ["season", "1m", "1w", "forecast"]
        },
        useHeightHints: true
      };
      const params = new URLSearchParams({ ViewerAppProps: JSON.stringify(configuration) });
      const url = "https://dashboard.alpsolut.eu/graphs/stable/viewer.html#" + params;
      return new ZamgModelPoint(
        d.stage,
        f.properties.code,
        f.properties.name,
        [],
        url,
        f.geometry.coordinates[1],
        f.geometry.coordinates[0]
      );
    }
  }
}

type AlpsolutFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Point, Properties>;

interface Properties {
  id: number;
  code: string;
  name: string;
  dataSets: DataSet[];
}

interface DataSet {
  dataSetId: number;
  stage: "SNOWPACK";
  aspect: Aspect;
  slopeAngle: number;
  slopeAzimuth: number;
}

enum Aspect {
  East = "EAST",
  Main = "MAIN",
  North = "NORTH",
  South = "SOUTH",
  West = "WEST"
}
