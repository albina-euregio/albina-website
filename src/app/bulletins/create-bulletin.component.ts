import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinsService } from '../providers/mock-service/bulletins.service';
import { BulletinModel } from '../models/bulletin.model';
import * as Enums from '../enums/enums';
import { MapService } from "../providers/map-service/map.service";
import { RegionsTN } from "../mock/regions.tn";

import "leaflet";

@Component({
  templateUrl: 'create-bulletin.component.html'
})
export class CreateBulletinComponent {

  public aggregatedRegionSelected: boolean;
  public bulletinEditable: boolean;

  constructor(
  	private translate: TranslateService,
  	private route: ActivatedRoute,
    private router: Router,
    private bulletinsService: BulletinsService,
    private mapService: MapService)
  {
    this.aggregatedRegionSelected = false;
    this.bulletinEditable = true;
    if (this.bulletinsService.getActiveBulletin() != null && this.bulletinsService.getActiveBulletin() != undefined) {
      if (this.bulletinsService.getActiveBulletin().getStatus() == Enums.BulletinStatus.published || this.bulletinsService.getActiveBulletin().getStatus() == Enums.BulletinStatus.pending)
        this.bulletinEditable = false;
    }
  }

  ngOnInit() {
      let map = L.map("map", {
          zoomControl: false,
          center: L.latLng(46.65, 11.47),
          zoom: 7,
          //minZoom: 6,
          maxZoom: 12,
          layers: [this.mapService.baseMaps.Gdi_Winter, this.mapService.overlayMaps.regionsBulletins]
      });

      L.control.zoom({ position: "topleft" }).addTo(map);
      L.control.scale().addTo(map);

      this.mapService.map = map;
  }

  ngOnDestroy() {
    // TODO unlock via socketIO
  }

  createAggregatedRegion() {
    // TODO lock region (Tirol, Südtirol or Trentino) via socketIO
    this.mapService.createAggregatedRegion();
    this.bulletinsService.addBulletin();
    // TODO show list of regions and aggregated regions (checkboxes)
  }

  selectAggregatedRegion(bulletin: BulletinModel) {
    this.aggregatedRegionSelected = true;
    this.bulletinsService.setActiveBulletin(bulletin);
    this.mapService.selectAggregatedRegion(bulletin);
  }

  saveAggregatedRegion() {
    // TODO create new aggregated region with selected regions
    this.mapService.saveAggregatedRegion();

    this.aggregatedRegionSelected = false;
    // TODO unlock region (Tirol, Südtirol or Trentino) via socketIO
    // TODO send newly created region via socketIO
  }

  discardAggregatedRegion() {
    this.mapService.discardAggregatedRegion();
    this.aggregatedRegionSelected = false;
    // TODO reset selected regions
    // TODO unlock region (Tirol, Südtirol or Trentino) via socketIO
  }

  deleteAggregatedRegion(bulletin: BulletinModel) {
    this.mapService.deleteAggregatedRegion(bulletin);
    this.bulletinsService.deleteBulletin(bulletin);
    this.aggregatedRegionSelected = false;
    // TODO unlock region (Tirol, Südtirol or Trentino) via socketIO
    // TODO send newly created region via socketIO
  }

  save() {
    this.aggregatedRegionSelected = false;

  	this.bulletinsService.saveBulletins().subscribe(
  		data => {
        this.bulletinsService.reset();
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
    this.bulletinsService.reset();
    console.log("Bulletin: changes discarded.");
    this.aggregatedRegionSelected = false;
	  this.router.navigate(['/bulletins/bulletins']);
  }
}