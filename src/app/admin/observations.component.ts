import { Component } from "@angular/core";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "app/providers/authentication-service/authentication.service";
import { ConstantsService } from "app/providers/constants-service/constants.service";
import { saveAs } from "file-saver";

@Component({
  templateUrl: "observations.component.html",
  selector: "app-observations",
})
export class ObservationsComponent {
  public loadingStatistics: boolean;
  public bsRangeValue: Date[];

  constructor(
    public http: HttpClient,
    public constantsService: ConstantsService,
    public authenticationService: AuthenticationService
  ) {
    this.loadingStatistics = false;
  }

  getStatistics(event) {
    event.stopPropagation();
    if (this.bsRangeValue) {
      this.loadingStatistics = true;
      document.getElementById("overlay").style.display = "block";
      const url =
        this.constantsService.getServerUrl() +
        "observations/export?startDate=" +
        this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(this.bsRangeValue[0]) +
        "&endDate=" +
        this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(this.bsRangeValue[1]);
      const headers = this.authenticationService.newAuthHeader("text/csv");
      this.http.get(url, { headers: headers, responseType: "blob" }).subscribe((blob) => {
        this.loadingStatistics = false;
        document.getElementById("overlay").style.display = "none";
        const format = "yyyy-MM-dd";
        const locale = "en-US";
        const startDate = formatDate(this.bsRangeValue[0], format, locale);
        const endDate = formatDate(this.bsRangeValue[1], format, locale);
        let filename = "observations_" + startDate + "_" + endDate;
        filename = filename + ".csv";
        saveAs(blob, filename);
        console.log("Observations loaded.");
      });
    }
  }
}
