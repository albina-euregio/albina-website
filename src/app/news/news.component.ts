import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { SettingsService } from '../providers/settings-service/settings.service';
import { NewsModel } from '../models/news.model';
import { NewsMockService } from '../providers/mock-service/news.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  templateUrl: 'news.component.html'
})
export class NewsComponent {

  private newsList: NewsModel[];

  constructor(
  	private translate: TranslateService,
    private settingsService: SettingsService,
	  private newsService: NewsMockService,
  	private route: ActivatedRoute,
    private router: Router)
  {
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
