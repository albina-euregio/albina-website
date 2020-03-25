import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { ModellingService } from "./modelling.service";

@Component({
  templateUrl: "./snowpack.meteo.component.html"
})
export class SnowpackMeteoComponent implements OnInit {
  snowpackMeteoPlots: string[];
  snowpackMeteoPlot: string;
  plotUrl: SafeResourceUrl;

  constructor(
    private modellingService: ModellingService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.snowpackMeteoPlots = this.modellingService.getSnowpackMeteoPlots();
    this.snowpackMeteoPlot = this.snowpackMeteoPlots[0];
    this.updatePlotUrl();
  }

  updatePlotUrl() {
    const url = `https://orsera.alpsolut.eu/tyrol/graphs/${this.snowpackMeteoPlot}.html`;
    this.plotUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
