import { Injectable } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BulletinModel } from '../../models/bulletin.model';
import { MockBulletinsTNIncomplete } from '../../mock/bulletin.mock';
import { MockCaaml } from '../../mock/bulletin.mock';
import * as Enums from '../../enums/enums';

@Injectable()
export class BulletinsService {

  private activeDate: Date;
  private isEditable: boolean;

  constructor() {
    this.activeDate = undefined;
    this.isEditable = false;
  }

  getActiveDate() : Date {
    return this.activeDate;
  }

  setActiveDate(date: Date) {
    this.activeDate = date;
  }

  getIsEditable() : boolean {
    return this.isEditable;
  }

  setIsEditable(isEditable: boolean) {
    this.isEditable = isEditable;
  }
  
  // Get the status for one region (IT-32-TN, AT-07, ...) and one day
  getStatus(region: string, date: Date) : Observable<Response> {
    let tmpDate = new Date();

    if (date.getFullYear() == tmpDate.getFullYear() && date.getMonth() == tmpDate.getMonth() && date.getDate() == tmpDate.getDate())
      status = "draft";
    else if (date.getFullYear() > tmpDate.getFullYear() || date.getMonth() > tmpDate.getMonth())
      status = "missing";
    else if ((date.getMonth() == tmpDate.getMonth() && date.getDate() > tmpDate.getDate()))
      status = "missing";
    else
      status = "published";

    let response = new ResponseOptions({
      body: { "status" : status }
    });
    console.log('MOCK: Status loaded!');

    return Observable.of(new Response(response));
  }

  loadBulletins(from: Date) : Observable<Response> {
    // TODO load correct bulletins (from is the start at 00:00)
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

  loadCaamlBulletins(from: Date) : Observable<Response> {
    // TODO load correct caaml bulletins (from is the start at 00:00)
    let response;
    if (from.getDate() == (new Date()).getDate()) {
      response = new ResponseOptions({
        body: MockCaaml
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