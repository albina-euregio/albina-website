import { Component, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinElevationDescriptionModel } from '../models/bulletin-elevation-description.model';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { AuthenticationService } from '../providers/authentication-service/authentication.service';
import { MapService } from "../providers/map-service/map.service";
import { RegionsService } from "../providers/regions-service/regions.service";
import { SettingsService } from '../providers/settings-service/settings.service';
import { ConstantsService } from '../providers/constants-service/constants.service';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import * as Enums from '../enums/enums';
import { UUID } from 'angular2-uuid';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/forkJoin';
import { BehaviorSubject } from 'rxjs/Rx';

import "leaflet";
import "leaflet.sync";

import * as d3 from "d3";
import { geoPath } from "d3-geo";

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
  public loading: boolean;
  public showAfternoonMap: boolean;

  public aggregatedRegionsIds: string[];

  public activeBulletin: BulletinModel;
  public bulletinsList: BulletinModel[];

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

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    public bulletinsService: BulletinsService,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private settingsService: SettingsService,
    private constantsService: ConstantsService,
    private mapService: MapService,
    private regionsService: RegionsService,
    private confirmationService: ConfirmationService)
  {
    this.loading = true;
    this.showAfternoonMap = false;
  }

  reset() {
    this.originalBulletins = new Map<string, BulletinModel>();
    this.aggregatedRegionsIds = new Array<string>();
    this.activeBulletin = undefined;
    this.bulletinsList = new Array<BulletinModel>();

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

      // copy bulletins from other date
      if (this.bulletinsService.getCopyDate()) {
        let regions = new Array<String>();
        regions.push(this.authenticationService.getUserRegion());

        // load own bulletins from the date they are copied from
        this.bulletinsService.loadBulletins(this.bulletinsService.getCopyDate(), regions).subscribe(
          data => {
            this.copyBulletins(data.json());
            this.bulletinsService.setCopyDate(undefined);
            // load foreign bulletins from the current date
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

      // load current bulletins (do not copy them, also if it is an update)
      } else {
        this.bulletinsService.loadBulletins(this.bulletinsService.getActiveDate()).subscribe(
          data => {
            let response = data.json();
            for (let jsonBulletin of response) {
              let bulletin = BulletinModel.createFromJson(jsonBulletin);

              // only add bulletins with published or saved regions
              if ((bulletin.getPublishedRegions() && bulletin.getPublishedRegions().length > 0) || (bulletin.getSavedRegions() && bulletin.getSavedRegions().length > 0)) {

                // move published regions to saved regions
                if (this.bulletinsService.getIsUpdate()) {
                  let saved = new Array<String>();
                  for (let region of bulletin.getSavedRegions())
                    if (region.startsWith(this.authenticationService.getUserRegion()))
                      saved.push(region);
                  for (let region of bulletin.getPublishedRegions())
                    if (region.startsWith(this.authenticationService.getUserRegion()))
                      saved.push(region);

                  if (saved.length > 0) {
                    bulletin.setSavedRegions(saved);
                    bulletin.setPublishedRegions(new Array<String>());
                  }
                }

                this.addBulletin(bulletin);
              }
            }

            if (this.getOwnBulletins().length == 0)
              this.createInitialAggregatedRegion();

            this.updateMap();

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
        doubleClickZoom: true,
        scrollWheelZoom: false,
        touchZoom: true,
        center: L.latLng(this.authenticationService.getUserLat(), this.authenticationService.getUserLng()),
        zoom: 8,
        minZoom: 8,
        maxZoom: 10,
        maxBounds: L.latLngBounds(L.latLng(this.constantsService.mapBoundaryN, this.constantsService.mapBoundaryW), L.latLng(this.constantsService.mapBoundaryS, this.constantsService.mapBoundaryE)),
        layers: [this.mapService.baseMaps.AlbinaBaseMap, this.mapService.overlayMaps.aggregatedRegions, this.mapService.overlayMaps.regions]
    });

    L.control.zoom({ position: "topleft" }).addTo(map);
    //L.control.layers(this.mapService.baseMaps).addTo(map);
    //L.control.scale().addTo(map);

    if (this.showAfternoonMap) {
      L.Control.AM = L.Control.extend({
          onAdd: function(map) {
              var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
              container.style.backgroundColor = 'white';
              container.style.width = '52px';
              container.style.height = '35px';
              container.innerHTML = '<p style="font-size: 1.75em; color: #989898; position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%)"><b>AM</b></p>';
              return container;
          },

          onRemove: function(map) {
              // Nothing to do here
          }
      });

      L.control.am = function(opts) {
          return new L.Control.AM(opts);
      }

      L.control.am({ position: 'topright' }).addTo(map);
    }

    this.mapService.map = map;

    let afternoonMap = L.map("afternoonMap", {
        zoomControl: false,
        doubleClickZoom: true,
        scrollWheelZoom: false,
        touchZoom: true,
        center: L.latLng(this.authenticationService.getUserLat(), this.authenticationService.getUserLng()),
        zoom: 8,
        minZoom: 8,
        maxZoom: 10,
        maxBounds: L.latLngBounds(L.latLng(this.constantsService.mapBoundaryN, this.constantsService.mapBoundaryW), L.latLng(this.constantsService.mapBoundaryS, this.constantsService.mapBoundaryE)),
        layers: [this.mapService.afternoonBaseMaps.AlbinaBaseMap, this.mapService.afternoonOverlayMaps.aggregatedRegions, this.mapService.afternoonOverlayMaps.regions]
    });

    //L.control.zoom({ position: "topleft" }).addTo(afternoonMap);
    //L.control.layers(this.mapService.baseMaps).addTo(afternoonMap);
    //L.control.scale().addTo(afternoonMap);

    L.Control.PM = L.Control.extend({
        onAdd: function(map) {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            container.style.backgroundColor = 'white';
            container.style.width = '52px';
            container.style.height = '35px';
            container.innerHTML = '<p style="font-size: 1.75em; color: #989898; position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%)"><b>PM</b></p>';
            return container;
        },

        onRemove: function(map) {
            // Nothing to do here
        }
    });

    L.control.pm = function(opts) {
        return new L.Control.PM(opts);
    }

    L.control.pm({ position: 'topright' }).addTo(afternoonMap);

    this.mapService.afternoonMap = afternoonMap;

    map.sync(afternoonMap);
    afternoonMap.sync(map);
  }

  private addThumbnailMap(id) {
    // Load map data
    var features = this.regionsService.getRegionsTrentino().features;

    var width = 40;
    var height = 40;

    var projection = d3.geoMercator().scale(1200).translate([-215, 1110]);
    
    if (!d3.select("#" + id).empty()) {
      d3.select("#" + id).select("svg").remove();
      var svg = d3.select("#" + id).append("svg")
          .attr("width", width)
          .attr("height", height);

      var path : any = d3.geoPath()
          .projection(projection);

      var g = svg.append("g");
      
      var mapLayer = g.append('g')
        .classed('map-layer', true);

      // Draw each province as a path
      mapLayer.selectAll('path')
          .data(features)
        .enter().append('path')
          .attr('d', path)
          .attr('vector-effect', 'non-scaling-stroke');
    }
  }

  onShowAfternoonMapChange(checked) {
    this.showAfternoonMap = checked;
    this.setTexts();

    let bulletin = this.activeBulletin;

    this.deselectBulletin();
    let map = document.getElementById('map');
    let afternoonMap = document.getElementById('afternoonMap');
    if (this.showAfternoonMap) {
      map.classList.remove("col-md-12");
      map.classList.add("col-md-6");
      afternoonMap.classList.remove("col-md-0");
      afternoonMap.classList.add("col-md-6");
      afternoonMap.style.borderBottom = "1px solid";
      afternoonMap.style.borderLeft = "1px solid";
      afternoonMap.style.borderColor = "#cfd8dc";
    } else {
      map.classList.remove("col-md-6");
      map.classList.add("col-md-12");
      afternoonMap.classList.remove("col-md-6");
      afternoonMap.classList.add("col-md-0");
      afternoonMap.style.border = "";
    }
    this.initMaps();

    if (bulletin)
      this.selectBulletin(bulletin);
  }

  getOwnBulletins() {
    let result = new Array<BulletinModel>();
    for (let bulletin of this.bulletinsList)
      if (bulletin.getCreatorRegion().startsWith(this.authenticationService.getUserRegion()))
        result.push(bulletin);
    return result;
  }

  getForeignBulletins() {
    let result = new Array<BulletinModel>();
    for (let bulletin of this.bulletinsList)
      if (!bulletin.getCreatorRegion().startsWith(this.authenticationService.getUserRegion()))
        result.push(bulletin);
    return result;
  }

  ngOnDestroy() {
    if (this.bulletinsService.getActiveDate() && this.bulletinsService.getIsEditable())
      this.bulletinsService.unlockRegion(this.bulletinsService.getActiveDate(), this.authenticationService.getUserRegion());

    this.mapService.resetAll();
    
    this.bulletinsService.setActiveDate(undefined);
    this.bulletinsService.setIsEditable(false);
    this.bulletinsService.setIsSmallChange(false);
    this.bulletinsService.setIsUpdate(false);

    this.loading = false;
    this.editRegions = false;
  }

  updateElevation() {
    if (this.activeBulletin) {
      this.activeBulletin.elevation = Math.round(this.activeBulletin.elevation/100)*100;
      if (this.activeBulletin.elevation > 9000)
        this.activeBulletin.elevation = 9000;
      else if (this.activeBulletin.elevation < 0)
        this.activeBulletin.elevation = 0;
    }
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

            // TODO delete own regions
            let entries = new Array<BulletinModel>();

            for (let bulletin of this.bulletinsList) {
              if (bulletin.getCreatorRegion().startsWith(this.authenticationService.getUserRegion()))
                entries.push(bulletin);
            }
            for (let entry of entries)
              this.delBulletin(entry);

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

  // create a copy of every bulletin (with new id)
  private copyBulletins(response) {
    this.mapService.resetAggregatedRegions();

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

        //let uuid = UUID.UUID();
        //bulletin.setId(uuid);

        this.addBulletin(bulletin);
      }
    }

    this.updateMap();

    this.mapService.deselectAggregatedRegion();
  }

  private addForeignBulletins(response) {
    this.mapService.resetAggregatedRegions();

    for (let jsonBulletin of response) {
      let bulletin = BulletinModel.createFromJson(jsonBulletin);

      if (!bulletin.getCreatorRegion().startsWith(this.authenticationService.getUserRegion()))
        this.addBulletin(bulletin);
    }

    this.updateMap();

    this.loading = false;
    this.mapService.deselectAggregatedRegion();
  }

  private updateMap() {
    for (let bulletin of this.bulletinsList)
      this.mapService.addAggregatedRegion(bulletin);
  }

  private addBulletin(bulletin: BulletinModel) {
    this.bulletinsList.push(bulletin);

    if (bulletin.hasDaytimeDependency && this.showAfternoonMap == false) {
      this.showAfternoonMap = true;
      this.onShowAfternoonMapChange(true);
    }
  }

  acceptSuggestions(event, bulletin: BulletinModel) {
    event.stopPropagation();
    let suggested = new Array<String>();
    for (let region of bulletin.getSuggestedRegions())
      if (region.startsWith(this.authenticationService.getUserRegion())) {

        // delete region from other bulletinInputModels
        for (let b of this.bulletinsList) {
          let savedRegions = new Array<String>();
          for (let entry of b.getSavedRegions()) {
            if (entry != region)
              savedRegions.push(entry);
          }
          b.setSavedRegions(savedRegions);
        }

        bulletin.getSavedRegions().push(region);
      } else
        suggested.push(region);
    bulletin.setSuggestedRegions(suggested);

    this.updateAggregatedRegions();
  }

  rejectSuggestions(event, bulletin: BulletinModel) {
    event.stopPropagation();
    let suggested = new Array<String>();
    for (let region of bulletin.getSuggestedRegions())
      if (!region.startsWith(this.authenticationService.getUserRegion()))
        suggested.push(region);
    bulletin.setSuggestedRegions(suggested);

    this.updateAggregatedRegions();
  }

  private createInitialAggregatedRegion() {
    let bulletin = new BulletinModel();
    //let uuid = UUID.UUID();
    //bulletin.setId(uuid);
    bulletin.setCreator(this.authenticationService.getUsername());
    bulletin.setCreatorRegion(this.authenticationService.getUserRegion());
    bulletin.setSavedRegions(this.constantsService.regions.get(this.authenticationService.getUserRegion()));

    this.addBulletin(bulletin);
  }

  createBulletin(copy) {

    // TODO lock region (Tirol, Südtirol or Trentino) via socketIO

    let bulletin;

    if (copy && this.activeBulletin)
      bulletin = new BulletinModel(this.activeBulletin);
    else
      bulletin = new BulletinModel();

    //let uuid = UUID.UUID();
    //bulletin.setId(uuid);
    bulletin.setCreator(this.authenticationService.getUsername());
    bulletin.setCreatorRegion(this.authenticationService.getUserRegion());

    this.addBulletin(bulletin);
    //this.mapService.addAggregatedRegion(bulletin);
    this.selectBulletin(bulletin);
  }

  selectBulletin(bulletin: BulletinModel) {
    if (!this.editRegions) {
      this.setTexts();

      this.activeBulletin = bulletin;
      this.activeAvActivityHighlightsDe = this.activeBulletin.getAvActivityHighlightsIn(Enums.LanguageCode.de);
      this.activeAvActivityCommentDe = this.activeBulletin.getAvActivityCommentIn(Enums.LanguageCode.de);
      this.activeAvActivityHighlightsIt = this.activeBulletin.getAvActivityHighlightsIn(Enums.LanguageCode.it);
      this.activeAvActivityCommentIt = this.activeBulletin.getAvActivityCommentIn(Enums.LanguageCode.it);
      this.activeAvActivityHighlightsEn = this.activeBulletin.getAvActivityHighlightsIn(Enums.LanguageCode.en);
      this.activeAvActivityCommentEn = this.activeBulletin.getAvActivityCommentIn(Enums.LanguageCode.en);
      this.activeSnowpackStructureHighlightsDe = this.activeBulletin.getSnowpackStructureHighlightIn(Enums.LanguageCode.de);
      this.activeSnowpackStructureCommentDe = this.activeBulletin.getSnowpackStructureCommentIn(Enums.LanguageCode.de);
      this.activeSnowpackStructureHighlightsIt = this.activeBulletin.getSnowpackStructureHighlightIn(Enums.LanguageCode.it);
      this.activeSnowpackStructureCommentIt = this.activeBulletin.getSnowpackStructureCommentIn(Enums.LanguageCode.it);
      this.activeSnowpackStructureHighlightsEn = this.activeBulletin.getSnowpackStructureHighlightIn(Enums.LanguageCode.en);
      this.activeSnowpackStructureCommentEn = this.activeBulletin.getSnowpackStructureCommentIn(Enums.LanguageCode.en);

      this.mapService.selectAggregatedRegion(this.activeBulletin);
    }
  }

  elevationDependencyChanged(event, value) {
    event.stopPropagation();
    this.activeBulletin.setHasElevationDependency(value);

    if (this.activeBulletin.hasElevationDependency) {
      this.activeBulletin.forenoonBelow.setDangerRating(this.activeBulletin.forenoonAbove.getDangerRating());
      this.activeBulletin.forenoonBelow.setAspects(this.activeBulletin.forenoonAbove.getAspects());
      this.activeBulletin.forenoonBelow.setAvalancheProblem(this.activeBulletin.forenoonAbove.getAvalancheProblem());
      if (this.activeBulletin.hasDaytimeDependency) {
        this.activeBulletin.afternoonBelow.setDangerRating(this.activeBulletin.forenoonBelow.getDangerRating());
        this.activeBulletin.afternoonBelow.setAspects(this.activeBulletin.forenoonBelow.getAspects());
        this.activeBulletin.afternoonBelow.setAvalancheProblem(this.activeBulletin.forenoonBelow.getAvalancheProblem());
      }
    } else {
      this.activeBulletin.forenoonBelow.setDangerRating(new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing));
      this.activeBulletin.forenoonBelow.setAspects(new Array<Enums.Aspect>());
      this.activeBulletin.forenoonBelow.setAvalancheProblem(undefined);
      if (this.activeBulletin.hasDaytimeDependency) {
        this.activeBulletin.afternoonBelow.setDangerRating(new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing));
        this.activeBulletin.afternoonBelow.setAspects(new Array<Enums.Aspect>());
        this.activeBulletin.afternoonBelow.setAvalancheProblem(undefined);
      }
    }
  }

  daytimeDependencyChanged(event, value) {
    event.stopPropagation();
    this.activeBulletin.setHasDaytimeDependency(value);

    if (this.activeBulletin.hasDaytimeDependency) {
      if (this.showAfternoonMap == false) {
        this.showAfternoonMap = true;
        this.onShowAfternoonMapChange(true);
      }
      this.activeBulletin.afternoonAbove.setDangerRating(this.activeBulletin.forenoonAbove.getDangerRating());
      this.activeBulletin.afternoonAbove.setAspects(this.activeBulletin.forenoonAbove.getAspects());
      this.activeBulletin.afternoonAbove.setAvalancheProblem(this.activeBulletin.forenoonAbove.getAvalancheProblem());
      if (this.activeBulletin.hasElevationDependency) {
        this.activeBulletin.afternoonBelow.setDangerRating(this.activeBulletin.forenoonBelow.getDangerRating());
        this.activeBulletin.afternoonBelow.setAspects(this.activeBulletin.forenoonBelow.getAspects());
        this.activeBulletin.afternoonBelow.setAvalancheProblem(this.activeBulletin.forenoonBelow.getAvalancheProblem());
      }
    } else {
      this.activeBulletin.afternoonAbove.setDangerRating(new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing));
      this.activeBulletin.afternoonAbove.setAspects(new Array<Enums.Aspect>());
      this.activeBulletin.afternoonAbove.setAvalancheProblem(undefined);
      if (this.activeBulletin.hasElevationDependency) {
        this.activeBulletin.afternoonBelow.setDangerRating(new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing));
        this.activeBulletin.afternoonBelow.setAspects(new Array<Enums.Aspect>());
        this.activeBulletin.afternoonBelow.setAvalancheProblem(undefined);
      }
    }
  }

  deselectBulletin() {
    if (!this.editRegions) {
      this.mapService.deselectAggregatedRegion();
      this.activeBulletin = undefined;
    }
  }

  private setTexts() {
    if (this.activeBulletin) {
      if (this.activeAvActivityHighlightsDe != undefined && this.activeAvActivityHighlightsDe != "")
        this.activeBulletin.setAvActivityHighlightsIn(this.activeAvActivityHighlightsDe, Enums.LanguageCode.de);
      if (this.activeAvActivityCommentDe != undefined && this.activeAvActivityCommentDe != "")
        this.activeBulletin.setAvActivityCommentIn(this.activeAvActivityCommentDe, Enums.LanguageCode.de);
      if (this.activeAvActivityHighlightsIt != undefined && this.activeAvActivityHighlightsIt != "")
        this.activeBulletin.setAvActivityHighlightsIn(this.activeAvActivityHighlightsIt, Enums.LanguageCode.it);
      if (this.activeAvActivityCommentIt != undefined && this.activeAvActivityCommentIt != "")
        this.activeBulletin.setAvActivityCommentIn(this.activeAvActivityCommentIt, Enums.LanguageCode.it);
      if (this.activeAvActivityHighlightsEn != undefined && this.activeAvActivityHighlightsEn != "")
        this.activeBulletin.setAvActivityHighlightsIn(this.activeAvActivityHighlightsEn, Enums.LanguageCode.en);
      if (this.activeAvActivityCommentEn != undefined && this.activeAvActivityCommentEn != "")
        this.activeBulletin.setAvActivityCommentIn(this.activeAvActivityCommentEn, Enums.LanguageCode.en);

      if (this.activeSnowpackStructureHighlightsDe != undefined && this.activeSnowpackStructureHighlightsDe != "")
        this.activeBulletin.setSnowpackStructureHighlightsIn(this.activeSnowpackStructureHighlightsDe, Enums.LanguageCode.de);
      if (this.activeSnowpackStructureCommentDe != undefined && this.activeSnowpackStructureCommentDe != "")
        this.activeBulletin.setSnowpackStructureCommentIn(this.activeSnowpackStructureCommentDe, Enums.LanguageCode.de);
      if (this.activeSnowpackStructureHighlightsIt != undefined && this.activeSnowpackStructureHighlightsIt != "")
        this.activeBulletin.setSnowpackStructureHighlightsIn(this.activeSnowpackStructureHighlightsIt, Enums.LanguageCode.it);
      if (this.activeSnowpackStructureCommentIt != undefined && this.activeSnowpackStructureCommentIt != "")
        this.activeBulletin.setSnowpackStructureCommentIn(this.activeSnowpackStructureCommentIt, Enums.LanguageCode.it);
      if (this.activeSnowpackStructureHighlightsEn != undefined && this.activeSnowpackStructureHighlightsEn != "")
        this.activeBulletin.setSnowpackStructureHighlightsIn(this.activeSnowpackStructureHighlightsEn, Enums.LanguageCode.en);
      if (this.activeSnowpackStructureCommentEn != undefined && this.activeSnowpackStructureCommentEn != "")
        this.activeBulletin.setSnowpackStructureCommentIn(this.activeSnowpackStructureCommentEn, Enums.LanguageCode.en);
    }
  }

  deleteBulletin(event, bulletin: BulletinModel) {
    event.stopPropagation();

    this.confirmationService.confirm({
      key: "deleteAggregatedRegionDialog",
      header: this.translateService.instant("bulletins.create.deleteAggregatedRegionDialog.header"),
      message: this.translateService.instant("bulletins.create.deleteAggregatedRegionDialog.message"),
      accept: () => {
        this.delBulletin(bulletin);

        // TODO unlock region (Tirol, Südtirol or Trentino) via socketIO

      }
    });
  }

  private delBulletin(bulletin: BulletinModel) {
    var index = this.bulletinsList.indexOf(bulletin);
    if (index > -1)
      this.bulletinsList.splice(index, 1);
    
    this.mapService.resetAggregatedRegions();
    this.updateMap();
    this.deselectBulletin();
  }

  editBulletin(event, bulletin: BulletinModel) {
    event.stopPropagation();

    // TODO lock whole day in TN, check if any aggregated region is locked

    this.editRegions = true;

    this.mapService.editAggregatedRegion(this.activeBulletin);
  }

  saveBulletin(event, bulletin) {
    event.stopPropagation();

    // save selected regions to active bulletin input
    let regions = this.mapService.getSelectedRegions();

    let oldRegionsHit = false;
    for (let region of this.activeBulletin.getSavedRegions()) {
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
      for (let region of this.activeBulletin.getSavedRegions())
        if (region.startsWith(this.authenticationService.getUserRegion()))
          oldSavedRegions.push(region);
      for (let region of oldSavedRegions) {
        let index = this.activeBulletin.getSavedRegions().indexOf(region);
        this.activeBulletin.getSavedRegions().splice(index, 1);
      }

      // delete old suggested regions outside own area
      let oldSuggestedRegions = new Array<String>();
      for (let region of this.activeBulletin.getSuggestedRegions())
        if (!region.startsWith(this.authenticationService.getUserRegion()))
          oldSuggestedRegions.push(region);
      for (let region of oldSuggestedRegions) {
        let index = this.activeBulletin.getSuggestedRegions().indexOf(region);
        this.activeBulletin.getSuggestedRegions().splice(index, 1);
      }

      for (let region of regions) {
        if (region.startsWith(this.authenticationService.getUserRegion())) {
          if (this.activeBulletin.getSavedRegions().indexOf(region) == -1)
            this.activeBulletin.getSavedRegions().push(region);
        } else {
          if ((this.activeBulletin.getSavedRegions().indexOf(region) == -1) && (this.activeBulletin.getSuggestedRegions().indexOf(region) == -1))
            this.activeBulletin.getSuggestedRegions().push(region);
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

    for (let bulletin of this.bulletinsList) {
      if (bulletin != this.activeBulletin) {
        // regions saved by me (only in own area possible)
        for (let region of this.activeBulletin.getSavedRegions()) {
          // region was saved in other aggregated region => delete
          let index = bulletin.getSavedRegions().indexOf(region);
          if (index != -1)
            bulletin.getSavedRegions().splice(index, 1);

          // region was suggested by other user (multiple suggestions possible for same region) => delete all)
          index = bulletin.getSuggestedRegions().indexOf(region);
          if (index != -1)
            bulletin.getSuggestedRegions().splice(index, 1);
        }

        // regions suggested by me (only in foreign area possible)
        // region was published => delete suggestion
        for (let region of bulletin.getPublishedRegions()) {
          let index = this.activeBulletin.getSuggestedRegions().indexOf(region);
          if (index != -1)
            this.activeBulletin.getSuggestedRegions().splice(index, 1);
        }
      }

      this.mapService.addAggregatedRegion(bulletin);

    }

    this.mapService.discardAggregatedRegion();
    this.mapService.selectAggregatedRegion(this.activeBulletin);
  }

  hasSuggestions(bulletin: BulletinModel) : boolean {
    for (let region of bulletin.getSuggestedRegions()) {
      if (region.startsWith(this.authenticationService.getUserRegion()))
        return true;
    }
    return false;
  }

  isCreator(bulletin: BulletinModel) : boolean {
    if (bulletin.getCreatorRegion() != undefined && bulletin.getCreatorRegion().startsWith(this.authenticationService.getUserRegion()))
        return true;
    return false;
  }

  discardBulletin(event, bulletin?: BulletinModel) {
    event.stopPropagation();
    this.editRegions = false;

    this.mapService.discardAggregatedRegion();
    this.mapService.selectAggregatedRegion(this.activeBulletin);

    // TODO unlock whole day in TN
  }

  getForenoonColor(bulletin: BulletinModel) {
    let dangerRating = bulletin.getForenoonDangerRatingAbove().toString();
    return this.getDangerRatingColor(dangerRating);
  }

  getAfternoonColor(bulletin: BulletinModel) {
    let dangerRating = "";
    if (bulletin.getAfternoonDangerRatingAbove())
      dangerRating = bulletin.getAfternoonDangerRatingAbove().toString();
    else
      dangerRating = bulletin.getForenoonDangerRatingAbove().toString();
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

    this.setTexts();

    let validFrom = new Date(this.bulletinsService.getActiveDate());
    let validUntil = new Date(this.bulletinsService.getActiveDate());
    validUntil.setTime(validUntil.getTime() + (24*60*60*1000));

    for (let bulletin of this.bulletinsList) {
      bulletin.setValidFrom(validFrom);
      bulletin.setValidUntil(validUntil);
    }

    if (this.bulletinsList.length > 0) {
      if (this.bulletinsService.getIsSmallChange()) {
        this.bulletinsService.changeBulletins(this.bulletinsList, this.bulletinsService.getActiveDate()).subscribe(
            data => {
              this.loading = false;
              this.goBack();
              console.log("Bulletins changed on server.");
            },
            error => {
              this.loading = false;
              console.error("Bulletins could not be changed on server!");
              this.confirmationService.confirm({
                key: "changeErrorDialog",
                header: this.translateService.instant("bulletins.create.changeErrorDialog.header"),
                message: this.translateService.instant("bulletins.create.changeErrorDialog.message"),
                accept: () => {
                }
              });
            }
        );
      } else {
        this.bulletinsService.saveBulletins(this.bulletinsList, this.bulletinsService.getActiveDate()).subscribe(
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
      this.discardBulletin(event);
    }
  }
}