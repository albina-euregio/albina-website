import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { Observable } from 'rxjs/Observable';
import { NewsModel } from '../../models/news.model';


@Injectable()
export class NewsService {

  private activeNews: NewsModel;

  constructor(
    public http: Http,
    public constantsService: ConstantsService,
    public authenticationService: AuthenticationService)
  {
    this.activeNews = undefined;
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

  saveNews(news: NewsModel) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'news';
    console.log(url);
    let authHeader = 'Bearer' + this.authenticationService.getToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify(news.toJson());
    console.log(body);
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options);
  }

  setActiveNews(news: NewsModel) {
    this.activeNews = news;
  }

  getActiveNews() : NewsModel {
    return this.activeNews;
  }
}

