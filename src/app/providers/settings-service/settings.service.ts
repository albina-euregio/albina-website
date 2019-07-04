import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Enums from '../../enums/enums';
import { EventEmitter } from '@angular/core';
import * as de from '../../../assets/i18n/de.json';
import * as en from '../../../assets/i18n/en.json';
import * as it from '../../../assets/i18n/it.json';


@Injectable()
export class SettingsService {

  public translateService;
  public lang: Enums.LanguageCode;
  public useMatrix: boolean;
  public showObservations: boolean;
  public showCaaml: boolean;
  public showJson: boolean;

  eventEmitter: EventEmitter<string> = new EventEmitter();
  
  constructor(
    public translate: TranslateService)
  {
    this.translateService = translate;

    translate.setTranslation('de', de);
    translate.setTranslation('en', en);
    translate.setTranslation('it', it);

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    let lang = navigator.language.split('-')[0];
    lang = /(de|it)/gi.test(lang) ? lang : 'de';
    translate.use(lang);
    this.lang = Enums.LanguageCode[lang];

    this.useMatrix = true;
    this.showObservations = false;
    this.showCaaml = false;
    this.showJson = false;
  }

  getLang() : Enums.LanguageCode {
    return this.lang;
  }

  setLang(lang: Enums.LanguageCode) {
    if (lang) {
      let language = /(de|it)/gi.test(Enums.LanguageCode[lang]) ? Enums.LanguageCode[lang] : 'de';
      this.translateService.use(language);
      this.lang = Enums.LanguageCode[language];

      //to reload iframe
      this.emitChangeEvent(this.lang);
    }
  }


  emitChangeEvent(number) {
    this.eventEmitter.emit(number);
  }
  getChangeEmitter() {
    return this.eventEmitter;
  }


  getLangString() : string {
    return Enums.LanguageCode[this.lang];
  }

  setLangString(lang: string) {
    let language = Enums.LanguageCode[lang];
    this.setLang(language);
    
  }

  getUseMatrix() : boolean {
    return this.useMatrix;
  }

  setUseMatrix(useMatrix: boolean) {
    this.useMatrix = useMatrix;
  }

  getShowObservations() : boolean {
    return this.showObservations;
  }

  setShowObservations(showObservations: boolean) {
    this.showObservations = showObservations;
  }

  getShowCaaml() : boolean {
    return this.showCaaml;
  }

  setShowCaaml(showCaaml: boolean) {
    this.showCaaml = showCaaml;
  }

  getShowJson() : boolean {
    return this.showJson;
  }

  setShowJson(showJson: boolean) {
    this.showJson = showJson;
  }
}