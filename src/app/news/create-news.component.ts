import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { NewsModel } from '../models/news.model';
import { TextModel } from '../models/text.model';
import { NewsService } from '../providers/news-service/news.service';
import * as Enums from '../enums/enums';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';

@Component({
  templateUrl: 'create-news.component.html'
})
export class CreateNewsComponent {

  public disabled: boolean;

  public titleIt: string;
  public titleDe: string;
  public titleEn: string;
  public contentIt: string;
  public contentDe: string;
  public contentEn: string;

  constructor(
  	private translate: TranslateService,
  	private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private confirmationService: ConfirmationService)
  {
    this.disabled = false;

    if (this.newsService.getActiveNews() != null && this.newsService.getActiveNews() != undefined) {
      this.titleIt = this.newsService.getActiveNews().getTitleIn(Enums.LanguageCode.it);
      this.titleDe = this.newsService.getActiveNews().getTitleIn(Enums.LanguageCode.de);
      this.titleEn = this.newsService.getActiveNews().getTitleIn(Enums.LanguageCode.en);
      this.contentIt = this.newsService.getActiveNews().getContentIn(Enums.LanguageCode.it);
      this.contentDe = this.newsService.getActiveNews().getContentIn(Enums.LanguageCode.de);
      this.contentEn = this.newsService.getActiveNews().getContentIn(Enums.LanguageCode.en);

      if (this.newsService.getActiveNews().getStatus() == Enums.NewsStatus.published)
        this.disabled = true;
    }
  }

  save() {
  	let titleArray = new Array<TextModel>();
  	let titleIt = new TextModel();
  	titleIt.setLanguageCode(Enums.LanguageCode.it);
  	titleIt.setText(this.titleIt);
  	titleArray.push(titleIt);
  	let titleDe = new TextModel();
  	titleDe.setLanguageCode(Enums.LanguageCode.de);
  	titleDe.setText(this.titleDe);
  	titleArray.push(titleDe);
  	let titleEn = new TextModel();
  	titleEn.setLanguageCode(Enums.LanguageCode.en);
  	titleEn.setText(this.titleEn);
  	titleArray.push(titleEn);

  	let contentArray = new Array<TextModel>();
  	let contentIt = new TextModel();
  	contentIt.setLanguageCode(Enums.LanguageCode.it);
  	contentIt.setText(this.contentIt);
  	contentArray.push(contentIt);
  	let contentDe = new TextModel();
  	contentDe.setLanguageCode(Enums.LanguageCode.de);
  	contentDe.setText(this.contentDe);
  	contentArray.push(contentDe);
  	let contentEn = new TextModel();
  	contentEn.setLanguageCode(Enums.LanguageCode.en);
  	contentEn.setText(this.contentEn);
  	contentArray.push(contentEn);

    let news = new NewsModel();
    news.setTitle(titleArray);
  	news.setContent(contentArray);
  	news.setDate(new Date());
    
    if (this.newsService.getActiveNews() != undefined) {
      news.setId(this.newsService.getActiveNews().getId());
    	this.newsService.updateNews(news).subscribe(
    		data => {
    			console.log("News updated on server.");
          this.newsService.setActiveNews(undefined);

          // TODO show toast

    			this.router.navigate(['/news']);
    		},
    		error => {
    			console.error("News could not be updated on server!");

    			// TODO show toast

    		}
    	);
    } else {
      this.newsService.saveNews(news).subscribe(
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
  }

  discard() {
    this.confirmationService.confirm({
      header: this.translate.instant("news.create.discardDialog.header"),
      message: this.translate.instant("news.create.discardDialog.message"),
      accept: () => {
        this.goBack();
      }
    });
  }    

  goBack() {
    console.log("News: changes discarded.");
	  this.router.navigate(['/news']);
  }
}
