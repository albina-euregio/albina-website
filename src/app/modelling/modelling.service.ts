import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as Papa from "papaparse";
import { RegionsService } from "app/providers/regions-service/regions.service";

/**
 * Represents one ZAMG multi model point.
 */
export class ZamgModelPoint {
  constructor(
    public id: string,
    public regionCode: string,
    public regionNameDE: string,
    public regionNameIT: string,
    public plotUrl
  ) {}
}

export interface SnowpackPlots {
  plotTypes: string[];
  aspects: string[];
  stations: string[];
};

@Injectable()
export class ModellingService {
  constructor(
    public http: Http,
    public constantsService: ConstantsService,
    public regionsService: RegionsService
  ) {}

  /**
   * Fetches ZAMG multi model points via HTTP, parses CSV file and returns parsed results.
   */
  getZamgModelPoints(): Observable<ZamgModelPoint[]> {
    const regions = this.regionsService.getRegionsEuregio();
    const url = `${this.constantsService.zamgModelsUrl}MultimodelPointsEuregio_001.csv`;
    return this.http.get(url).pipe(
      map(response => {
        const csv = Papa.parse(response.text(), {
          header: true,
          skipEmptyLines: true
        });
        return csv.data.map(row => {
          const id = row.UID;
          const regionCode = row.RegionCode;
          const region = regions.features.find(
            feature => feature.properties.id === regionCode
          );
          return new ZamgModelPoint(
            id,
            regionCode,
            region ? region.properties.name_de : undefined,
            region ? region.properties.name_it : undefined,
            `${this.constantsService.zamgModelsUrl}snowgridmultimodel_${id}.png`
          );
        });
      })
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
}
