import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { NewsModel } from '../models/news.model';
import { NewsService } from '../providers/news-service/news.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  templateUrl: 'news.component.html'
})
export class NewsComponent {

  private newsService : NewsService;
  private newsList: NewsModel[];

  constructor(
  	private translate: TranslateService,
	private news: NewsService,
  	private route: ActivatedRoute,
    private router: Router)
  {
  	this.newsService = news;
  	this.newsList = new Array<NewsModel>();

  	this.newsService.getNews().subscribe(
  	  data => {
        let response = data.json();

        for (let jsonNews of response) {
        	this.newsList.push(NewsModel.createFromJson(jsonNews));
        }
      },
      error => {
        console.error("News could not be loaded!");
        // TODO
      }
  	);
  }

  createNews() {
  	this.router.navigate(['/news/new']);
  }
}
