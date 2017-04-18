import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class BulletinsService {

  constantsService: ConstantsService;

  constructor(
    public http: Http,
    public constants: ConstantsService)
  {
    this.constantsService = constants;
  }

  getBulletins() : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins';
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

