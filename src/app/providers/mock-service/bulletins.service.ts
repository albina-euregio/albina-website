import { Injectable } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BulletinModel } from '../../models/bulletin.model';
import { MockBulletinsTNIncomplete } from '../../mock/bulletin.mock';
import * as Enums from '../../enums/enums';

@Injectable()
export class BulletinsService {

  private activeDate: Date;

  constructor() {
    this.activeDate = undefined;
  }

  getActiveDate() : Date {
    return this.activeDate;
  }

  setActiveDate(date: Date) {
    this.activeDate = date;
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

    let today = new Date();
    today.setHours(0,0,0,0);

    let tmpDate = date;
    tmpDate.setHours(0,0,0,0);

    if (tmpDate < today)
      return Enums.BulletinStatus.published;
    else if (tmpDate > today)
      return Enums.BulletinStatus.missing;
    else
      return Enums.BulletinStatus.incomplete;
  }

//  getBulletins() : BulletinModel[] {
//    return this.bulletins;
//  }

  loadBulletins(from: Date, until: Date) : Observable<Response> {
    let response;
    if (from.getDate() == (new Date()).getDate()) {
      response = new ResponseOptions({
        body: JSON.stringify(MockBulletinsTNIncomplete)
      });
      console.log('MOCK: Bulletins loaded!');
    } else {
      response = new ResponseOptions({
        body: {}
      });
      console.log('MOCK: No bulletins loaded!');
    }
    return Observable.of(new Response(response));
  }

  saveBulletins() : Observable<Response> {
    let response = new ResponseOptions({
      status: 201,
    });
    console.log('MOCK: Bulletins saved!');
    return Observable.of(new Response(response));
  }

  saveOrUpdateBulletins(bulletins: BulletinModel[]) {
    let response = new ResponseOptions({
      status: 201,
    });
    console.log('MOCK: Bulletins saved!');
    return Observable.of(new Response(response));
  }
}