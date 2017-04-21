import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { NewsModel } from '../models/news.model';
import { TextModel } from '../models/text.model';
import { NewsService } from '../providers/news-service/news.service';
import * as Enums from '../enums/enums';

@Component({
  templateUrl: 'create-news.component.html'
})
export class CreateNewsComponent {

  @Input() activeNews: NewsModel;
  private newsService: NewsService;
  private titleIT: string;
  private titleDE: string;
  private titleEN: string;
  private contentIT: string;
  private contentDE: string;
  private contentEN: string;

  constructor(
  	private translate: TranslateService,
  	private route: ActivatedRoute,
    private router: Router,
    private news: NewsService)
  {
  	this.activeNews = new NewsModel();
  	this.newsService = news;
  }

  save() {
  	let titleArray = new Array<TextModel>();
  	let titleIT = new TextModel();
  	titleIT.setLanguageCode(Enums.LanguageCode.it);
  	titleIT.setText(this.titleIT);
  	titleArray.push(titleIT);
  	let titleDE = new TextModel();
  	titleDE.setLanguageCode(Enums.LanguageCode.de);
  	titleDE.setText(this.titleDE);
  	titleArray.push(titleDE);
  	let titleEN = new TextModel();
  	titleEN.setLanguageCode(Enums.LanguageCode.en);
  	titleEN.setText(this.titleEN);
  	titleArray.push(titleEN);

  	let contentArray = new Array<TextModel>();
  	let contentIT = new TextModel();
  	contentIT.setLanguageCode(Enums.LanguageCode.it);
  	contentIT.setText(this.contentIT);
  	contentArray.push(contentIT);
  	let contentDE = new TextModel();
  	contentDE.setLanguageCode(Enums.LanguageCode.de);
  	contentDE.setText(this.contentDE);
  	contentArray.push(contentDE);
  	let contentEN = new TextModel();
  	contentEN.setLanguageCode(Enums.LanguageCode.en);
  	contentEN.setText(this.contentEN);
  	contentArray.push(contentEN);

  	this.activeNews.setTitle(titleArray);
  	this.activeNews.setContent(contentArray);
  	this.activeNews.setDate(new Date());

  	this.newsService.saveNews(this.activeNews).subscribe(
  		data => {
  			console.log("News saved on server.");
  			// TODO show toast
  			this.router.navigate(['/news']);
  		},
  		error => {
  			console.error("News could not be saved on server!");
  			// TODO show toast
  		}
  	);
  }

  discard() {
	this.router.navigate(['/news']);
  }
}
