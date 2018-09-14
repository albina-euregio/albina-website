import { Component, HostListener } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { ConstantsService } from '../providers/constants-service/constants.service';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { ConfigurationService } from '../providers/configuration-service/configuration.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';

declare var L: any;

@Component({
  templateUrl: 'admin.component.html'
})
export class AdminComponent {

  public statusMap: Map<number, Enums.BulletinStatus>;
  public configurationPropertiesLoaded : boolean = false;

  public createMaps: boolean;
  public createPdf: boolean;
  public createStaticWidget: boolean;
  public sendEmails: boolean;
  public publishToSocialMedia: boolean;
  public publishAt5PM: boolean;
  public publishAt8AM: boolean;
  public localImagesPath: string;
  public localFontsPath: string;
  public publishBulletinsTyrol: boolean;
  public publishBulletinsSouthTyrol: boolean;
  public publishBulletinsTrentino: boolean;
  public publishBulletinsStyria: boolean;
  public pdfDirectory: string;
  public serverImagesUrl: string;
  public serverImagesUrlLocalhost: string;
  public mapsPath: string;
  public smtpAuth: boolean;
  public smtpTls: boolean;
  public smtpHost: string;
  public smtpPort: string;
  public emailUsername: string;
  public emailPassword: string;
  public socketIoOrigin: string;
  public socketIoPort: number;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private constantsService: ConstantsService,
    private bulletinsService: BulletinsService,
    public configurationService: ConfigurationService,
    private router: Router)
  {
    this.statusMap = new Map<number, Enums.BulletinStatus>();
  }

  ngAfterContentInit() {
    if (this.authenticationService.isCurrentUserInRole(this.constantsService.roleAdmin)) {
      this.configurationService.loadConfigurationProperties().subscribe(
        data => {
          let response = data.json();
          this.createMaps = response.createMaps;
          this.createPdf = response.createPdf;
          this.createStaticWidget = response.createStaticWidget;
          this.sendEmails = response.sendEmails;
          this.publishToSocialMedia = response.publishToSocialMedia;
          this.publishAt5PM = response.publishAt5PM;
          this.publishAt8AM = response.publishAt8AM;
          this.localImagesPath = response.localImagesPath;
          this.localFontsPath = response.localFontsPath;
          this.publishBulletinsTyrol = response.publishBulletinsTyrol;
          this.publishBulletinsSouthTyrol = response.publishBulletinsSouthTyrol;
          this.publishBulletinsTrentino = response.publishBulletinsTrentino;
          this.publishBulletinsStyria = response.publishBulletinsStyria;
          this.pdfDirectory = response.pdfDirectory;
          this.serverImagesUrl = response.serverImagesUrl;
          this.serverImagesUrlLocalhost = response.serverImagesUrlLocalhost;
          this.mapsPath = response.mapsPath;
          this.smtpAuth = response.smtpAuth;
          this.smtpTls = response.smtpTls;
          this.smtpHost = response.smtpHost;
          this.smtpPort = response.smtpPort;
          this.emailUsername = response.emailUsername;
          this.emailPassword = response.emailPassword;
          this.socketIoOrigin = response.socketIoOrigin;
          this.socketIoPort = response.socketIoPort;
          this.configurationPropertiesLoaded = true;
        },
        error => {
          console.error("Configuration properties could not be loaded!");
        }
      );

      let startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);

      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 3);
      endDate.setHours(0, 0, 0, 0);

      // TODO use the information about the publciation process somewhere (maybe just as ADMIN?)
      this.bulletinsService.getPublicationStatus(this.authenticationService.getActiveRegion(), startDate, endDate).subscribe(
        data => {
          let json = data.json();
        },
        error => {
          console.error("Publication status could not be loaded!");
        }
      );
    }
  }

  public save() {
    var json = Object();
    json['createMaps'] = this.createMaps;
    json['createPdf'] = this.createPdf;
    json['createStaticWidget'] = this.createStaticWidget;
    json['sendEmails'] = this.sendEmails;
    json['publishToSocialMedia'] = this.publishToSocialMedia;
    json['publishAt5PM'] = this.publishAt5PM;
    json['publishAt8AM'] = this.publishAt8AM;
    json['localImagesPath'] = this.localImagesPath;
    json['localFontsPath'] = this.localFontsPath;
    json['publishBulletinsTyrol'] = this.publishBulletinsTyrol;
    json['publishBulletinsSouthTyrol'] = this.publishBulletinsSouthTyrol;
    json['publishBulletinsTrentino'] = this.publishBulletinsTrentino;
    json['publishBulletinsStyria'] = this.publishBulletinsStyria;
    json['pdfDirectory'] = this.pdfDirectory;
    json['serverImagesUrl'] = this.serverImagesUrl;
    json['serverImagesUrlLocalhost'] = this.serverImagesUrlLocalhost;
    json['mapsPath'] = this.mapsPath;
    json['smtpAuth'] = this.smtpAuth;
    json['smtpTls'] = this.smtpTls;
    json['smtpHost'] = this.smtpHost;
    json['smtpPort'] = this.smtpPort;
    json['emailUsername'] = this.emailUsername;
    json['emailPassword'] = this.emailPassword;
    json['socketIoOrigin'] = this.socketIoOrigin;
    json['socketIoPort'] = this.socketIoPort;
    json['configurationPropertiesLoaded'] = this.configurationPropertiesLoaded;

    this.configurationService.saveConfigurationProperties(json).subscribe(
      data => {
        console.log("Server configuration saved!");
      },
      error => {
        console.error("Server configuration could not be saved!");
      }
    );
  }
}
