import { Component, AfterContentInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { ConfigurationService } from "../providers/configuration-service/configuration.service";
import { SocialmediaService } from "../providers/socialmedia-service/socialmedia.service";
import * as Enums from "../enums/enums";
import { AlertComponent } from "ngx-bootstrap";

@Component({
  templateUrl: "server-configuration.component.html",
  selector: "app-server-configuration"
})
export class ServerConfigurationComponent implements AfterContentInit {

  public statusMap: Map<number, Enums.BulletinStatus>;
  public configurationPropertiesLoaded: boolean = false;
  public saveConfigurationLoading: boolean;

  public alerts: any[] = [];

  public createMaps: boolean;
  public createPdf: boolean;
  public createStaticWidget: boolean;
  public createSimpleHtml: boolean;
  public sendEmails: boolean;
  public publishToTelegramChannel: boolean;
  public publishAt5PM: boolean;
  public publishAt8AM: boolean;
  public publishBulletinsTyrol: boolean;
  public publishBulletinsSouthTyrol: boolean;
  public publishBulletinsTrentino: boolean;
  public publishBulletinsAran: boolean;
  public publishBlogsTyrol: boolean;
  public publishBlogsSouthTyrol: boolean;
  public publishBlogsTrentino: boolean;
  public pdfDirectory: string;
  public htmlDirectory: string;
  public serverImagesUrl: string;
  public mapsPath: string;
  public mapProductionUrl: string;
  public scriptsPath: string;

  constructor(
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private constantsService: ConstantsService,
    public configurationService: ConfigurationService,
    public socialmediaService: SocialmediaService) {
    this.statusMap = new Map<number, Enums.BulletinStatus>();
    this.saveConfigurationLoading = false;
  }

  ngAfterContentInit() {
    if (this.authenticationService.isCurrentUserInRole(this.constantsService.roleAdmin)) {
      this.configurationService.loadConfigurationProperties().subscribe(
        data => {
          this.createMaps = (data as any).createMaps;
          this.createPdf = (data as any).createPdf;
          this.createStaticWidget = (data as any).createStaticWidget;
          this.createSimpleHtml = (data as any).createSimpleHtml;
          this.sendEmails = (data as any).sendEmails;
          this.publishToTelegramChannel = (data as any).publishToTelegramChannel;
          this.publishAt5PM = (data as any).publishAt5PM;
          this.publishAt8AM = (data as any).publishAt8AM;
          this.publishBulletinsTyrol = (data as any).publishBulletinsTyrol;
          this.publishBulletinsSouthTyrol = (data as any).publishBulletinsSouthTyrol;
          this.publishBulletinsTrentino = (data as any).publishBulletinsTrentino;
          this.publishBulletinsAran = (data as any).publishBulletinsAran;
          this.publishBlogsTyrol = (data as any).publishBlogsTyrol;
          this.publishBlogsSouthTyrol = (data as any).publishBlogsSouthTyrol;
          this.publishBlogsTrentino = (data as any).publishBlogsTrentino;
          this.pdfDirectory = (data as any).pdfDirectory;
          this.htmlDirectory = (data as any).htmlDirectory;
          this.serverImagesUrl = (data as any).serverImagesUrl;
          this.mapsPath = (data as any).mapsPath;
          this.mapProductionUrl = (data as any).mapProductionUrl;
          this.scriptsPath = (data as any).scriptsPath;
          this.configurationPropertiesLoaded = true;

        },
        error => {
          console.error("Configuration properties could not be loaded!");
        }
      );
    }
  }

  public save() {
    this.saveConfigurationLoading = true;
    const json = Object();
    json["createMaps"] = this.createMaps;
    json["createPdf"] = this.createPdf;
    json["createStaticWidget"] = this.createStaticWidget;
    json["createSimpleHtml"] = this.createSimpleHtml;
    json["sendEmails"] = this.sendEmails;
    json["publishToTelegramChannel"] = this.publishToTelegramChannel;
    json["publishAt5PM"] = this.publishAt5PM;
    json["publishAt8AM"] = this.publishAt8AM;
    json["publishBulletinsTyrol"] = this.publishBulletinsTyrol;
    json["publishBulletinsSouthTyrol"] = this.publishBulletinsSouthTyrol;
    json["publishBulletinsTrentino"] = this.publishBulletinsTrentino;
    json["publishBulletinsAran"] = this.publishBulletinsAran;
    json["publishBlogsTyrol"] = this.publishBlogsTyrol;
    json["publishBlogsSouthTyrol"] = this.publishBlogsSouthTyrol;
    json["publishBlogsTrentino"] = this.publishBlogsTrentino;
    json["pdfDirectory"] = this.pdfDirectory;
    json["htmlDirectory"] = this.htmlDirectory;
    json["serverImagesUrl"] = this.serverImagesUrl;
    json["mapsPath"] = this.mapsPath;
    json["mapProductionUrl"] = this.mapProductionUrl;
    json["scriptsPath"] = this.scriptsPath;

    this.configurationService.saveConfigurationProperties(json).subscribe(
      data => {
        this.saveConfigurationLoading = false;
        console.debug("Server configuration saved!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "success",
          msg: this.translateService.instant("admin.server-configuration.success"),
          timeout: 5000
        });
      },
      error => {
        this.saveConfigurationLoading = false;
        console.error("Server configuration could not be saved!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("admin.server-configuration.error"),
          timeout: 5000
        });
      }
    );
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
