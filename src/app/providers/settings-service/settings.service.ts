import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import * as Enums from '../../enums/enums';

@Injectable()
export class SettingsService {

  public translateService;
  public lang: Enums.LanguageCode;

  constructor(
    public translate: TranslateService)
  {
    this.translateService = translate;

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    let lang = navigator.language.split('-')[0];
    lang = /(de|it)/gi.test(lang) ? lang : 'de';
    translate.use(lang);
    this.lang = Enums.LanguageCode[lang];
  }

  getLang() : Enums.LanguageCode {
    return this.lang;
  }

  setLang(lang: Enums.LanguageCode) {
    if (lang) {
      let language = /(de|it)/gi.test(Enums.LanguageCode[lang]) ? Enums.LanguageCode[lang] : 'de';
      this.translateService.use(language);
      this.lang = Enums.LanguageCode[language];
    }
  }

  getLangString() : string {
    return Enums.LanguageCode[this.lang];
  }

  setLangString(lang: string) {
    let language = Enums.LanguageCode[lang];
    this.setLang(language);
  }
}