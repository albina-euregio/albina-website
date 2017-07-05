import { Component, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinInputModel } from '../models/bulletin-input.model';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { MapService } from "../providers/map-service/map.service";
import { SettingsService } from '../providers/settings-service/settings.service';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import * as Enums from '../enums/enums';
import { UUID } from 'angular2-uuid';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/forkJoin';

import "leaflet";

@Component({
  templateUrl: 'create-bulletin.component.html'
})
export class CreateBulletinComponent {

  public bulletinStatus = Enums.BulletinStatus;

  public originalBulletins: Map<string, BulletinModel>;

  public editRegions: boolean;

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
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private settingsService: SettingsService,
    private mapService: MapService,
    private confirmationService: ConfirmationService)
  {
    this.loading = true;
  }

  reset() {
    this.originalBulletins = new Map<string, BulletinModel>();
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
    this.editRegions = false;
  }

  ngOnInit() {
    this.bulletinsService.lockRegion(this.bulletinsService.getActiveDate(), this.authenticationService.getUserRegion());

    this.reset();

    if (this.bulletinsService.getCopyDate()) {
      this.bulletinsService.loadBulletins(this.bulletinsService.getCopyDate()).subscribe(
        data => {
          this.copyBulletins(data.json());
          this.bulletinsService.setCopyDate(undefined);
        },
        error => {
          console.error("Bulletins could not be loaded!");
          this.loading = false;
          this.confirmationService.confirm({
            key: "loadingErrorDialog",
            header: this.translateService.instant("bulletins.create.loadingErrorDialog.header"),
            message: this.translateService.instant("bulletins.create.loadingErrorDialog.message"),
            accept: () => {
              this.goBack();
            }
          });
        }
      );
    } else {
      this.bulletinsService.loadBulletins(this.bulletinsService.getActiveDate()).subscribe(
        data => {
          let response = data.json();
          for (let jsonBulletin of response) {
            let bulletin = BulletinModel.createFromJson(jsonBulletin);

            this.originalBulletins.set(bulletin.getId(), bulletin);
            this.addBulletin(bulletin);
          }
          this.loading = false;
          this.mapService.deselectAggregatedRegion();
        },
        error => {
          console.error("Bulletins could not be loaded!");
          this.loading = false;
          this.confirmationService.confirm({
            key: "loadingErrorDialog",
            header: this.translateService.instant("bulletins.create.loadingErrorDialog.header"),
            message: this.translateService.instant("bulletins.create.loadingErrorDialog.message"),
            accept: () => {
              this.goBack();
            }
          });
        }
      );
    }

    let map = L.map("map", {
        zoomControl: false,
        center: L.latLng(46.05, 11.07),
        zoom: 8,
        minZoom: 6,
        maxZoom: 10,
        layers: [this.mapService.baseMaps.OpenMapSurfer_Grayscale, this.mapService.overlayMaps.aggregatedRegions]
    });

    L.control.zoom({ position: "topleft" }).addTo(map);
    //L.control.layers(this.mapService.baseMaps).addTo(map);
    L.control.scale().addTo(map);

    this.mapService.map = map;
  }

  ngOnDestroy() {
    this.bulletinsService.unlockRegion(this.bulletinsService.getActiveDate(), this.authenticationService.getUserRegion());

    this.mapService.map.remove();
    this.bulletinsService.setActiveDate(undefined);
    this.bulletinsService.setIsEditable(false);

    this.loading = false;
  }

  updateElevation() {
    if (this.activeBulletinInput)
      this.activeBulletinInput.elevation = Math.round(this.activeBulletinInput.elevation/100)*100;
  }

  loadBulletinsFromYesterday() {
    this.confirmationService.confirm({
      key: "loadDialog",
      header: this.translateService.instant("bulletins.create.loadDialog.header"),
      message: this.translateService.instant("bulletins.create.loadDialog.message"),
      accept: () => {
        this.loading = true;
        
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        var dateOffset = (24*60*60*1000) * 1;
        date.setTime(this.bulletinsService.getActiveDate().getTime() - dateOffset);

        let regions = new Array<String>();
        regions.push(this.authenticationService.getUserRegion());

        this.bulletinsService.loadBulletins(date, regions).subscribe(
          data => {
            this.copyBulletins(data.json());
          },
          error => {
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
      }
    });
  }

  copyBulletins(response) {
    // reset everything
    this.reset();
    this.mapService.resetAggregatedRegions();

    let idMap = new Map<string, string>();
    for (let jsonBulletin of response) {
      let originalBulletin = BulletinModel.createFromJson(jsonBulletin);
      let bulletin = new BulletinModel(originalBulletin);
      bulletin.setCreator(this.authenticationService.getUsername());
      bulletin.setCreatorRegion(this.authenticationService.getUserRegion());
      
      // reset regions
      let saved = new Array<String>();
      for (let region of bulletin.getSavedRegions())
        if (region.startsWith(this.authenticationService.getUserRegion()))
          saved.push(region);
      for (let region of bulletin.getPublishedRegions())
        if (region.startsWith(this.authenticationService.getUserRegion()))
          saved.push(region);

      if (saved.length > 0) {
        bulletin.setSavedRegions(saved);

        bulletin.setSuggestedRegions(new Array<String>());
        bulletin.setPublishedRegions(new Array<String>());

        if (idMap.has(originalBulletin.getAggregatedRegionId()))
          bulletin.setAggregatedRegionId(idMap.get(originalBulletin.getAggregatedRegionId()));
        else {
          let uuid = UUID.UUID();
          idMap.set(originalBulletin.getAggregatedRegionId(), uuid);
          bulletin.setAggregatedRegionId(uuid);
        }

        this.addBulletin(bulletin);
      }
    }
    this.loading = false;
    this.mapService.deselectAggregatedRegion();
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

      this.mapService.addAggregatedRegion(bulletinInput);

      this.aggregatedRegionsMap.set(bulletin.getAggregatedRegionId(), bulletinInput);
      this.aggregatedRegionsIds.push(bulletin.getAggregatedRegionId());
    }
  }

  acceptSuggestions(aggregatedRegionId: string) {
    let bulletinInputModel = this.aggregatedRegionsMap.get(aggregatedRegionId);
    let suggested = new Array<String>();
    for (let region of bulletinInputModel.getSuggestedRegions())
      if (region.startsWith(this.authenticationService.getUserRegion())) {

        // delete region from other bulletinInputModels
        this.aggregatedRegionsMap.forEach((value: BulletinInputModel, key: string) => {
          let savedRegions = new Array<String>();
          for (let entry of value.getSavedRegions()) {
            if (entry != region)
              savedRegions.push(entry);
          }
          value.setSavedRegions(savedRegions);
        });

        bulletinInputModel.getSavedRegions().push(region);
      } else
        suggested.push(region);
    bulletinInputModel.setSuggestedRegions(suggested);
  }

  rejectSuggestions(aggregatedRegionId: string) {
    let bulletinInputModel = this.aggregatedRegionsMap.get(aggregatedRegionId);
    let suggested = new Array<String>();
    for (let region of bulletinInputModel.getSuggestedRegions())
      if (!region.startsWith(this.authenticationService.getUserRegion()))
        suggested.push(region);
    bulletinInputModel.setSuggestedRegions(suggested);

    this.updateAggregatedRegions();
  }

  createAggregatedRegion(copy) {

    // TODO lock region (Tirol, Südtirol or Trentino) via socketIO

    let uuid = UUID.UUID();
    let bulletinInput;

    if (copy && this.activeBulletinInput)
      bulletinInput = new BulletinInputModel(this.activeBulletinInput);
    else
      bulletinInput = new BulletinInputModel();

    bulletinInput.setCreator(this.authenticationService.getUsername());
    bulletinInput.setCreatorRegion(this.authenticationService.getUserRegion());

    this.aggregatedRegionsMap.set(uuid, bulletinInput);
    this.aggregatedRegionsIds.push(uuid);

    this.selectAggregatedRegion(uuid);
  }

  selectAggregatedRegion(aggregatedRegionId: string) {
    this.setAvActivityTexts();

    this.activeAggregatedRegionId = aggregatedRegionId;
    this.activeBulletinInput = this.aggregatedRegionsMap.get(aggregatedRegionId);
    this.activeAvActivityHighlights = this.activeBulletinInput.getAvActivityHighlightsIn(this.settingsService.getLang());
    this.activeAvActivityComment = this.activeBulletinInput.getAvActivityCommentIn(this.settingsService.getLang());

    this.mapService.selectAggregatedRegion(this.activeBulletinInput);
  }

  deselectAggregatedRegion() {
    this.mapService.deselectRegions(this.activeBulletinInput);

    this.activeAggregatedRegionId = undefined;
    this.activeBulletinInput = undefined;
    this.activeAvActivityHighlights = undefined;
    this.activeAvActivityComment = undefined;
  }

  private setAvActivityTexts() {
    if (this.activeBulletinInput) {
      if (this.activeAvActivityHighlights != undefined && this.activeAvActivityHighlights != "")
        this.activeBulletinInput.setAvActivityHighlightsIn(this.activeAvActivityHighlights, this.settingsService.getLang());
      if (this.activeAvActivityComment != undefined && this.activeAvActivityComment != "")
        this.activeBulletinInput.setAvActivityCommentIn(this.activeAvActivityComment, this.settingsService.getLang());
    }
  }

  deleteAggregatedRegion(aggregatedRegionId: string) {
    this.confirmationService.confirm({
      key: "deleteAggregatedRegionDialog",
      header: this.translateService.instant("bulletins.create.deleteAggregatedRegionDialog.header"),
      message: this.translateService.instant("bulletins.create.deleteAggregatedRegionDialog.message"),
      accept: () => {
        this.aggregatedRegionsMap.delete(aggregatedRegionId);

        var index = this.aggregatedRegionsIds.indexOf(aggregatedRegionId);
        if (index > -1)
          this.aggregatedRegionsIds.splice(index, 1);

        this.deselectAggregatedRegion();

        // TODO unlock region (Tirol, Südtirol or Trentino) via socketIO

      }
    });
  }

  editAggregatedRegion(aggregatedRegionId: string) {

    // TODO lock whole day in TN, check if any aggregated region is locked

    this.editRegions = true;
    this.mapService.editAggregatedRegion(this.activeBulletinInput);
  }

  saveAggregatedRegion(aggregatedRegionId: string) {
    // save selected regions to active bulletin input
    let regions = this.mapService.getSelectedRegions();

    let oldRegionsHit = false;
    for (let region of this.activeBulletinInput.getSavedRegions()) {
      if (region.startsWith(this.authenticationService.getUserRegion())) {
        oldRegionsHit = true;
        break
      }
    }

    let newRegionsHit = false;
    for (let region of regions) {
      if (region.startsWith(this.authenticationService.getUserRegion())) {
        newRegionsHit = true;
        break
      }
    }

    if (newRegionsHit || oldRegionsHit) {
      this.editRegions = false;

      // delete old saved regions in own area
      let oldSavedRegions = new Array<String>();
      for (let region of this.activeBulletinInput.getSavedRegions())
        if (region.startsWith(this.authenticationService.getUserRegion()))
          oldSavedRegions.push(region);
      for (let region of oldSavedRegions) {
        let index = this.activeBulletinInput.getSavedRegions().indexOf(region);
        this.activeBulletinInput.getSavedRegions().splice(index, 1);
      }

      // delete old suggested regions outside own area
      let oldSuggestedRegions = new Array<String>();
      for (let region of this.activeBulletinInput.getSuggestedRegions())
        if (!region.startsWith(this.authenticationService.getUserRegion()))
          oldSuggestedRegions.push(region);
      for (let region of oldSuggestedRegions) {
        let index = this.activeBulletinInput.getSuggestedRegions().indexOf(region);
        this.activeBulletinInput.getSuggestedRegions().splice(index, 1);
      }

      for (let region of regions) {
        if (region.startsWith(this.authenticationService.getUserRegion())) {
          if (this.activeBulletinInput.getSavedRegions().indexOf(region) == -1)
            this.activeBulletinInput.getSavedRegions().push(region);
        } else {
          if ((this.activeBulletinInput.getSavedRegions().indexOf(region) == -1) && (this.activeBulletinInput.getSuggestedRegions().indexOf(region) == -1))
            this.activeBulletinInput.getSuggestedRegions().push(region);
        }
      }

      this.updateAggregatedRegions();

      // TODO unlock whole day in TN

    } else {
      this.confirmationService.confirm({
        key: "noRegionDialog",
        header: this.translateService.instant("bulletins.create.noRegionDialog.header"),
        message: this.translateService.instant("bulletins.create.noRegionDialog.message"),
        accept: () => {
        }
      });
    }
  }

  private updateAggregatedRegions() {
    this.mapService.resetAggregatedRegions();

    // delete regions from other aggregated regions (one region can only be within one aggregated region on this day)
    this.aggregatedRegionsMap.forEach((value: BulletinInputModel, key: string) => {

      // not selected region
      if (key != this.activeAggregatedRegionId) {

        // regions saved by me (only in own area possible)
        for (let region of this.activeBulletinInput.getSavedRegions()) {
          // region was saved in other aggregated region => delete
          let index = value.getSavedRegions().indexOf(region);
          if (index != -1)
            value.getSavedRegions().splice(index, 1);

          // region was suggested by other user (multiple suggestions possible for same region) => delete all)
          index = value.getSuggestedRegions().indexOf(region);
          if (index != -1)
            value.getSuggestedRegions().splice(index, 1);
        }

        // regions suggested by me (only in foreign area possible)
        // region was published => delete suggestion
        for (let region of value.getPublishedRegions()) {
          let index = this.activeBulletinInput.getSuggestedRegions().indexOf(region);
          if (index != -1)
            this.activeBulletinInput.getSuggestedRegions().splice(index, 1);
        }
      }

      this.mapService.addAggregatedRegion(value);
    });
    this.mapService.discardAggregatedRegion();
    this.mapService.selectAggregatedRegion(this.activeBulletinInput);
  }

  hasSuggestions(aggregatedRegionId: string) : boolean {
    let bulletinInputModel = this.aggregatedRegionsMap.get(aggregatedRegionId);
    for (let region of bulletinInputModel.getSuggestedRegions()) {
      if (region.startsWith(this.authenticationService.getUserRegion()))
        return true;
    }
    return false;
  }

  isCreator(aggregatedRegionId: string) : boolean {
    if (aggregatedRegionId != undefined) {
      let bulletinInputModel = this.aggregatedRegionsMap.get(aggregatedRegionId);
      if (bulletinInputModel.getCreatorRegion() != undefined && bulletinInputModel.getCreatorRegion().startsWith(this.authenticationService.getUserRegion()))
        return true;
    }
    return false;
  }

  discardAggregatedRegion(aggregatedRegionId?: string) {
    this.editRegions = false;
    this.mapService.discardAggregatedRegion();
    this.mapService.selectAggregatedRegion(this.activeBulletinInput);

    // TODO unlock whole day in TN
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

  save() {
    this.loading = true;

    this.setAvActivityTexts();

    let bulletins = Array<BulletinModel>();

    this.aggregatedRegionsMap.forEach((value: BulletinInputModel, key: string) => {
      // set snowpack structure texts
      if (this.activeSnowpackStructureHighlights != undefined && this.activeSnowpackStructureHighlights != "")
        value.setSnowpackStructureHighlightsIn(this.activeSnowpackStructureHighlights, this.settingsService.getLang());
      if (this.activeSnowpackStructureComment != undefined && this.activeSnowpackStructureComment != "")
        value.setSnowpackStructureCommentIn(this.activeSnowpackStructureComment, this.settingsService.getLang());

      // create bulletins
      let b = value.toBulletins(key, this.bulletinsService.getActiveDate());
      for (var i = b.length - 1; i >= 0; i--) {
        bulletins.push(b[i]);
      }
    });

    let observableBatch = [];

    for (let bulletin of bulletins) {
      if (bulletin.getId() == undefined) {
        console.log("[" + bulletin.getId() + "] Save bulletin ...");
        observableBatch.push(this.bulletinsService.saveBulletin(bulletin));
      } else {
        console.log("[" + bulletin.getId() + "] Update bulletin ...");
        observableBatch.push(this.bulletinsService.updateBulletin(bulletin));
      }
    }

    // delete original bulletins
    let hit = false;
    this.originalBulletins.forEach((value: BulletinModel, key: string) => {
      for (let bulletin of bulletins)
        if (bulletin.id == key) {
          hit = true;
          break;
        }
      if (!hit) {
        console.log("[" + key + "] Delete bulletin ...");
        observableBatch.push(this.bulletinsService.deleteBulletin(key));
      }
    });

    Observable.forkJoin(observableBatch).subscribe(
      data => {
        this.loading = false;
        this.goBack();
        console.log("Bulletins saved on server.");
      },
      error => {
        this.loading = false;
        console.error("Bulletins could not be saved on server!");
        this.confirmationService.confirm({
          key: "saveErrorDialog",
          header: this.translateService.instant("bulletins.create.saveErrorDialog.header"),
          message: this.translateService.instant("bulletins.create.saveErrorDialog.message"),
          accept: () => {
          }
        });
      }
    );
  }

  discard() {
    this.confirmationService.confirm({
      key: "discardDialog",
      header: this.translateService.instant("bulletins.create.discardDialog.header"),
      message: this.translateService.instant("bulletins.create.discardDialog.message"),
      accept: () => {
        console.log("Bulletin: changes discarded.");
        this.goBack();
      }
    });
  }

  goBack() {
    this.mapService.resetAll();
    this.router.navigate(['/bulletins']);
    this.loading = false;
    this.editRegions = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.keyCode == 27 && this.editRegions) {
      this.discardAggregatedRegion();
    }
  }
}