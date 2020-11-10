import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as Papa from "papaparse";
import { RegionsService } from "app/providers/regions-service/regions.service";

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
    public regionNameDE: string,
    public regionNameIT: string,
    public freshSnow: ZamgFreshSnow[],
    public plotUrl: string,
    public lat: number,
    public lng: number
  ) {}
}

export interface SnowpackPlots {
  plotTypes: string[];
  aspects: string[];
  stations: string[];
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

  /**
   * Fetches ZAMG multi model points via HTTP, parses CSV file and returns parsed results.
   */
  getZamgModelPoints(): Observable<ZamgModelPoint[]> {
    const regions = this.regionsService.getRegionsEuregio();
    const urls = [
      "MultimodelPointsEuregio_001.csv",
      "snowgridmultimodel_modprog110_HN.txt",
      "snowgridmultimodel_modprog213_HN.txt",
      "snowgridmultimodel_modprog910_HN.txt",
      "snowgridmultimodel_modprog990_HN.txt"
    ].map(file => this.constantsService.zamgModelsUrl + file);
    return Observable.forkJoin(urls.map(url => this.http.get(url, {responseType: "text"})))
      .pipe(map(responses => responses.map(r => this.parseCSV(r.toString()))))
      .pipe(
        map(([points, hn110, hn213, hn910, hn990]) =>
          points.data.map(row => {
            const id = row.UID;
            const regionCode = row.RegionCode;
            const region = regions.features.find(
              feature => feature.properties.id === regionCode
            );
            const lat = parseFloat(row.MuMo_Y.replace(/,/g, "."));
            const lng = parseFloat(row.MuMo_X.replace(/,/g, "."));

            const freshSnow: ZamgFreshSnow[] = [];
            try {
              [12, 24, 48, 72].map(hour => {
                const values = [hn110, hn213, hn910, hn990]
                  .map(csv => {
                    const rowIndex = csv.data.findIndex(
                      r => r["-9999.0"] === `${hour}.0`
                    );
                    return rowIndex >= 0
                      ? parseFloat(csv.data[rowIndex][`${id}.0`])
                      : undefined;
                  })
                  .filter(v => isFinite(v));
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
              region ? region.properties.name_de : undefined,
              region ? region.properties.name_it : undefined,
              freshSnow,
              `${this.constantsService.zamgModelsUrl}snowgridmultimodel_${id}.png`,
              lat,
              lng
            );
          })
        )
      );
  }

  /**
   * Returns a data structure for the snowpack visualizations.
   */
  getSnowpackPlots(): SnowpackPlots {
    const plotTypes = [
      "LWC_stratigraphy",
      "wet_snow_instability",
      "Sk38_stratigraphy",
      "stratigraphy"
    ];
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
      "new_snow_plot_3day",
      "new_snow_plot_7day",
      "new_snow_plot_1month",
      "new_snow_plot_season",
      "new_snow_plot_forecast",
      "wet_snow_plot_3day",
      "wet_snow_plot_7day",
      "wet_snow_plot_1month",
      "wet_snow_plot_season",
      "wet_snow_plot_forecast",
      "HS_table_24h",
      "HS_table_72h",
      "HS_table_season",
      "HS_table_forecast",
      "TA_table_24h",
      "TA_table_72h",
      "TA_table_season"
    ];
  }
}