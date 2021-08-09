import { Component } from "@angular/core";
import { formatDate } from "@angular/common";
import { ObservationsService } from "../observations/observations.service";
import { SettingsService } from "../providers/settings-service/settings.service";
import { saveAs } from "file-saver";

@Component({
  templateUrl: "observations.component.html",
  selector: "app-observations"
})
export class ObservationsComponent {

  public loadingStatistics: boolean;
  public bsRangeValue: Date[];

  constructor(
    public observationsService: ObservationsService,
    public settingsService: SettingsService) {
      this.loadingStatistics = false;
  }

  getStatistics(event) {
    event.stopPropagation();
    if (this.bsRangeValue) {
      this.loadingStatistics = true;
      document.getElementById("overlay").style.display = "block";
      this.observationsService.getCsv(this.bsRangeValue[0], this.bsRangeValue[1]).subscribe(blob => {
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
      })
    }
  }
}
