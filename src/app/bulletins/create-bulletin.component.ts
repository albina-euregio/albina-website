import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinsService } from '../providers/mock-service/bulletins.service';
import { BulletinModel } from '../models/bulletin.model';
import * as Enums from '../enums/enums';
import { MapService } from "../providers/map-service/map.service";

import "leaflet";

@Component({
  templateUrl: 'create-bulletin.component.html'
})
export class CreateBulletinComponent {

  public disabled: boolean;

  constructor(
  	private translate: TranslateService,
  	private route: ActivatedRoute,
    private router: Router,
    private bulletinsService: BulletinsService,
    private mapService: MapService)
  {
    this.disabled = false;
    if (this.bulletinsService.getActiveBulletin() != null && this.bulletinsService.getActiveBulletin() != undefined) {
      if (this.bulletinsService.getActiveBulletin().getStatus() == Enums.BulletinStatus.published || this.bulletinsService.getActiveBulletin().getStatus() == Enums.BulletinStatus.pending)
        this.disabled = true;
    }
  }

  ngOnInit() {
      let map = L.map("map", {
          zoomControl: false,
          center: L.latLng(46.65, 11.47),
          zoom: 8,
//            minZoom: 4,
          maxZoom: 19,
          layers: [this.mapService.baseMaps.Gdi_Winter]
      });

      L.control.zoom({ position: "topleft" }).addTo(map);
      L.control.layers(this.mapService.baseMaps).addTo(map);
      L.control.scale().addTo(map);

      this.mapService.map = map;
  }
    
  save() {

    let bulletin = new BulletinModel();

  	this.bulletinsService.saveBulletin(bulletin).subscribe(
  		data => {
  			console.log("Bulletin saved on server.");
  			// TODO show toast
  			this.router.navigate(['/bulletins/bulletins']);
  		},
  		error => {
  			console.error("Bulletin could not be saved on server!");
  			// TODO show toast
  		}
  	);
  }

  discard() {
    console.log("Bulletin: changes discarded.");
	  this.router.navigate(['/bulletins/bulletins']);
  }
}