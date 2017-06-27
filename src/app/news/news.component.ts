import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { SettingsService } from '../providers/settings-service/settings.service';
import { NewsModel } from '../models/news.model';
import { NewsService } from '../providers/news-service/news.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';

@Component({
  templateUrl: 'news.component.html'
})
export class NewsComponent {

  public newsList: NewsModel[];
  public newsStatus = Enums.NewsStatus;

  constructor(
  	private translate: TranslateService,
    private settingsService: SettingsService,
	  private newsService: NewsService,
  	private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService)
  {
  	this.newsList = new Array<NewsModel>();

  	this.newsService.getNews().subscribe(
  	  data => {
        let response = data.json();
        for (let jsonNews of response) {
        	this.newsList.push(NewsModel.createFromJson(jsonNews));
        }
        this.newsList.sort((a, b) : number => {
            if (a.date < b.date) return 1;
            if (a.date > b.date) return -1;
            return 0;
        });
      },
      error => {
        console.error("News could not be loaded!");
        // TODO
      }
  	);
  }

  createNews(item?: NewsModel) {
    if (item)
      this.newsService.setActiveNews(item);
    else
      this.newsService.setActiveNews(undefined);
    this.router.navigate(['/news/new']);
  }

  deleteNews(event, item: NewsModel) {
    event.stopPropagation();
    this.confirmationService.confirm({
      header: this.translate.instant("news.deleteNewsDialog.header"),
      message: this.translate.instant("news.deleteNewsDialog.message"),
      accept: () => {
        this.newsService.deleteNews(item).subscribe(
          data => {
            let index = this.newsList.indexOf(item);
            this.newsList.splice(index, 1);
            console.log("News deleted.");
          },
          error => {
            console.error("News could not be deleted!");
            // TODO
          }
        );
      }
    });
  }

  publishNews(event, item: NewsModel) {
    event.stopPropagation();
    this.confirmationService.confirm({
      header: this.translate.instant("news.publishNewsDialog.header"),
      message: this.translate.instant("news.publishNewsDialog.message"),
      accept: () => {
        this.newsService.publishNews(item).subscribe(
          data => {
            item.setStatus(Enums.NewsStatus.published);
            console.log("News published.");
          },
          error => {
            console.error("News could not be published!");
            // TODO
          }
        );
      }
    });
  }
}
