import { Component, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinInputModel } from '../models/bulletin-input.model';
import { BulletinElevationDescriptionModel } from '../models/bulletin-elevation-description.model';
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
import { BehaviorSubject } from 'rxjs/Rx';

import "leaflet";
import "leaflet.sync";

import { Tabs } from './tabs.component';
import { Tab } from './tab.component';

declare var L:any;

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

  public activeAvActivityHighlightsDe: string;
  public activeAvActivityCommentDe: string;
  public activeAvActivityHighlightsIt: string;
  public activeAvActivityCommentIt: string;
  public activeAvActivityHighlightsEn: string;
  public activeAvActivityCommentEn: string;

  public activeSnowpackStructureHighlightsDe: string;
  public activeSnowpackStructureCommentDe: string;
  public activeSnowpackStructureHighlightsIt: string;
  public activeSnowpackStructureCommentIt: string;
  public activeSnowpackStructureHighlightsEn: string;
  public activeSnowpackStructureCommentEn: string;

  public loading: boolean;

  public showAfternoonMap: boolean;

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
    this.showAfternoonMap = false;
  }

  reset() {
    this.originalBulletins = new Map<string, BulletinModel>();
    this.aggregatedRegionsMap = new Map<string, BulletinInputModel>();
    this.aggregatedRegionsIds = new Array<string>();
    this.activeAggregatedRegionId = undefined;
    this.activeBulletinInput = undefined;
    this.activeAvActivityHighlightsDe = undefined;
    this.activeAvActivityCommentDe = undefined;
    this.activeAvActivityHighlightsIt = undefined;
    this.activeAvActivityCommentIt = undefined;
    this.activeAvActivityHighlightsEn = undefined;
    this.activeAvActivityCommentEn = undefined;
    this.activeSnowpackStructureHighlightsDe = undefined;
    this.activeSnowpackStructureCommentDe = undefined;
    this.activeSnowpackStructureHighlightsIt = undefined;
    this.activeSnowpackStructureCommentIt = undefined;
    this.activeSnowpackStructureHighlightsEn = undefined;
    this.activeSnowpackStructureCommentEn = undefined;
    this.editRegions = false;
    this.showAfternoonMap = false;
  }

  ngOnInit() {
    if (this.bulletinsService.getActiveDate() && this.authenticationService.isUserLoggedIn()) {

      this.reset();

      if (this.bulletinsService.getCopyDate()) {
        let regions = new Array<String>();
        regions.push(this.authenticationService.getUserRegion());

        this.bulletinsService.loadBulletins(this.bulletinsService.getCopyDate(), regions).subscribe(
          data => {
            this.copyBulletins(data.json());
            this.bulletinsService.setCopyDate(undefined);
            this.bulletinsService.loadBulletins(this.bulletinsService.getActiveDate()).subscribe(
              data => {
                this.addForeignBulletins(data.json());
              },
              error => {
                console.error("Foreign bulletins could not be loaded!");
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
          },
          error => {
            console.error("Own bulletins could not be loaded!");
            this.loading = false;
            this.confirmationService.confirm({
              key: "loadingErrorDialog",
              header: this.translateService.instant("bulletins.create.loadingErrorDialog.header"),
              message: this.translateService.instant("bulletins.create.loadingErrorDialog.message"),
              accept: () => {
                this.loading = false;
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

              // only add bulletins with published or saved regions
              if ((bulletin.getPublishedRegions() && bulletin.getPublishedRegions().length > 0) || (bulletin.getSavedRegions() && bulletin.getSavedRegions().length > 0)) {
                this.originalBulletins.set(bulletin.getId(), bulletin);
                this.addBulletin(bulletin);
              }
            }

            this.aggregatedRegionsMap.forEach((value: BulletinInputModel, key: string) => {
              this.mapService.addAggregatedRegion(value);
            });

            this.mapService.deselectAggregatedRegion();
            this.loading = false;
          },
          error => {
            console.error("Bulletins could not be loaded!");
            this.confirmationService.confirm({
              key: "loadingErrorDialog",
              header: this.translateService.instant("bulletins.create.loadingErrorDialog.header"),
              message: this.translateService.instant("bulletins.create.loadingErrorDialog.message"),
              accept: () => {
                this.loading = false;
                this.goBack();
              }
            });
          }
        );
      }
    } else
      this.goBack();     
  }

  ngAfterViewInit() {
    this.initMaps();
  }

  private initMaps() {
    if (this.mapService.map)
      this.mapService.map.remove();
    if (this.mapService.afternoonMap)
      this.mapService.afternoonMap.remove();

    let map = L.map("map", {
        zoomControl: false,
        center: L.latLng(this.authenticationService.getUserLat(), this.authenticationService.getUserLng()),
        zoom: 8,
        minZoom: 6,
        maxZoom: 10,
        layers: [this.mapService.baseMaps.OpenMapSurfer_Grayscale, this.mapService.overlayMaps.aggregatedRegions]
    });

    L.control.zoom({ position: "topleft" }).addTo(map);
    //L.control.layers(this.mapService.baseMaps).addTo(map);
    L.control.scale().addTo(map);

    this.mapService.map = map;

    let afternoonMap = L.map("afternoonMap", {
        zoomControl: false,
        center: L.latLng(this.authenticationService.getUserLat(), this.authenticationService.getUserLng()),
        zoom: 8,
        minZoom: 6,
        maxZoom: 10,
        layers: [this.mapService.afternoonBaseMaps.OpenMapSurfer_Grayscale, this.mapService.afternoonOverlayMaps.aggregatedRegions]
    });

    //L.control.zoom({ position: "topleft" }).addTo(afternoonMap);
    //L.control.layers(this.mapService.baseMaps).addTo(afternoonMap);
    //L.control.scale().addTo(afternoonMap);

    this.mapService.afternoonMap = afternoonMap;

    map.sync(afternoonMap);
    afternoonMap.sync(map);
  }

  onShowAfternoonMapChange(checked) {
    this.showAfternoonMap = checked;
    let id = this.activeAggregatedRegionId;

    this.deselectAggregatedRegion();
    let map = document.getElementById('map');
    let afternoonMap = document.getElementById('afternoonMap');
    if (this.showAfternoonMap) {
      map.classList.remove("col-md-12");
      map.classList.add("col-md-6");
      afternoonMap.classList.remove("col-md-0");
      afternoonMap.classList.add("col-md-6");
    } else {
      map.classList.remove("col-md-6");
      map.classList.add("col-md-12");
      afternoonMap.classList.remove("col-md-6");
      afternoonMap.classList.add("col-md-0");
    }
    this.initMaps();

    if (id)
      this.selectAggregatedRegion(id);
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
    if (this.bulletinsService.getActiveDate() && this.bulletinsService.getIsEditable())
      this.bulletinsService.unlockRegion(this.bulletinsService.getActiveDate(), this.authenticationService.getUserRegion());

    this.mapService.resetAll();
    
    this.bulletinsService.setActiveDate(undefined);
    this.bulletinsService.setIsEditable(false);

    this.loading = false;
    this.editRegions = false;
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
            // delete own regions
            let entries = new Array<string>();
            this.aggregatedRegionsMap.forEach((value: BulletinInputModel, key: string) => {
              if (value.getCreatorRegion().startsWith(this.authenticationService.getUserRegion()))
                entries.push(key);
            });
            for (let entry of entries)
              this.delAggregatedRegion(entry);

            this.copyBulletins(data.json());
            this.loading = false;
          },
          error => {
            this.confirmationService.confirm({
              key: "loadingBulletinsErrorDialog",
              header: this.translateService.instant("bulletins.create.loadingBulletinsErrorDialog.header"),
              message: this.translateService.instant("bulletins.create.loadingBulletinsErrorDialog.message"),
              accept: () => {
                this.loading = false;
                this.goBack();
              }
            });
          }
        );
      }
    });
  }

  copyBulletins(response) {
    // TODO if copy from other day, add own regions but load other regions from today
    this.mapService.resetAggregatedRegions();

    let idMap = new Map<string, string>();
    for (let jsonBulletin of response) {
      let originalBulletin = BulletinModel.createFromJson(jsonBulletin);

      if (this.bulletinsService.getIsUpdate())
        this.originalBulletins.set(originalBulletin.getId(), originalBulletin);

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

    this.aggregatedRegionsMap.forEach((value: BulletinInputModel, key: string) => {
      this.mapService.addAggregatedRegion(value);
    });

    this.mapService.deselectAggregatedRegion();
  }

  addForeignBulletins(response) {
    this.mapService.resetAggregatedRegions();

    for (let jsonBulletin of response) {
      let bulletin = BulletinModel.createFromJson(jsonBulletin);

      if (!bulletin.getCreatorRegion().startsWith(this.authenticationService.getUserRegion()))
        this.addBulletin(bulletin);
    }

    this.aggregatedRegionsMap.forEach((value: BulletinInputModel, key: string) => {
      this.mapService.addAggregatedRegion(value);
    });

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
        this.showAfternoonMap = true;
        this.onShowAfternoonMapChange(true);
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

      this.activeSnowpackStructureHighlightsDe = bulletinInput.getSnowpackStructureHighlightsIn(Enums.LanguageCode.de);
      this.activeSnowpackStructureCommentDe = bulletinInput.getSnowpackStructureCommentIn(Enums.LanguageCode.de);
      this.activeSnowpackStructureHighlightsIt = bulletinInput.getSnowpackStructureHighlightsIn(Enums.LanguageCode.it);
      this.activeSnowpackStructureCommentIt = bulletinInput.getSnowpackStructureCommentIn(Enums.LanguageCode.it);
      this.activeSnowpackStructureHighlightsEn = bulletinInput.getSnowpackStructureHighlightsIn(Enums.LanguageCode.en);
      this.activeSnowpackStructureCommentEn = bulletinInput.getSnowpackStructureCommentIn(Enums.LanguageCode.en);

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
        this.showAfternoonMap = true;
        this.onShowAfternoonMapChange(true);
      // TODO check if this a good method
      } else if (bulletin.validFrom.getHours() == 0) {
        bulletinInput.setForenoonBulletinId(bulletin.id);
        bulletinInput.forenoonBelow = bulletin.below;
        bulletinInput.forenoonAbove = bulletin.above;
      }

      //this.addAggregatedRegion(bulletin.getAggregatedRegionId(), bulletinInput);
      this.aggregatedRegionsMap.set(bulletin.getAggregatedRegionId(), bulletinInput);
      this.aggregatedRegionsIds.push(bulletin.getAggregatedRegionId());
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

  acceptSuggestions(event, aggregatedRegionId: string) {
    event.stopPropagation();
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

  rejectSuggestions(event, aggregatedRegionId: string) {
    event.stopPropagation();
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

    this.addAggregatedRegion(uuid, bulletinInput);
    this.selectAggregatedRegion(uuid);
  }

  selectAggregatedRegion(aggregatedRegionId: string) {
    if (!this.editRegions) {
      this.setAvActivityTexts();

      this.activeAggregatedRegionId = aggregatedRegionId;
      this.activeBulletinInput = this.aggregatedRegionsMap.get(aggregatedRegionId);
      this.activeAvActivityHighlightsDe = this.activeBulletinInput.getAvActivityHighlightsIn(Enums.LanguageCode.de);
      this.activeAvActivityCommentDe = this.activeBulletinInput.getAvActivityCommentIn(Enums.LanguageCode.de);
      this.activeAvActivityHighlightsIt = this.activeBulletinInput.getAvActivityHighlightsIn(Enums.LanguageCode.it);
      this.activeAvActivityCommentIt = this.activeBulletinInput.getAvActivityCommentIn(Enums.LanguageCode.it);
      this.activeAvActivityHighlightsEn = this.activeBulletinInput.getAvActivityHighlightsIn(Enums.LanguageCode.en);
      this.activeAvActivityCommentEn = this.activeBulletinInput.getAvActivityCommentIn(Enums.LanguageCode.en);

      this.mapService.selectAggregatedRegion(this.activeBulletinInput);
    }
  }

  elevationDependencyChanged() {
    if (this.activeBulletinInput.elevationDependency) {
      this.activeBulletinInput.forenoonBelow.setDangerRating(this.activeBulletinInput.forenoonAbove.getDangerRating());
      this.activeBulletinInput.forenoonBelow.setAspects(this.activeBulletinInput.forenoonAbove.getAspects());
      this.activeBulletinInput.forenoonBelow.setAvalancheProblem(this.activeBulletinInput.forenoonAbove.getAvalancheProblem());
      if (this.activeBulletinInput.daytimeDependency) {
        this.activeBulletinInput.afternoonBelow.setDangerRating(this.activeBulletinInput.forenoonBelow.getDangerRating());
        this.activeBulletinInput.afternoonBelow.setAspects(this.activeBulletinInput.forenoonBelow.getAspects());
        this.activeBulletinInput.afternoonBelow.setAvalancheProblem(this.activeBulletinInput.forenoonBelow.getAvalancheProblem());
      }
    } else {
      this.activeBulletinInput.forenoonBelow.setDangerRating(new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing));
      this.activeBulletinInput.forenoonBelow.setAspects(new Array<Enums.Aspect>());
      this.activeBulletinInput.forenoonBelow.setAvalancheProblem(undefined);
      if (this.activeBulletinInput.daytimeDependency) {
        this.activeBulletinInput.afternoonBelow.setDangerRating(new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing));
        this.activeBulletinInput.afternoonBelow.setAspects(new Array<Enums.Aspect>());
        this.activeBulletinInput.afternoonBelow.setAvalancheProblem(undefined);
      }
    }
  }

  daytimeDependencyChanged() {
    if (this.activeBulletinInput.daytimeDependency) {
      this.activeBulletinInput.afternoonAbove.setDangerRating(this.activeBulletinInput.forenoonAbove.getDangerRating());
      this.activeBulletinInput.afternoonAbove.setAspects(this.activeBulletinInput.forenoonAbove.getAspects());
      this.activeBulletinInput.afternoonAbove.setAvalancheProblem(this.activeBulletinInput.forenoonAbove.getAvalancheProblem());
      if (this.activeBulletinInput.elevationDependency) {
        this.activeBulletinInput.afternoonBelow.setDangerRating(this.activeBulletinInput.forenoonBelow.getDangerRating());
        this.activeBulletinInput.afternoonBelow.setAspects(this.activeBulletinInput.forenoonBelow.getAspects());
        this.activeBulletinInput.afternoonBelow.setAvalancheProblem(this.activeBulletinInput.forenoonBelow.getAvalancheProblem());
      }
    } else {
      this.activeBulletinInput.afternoonAbove.setDangerRating(new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing));
      this.activeBulletinInput.afternoonAbove.setAspects(new Array<Enums.Aspect>());
      this.activeBulletinInput.afternoonAbove.setAvalancheProblem(undefined);
      if (this.activeBulletinInput.elevationDependency) {
        this.activeBulletinInput.afternoonBelow.setDangerRating(new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing));
        this.activeBulletinInput.afternoonBelow.setAspects(new Array<Enums.Aspect>());
        this.activeBulletinInput.afternoonBelow.setAvalancheProblem(undefined);
      }
    }
  }

  deselectAggregatedRegion() {
    if (!this.editRegions) {
      //this.mapService.deselectRegions(this.activeBulletinInput);
      this.mapService.deselectAggregatedRegion();

      this.activeAggregatedRegionId = undefined;
      this.activeBulletinInput = undefined;
      this.activeAvActivityHighlightsDe = undefined;
      this.activeAvActivityCommentDe = undefined;
      this.activeAvActivityHighlightsIt = undefined;
      this.activeAvActivityCommentIt = undefined;
      this.activeAvActivityHighlightsEn = undefined;
      this.activeAvActivityCommentEn = undefined;
    }
  }

  private setAvActivityTexts() {
    if (this.activeBulletinInput) {
      if (this.activeAvActivityHighlightsDe != undefined && this.activeAvActivityHighlightsDe != "")
        this.activeBulletinInput.setAvActivityHighlightsIn(this.activeAvActivityHighlightsDe, Enums.LanguageCode.de);
      if (this.activeAvActivityCommentDe != undefined && this.activeAvActivityCommentDe != "")
        this.activeBulletinInput.setAvActivityCommentIn(this.activeAvActivityCommentDe, Enums.LanguageCode.de);
      if (this.activeAvActivityHighlightsIt != undefined && this.activeAvActivityHighlightsIt != "")
        this.activeBulletinInput.setAvActivityHighlightsIn(this.activeAvActivityHighlightsIt, Enums.LanguageCode.it);
      if (this.activeAvActivityCommentIt != undefined && this.activeAvActivityCommentIt != "")
        this.activeBulletinInput.setAvActivityCommentIn(this.activeAvActivityCommentIt, Enums.LanguageCode.it);
      if (this.activeAvActivityHighlightsEn != undefined && this.activeAvActivityHighlightsEn != "")
        this.activeBulletinInput.setAvActivityHighlightsIn(this.activeAvActivityHighlightsEn, Enums.LanguageCode.en);
      if (this.activeAvActivityCommentEn != undefined && this.activeAvActivityCommentEn != "")
        this.activeBulletinInput.setAvActivityCommentIn(this.activeAvActivityCommentEn, Enums.LanguageCode.en);
    }
  }

  deleteAggregatedRegion(event, aggregatedRegionId: string) {
    event.stopPropagation();

    this.confirmationService.confirm({
      key: "deleteAggregatedRegionDialog",
      header: this.translateService.instant("bulletins.create.deleteAggregatedRegionDialog.header"),
      message: this.translateService.instant("bulletins.create.deleteAggregatedRegionDialog.message"),
      accept: () => {
        this.delAggregatedRegion(aggregatedRegionId);
      }
    });
  }

  private delAggregatedRegion(aggregatedRegionId: string) {
        this.aggregatedRegionsMap.delete(aggregatedRegionId);

        var index = this.aggregatedRegionsIds.indexOf(aggregatedRegionId);
        if (index > -1)
          this.aggregatedRegionsIds.splice(index, 1);
        
        this.mapService.resetAggregatedRegions();
        this.aggregatedRegionsMap.forEach((value: BulletinInputModel, key: string) => {
          this.mapService.addAggregatedRegion(value);
        });

        this.deselectAggregatedRegion();

        // TODO unlock region (Tirol, Südtirol or Trentino) via socketIO
  }

  editAggregatedRegion(event, aggregatedRegionId: string) {
    event.stopPropagation();

    // TODO lock whole day in TN, check if any aggregated region is locked

    this.editRegions = true;
    this.mapService.editAggregatedRegion(this.activeBulletinInput);
  }

  saveAggregatedRegion(event, aggregatedRegionId: string) {
    event.stopPropagation();

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

  discardAggregatedRegion(event, aggregatedRegionId?: string) {
    event.stopPropagation();
    this.editRegions = false;
    this.mapService.discardAggregatedRegion();
    this.mapService.selectAggregatedRegion(this.activeBulletinInput);

    // TODO unlock whole day in TN
  }

  getForenoonColor(aggregatedRegionId) {
    let dangerRating = "";
    if (this.aggregatedRegionsMap.get(aggregatedRegionId) && this.aggregatedRegionsMap.get(aggregatedRegionId) != undefined && this.aggregatedRegionsMap.get(aggregatedRegionId).getForenoonDangerRatingAbove())
      dangerRating = this.aggregatedRegionsMap.get(aggregatedRegionId).getForenoonDangerRatingAbove().toString();

    return this.getDangerRatingColor(dangerRating);
  }

  getAfternoonColor(aggregatedRegionId) {
    let dangerRating = "";
    if (this.aggregatedRegionsMap.get(aggregatedRegionId) && this.aggregatedRegionsMap.get(aggregatedRegionId) != undefined) {
      if (this.aggregatedRegionsMap.get(aggregatedRegionId).getAfternoonDangerRatingAbove())
        dangerRating = this.aggregatedRegionsMap.get(aggregatedRegionId).getAfternoonDangerRatingAbove().toString();
      else
        dangerRating = this.aggregatedRegionsMap.get(aggregatedRegionId).getForenoonDangerRatingAbove().toString();
    }
    return this.getDangerRatingColor(dangerRating);
  }

  private getDangerRatingColor(dangerRating) {
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
      if (this.activeSnowpackStructureHighlightsDe != undefined && this.activeSnowpackStructureHighlightsDe != "")
        value.setSnowpackStructureHighlightsIn(this.activeSnowpackStructureHighlightsDe, Enums.LanguageCode.de);
      if (this.activeSnowpackStructureCommentDe != undefined && this.activeSnowpackStructureCommentDe != "")
        value.setSnowpackStructureCommentIn(this.activeSnowpackStructureCommentDe, Enums.LanguageCode.de);
      if (this.activeSnowpackStructureHighlightsIt != undefined && this.activeSnowpackStructureHighlightsIt != "")
        value.setSnowpackStructureHighlightsIn(this.activeSnowpackStructureHighlightsIt, Enums.LanguageCode.it);
      if (this.activeSnowpackStructureCommentIt != undefined && this.activeSnowpackStructureCommentIt != "")
        value.setSnowpackStructureCommentIn(this.activeSnowpackStructureCommentIt, Enums.LanguageCode.it);
      if (this.activeSnowpackStructureHighlightsEn != undefined && this.activeSnowpackStructureHighlightsEn != "")
        value.setSnowpackStructureHighlightsIn(this.activeSnowpackStructureHighlightsEn, Enums.LanguageCode.en);
      if (this.activeSnowpackStructureCommentEn != undefined && this.activeSnowpackStructureCommentEn != "")
        value.setSnowpackStructureCommentIn(this.activeSnowpackStructureCommentEn, Enums.LanguageCode.en);

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

    if (this.bulletinsService.getIsUpdate()) {
      // set status of original bulletins to obsolete
      let hit = false;
      this.originalBulletins.forEach((value: BulletinModel, key: string) => {
        console.log("[" + key + "] Set bulletin status to obsolete ...");

        let savedRegions = new Array<String>();
        let publishedRegions = new Array<String>();
        let obsoleteRegions = new Array<String>();
        for (let region of value.getPublishedRegions())
          if (region.startsWith(this.authenticationService.getUserRegion()))
            obsoleteRegions.push(region);
          else
            publishedRegions.push(region);
        for (let region of value.getSavedRegions())
          if (region.startsWith(this.authenticationService.getUserRegion()))
            obsoleteRegions.push(region);
          else
            savedRegions.push(region);
        value.setSavedRegions(savedRegions);
        value.setPublishedRegions(publishedRegions);
        value.setObsoleteRegions(obsoleteRegions);

        observableBatch.push(this.bulletinsService.updateBulletin(value));
      });
    } else {
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
    }

    if (observableBatch.length > 0) {
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
    } else {
      this.loading = false;
      this.goBack();
      console.log("No bulletins saved on server.");
    }
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
    this.router.navigate(['/bulletins']);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.keyCode == 27 && this.editRegions) {
      this.discardAggregatedRegion(event);
    }
  }
}