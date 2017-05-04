import { Injectable } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BulletinModel } from '../../models/bulletin.model';
import { MockBulletins } from '../../mock/bulletin.mock';
import { RegionsService } from './regions.service';
import * as Enums from '../../enums/enums';
import { RegionsTN } from '../../mock/regions.tn';


@Injectable()
export class BulletinsService {

  // The bulletin the user is currently working on in the detail view (problems, ...)
  private activeBulletin: BulletinModel;

  // Bulletins the user is currently working on (different aggregated regions)
  private bulletins: BulletinModel[];

  constructor(
    private regionsService: RegionsService)
  {
    this.bulletins = new Array<BulletinModel>();
    this.activeBulletin = undefined;
  }

  addBulletin() {
    let bulletin = new BulletinModel();
    this.bulletins.push(bulletin);
    this.selectBulletin(bulletin);
  }

  selectBulletin(bulletin: BulletinModel) {
    this.activeBulletin = bulletin;
  }

  deleteBulletin(bulletin: BulletinModel) {
    let index = -1;
    for (var i = this.bulletins.length - 1; i >= 0; i--) {
      if (this.bulletins[i].getId() == bulletin.getId())
        index = i;
    }

    if (index > -1)
      this.bulletins.splice(i, 1);
  }

  // TODO
  // Returns the status of the region at the given date
  getStatus(region: string, date: Date) : Enums.BulletinStatus {
/*
    let map = new Map<String, Enums.BulletinStatus>();

    // map of alle subregions of region where a bulletin is present and the corresponding status
    for (var i = this.bulletins.length - 1; i >= 0; i--) {
      // TODO check if the comparsion of date does work
      if (this.bulletins[i].getValidFrom().getDate() == date.getDate()) {
        let regions = this.bulletins[i].getRegions(); 
        for (var j = regions.length - 1; j >= 0; j--) {
          if (regions[j].startsWith(region))
            map.set(regions[j], this.bulletins[i].getStatus());
        }
      }
    }

    // TODO make it work
    let result = Enums.BulletinStatus.published;
    for (let i = this.regionsService.getRegionsTrentino().length - 1; i >= 0; i--) {
      let hit = false;
      for (let r in map.keys) {
        if (this.regionsService.getRegionsTrentino()[i].properties.id == r) {
          hit = true;

          // get status from map
          if (map.get(r) != Enums.BulletinStatus.published)
            return Enums.BulletinStatus.incomplete;
        }
      }
      if (!hit)
        return Enums.BulletinStatus.incomplete;
    }
    return result;
*/
    return Enums.BulletinStatus.incomplete;
  }

  getBulletins() : BulletinModel[] {
    return this.bulletins;
  }

  loadBulletins(from: Date, until: Date) : Observable<Response> {
    let response = new ResponseOptions({
      body: JSON.stringify(MockBulletins)
    });
    console.log('MOCK: Bulletins loaded!');
    return Observable.of(new Response(response));
  }

  saveBulletins() : Observable<Response> {
    let response = new ResponseOptions({
      status: 201,
    });
    console.log('MOCK: Bulletins saved!');
    return Observable.of(new Response(response));
  }

  getActiveBulletin() : BulletinModel {
    return this.activeBulletin;
  }

  setActiveBulletin(bulletin: BulletinModel) {
    this.activeBulletin = bulletin;
  }

  reset() {
    this.activeBulletin = undefined;
    this.bulletins = new Array<BulletinModel>();
  }
}