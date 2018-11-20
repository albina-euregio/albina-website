import { Component, HostListener } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { ConstantsService } from '../providers/constants-service/constants.service';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { ConfigurationService } from '../providers/configuration-service/configuration.service';
import { SocialmediaService } from '../providers/socialmedia-service/socialmedia.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';
import { SelectItem } from 'primeng/primeng';

declare var L: any;

@Component({
  templateUrl: 'admin.component.html'
})
export class AdminComponent {

  public statusMap: Map<number, Enums.BulletinStatus>;
  public configurationPropertiesLoaded: boolean = false;

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

  public regions: SelectItem[];
  public channels: SelectItem[];
  public regionConfiguration = {};
  public currentChannel: any;
  public shipments: [{}];
  public currentRegion: string;
  public recipientList;
  public sendresult;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private constantsService: ConstantsService,
    private bulletinsService: BulletinsService,
    public configurationService: ConfigurationService,
    public socialmediaService: SocialmediaService,
    private router: Router) {
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

  public regionChanged(regionId: String) {
    this.currentRegion = regionId.toString();
    this.configurationService.loadSocialMediaConfiguration(regionId).subscribe(
      data => {
        this.regionConfiguration = data.json();
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
    );;
  }

  public loadChannels() {
    this.configurationService.loadSocialMediaChannels().subscribe(
      data => {
        this.channels = data.json();
        this.currentChannel = this.channels[0];
      },
      error => {
        console.error("Social Media configuration could not be loaded!");
      }
    );
  }

  public addChannel(event) {
    if (this.currentChannel) {
      let exists = (<any>this.regionConfiguration).channels.find(obj => obj.id == this.currentChannel.id);
      if (!exists) {
        (<any>this.regionConfiguration).channels.push(this.currentChannel);
        //hack to refresh 
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
    if ((<any>this.regionConfiguration).channels.find(obj => obj.provider.id == idprovider))
      return false;
    else
      return true;
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
        data.json()._embedded.recipientlists.forEach(element => {
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
        this.shipments = data.json();
      },
      error => {
        console.error("Social Media shipments could not be loaded!");
      }
    );
  }


  // TEST API
  public sendRapidmail() {
    let regionId = 'IT-32-TN';
    let language = 'DE';
    let mailingsPost = '{"destinations": [ { "type": "recipientlist", "id": "2199", "action": "include" } ], "from_name": "Denis Miorandi", "from_email": "norbert.lanzanasto@tirol.gv.at", "subject": "Clesius TEST 2", "file": { "description":"mail-content.zip", "content": "UEsDBAoAAAAAAMl4cE2yoGG2IwAAACMAAAAJAAAAdGVzdC5odG1sPGI+IHRoaXMgaXMgYSB0ZXN0IGZyb20gQ2xlc2l1czwvYj5QSwECPwAKAAAAAADJeHBNsqBhtiMAAAAjAAAACQAkAAAAAAAAACAAAAAAAAAAdGVzdC5odG1sCgAgAAAAAAABABgAx9qLirV91AEJorp6tX3UAQmiunq1fdQBUEsFBgAAAAABAAEAWwAAAEoAAAAAAA==", "type": "application/zip" } } ';
    this.socialmediaService.sendRapidMail(regionId, language, mailingsPost).subscribe(
      data => {
        this.sendresult = data.json();
        // refresh Shipments 
        this.loadShipments();
      },
      error => {
        console.error("Rapidmail send could not be made!");
      }
    );
  }

  public sendMP() {
    let regionId = 'IT-32-TN';
    let language = 'IT';
    let  message = 'test%20da%20esempio';
    let  attachment =''; // 'https://avalanche.report/albina_files/2018-11-20/2018-11-20_en.pdf'
    this.socialmediaService.sendMP(regionId, language, message, attachment).subscribe(
      data => {
        this.sendresult = data.json();
        // refresh Shipments 
        this.loadShipments();
      },
      error => {
        console.error("MP  send could not be made!");
      }
    );
  }


  public sendTW() {
    let regionId = 'IT-32-BZ';
    let language = 'DE';
    let  message = 'test for tw https://avalanche.report/albina_files/2018-11-20/2018-11-20_en.pdf';
    let previous_id=1064896795929653248;
    this.socialmediaService.sendTW(regionId, language, message, previous_id).subscribe(
      data => {
        this.sendresult = data.json();
        // refresh Shipments 
        this.loadShipments();
      },
      error => {
        console.error("Twitter send could not be made!");
      }
    );
  }

}
