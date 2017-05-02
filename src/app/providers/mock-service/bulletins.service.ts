import { Injectable } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BulletinModel } from '../../models/bulletin.model';
import { MockBulletins } from '../../mock/bulletin.mock';


@Injectable()
export class BulletinsService {


  private activeBulletin: BulletinModel;

  constructor()
  {
    this.activeBulletin = undefined;
  }

  getEuregioBulletins() : Observable<Response> {
    var regions = [ "AT-07", "IT-32-TN", "IT-32-BZ" ];
    return this.getBulletins(regions);
  }

  getBulletins(regions) : Observable<Response> {
    let response = new ResponseOptions({
      body: JSON.stringify(MockBulletins)
    });
    console.log('MOCK: Bulletins loaded!');
    return Observable.of(new Response(response));
  }

  saveBulletin(bulletin: BulletinModel) : Observable<Response> {
    let response = new ResponseOptions({
      status: 201
    });
    this.activeBulletin = undefined;
    console.log('MOCK: Bulletin saved!');
    return Observable.of(new Response(response));
  }

  getActiveBulletin() : BulletinModel {
    return this.activeBulletin;
  }

  setActiveBulletin(bulletin: BulletinModel) {
    this.activeBulletin = bulletin;
  }
}