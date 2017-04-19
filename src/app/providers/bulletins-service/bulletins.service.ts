import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { Observable } from 'rxjs/Observable';
import { BulletinModel } from '../../models/bulletin.model';
import * as Enums from '../../enums/enums';
import { RegionsService } from '../regions-service/regions.service';


@Injectable()
export class BulletinsService {

  constantsService: ConstantsService;
  regionsService: RegionsService;

  constructor(
    public http: Http,
    public constants: ConstantsService,
    public regions: RegionsService)
  {
    this.constantsService = constants;
    this.regionsService = regions;
  }

  getEuregioBulletins() : Observable<Response> {
    var regions = [ "AT-07", "IT-32-TN", "IT-32-BZ" ];
    return this.getBulletins(regions);
  }

  getBulletins(regions) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins?';
    for (let region of regions)
      url += 'regions=' + region + '&';
    console.log(url);
    let headers = new Headers({
      'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  getBulletin(id) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/' + id;
    console.log(url);
    let headers = new Headers({
      'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }
}

