import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinsService } from '../providers/mock-service/bulletins.service';
import { SettingsService } from '../providers/settings-service/settings.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinInputModel } from '../models/bulletin-input.model';
import * as Enums from '../enums/enums';
import { MapService } from "../providers/map-service/map.service";
import { RegionsTN } from "../mock/regions.tn";
import { UUID } from 'angular2-uuid';
import 'rxjs/add/operator/switchMap';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';

import "leaflet";

@Component({
  templateUrl: 'create-bulletin.component.html'
})
export class CreateBulletinComponent {

  public bulletinStatus = Enums.BulletinStatus;

  public originalBulletins: BulletinModel[];

  public editRegions: boolean;

  public aggregatedRegionsIds: String[];
  public aggregatedRegionsMap: Map<String, BulletinInputModel>;
  public activeAggregatedRegionId: string;
  public activeBulletinInput: BulletinInputModel;

  public activeAvalancheSituationHighlight: string;
  public activeAvalancheSituationComment: string;

  public activeSnowpackStructureHighlight: string;
  public activeSnowpackStructureComment: string;

  public hasDaytimeDependency: boolean;
  public hasElevationDependency: boolean;

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
  }

  ngOnInit() {
    this.originalBulletins = new Array<BulletinModel>();
    this.aggregatedRegionsMap = new Map<string, BulletinInputModel>();
    this.aggregatedRegionsIds = new Array<String>();
    this.activeAggregatedRegionId = undefined;
    this.activeBulletinInput = undefined;
    this.activeAvalancheSituationHighlight = undefined;
    this.activeAvalancheSituationComment = undefined;
    this.activeSnowpackStructureHighlight = undefined;
    this.activeSnowpackStructureComment = undefined;
    this.hasElevationDependency = false;
    this.hasDaytimeDependency = false;
    this.editRegions = false;

    this.bulletinsService.loadBulletins(this.bulletinsService.getActiveDate()).subscribe(
      data => {
        let response = data.json();
        for (let jsonBulletin of response) {
          let bulletin = BulletinModel.createFromJson(jsonBulletin);
          this.addBulletin(bulletin);
        }
      },
      error => {
        console.error("Bulletins could not be loaded!");
        // TODO
      }
    );

    let map = L.map("map", {
        zoomControl: false,
        center: L.latLng(46.05, 11.07),
        zoom: 8,
        minZoom: 7,
        maxZoom: 9,
        layers: [this.mapService.baseMaps.OpenMapSurfer_Grayscale, this.mapService.overlayMaps.regionsBulletins]
    });

    L.control.zoom({ position: "topleft" }).addTo(map);
    //L.control.layers(this.mapService.baseMaps).addTo(map);
    L.control.scale().addTo(map);

    this.mapService.map = map;
  }

  ngOnDestroy() {
    this.bulletinsService.setActiveDate(undefined);
    this.bulletinsService.setIsEditable(false);
    // TODO unlock via socketIO
  }

  addBulletin(bulletin: BulletinModel) {
    this.originalBulletins.push(bulletin);

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
      } else if (bulletin.validFrom.getHours() == 17) {
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).forenoonBelow = bulletin.below;
        this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).forenoonAbove = bulletin.above;
      }
    } else {
      let bulletinInput = new BulletinInputModel();
      bulletinInput.regions = bulletin.regions;
      bulletinInput.avalancheSituationHighlight = bulletin.avalancheSituationHighlight;
      bulletinInput.avalancheSituationComment = bulletin.avalancheSituationComment;
      bulletinInput.elevation = bulletin.elevation;
      if (bulletin.below) {
        bulletinInput.elevationDependency = true;
      }
      // TODO check if this a good method
      if (bulletin.validFrom.getHours() == 12) {
        bulletinInput.daytimeDependency = true;
        bulletinInput.afternoonBelow = bulletin.below;
        bulletinInput.afternoonAbove = bulletin.above;
      // TODO check if this a good method
      } else if (bulletin.validFrom.getHours() == 17) {
        bulletinInput.forenoonBelow = bulletin.below;
        bulletinInput.forenoonAbove = bulletin.above;
      }

      this.aggregatedRegionsMap.set(bulletin.getAggregatedRegionId(), bulletinInput);
      this.aggregatedRegionsIds.push(bulletin.getAggregatedRegionId());
    }
  }

  createAggregatedRegion() {
    // TODO lock region (Tirol, Südtirol or Trentino) via socketIO
    let uuid = UUID.UUID();
    let bulletinInput = new BulletinInputModel();
    this.aggregatedRegionsMap.set(uuid, bulletinInput);
    this.aggregatedRegionsIds.push(uuid);

    this.selectAggregatedRegion(uuid);
    // this.mapService.createAggregatedRegion();
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
    // this.mapService.selectAggregatedRegion(aggregatedRegionId);
  }

  deleteAggregatedRegion(aggregatedRegionId: string) {
    this.confirmationService.confirm({
      header: this.translateService.instant("bulletins.create.deleteAggregatedRegionDialog.header"),
      message: this.translateService.instant("bulletins.create.deleteAggregatedRegionDialog.message"),
      accept: () => {
        this.aggregatedRegionsMap.delete(aggregatedRegionId);

        var index = this.aggregatedRegionsIds.indexOf(aggregatedRegionId);
        if (index > -1)
          this.aggregatedRegionsIds.splice(index, 1);

        this.activeAggregatedRegionId = undefined;
        this.activeBulletinInput = undefined;
        this.activeAvalancheSituationHighlight = undefined;
        this.activeAvalancheSituationComment = undefined;

        // this.mapService.deleteAggregatedRegion(bulletin);
        // TODO unlock region (Tirol, Südtirol or Trentino) via socketIO
      }
    });
  }

  editAggregatedRegion(aggregatedRegionId: string) {
    // TODO allow selection of microregions in map
    // TODO lock whole day in TN, check if any aggregated region is locked
    this.editRegions = true;
    this.mapService.editAggregatedRegion(this.activeBulletinInput);
  }

  saveAggregatedRegion(aggregatedRegionId: string) {
    // TODO unlock whole day in TN
    this.editRegions = false;

    // TODO delete regions from other aggregated regions
    let regions = this.mapService.getSelectedRegions();
    this.aggregatedRegionsMap.get(aggregatedRegionId).setRegions(regions);
    for (var i = regions.length - 1; i >= 0; i--) {
      for (var i = this.aggregatedRegionsMap.keys.length - 1; i >= 0; i--) {
        let index = this.aggregatedRegionsMap.get(this.aggregatedRegionsMap.keys[i]).getRegions().indexOf(regions[i]);
        if (index != -1)
          this.aggregatedRegionsMap.get(this.aggregatedRegionsMap.keys[i]).getRegions().splice(index, 1);
      }
    }
    this.mapService.discardAggregatedRegion();
  }

  discardAggregatedRegion(aggregatedRegionId: string) {
    // TODO unlock whole day in TN
    this.editRegions = false;
    this.mapService.discardAggregatedRegion();
  }

  save() {
    let bulletins = Array<BulletinModel>();

    debugger

    this.aggregatedRegionsMap.forEach((value: BulletinInputModel, key: string) => {
      // create bulletins
      let b = value.toBulletins(key, this.bulletinsService.getActiveDate());
      for (var i = b.length - 1; i >= 0; i--) {
        bulletins.push(b[i]);
      }

      // TODO
      // delete original bulletins that are no longer existend
      // update changed bulletins (keep bulletin id)
      // create new bulletins (create bulletin id)
      for (var i = this.originalBulletins.length - 1; i >= 0; i--) {
        if (this.originalBulletins[i].aggregatedRegionId == key) {
          if (this.originalBulletins[i].validFrom.getHours() == 12) {

          } else if (this.originalBulletins[i].validFrom.getHours() == 17) {

          }
          break;
        }
      }
    });

    debugger

    this.bulletinsService.saveOrUpdateBulletins(bulletins).subscribe(
      data => {
        console.log("Bulletins saved on server.");
        // TODO show toast
        this.router.navigate(['/bulletins/bulletins']);
      },
      error => {
        console.error("Bulletins could not be saved on server!");
        // TODO show toast
      }
    );
  }

  discard() {
    this.confirmationService.confirm({
      header: this.translateService.instant("bulletins.create.discardDialog.header"),
      message: this.translateService.instant("bulletins.create.discardDialog.message"),
      accept: () => {
        this.goBack();
      }
    });
  }

  goBack() {
    console.log("Bulletin: changes discarded.");
    this.router.navigate(['/bulletins/bulletins']);
  }    
}