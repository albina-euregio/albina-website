import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { ModellingService, SnowpackPlots } from "./modelling.service";

@Component({
  templateUrl: "./snowpack.component.html"
})
export class SnowpackComponent implements OnInit {
  snowpackPlots: SnowpackPlots;
  station: string;
  aspect: string;
  plotType: string;
  plotUrl: SafeResourceUrl;

  constructor(
    private modellingService: ModellingService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.snowpackPlots = this.modellingService.getSnowpackPlots();
    this.station = this.snowpackPlots.stations[0];
    this.aspect = this.snowpackPlots.aspects[0];
    this.plotType = this.snowpackPlots.plotTypes[0];
    this.updatePlotUrl();
  }

  updatePlotUrl() {
    const url = `https://orsera.alpsolut.eu/tyrol/graphs/${this.plotType}_plot_${this.aspect}_${this.station}.html`;
    this.plotUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
