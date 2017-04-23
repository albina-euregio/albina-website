import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response, ResponseOptions } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { Observable } from 'rxjs/Observable';
import { NewsModel } from '../../models/news.model';
import { MockNews } from '../../mock/news.mock';


@Injectable()
export class NewsMockService {

  constructor(
    public constantsService: ConstantsService,
    public authenticationService: AuthenticationService)
  {
  }

  getNews() : Observable<Response> {
    let response = new ResponseOptions({
      body: JSON.stringify(MockNews)
    });
    return Observable.of(new Response(response));
  }
}

