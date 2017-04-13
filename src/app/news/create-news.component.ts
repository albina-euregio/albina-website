import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';

@Component({
  templateUrl: 'create-news.component.html'
})
export class CreateNewsComponent {

  constructor(
  	translate: TranslateService
  ) { }

}
