import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { ConfigurationService } from "../providers/configuration-service/configuration.service";
import { SocialmediaService } from "../providers/socialmedia-service/socialmedia.service";
import { AlertComponent } from "ngx-bootstrap/alert";

@Component({
  templateUrl: "servers-configuration.component.html",
  selector: "app-servers-configuration"
})
export class ServersConfigurationComponent implements OnInit {

  public configurationPropertiesLoaded: boolean = false;
  public saveConfigurationLoading: boolean;
  public localServerConfiguration: any;

  public isAccordionLocalOpen: boolean;

  public alerts: any[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private constantsService: ConstantsService,
    public configurationService: ConfigurationService,
    public socialmediaService: SocialmediaService) {
    this.saveConfigurationLoading = false;
    this.isAccordionLocalOpen = false;
  }
  
  ngOnInit() {
    if (this.authenticationService.isCurrentUserInRole(this.constantsService.roleAdmin)) {
      this.configurationService.loadLocalServerConfiguration().subscribe(
        data => {
          // TODO implement
          this.localServerConfiguration = data;
        },
        error => {
          console.error("Configuration properties could not be loaded!");
        }
      );
    }
  }

  accordionChanged(event: boolean, groupName: string) {
    switch (groupName) {
      case "local":
        this.isAccordionLocalOpen = event;
        break;
      default:
        break;
    }
  }

  public createServer(event) {
    // TODO implement
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
