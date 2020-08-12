import { Component, AfterContentInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { BulletinsService } from "../providers/bulletins-service/bulletins.service";
import { ConfigurationService } from "../providers/configuration-service/configuration.service";
import { SocialmediaService } from "../providers/socialmedia-service/socialmedia.service";
import * as Enums from "../enums/enums";
import { SelectItem } from "primeng/api";
import { AlertComponent } from "ngx-bootstrap";

@Component({
  templateUrl: "admin.component.html"
})
export class AdminComponent implements AfterContentInit {

  public statusMap: Map<number, Enums.BulletinStatus>;
  public configurationPropertiesLoaded: boolean = false;
  public saveConfigurationLoading: boolean;

  public alerts: any[] = [];

  public createMaps: boolean;
  public createPdf: boolean;
  public createStaticWidget: boolean;
  public createSimpleHtml: boolean;
  public sendEmails: boolean;
  public publishToMessengerpeople: boolean;
  public publishToTelegramChannel: boolean;
  public publishAt5PM: boolean;
  public publishAt8AM: boolean;
  public localImagesPath: string;
  public localFontsPath: string;
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
  public serverImagesUrlLocalhost: string;
  public univieMapsPath: string;
  public mapsPath: string;
  public mapProductionUrl: string;
  public scriptsPath: string;

  public regions: SelectItem[];
  public channels: SelectItem[];
  public regionConfiguration = <any>{};
  public currentChannel: any;
  public shipments: [{}];
  public currentRegion: string;
  public recipientList;
  public sendresult;

  public a;
  public b;
  public c;
  public d;
  public e;
  public f;
  public g;
  public h;

  constructor(
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private constantsService: ConstantsService,
    private bulletinsService: BulletinsService,
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
          this.publishToMessengerpeople = (data as any).publishToMessengerpeople;
          this.publishToTelegramChannel = (data as any).publishToTelegramChannel;
          this.publishAt5PM = (data as any).publishAt5PM;
          this.publishAt8AM = (data as any).publishAt8AM;
          this.localImagesPath = (data as any).localImagesPath;
          this.localFontsPath = (data as any).localFontsPath;
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
          this.serverImagesUrlLocalhost = (data as any).serverImagesUrlLocalhost;
          this.univieMapsPath = (data as any).univieMapsPath;
          this.mapsPath = (data as any).mapsPath;
          this.mapProductionUrl = (data as any).mapProductionUrl;
          this.scriptsPath = (data as any).scriptsPath;
          this.configurationPropertiesLoaded = true;

        },
        error => {
          console.error("Configuration properties could not be loaded!");
        }
      );

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 3);
      endDate.setHours(0, 0, 0, 0);

      this.bulletinsService.getPublicationsStatus(this.authenticationService.getActiveRegion(), startDate, endDate).subscribe(
        _data => {
          // TODO use the information about the publciation process somewhere (maybe just as ADMIN?)
        },
        error => {
          console.error("Publication status could not be loaded!");
        }
      );

      // Force select of first combo with current region
      this.currentRegion = this.authenticationService.activeRegion;
      this.regionChanged(this.currentRegion);
      // Load channels
      this.loadChannels();
      // Load shipments
      this.loadShipments();
      this.loadRecipientList(this.currentRegion);
    }
    this.regions = this.authenticationService.getCurrentAuthorRegions().map(x => ({ label: x, value: x }));
  }

  public save() {
    this.saveConfigurationLoading = true;
    const json = Object();
    json["createMaps"] = this.createMaps;
    json["createPdf"] = this.createPdf;
    json["createStaticWidget"] = this.createStaticWidget;
    json["createSimpleHtml"] = this.createSimpleHtml;
    json["sendEmails"] = this.sendEmails;
    json["publishToMessengerpeople"] = this.publishToMessengerpeople;
    json["publishToTelegramChannel"] = this.publishToTelegramChannel;
    json["publishAt5PM"] = this.publishAt5PM;
    json["publishAt8AM"] = this.publishAt8AM;
    json["localImagesPath"] = this.localImagesPath;
    json["localFontsPath"] = this.localFontsPath;
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
    json["serverImagesUrlLocalhost"] = this.serverImagesUrlLocalhost;
    json["univieMapsPath"] = this.univieMapsPath;
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
          msg: this.translateService.instant("settings.saveConfiguration.success"),
          timeout: 5000
        });
      },
      error => {
        this.saveConfigurationLoading = false;
        console.error("Server configuration could not be saved!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("settings.saveConfiguration.error"),
          timeout: 5000
        });
      }
    );
  }

  public regionChanged(regionId: String) {
    this.currentRegion = regionId.toString();
    this.configurationService.loadSocialMediaConfiguration(regionId).subscribe(
      data => {
        this.regionConfiguration = data as any;
      },
      error => {
        console.error("Social Media configuration could not be loaded!");
      }
    );
  }

  public saveRegion() {
    this.configurationService.saveSocialMediaConfiguration(this.regionConfiguration).subscribe(
      data => {
        console.log("Social Media configuration saved!");
      },
      error => {
        console.error("Social Media configuration could not be saved!");
      }
    );
  }

  public loadChannels() {
    this.configurationService.loadSocialMediaChannels().subscribe(
      data => {
        this.channels = (data as any);
        this.currentChannel = this.channels[0];
      },
      error => {
        console.error("Social Media configuration could not be loaded!");
      }
    );
  }

  public addChannel(event) {
    if (this.currentChannel) {
      const exists = (<any>this.regionConfiguration).channels.find(obj => obj.id === this.currentChannel.id);
      if (!exists) {
        (<any>this.regionConfiguration).channels.push(this.currentChannel);
        // hack to refresh
        (<any>this.regionConfiguration).channels = (<any>this.regionConfiguration).channels.filter(x => x.id > 0);
      }
    }
  }

  public removeChannel(event) {
    if (this.currentChannel) {
      (<any>this.regionConfiguration).channels = (<any>this.regionConfiguration).channels.filter(x => x.id !== this.currentChannel.id);
    }
  }

  public checkTab(idprovider) {
    if ((<any>this.regionConfiguration).channels.find(obj => obj.provider.id === idprovider)) {
      return false;
    } else {
      return true;
    }
  }

  public deleteChannel(row: any) {
    console.log(row);
    if (this.currentChannel) {
      (<any>this.regionConfiguration).channels = (<any>this.regionConfiguration).channels.filter(x => x.id !== row.id);

      (<any>this.regionConfiguration).channels = (<any>this.regionConfiguration).channels;
    }
  }


  public loadRecipientList(regionId: String) {
    this.recipientList = [];
    this.configurationService.loadRecipientList(regionId).subscribe(
      data => {
        (data as any)._embedded.recipientlists.forEach(element => {
          this.recipientList.push({
            label: element.name,
            value: element.id
          });
        });
      },
      error => {
        console.error("Recipient List configuration could not be loaded!");
      }
    );
  }

  public loadShipments() {
    this.configurationService.loadShipments().subscribe(
      data => {
        this.shipments = data as any;
      },
      error => {
        console.error("Social Media shipments could not be loaded!");
      }
    );
  }


  // TEST API
  public sendRapidmail() {
    const regionId = "IT-32-TN";
    const language = "DE";
    const mailingsPost = "{\"destinations\": [ { \"type\": \"recipientlist\", \"id\": \"2199\", \"action\": \"include\" } ], \"from_name\": \"Denis Miorandi\", \"from_email\": \"norbert.lanzanasto@tirol.gv.at\", \"subject\": \"Clesius TEST 2\", \"file\": { \"description\":\"mail-content.zip\", \"content\": \"UEsDBAoAAAAAAMl4cE2yoGG2IwAAACMAAAAJAAAAdGVzdC5odG1sPGI+IHRoaXMgaXMgYSB0ZXN0IGZyb20gQ2xlc2l1czwvYj5QSwECPwAKAAAAAADJeHBNsqBhtiMAAAAjAAAACQAkAAAAAAAAACAAAAAAAAAAdGVzdC5odG1sCgAgAAAAAAABABgAx9qLirV91AEJorp6tX3UAQmiunq1fdQBUEsFBgAAAAABAAEAWwAAAEoAAAAAAA==\", \"type\": \"application/zip\" } } ";
    this.socialmediaService.sendRapidMail(regionId, language, mailingsPost).subscribe(
      data => {
        // refresh Shipments
        this.loadShipments();
      },
      error => {
        console.error("Rapidmail send could not be made!");
      }
    );
  }

  public sendMP() {
    const regionId = "IT-32-TN";
    const language = "IT";
    const message = "test%20da%20esempio";
    const attachment = ""; // 'https://avalanche.report/albina_files/2018-11-20/2018-11-20_en.pdf'
    this.socialmediaService.sendMP(regionId, language, message, attachment).subscribe(
      data => {
        // refresh Shipments
        this.loadShipments();
      },
      error => {
        console.error("MP  send could not be made!");
      }
    );
  }


  public sendTW() {
    const regionId = "IT-32-BZ";
    const language = "DE";
    const message = "test for tw https://avalanche.report/albina_files/2018-11-20/2018-11-20_en.pdf";
    const previous_id = 1064896795929653248;
    this.socialmediaService.sendTW(regionId, language, message, previous_id).subscribe(
      data => {
        // refresh Shipments
        this.loadShipments();
      },
      error => {
        console.error("Twitter send could not be made!");
      }
    );
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
