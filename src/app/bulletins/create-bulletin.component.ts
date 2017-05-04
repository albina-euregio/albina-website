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

  public bulletinEditable: boolean;
  public activeBulletin: BulletinModel;

  constructor(
  	private translate: TranslateService,
  	private route: ActivatedRoute,
    private router: Router,
    private bulletinsService: BulletinsService,
    private mapService: MapService)
  {
    // TODO check if bulletins are editable (not published yet)
    this.bulletinEditable = true;
  }

  ngOnInit() {
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
    // TODO unlock via socketIO
  }

  createAggregatedRegion() {
    // TODO lock region (Tirol, Südtirol or Trentino) via socketIO
    this.mapService.createAggregatedRegion();
    let bulletin = new BulletinModel();
    this.bulletinsService.addBulletin(bulletin);
    this.activeBulletin = bulletin;
    // TODO show list of regions and aggregated regions (checkboxes)
  }

  selectAggregatedRegion(bulletin: BulletinModel) {
    this.activeBulletin = bulletin;
    this.mapService.selectAggregatedRegion(bulletin);
  }

  deleteAggregatedRegion(bulletin: BulletinModel) {
    if (this.activeBulletin && this.activeBulletin.getInternalId() == bulletin.getInternalId())
      this.activeBulletin = undefined;
    this.mapService.deleteAggregatedRegion(bulletin);
    this.bulletinsService.deleteBulletin(bulletin);
    // TODO unlock region (Tirol, Südtirol or Trentino) via socketIO
    // TODO send newly created region via socketIO
  }

  save() {
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
	  this.router.navigate(['/bulletins/bulletins']);
  }
}