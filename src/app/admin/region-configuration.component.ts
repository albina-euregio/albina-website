import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationService, RegionConfiguration } from "../providers/configuration-service/configuration.service";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { SocialmediaService } from "../providers/socialmedia-service/socialmedia.service";
import { AlertComponent } from "ngx-bootstrap/alert";

@Component({
  templateUrl: "region-configuration.component.html",
  selector: "app-region-configuration"
})
export class RegionConfigurationComponent {

  @Input() config: RegionConfiguration;

  public configurationPropertiesLoaded: boolean = false;
  public saveConfigurationLoading: boolean;

  public alerts: any[] = [];

  constructor(
    private translateService: TranslateService,
    public configurationService: ConfigurationService,
    public authenticationService: AuthenticationService,
    public socialmediaService: SocialmediaService) {
    this.saveConfigurationLoading = false;
  }

  public save() {
    this.saveConfigurationLoading = true;
    if (this.authenticationService.getActiveRegionId() == this.config.id)
      this.authenticationService.setActiveRegion(this.config);
    const json = Object();
    json["id"] = this.config.id;
    json["microRegions"] = this.config.microRegions;
    json["subRegions"] = this.config.subRegions;
    json["superRegions"] = this.config.superRegions;
    json["neighborRegions"] = this.config.neighborRegions;
    json["publishBulletins"] = this.config.publishBulletins;
    json["publishBlogs"] = this.config.publishBlogs;
    json["createCaamlV5"] = this.config.createCaamlV5;
    json["createCaamlV6"] = this.config.createCaamlV6;
    json["createJson"] = this.config.createJson;
    json["createMaps"] = this.config.createMaps;
    json["createPdf"] = this.config.createPdf;
    json["createSimpleHtml"] = this.config.createSimpleHtml;
    json["sendEmails"] = this.config.sendEmails;
    json["sendTelegramMessages"] = this.config.sendTelegramMessages;
    json["sendPushNotifications"] = this.config.sendPushNotifications;
    json["enableMediaFile"] = this.config.enableMediaFile;
    json["serverInstance"] = this.config.serverInstance;
    json["pdfColor"] = this.config.pdfColor;
    json["emailColor"] = this.config.emailColor;
    json["pdfMapYAmPm"] = this.config.pdfMapYAmPm;
    json["pdfMapYFd"] = this.config.pdfMapYFd;
    json["pdfMapWidthAmPm"] = this.config.pdfMapWidthAmPm;
    json["pdfMapWidthFd"] = this.config.pdfMapWidthFd;
    json["pdfMapHeight"] = this.config.pdfMapHeight;
    json["pdfFooterLogo"] = this.config.pdfFooterLogo;
    json["pdfFooterLogoColorPath"] = this.config.pdfFooterLogoColorPath;
    json["pdfFooterLogoBwPath"] = this.config.pdfFooterLogoBwPath;
    json["mapXmax"] = this.config.mapXmax;
    json["mapXmin"] = this.config.mapXmin;
    json["mapYmax"] = this.config.mapYmax;
    json["mapYmin"] = this.config.mapYmin;
    json["simpleHtmlTemplateName"] = this.config.simpleHtmlTemplateName;
    json["geoDataDirectory"] = this.config.geoDataDirectory;
    json["mapLogoColorPath"] = this.config.mapLogoColorPath;
    json["mapLogoBwPath"] = this.config.mapLogoBwPath;
    json["mapLogoPosition"] = this.config.mapLogoPosition;
    json["mapCenterLat"] = this.config.mapCenterLat;
    json["mapCenterLng"] = this.config.mapCenterLng;
    json["imageColorbarColorPath"] = this.config.imageColorbarColorPath;
    json["imageColorbarBwPath"] = this.config.imageColorbarBwPath;

    if (!this.config.isNew) {
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
    } else {
      this.configurationService.createRegionConfiguration(json).subscribe(
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
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
