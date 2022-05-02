import { Component, AfterContentInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { ConfigurationService } from "../providers/configuration-service/configuration.service";
import { SocialmediaService } from "../providers/socialmedia-service/socialmedia.service";
import * as Enums from "../enums/enums";
import { AlertComponent } from "ngx-bootstrap/alert";

@Component({
  templateUrl: "region-configuration.component.html",
  selector: "app-region-configuration"
})
export class RegionConfigurationComponent implements AfterContentInit {

  public statusMap: Map<number, Enums.BulletinStatus>;
  public configurationPropertiesLoaded: boolean = false;
  public saveConfigurationLoading: boolean;

  public alerts: any[] = [];

  public createMaps: boolean;
  public createPdf: boolean;
  public createSimpleHtml: boolean;
  public sendEmails: boolean;
  public publishToTelegramChannel: boolean;
  public publishBulletins: boolean;
  public publishBlogs: boolean;

  public isAccordionOpen: boolean;

  constructor(
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private constantsService: ConstantsService,
    public configurationService: ConfigurationService,
    public socialmediaService: SocialmediaService) {
    this.statusMap = new Map<number, Enums.BulletinStatus>();
    this.saveConfigurationLoading = false;
    this.isAccordionOpen = false;
  }

  ngAfterContentInit() {
    if (this.authenticationService.isCurrentUserInRole(this.constantsService.roleAdmin)) {
      this.configurationService.loadRegionConfiguration(this.authenticationService.activeRegion).subscribe(
        data => {
          // TODO fix
          this.createMaps = (data as any).createMaps;
          this.createPdf = (data as any).createPdf;
          this.createSimpleHtml = (data as any).createSimpleHtml;
          this.sendEmails = (data as any).sendEmails;
          this.publishToTelegramChannel = (data as any).publishToTelegramChannel;
          this.publishBulletins = (data as any).publishBulletins;
          this.publishBlogs = (data as any).publishBlogs;
          this.configurationPropertiesLoaded = true;
        },
        error => {
          console.error("Region configuration properties could not be loaded!");
        }
      );
    }
  }

  accordionChanged(event: boolean) {
    this.isAccordionOpen = event;
  }

  public save() {
    this.saveConfigurationLoading = true;
    const json = Object();
    json["createMaps"] = this.createMaps;
    json["createPdf"] = this.createPdf;
    json["createSimpleHtml"] = this.createSimpleHtml;
    json["sendEmails"] = this.sendEmails;
    json["publishToTelegramChannel"] = this.publishToTelegramChannel;
    json["publishBulletins"] = this.publishBulletins;
    json["publishBlogs"] = this.publishBlogs;

    this.configurationService.updateRegionConfiguration(json).subscribe(
      data => {
        this.saveConfigurationLoading = false;
        console.debug("Region configuration saved!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "success",
          msg: this.translateService.instant("admin.region-configuration.success"),
          timeout: 5000
        });
      },
      error => {
        this.saveConfigurationLoading = false;
        console.error("Region configuration could not be saved!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("admin.region-configuration.error"),
          timeout: 5000
        });
      }
    );
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
