import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';


@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
	constructor(translate: TranslateService) {
		// this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        var lang = navigator.language.split('-')[0];
        translate.use(lang);
        console.log("Language set to: " + lang);
	}
}
