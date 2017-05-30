import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinsService } from '../providers/mock-service/bulletins.service';
import { BulletinModel } from '../models/bulletin.model';
import * as Enums from '../enums/enums';
import { MapService } from "../providers/map-service/map.service";
import { RegionsTN } from "../mock/regions.tn";
import { UUID } from 'angular2-uuid';
import 'rxjs/add/operator/switchMap';

import "leaflet";

@Component({
  templateUrl: 'create-bulletin.component.html'
})
export class CreateBulletinComponent {

  public aggregatedRegionsIds: String[];
  public aggregatedRegionsMap: Map<String, BulletinModel[]>;
  public activeAggregatedRegionId: string;

  public bulletinEditable: boolean;
  public hasDaytimeDependency: boolean;
  public hasAltitudeDependency: boolean;
  public altitude: number;

  public aspect: Enums.Aspect;
  public avalancheProblems: Enums.AvalancheProblem;
  public avalancheProblemValues = Object.keys(Enums.AvalancheProblem).filter( e => typeof( e ) == "number" );

  constructor(
  	private translate: TranslateService,
  	private route: ActivatedRoute,
    private router: Router,
    private bulletinsService: BulletinsService,
    private mapService: MapService)
  {
  }

  ngOnInit() {
    this.aggregatedRegionsMap = new Map<string, BulletinModel[]>();
    this.aggregatedRegionsIds = new Array<String>();
    this.activeAggregatedRegionId = undefined;
    this.hasAltitudeDependency = false;
    this.hasDaytimeDependency = false;

    // TODO get region from user info (role)
    let region = "IT-32-TN";
    if (this.bulletinsService.getStatus(region, this.bulletinsService.getActiveDate()) == Enums.BulletinStatus.published)
      this.bulletinEditable = false;
    else 
      this.bulletinEditable = true;

    this.bulletinsService.loadBulletins(this.bulletinsService.getActiveDate(), this.bulletinsService.getActiveDate()).subscribe(
      data => {
        let response = data.json();
        for (let jsonBulletin of response) {
          let bulletin = BulletinModel.createFromJson(jsonBulletin);
          if (bulletin.getElevation() > 0)
            this.hasAltitudeDependency = true;
          if (bulletin.getValidUntil().getHours() != 16)
            this.hasDaytimeDependency = true;
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
        //minZoom: 6,
        maxZoom: 12,
        layers: [this.mapService.baseMaps.OpenMapSurfer_Grayscale, this.mapService.overlayMaps.regionsBulletins]
    });

    L.control.zoom({ position: "topleft" }).addTo(map);
    //L.control.layers(this.mapService.baseMaps).addTo(map);
    L.control.scale().addTo(map);

    this.mapService.map = map;
  }

  ngOnDestroy() {
    this.bulletinsService.setActiveDate(undefined);
    // TODO unlock via socketIO
  }

  addBulletin(bulletin: BulletinModel) {
    if (this.aggregatedRegionsMap.has(bulletin.getAggregatedRegionId())) {
      this.aggregatedRegionsMap.get(bulletin.getAggregatedRegionId()).push(bulletin);
    } else {
      let bulletins = new Array<BulletinModel>();
      bulletins.push(bulletin);
      this.aggregatedRegionsMap.set(bulletin.getAggregatedRegionId(), bulletins);
      this.aggregatedRegionsIds.push(bulletin.getAggregatedRegionId());
    }
  }

  createAggregatedRegion() {
    // TODO lock region (Tirol, Südtirol or Trentino) via socketIO
    let uuid = UUID.UUID();
    this.aggregatedRegionsMap.set(uuid, []);
    this.activeAggregatedRegionId = uuid;
    this.aggregatedRegionsIds.push(uuid);
    // TODO create bulletin (change validity if daytime is selected)
    // this.mapService.createAggregatedRegion();
    // TODO show list of regions and aggregated regions (checkboxes)
  }

  selectAggregatedRegion(aggregatedRegionId: string) {
    // this.mapService.selectAggregatedRegion(aggregatedRegionId);
    this.activeAggregatedRegionId = aggregatedRegionId;
  }

  getAggregatedRegionsIds() {
    return this.aggregatedRegionsMap.keys();
  }

  getActiveAggregatedRegionId() {
    this.activeAggregatedRegionId;
  }

  deleteAggregatedRegion(aggregatedRegionId: string) {
    this.aggregatedRegionsMap.delete(aggregatedRegionId);

    // TODO delete id in aggregatedRegionsIds
    // TODO delete bulletins
    // this.mapService.deleteAggregatedRegion(bulletin);
    // TODO unlock region (Tirol, Südtirol or Trentino) via socketIO
  }

  save() {
    debugger
  	this.bulletinsService.saveBulletins().subscribe(
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
    console.log("Bulletin: changes discarded.");
	  this.router.navigate(['/bulletins/bulletins']);
  }
}