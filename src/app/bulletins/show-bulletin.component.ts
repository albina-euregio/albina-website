import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { SettingsService } from '../providers/settings-service/settings.service';
import { BulletinModel } from '../models/bulletin.model';
import { Observable } from 'rxjs/Observable';
import { BulletinInputModel } from '../models/bulletin-input.model';
import * as Enums from '../enums/enums';
import { MapService } from "../providers/map-service/map.service";
import { UUID } from 'angular2-uuid';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/forkJoin';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';

import "leaflet";

@Component({
  templateUrl: 'show-bulletin.component.html'
})
export class ShowBulletinComponent {

  public aggregatedRegionsIds: string[];
  public aggregatedRegionsMap: Map<string, BulletinInputModel>;
  public activeAggregatedRegionId: string;
  public activeBulletinInput: BulletinInputModel;

  public activeAvActivityHighlights: string;
  public activeAvActivityComment: string;

  public activeSnowpackStructureHighlights: string;
  public activeSnowpackStructureComment: string;

  public hasDaytimeDependency: boolean;
  public hasElevationDependency: boolean;

  public loading: boolean;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    public bulletinsService: BulletinsService,
    private translateService: TranslateService,
    private settingsService: SettingsService,
    private mapService: MapService,
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService)
  {
    this.loading = true;
  }

  ngOnInit() {
    if (this.bulletinsService.getActiveDate() && this.authenticationService.isUserLoggedIn()) {
      this.aggregatedRegionsMap = new Map<string, BulletinInputModel>();
      this.aggregatedRegionsIds = new Array<string>();
      this.activeAggregatedRegionId = undefined;
      this.activeBulletinInput = undefined;
      this.activeAvActivityHighlights = undefined;
      this.activeAvActivityComment = undefined;
      this.activeSnowpackStructureHighlights = undefined;
      this.activeSnowpackStructureComment = undefined;
      this.hasElevationDependency = false;
      this.hasDaytimeDependency = false;

      this.bulletinsService.loadBulletins(this.bulletinsService.getActiveDate()).subscribe(
        data => {
          let response = data.json();
          for (let jsonBulletin of response) {
            let bulletin = BulletinModel.createFromJson(jsonBulletin);

            // only add bulletins with published or saved regions
            if ((bulletin.getPublishedRegions() && bulletin.getPublishedRegions().length > 0) || (bulletin.getSavedRegions() && bulletin.getSavedRegions().length > 0))
              this.addBulletin(bulletin);
          }
          this.loading = false;
          this.mapService.deselectAggregatedRegion();
        },
        error => {
          console.error("Bulletins could not be loaded!");
          this.loading = false;
          this.confirmationService.confirm({
            key: "loadingBulletinsErrorDialog",
            header: this.translateService.instant("bulletins.create.loadingBulletinsErrorDialog.header"),
            message: this.translateService.instant("bulletins.create.loadingBulletinsErrorDialog.message"),
            accept: () => {
              this.goBack();
            }
          });
        }
      );

      let map = L.map("map", {
          zoomControl: false,
          center: L.latLng(46.05, 11.07),
          zoom: 8,
          minZoom: 7,
          maxZoom: 9,
          layers: [this.mapService.baseMaps.OpenMapSurfer_Grayscale, this.mapService.overlayMaps.aggregatedRegions]
      });

      L.control.zoom({ position: "topleft" }).addTo(map);
      //L.control.layers(this.mapService.baseMaps).addTo(map);
      L.control.scale().addTo(map);

      this.mapService.map = map;
    }
  }

  getOwnAggregatedRegionIds() {
    let result = new Array<string>();
    for (let id of this.aggregatedRegionsIds)
      if (this.aggregatedRegionsMap.get(id).getCreatorRegion().startsWith(this.authenticationService.getUserRegion()))
        result.push(id);
    return result;
  }

  getForeignAggregatedRegionIds() {
    let result = new Array<string>();
    for (let id of this.aggregatedRegionsIds)
      if (!this.aggregatedRegionsMap.get(id).getCreatorRegion().startsWith(this.authenticationService.getUserRegion()))
        result.push(id);
    return result;
  }

  ngOnDestroy() {
    this.mapService.resetAll();
    if (this.mapService.map)
      this.mapService.map.remove();
    
    this.bulletinsService.setActiveDate(undefined);
    this.bulletinsService.setIsEditable(false);

    this.loading = false;
  }

  addBulletin(bulletin: BulletinModel) {
    // a bulletin for this aggregated region is already in the map => use existend bulletin input object
    if (this.aggregatedRegionsMap.has(bulletin.getAggregatedRegionId())) {
      if (bulletin.elevation > 0 && bulletin.below) {
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).elevationDependency = true;
      }
      // TODO check if this a good method
      if (bulletin.validFrom.getHours() == 12) {
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).setAfternoonBulletinId(bulletin.id);
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).daytimeDependency = true;
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).afternoonBelow = bulletin.below;
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).afternoonAbove = bulletin.above;
      // TODO check if this a good method
      } else if (bulletin.validFrom.getHours() == 0) {
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).setForenoonBulletinId(bulletin.id);
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).forenoonBelow = bulletin.below;
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).forenoonAbove = bulletin.above;
      }
    // no bulletin with the aggregated region id is present => create a new bulletin input object
    } else {
      let bulletinInput = new BulletinInputModel();
      bulletinInput.suggestedRegions = bulletin.suggestedRegions;
      bulletinInput.savedRegions = bulletin.savedRegions;
      bulletinInput.publishedRegions = bulletin.publishedRegions;
      bulletinInput.creator = bulletin.creator;
      bulletinInput.creatorRegion = bulletin.creatorRegion;
      bulletinInput.avActivityHighlights = bulletin.avActivityHighlights;
      bulletinInput.avActivityComment = bulletin.avActivityComment;
      bulletinInput.snowpackStructureHighlights = bulletin.snowpackStructureHighlights;
      bulletinInput.snowpackStructureComment = bulletin.snowpackStructureComment;

      this.activeSnowpackStructureHighlights = bulletinInput.getSnowpackStructureHighlightsIn(this.settingsService.getLang());
      this.activeSnowpackStructureComment = bulletinInput.getSnowpackStructureCommentIn(this.settingsService.getLang());

      bulletinInput.elevation = bulletin.elevation;
      if (bulletin.elevation > 0 && bulletin.below) {
        bulletinInput.elevationDependency = true;
      }
      // TODO check if this a good method
      if (bulletin.validFrom.getHours() == 12) {
        bulletinInput.daytimeDependency = true;
        bulletinInput.setAfternoonBulletinId(bulletin.id);
        bulletinInput.afternoonBelow = bulletin.below;
        bulletinInput.afternoonAbove = bulletin.above;
      // TODO check if this a good method
      } else if (bulletin.validFrom.getHours() == 0) {
        bulletinInput.setForenoonBulletinId(bulletin.id);
        bulletinInput.forenoonBelow = bulletin.below;
        bulletinInput.forenoonAbove = bulletin.above;
      }
      this.addAggregatedRegion(bulletin.getAggregatedRegionId(), bulletinInput);
    }
  }

  private addAggregatedRegion(aggregatedRegionId, bulletinInput) {
      this.mapService.addAggregatedRegion(bulletinInput);

      this.aggregatedRegionsMap.set(aggregatedRegionId, bulletinInput);
      this.aggregatedRegionsIds.push(aggregatedRegionId);
  }

  getCreator(aggregatedRegionId: string) {
    return this.aggregatedRegionsMap.get(aggregatedRegionId).getCreator();
  }

  getCreatorRegion(aggregatedRegionId: string) {
    return this.aggregatedRegionsMap.get(aggregatedRegionId).getCreatorRegion();
  }

  selectAggregatedRegion(aggregatedRegionId: string) {
    // save text parts
    if (this.activeBulletinInput) {
      this.activeBulletinInput.setAvActivityHighlightsIn(this.activeAvActivityHighlights, this.settingsService.getLang());
      this.activeBulletinInput.setAvActivityCommentIn(this.activeAvActivityComment, this.settingsService.getLang());
    }

    this.activeAggregatedRegionId = aggregatedRegionId;
    this.activeBulletinInput = this.aggregatedRegionsMap.get(aggregatedRegionId);
    this.activeAvActivityHighlights = this.activeBulletinInput.getAvActivityHighlightsIn(this.settingsService.getLang());
    this.activeAvActivityComment = this.activeBulletinInput.getAvActivityCommentIn(this.settingsService.getLang());

    this.mapService.selectAggregatedRegion(this.activeBulletinInput);
  }

  deselectAggregatedRegion() {
    //this.mapService.deselectRegions(this.activeBulletinInput);
    this.mapService.deselectAggregatedRegion();

    this.activeAggregatedRegionId = undefined;
    this.activeBulletinInput = undefined;
    this.activeAvActivityHighlights = undefined;
    this.activeAvActivityComment = undefined;
  }

  getColor(aggregatedRegionId) {
    let dangerRating = "";
    if (this.aggregatedRegionsMap.get(aggregatedRegionId) && this.aggregatedRegionsMap.get(aggregatedRegionId) != undefined && this.aggregatedRegionsMap.get(aggregatedRegionId).getHighestDangerRating())
      dangerRating = this.aggregatedRegionsMap.get(aggregatedRegionId).getHighestDangerRating().toString();

    if (dangerRating == "very_high") {
        return {
            color: 'black'
        }
    } else if (dangerRating == "high") {
        return {
            color: 'red'
        }
    } else if (dangerRating == "considerable") {
        return {
            color: 'orange'
        }
    } else if (dangerRating == "moderate") {
        return {
            color: 'yellow'
        }
    } else if (dangerRating == "low") {
        return {
            color: 'green'
        }
    } else {
        return {
            color: 'grey'
        }
    }
  }

  goBack() {
    this.mapService.resetAll();
    this.router.navigate(['/bulletins']);
    this.loading = false;
  }
}