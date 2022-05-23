import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ConstantsService } from "../constants-service/constants.service";
import { AuthenticationService } from "../authentication-service/authentication.service";

@Injectable()
export class StatisticsService {

  constructor(
    public http: HttpClient,
    private constantsService: ConstantsService,
    private authenticationService: AuthenticationService) {
  }

  getStatisticsCsv(startDate: Date, endDate: Date, lang: String, extended: boolean, duplicates: boolean): Observable<Blob> {
    const url = this.constantsService.getServerUrl() + "statistics?startDate=" + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(startDate) + "&endDate=" + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(endDate) + "&region=" + this.authenticationService.getActiveRegionId() + "&lang=" + lang + "&extended=" + extended + "&duplicates=" + duplicates;
    const headers = this.authenticationService.newAuthHeader("text/csv");

    return this.http.get(url, { headers: headers, responseType: "blob" });
  }
}
