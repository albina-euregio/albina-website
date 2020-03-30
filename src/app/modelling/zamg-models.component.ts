import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ModellingService, ZamgModelPoint } from "./modelling.service";

@Component({
  templateUrl: "./zamg-models.component.html"
})
export class ZamgModelsComponent implements OnInit, AfterViewInit {
  modelPoints: ZamgModelPoint[];
  selectedModelPoint: ZamgModelPoint;

  @ViewChild("select") select;

  constructor(
    private modellingService: ModellingService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.modellingService.getZamgModelPoints().subscribe(zamgModelPoints => {
      this.modelPoints = zamgModelPoints;
    });
  }

  ngAfterViewInit() {
    this.select.nativeElement.focus();
  }

  get currentLang() {
    return this.translate.currentLang;
  }
}
