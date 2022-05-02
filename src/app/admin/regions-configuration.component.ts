import { Component, AfterContentInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { ConfigurationService } from "../providers/configuration-service/configuration.service";
import { SocialmediaService } from "../providers/socialmedia-service/socialmedia.service";
import * as Enums from "../enums/enums";
import { AlertComponent } from "ngx-bootstrap/alert";

@Component({
  templateUrl: "regions-configuration.component.html",
  selector: "app-regions-configuration"
})
export class RegionsConfigurationComponent implements AfterContentInit {

  public statusMap: Map<number, Enums.BulletinStatus>;
  public configurationPropertiesLoaded: boolean = false;
  public saveConfigurationLoading: boolean;

  public alerts: any[] = [];

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
      this.configurationService.loadRegionConfiguration(this.authenticationService.activeRegion).subscribe(
        data => {
          // TODO implement
          this.configurationPropertiesLoaded = true;
        },
        error => {
          console.error("Region configuration properties could not be loaded!");
        }
      );
    }
  }

  public createRegion(event) {
    // TODO implement
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
