import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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

@Injectable()
export class ModellingService {
  constructor(
    public http: HttpClient,
    public constantsService: ConstantsService,
    public regionsService: RegionsService
  ) {}

  /**
   * Fetches ZAMG multi model points via HTTP, parses CVS file and returns parsed results.
   */
  getZamgModelPoints(): Observable<ZamgModelPoint[]> {
    const regions = this.regionsService.getRegionsEuregio();
    const url = `${this.constantsService.zamgModelsUrl}MultimodelPointsEuregio_001.csv`;

    const options: {
      responseType: 'text'
    } = {
      responseType: 'text'
    };

    return this.http.get(url, options).pipe(
      map(response => {
        const csv = Papa.parse(response, {
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
}
