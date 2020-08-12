import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as Enums from "../../enums/enums";
import { EventEmitter } from "@angular/core";


@Injectable()
export class SettingsService {

  public translateService: TranslateService;
  public lang: Enums.LanguageCode;
  public useMatrix: boolean;
  public showObservations: boolean;
  public showCaaml: boolean;
  public showJson: boolean;

  eventEmitter: EventEmitter<string> = new EventEmitter();

  constructor(
    public translate: TranslateService) {
    this.translateService = translate;
    // lang
    this.translateService.addLangs(["de", "it", "en", "fr", "es", "ca", "oc"]);

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang("en");
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    const lang = navigator.language.split("-")[0] as any as Enums.LanguageCode;
    this.setLang(lang);

    this.useMatrix = true;
    this.showObservations = false;
    this.showCaaml = false;
    this.showJson = false;
  }

  getLang(): Enums.LanguageCode {
    return this.lang;
  }

  setLang(lang: Enums.LanguageCode) {
    if (lang) {
      let language = Enums.LanguageCode[lang];
      if (this.translateService.langs.indexOf(language) < 0) {
        language = "de";
      }
      this.translateService.use(language);
      this.lang = Enums.LanguageCode[language];

      // to reload iframe
      this.emitChangeEvent(this.lang);
    }
  }


  emitChangeEvent(number) {
    this.eventEmitter.emit(number);
  }
  getChangeEmitter() {
    return this.eventEmitter;
  }


  getLangString(): string {
    return Enums.LanguageCode[this.lang];
  }

  setLangString(lang: string) {
    const language = Enums.LanguageCode[lang];
    this.setLang(language);

  }

  getUseMatrix(): boolean {
    return this.useMatrix;
  }

  setUseMatrix(useMatrix: boolean) {
    this.useMatrix = useMatrix;
  }

  getShowObservations(): boolean {
    return this.showObservations;
  }

  setShowObservations(showObservations: boolean) {
    this.showObservations = showObservations;
  }

  getShowCaaml(): boolean {
    return this.showCaaml;
  }

  setShowCaaml(showCaaml: boolean) {
    this.showCaaml = showCaaml;
  }

  getShowJson(): boolean {
    return this.showJson;
  }

  setShowJson(showJson: boolean) {
    this.showJson = showJson;
  }
}
