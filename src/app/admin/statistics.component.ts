import { Component } from "@angular/core";
import { formatDate } from "@angular/common";
import { StatisticsService } from "../providers/statistics-service/statistics.service";
import { SettingsService } from "../providers/settings-service/settings.service";
import { saveAs } from "file-saver";

@Component({
  templateUrl: "statistics.component.html",
  selector: "app-statistics"
})
export class StatisticsComponent {

  public loadingStatistics: boolean;
  public bsRangeValue: Date[];
  public duplicates: boolean;
  public extended: boolean;

  constructor(
    public statisticsService: StatisticsService,
    public settingsService: SettingsService) {
      this.loadingStatistics = false;
  }

  getStatistics(event) {
    event.stopPropagation();
    if (this.bsRangeValue) {
      this.loadingStatistics = true;
      document.getElementById("overlay").style.display = "block";
      this.statisticsService.getStatisticsCsv(this.bsRangeValue[0], this.bsRangeValue[1], this.settingsService.getLangString(), this.extended, this.duplicates).subscribe(blob => {
        this.loadingStatistics = false;
        debugger
        document.getElementById("overlay").style.display = "none";
        const format = "yyyy-MM-dd";
        const locale = "en-US";
        const startDate = formatDate(this.bsRangeValue[0], format, locale);
        const endDate = formatDate(this.bsRangeValue[1], format, locale);
        let filename = "statistic_" + startDate + "_" + endDate;
        if (this.extended || this.duplicates) {
          filename = filename + "_";
          if (this.duplicates) {
            filename = filename + "d"
          }
          if (this.extended) {
            filename = filename + "e"
          }
        }
        filename = filename + "_" + this.settingsService.getLangString() + ".csv";
        saveAs(blob, filename);
        console.log("Statistics loaded.");
      })
    }
  }
}
