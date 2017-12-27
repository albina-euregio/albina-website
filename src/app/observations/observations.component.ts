import { Component, HostListener } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { ConstantsService } from '../providers/constants-service/constants.service';
import { ObservationsService } from '../providers/observations-service/observations.service';
import { MapService } from "../providers/map-service/map.service";
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';
import 'rxjs/add/observable/forkJoin';

import "leaflet";
import "leaflet.sync";

declare var L: any;

@Component({
  templateUrl: 'observations.component.html'
})
export class ObservationsComponent {


  constructor(
    private translate: TranslateService,
    private observationsService: ObservationsService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private mapService: MapService,
    private constantsService: ConstantsService,
    private router: Router,
    private confirmationService: ConfirmationService)
  {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMaps();

    this.mapService.layerGroups.observations.clearLayers();

    this.loadSnowProfiles();
    this.loadHastyPits();
    this.loadQuickReports();
  }

  private initMaps() {
    if (this.mapService.observationsMap)
      this.mapService.observationsMap.remove();

    let map = L.map("map", {
        zoomControl: false,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        touchZoom: true,
        center: L.latLng(this.authenticationService.getUserLat(), this.authenticationService.getUserLng()),
        zoom: 8,
        minZoom: 8,
        maxZoom: 16,
        maxBounds: L.latLngBounds(L.latLng(this.constantsService.mapBoundaryN, this.constantsService.mapBoundaryW), L.latLng(this.constantsService.mapBoundaryS, this.constantsService.mapBoundaryE)),
        layers: [this.mapService.observationsMaps.OpenTopoMap, this.mapService.layerGroups.observations]
    });

    L.control.zoom({ position: "topleft" }).addTo(map);
    L.control.scale().addTo(map);

    this.mapService.observationsMap = map;
  }

  private loadSnowProfiles() {
    this.observationsService.getSnowProfiles().subscribe(
      data => {
        let response = data.json();
        for (var i = response.length - 1; i >= 0; i--) {
            if (response[i].location && response[i].location.geo && response[i].location.geo.latitude && response[i].location.geo.longitude) {
              this.createSnowProfileMarker(response[i]);
                console.debug("Snow profile added.");
            } else {
                console.debug("No coordinates in snow profile.");
            }
        }
      },
      error => {
        console.error("Snow profiles could not be loaded from server: " + JSON.stringify(error._body));
        // TODO
      }
    );
  }

    private loadHastyPits() {
        this.observationsService.getHastyPits().subscribe(
          data => {
            let response = data.json();
            for (var i = response.length - 1; i >= 0; i--) {
                if (response[i].location && response[i].location.geo && response[i].location.geo.latitude && response[i].location.geo.longitude) {
                  this.createHastyPitMarker(response[i]);
                    console.debug("Hasty pit added.");
                } else {
                    console.debug("No coordinates in hasty pit.");
                }
            }
          },
          error => {
            console.error("Hasty pits could not be loaded from server: " + JSON.stringify(error._body));
            // TODO
          }
        );
    }

    private loadQuickReports() {
        this.observationsService.getQuickReports().subscribe(
          data => {
            let response = data.json();
            for (var i = response.length - 1; i >= 0; i--) {
                if (response[i].location && response[i].location.geo && response[i].location.geo.latitude && response[i].location.geo.longitude) {
                  this.createQuickReportMarker(response[i]);
                    console.debug("Quick report added.");
                } else {
                    console.debug("No coordinates in quick report.");
                }
            }
         },
          error => {
            console.error("Quick reports could not be loaded from server: " + JSON.stringify(error._body));
          }
        );
    }

    private createSnowProfileMarker(snowProfile) {
      new L.Marker(new L.LatLng(snowProfile.location.geo.latitude, snowProfile.location.geo.longitude), {icon: this.mapService.createSnowProfileMarker()})
          .on({click: () => this.snowProfileMarkerClicked(snowProfile)})
          .addTo(this.mapService.layerGroups.observations);
    }

    private createHastyPitMarker(hastyPit) {
      new L.Marker(new L.LatLng(hastyPit.location.geo.latitude, hastyPit.location.geo.longitude), {icon: this.mapService.createHastyPitMarker()})
          .on({click: () => this.hastyPitMarkerClicked(hastyPit)})
          .addTo(this.mapService.layerGroups.observations);
    }

    private createQuickReportMarker(quickReport) {
      new L.Marker(new L.LatLng(quickReport.location.geo.latitude, quickReport.location.geo.longitude), {icon: this.mapService.createQuickReportMarker()})
            .on({click: () => this.quickReportMarkerClicked(quickReport)})
            .addTo(this.mapService.layerGroups.observations);
    }

    quickReportMarkerClicked(quickReport) {
/*
        this.nav.push(QuickReportPage, {
            quickReport: QuickReportModel.createFromJson(quickReport)
        });
*/
    }

    snowProfileMarkerClicked(snowProfile) {
/*
      this.observationsService.getSnowProfile(snowProfile.serverId).subscribe(
        data => {
          let response = data.json();
          let snowProfile = SnowProfileModel.createFromJson(response);
          this.nav.push(NewSnowProfilePage, {
            snowProfile: snowProfile,
            disabled: true
          });
        },
        error => {
          let confirm = this.alertCtrl.create({
              title: this.translateService.instant("observations.snowProfileLoadingAlarm.title"),
              message: this.translateService.instant("observations.snowProfileLoadingAlarm.text"),
              buttons: [
                {
                  text: this.translateService.instant("observations.snowProfileLoadingAlarm.ok"),
                  handler: () => {
                  }
                }
              ]
            });
            confirm.present({ ev: event });
        }
      );
*/
    }

    hastyPitMarkerClicked(profile) {
/*
      this.observationsService.getHastyPit(profile.serverId).subscribe(
        data => {
          let response = data.json();
          let hastyPit = HastyPitModel.createFromJson(response);
          this.nav.push(NewHastyPitPage, {
            hastyPit: hastyPit,
            disabled: true
          });
        },
        error => {
          let confirm = this.alertCtrl.create({
              title: this.translateService.instant("observations.hastyPitLoadingAlarm.title"),
              message: this.translateService.instant("observations.hastyPitLoadingAlarm.text"),
              buttons: [
                {
                  text: this.translateService.instant("observations.hastyPitLoadingAlarm.ok"),
                  handler: () => {
                  }
                }
              ]
            });
            confirm.present({ ev: event });
        }
      );
*/
    }
}
