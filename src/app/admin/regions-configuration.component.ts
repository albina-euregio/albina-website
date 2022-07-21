import { Component, AfterContentInit } from "@angular/core";
import { AuthenticationService } from "../providers/authentication-service/authentication.service";
import { ConstantsService } from "../providers/constants-service/constants.service";
import { RegionsService } from "../providers/regions-service/regions.service";
import { ConfigurationService, RegionConfiguration } from "../providers/configuration-service/configuration.service";
import { SocialmediaService } from "../providers/socialmedia-service/socialmedia.service";

@Component({
  templateUrl: "regions-configuration.component.html",
  selector: "app-regions-configuration"
})
export class RegionsConfigurationComponent implements AfterContentInit {
  public configurationPropertiesLoaded: boolean = false;
  public saveConfigurationLoading: boolean;
  public regionConfigurations: RegionConfiguration[];

  constructor(
    private authenticationService: AuthenticationService,
    private constantsService: ConstantsService,
    public regionsService: RegionsService,
    public configurationService: ConfigurationService,
    public socialmediaService: SocialmediaService) {
    this.saveConfigurationLoading = false;
  }

  ngAfterContentInit() {
    if (this.authenticationService.isCurrentUserInRole(this.constantsService.roleAdmin)) {
      this.configurationService.loadRegionConfigurations().subscribe(
        data => {
          this.regionConfigurations = data;
          this.configurationPropertiesLoaded = true;
        },
        error => {
          console.error("Region configurations could not be loaded!");
        }
      );
    }
  }

  public createRegion(event) {
    let newRegion = {} as RegionConfiguration;
    newRegion.isNew = true;
    this.regionConfigurations.push(newRegion);
  }
}
