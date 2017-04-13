import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';


@Injectable()
export class SettingsService {

  public translateService;
  public lang;

  constructor(
    public translate: TranslateService)
  {
    this.translateService = translate;

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.lang = navigator.language.split('-')[0];
    this.lang = /(en|de)/gi.test(this.lang) ? this.lang : 'en';
    translate.use(this.lang);
    console.log("Language set to: " + this.lang);
  }

  getLang() {
    return this.lang;
  }

  setLang(lang) {
    if (lang) {
      lang = /(en|de)/gi.test(lang) ? lang : 'en';
      this.translateService.use(lang);
      this.lang = lang;
    }
  }
}