import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ServerService {

  constantsService: ConstantsService;

  constructor(
    public http: Http,
    public constants: ConstantsService)
  {
    this.constantsService = constants;
  }

  getNews() : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'news';
    console.log(url);
    let headers = new Headers({
      'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  findNews(searchString : String) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'news/search?s=' + searchString;
    console.log(url);
    let headers = new Headers({
      'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }
}

