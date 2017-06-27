import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
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

  public activeAvalancheSituationHighlight: string;
  public activeAvalancheSituationComment: string;

  public activeSnowpackStructureHighlight: string;
  public activeSnowpackStructureComment: string;

  public hasDaytimeDependency: boolean;
  public hasElevationDependency: boolean;

  public loading: boolean;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private bulletinsService: BulletinsService,
    private translateService: TranslateService,
    private settingsService: SettingsService,
    private mapService: MapService,
    private confirmationService: ConfirmationService)
  {
    this.loading = true;
  }

  ngOnInit() {
    this.aggregatedRegionsMap = new Map<string, BulletinInputModel>();
    this.aggregatedRegionsIds = new Array<string>();
    this.activeAggregatedRegionId = undefined;
    this.activeBulletinInput = undefined;
    this.activeAvalancheSituationHighlight = undefined;
    this.activeAvalancheSituationComment = undefined;
    this.activeSnowpackStructureHighlight = undefined;
    this.activeSnowpackStructureComment = undefined;
    this.hasElevationDependency = false;
    this.hasDaytimeDependency = false;

    this.bulletinsService.loadBulletins(this.bulletinsService.getActiveDate()).subscribe(
      data => {
        let response = data.json();
        for (let jsonBulletin of response) {
          let bulletin = BulletinModel.createFromJson(jsonBulletin);
          console.log(JSON.stringify(bulletin.toJson()));
          this.addBulletin(bulletin);
        }
        this.loading = false;
        this.mapService.deselectAggregatedRegion();
      },
      error => {
        console.error("Bulletins could not be loaded!");
        // TODO show toast, navigate back
        this.loading = false;
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

  ngOnDestroy() {
    this.bulletinsService.setActiveDate(undefined);
    this.bulletinsService.setIsEditable(false);

    this.loading = false;
  }

  addBulletin(bulletin: BulletinModel) {
    // a bulletin for this aggregated region is already in the map => use existend bulletin input object
    if (this.aggregatedRegionsMap.has(bulletin.getAggregatedRegionId())) {
      if (bulletin.below) {
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).elevationDependency = true;
      }
      // TODO check if this a good method
      if (bulletin.validFrom.getHours() == 12) {
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).daytimeDependency = true;
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).afternoonBelow = bulletin.below;
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).afternoonAbove = bulletin.above;
      // TODO check if this a good method
      } else if (bulletin.validFrom.getHours() == 0) {
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).forenoonBelow = bulletin.below;
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).forenoonAbove = bulletin.above;
      }
    // no bulletin with the aggregated region id is present => create a new bulletin input object
    } else {
      let bulletinInput = new BulletinInputModel();
      bulletinInput.regions = bulletin.regions;
      bulletinInput.avalancheSituationHighlight = bulletin.avalancheSituationHighlight;
      bulletinInput.avalancheSituationComment = bulletin.avalancheSituationComment;
      bulletinInput.snowpackStructureHighlight = bulletin.snowpackStructureHighlight;
      bulletinInput.snowpackStructureComment = bulletin.snowpackStructureComment;
      bulletinInput.elevation = bulletin.elevation;
      if (bulletin.elevation > 0 && bulletin.below) {
        bulletinInput.elevationDependency = true;
      }
      // TODO check if this a good method
      if (bulletin.validFrom.getHours() == 12) {
        bulletinInput.daytimeDependency = true;
        bulletinInput.afternoonBelow = bulletin.below;
        bulletinInput.afternoonAbove = bulletin.above;
      // TODO check if this a good method
      } else if (bulletin.validFrom.getHours() == 0) {
        bulletinInput.forenoonBelow = bulletin.below;
        bulletinInput.forenoonAbove = bulletin.above;
      }

      this.mapService.addAggregatedRegion(bulletinInput);

      this.aggregatedRegionsMap.set(bulletin.getAggregatedRegionId(), bulletinInput);
      this.aggregatedRegionsIds.push(bulletin.getAggregatedRegionId());
    }
  }

  selectAggregatedRegion(aggregatedRegionId: string) {
    // save text parts
    if (this.activeBulletinInput) {
      this.activeBulletinInput.setAvalancheSituationHighlightIn(this.activeAvalancheSituationHighlight, this.settingsService.getLang());
      this.activeBulletinInput.setAvalancheSituationCommentIn(this.activeAvalancheSituationComment, this.settingsService.getLang());
    }

    this.activeAggregatedRegionId = aggregatedRegionId;
    this.activeBulletinInput = this.aggregatedRegionsMap.get(aggregatedRegionId);
    this.activeAvalancheSituationHighlight = this.activeBulletinInput.getAvalancheSituationHighlightIn(this.settingsService.getLang());
    this.activeAvalancheSituationComment = this.activeBulletinInput.getAvalancheSituationCommentIn(this.settingsService.getLang());

    this.mapService.selectAggregatedRegion(this.activeBulletinInput);
  }

  deselectAggregatedRegion() {
    this.mapService.deselectRegions(this.activeBulletinInput);

    this.activeAggregatedRegionId = undefined;
    this.activeBulletinInput = undefined;
    this.activeAvalancheSituationHighlight = undefined;
    this.activeAvalancheSituationComment = undefined;
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