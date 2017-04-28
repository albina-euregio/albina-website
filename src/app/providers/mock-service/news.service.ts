import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response, ResponseOptions } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { AuthenticationService } from '../mock-service/authentication.service';
import { Observable } from 'rxjs/Observable';
import { NewsModel } from '../../models/news.model';
import { MockNews } from '../../mock/news.mock';


@Injectable()
export class NewsService {

  private activeNews: NewsModel;

  constructor(
    public constantsService: ConstantsService,
    public authenticationService: AuthenticationService)
  {
    this.activeNews = undefined;
  }

  getNews() : Observable<Response> {
    let response = new ResponseOptions({
      body: JSON.stringify(MockNews)
    });
    console.log('MOCK: News loaded!');
    return Observable.of(new Response(response));
  }

  saveNews(news: NewsModel) : Observable<Response> {
    let response = new ResponseOptions({
      status: 201
    });
    this.activeNews = undefined;
    console.log('MOCK: News saved!');
    return Observable.of(new Response(response));
  }

  updateNews(id: string, news: NewsModel) {
    let response = new ResponseOptions({
      status: 201
    });
    console.log('MOCK: News updated!');
    return Observable.of(new Response(response));
  }

  setActiveNews(news: NewsModel) {
    this.activeNews = news;
  }

  getActiveNews() : NewsModel {
    return this.activeNews;
  }
}

