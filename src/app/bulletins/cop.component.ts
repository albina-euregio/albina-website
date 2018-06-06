import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { SettingsService } from '../providers/settings-service/settings.service';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { TextModel } from '../models/text.model';
import { BulletinModel } from '../models/bulletin.model';
import * as Enums from '../enums/enums';

//For iframe 
import { Renderer2 } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'cop',
  templateUrl: 'cop.component.html'
})

export class CopComponent {

  @Input() bulletin: BulletinModel;
  @Input() name: string;
  @Input() field: string;
  @Input() disabled: boolean;

  public showTranslations: boolean;
  public activeTextcat: string;
  public activeTextDe: string;
  public activeTextIt: string;
  public activeTextEn: string;
  public activeTextFr: string;
  
  constructor(
    private translateService: TranslateService,
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {
    this.stopListening = renderer.listen('window', 'message', this.getText.bind(this));
  }

  public pmUrl: SafeUrl;
  @ViewChild('receiver') receiver: ElementRef;
  stopListening: Function;
  display: boolean = false;
  eventSubscriber: Subscription;

  ngAfterViewInit() {
    this.init();
  }

  ngOnInit() {
    this.showTranslations = false;

    //for reload iframe on change language
    this.eventSubscriber = this.settingsService.getChangeEmitter().subscribe(
      item => this.pmUrl = this.sanitizer.bypassSecurityTrustResourceUrl("http://albina.clesius.it/textcat/c_pm.html?l=" + this.settingsService.getLangString())
    );

    //setting pm language for iframe
    this.pmUrl = this.sanitizer.bypassSecurityTrustResourceUrl("http://albina.clesius.it/textcat/c_pm.html?l=" + this.settingsService.getLangString());
  }

  ngOnDestroy() {
    this.eventSubscriber.unsubscribe();
  }

  init() {
    if (this.bulletin && this.bulletin != undefined) {
      switch (this.name) {
        case "avActivityHighlights":
          this.activeTextcat = this.bulletin.avActivityHighlightsTextcat;
          this.activeTextDe = this.bulletin.getAvActivityHighlightsIn(Enums.LanguageCode.de);
          this.activeTextIt = this.bulletin.getAvActivityHighlightsIn(Enums.LanguageCode.it);
          this.activeTextEn = this.bulletin.getAvActivityHighlightsIn(Enums.LanguageCode.en);
          this.activeTextFr = this.bulletin.getAvActivityHighlightsIn(Enums.LanguageCode.fr);
          break;
        case "avActivityComment":
          this.activeTextcat = this.bulletin.avActivityCommentTextcat;
          this.activeTextDe = this.bulletin.getAvActivityCommentIn(Enums.LanguageCode.de);
          this.activeTextIt = this.bulletin.getAvActivityCommentIn(Enums.LanguageCode.it);
          this.activeTextEn = this.bulletin.getAvActivityCommentIn(Enums.LanguageCode.en);
          this.activeTextFr = this.bulletin.getAvActivityCommentIn(Enums.LanguageCode.fr);
          break;
        case "snowpackStructureComment":
          this.activeTextcat = this.bulletin.snowpackStructureCommentTextcat;
          this.activeTextDe = this.bulletin.getSnowpackStructureCommentIn(Enums.LanguageCode.de);
          this.activeTextIt = this.bulletin.getSnowpackStructureCommentIn(Enums.LanguageCode.it);
          this.activeTextEn = this.bulletin.getSnowpackStructureCommentIn(Enums.LanguageCode.en);
          this.activeTextFr = this.bulletin.getSnowpackStructureCommentIn(Enums.LanguageCode.fr);
          break;
        case "tendencyComment":
          this.activeTextcat = this.bulletin.tendencyCommentTextcat;
          this.activeTextDe = this.bulletin.getTendencyCommentIn(Enums.LanguageCode.de);
          this.activeTextIt = this.bulletin.getTendencyCommentIn(Enums.LanguageCode.it);
          this.activeTextEn = this.bulletin.getTendencyCommentIn(Enums.LanguageCode.en);
          this.activeTextFr = this.bulletin.getTendencyCommentIn(Enums.LanguageCode.fr);
          break;
        
        default:
          break;
      }
    } else {
      this.activeTextcat = undefined;
      this.activeTextDe = undefined;
      this.activeTextIt = undefined;
      this.activeTextEn = undefined;
      this.activeTextFr = undefined;
    }
  }

  setShowTranslations() {
    if (this.showTranslations)
      this.showTranslations = false;
    else
      this.showTranslations = true;
  }


  openTextcat($event, field, l, textDef) {
    let receiver = this.receiver.nativeElement.contentWindow;
    $event.preventDefault()

    if (!textDef)
      textDef="";

    //make Json to send to pm
    let inputDef = {
      textField: field,
      textDef: textDef,
      srcLang: Enums.LanguageCode[l],
      currentLang: this.translateService.currentLang
    };

    let pmData = JSON.stringify(inputDef);
    receiver.postMessage(pmData, '*');

    this.showDialog();
  }

  getText(e) {
    e.preventDefault();
    if (e.data.type != "webpackInvalid" && e.data.type != "webpackOk") {
      let pmData = JSON.parse(e.data);

      this.activeTextcat = pmData.textDef;
      this.activeTextDe = pmData.textDe;
      this.activeTextIt = pmData.textIt;
      this.activeTextEn = pmData.textEn;
      this.activeTextFr = pmData.textFr;
      
      switch (this.name) {
        case "avActivityHighlights":
          this.bulletin.setAvActivityHighlightsTextcat(pmData.textDef);
          this.bulletin.setAvActivityHighlightsIn(pmData.textDe, Enums.LanguageCode.de);
          this.bulletin.setAvActivityHighlightsIn(pmData.textIt, Enums.LanguageCode.it);
          this.bulletin.setAvActivityHighlightsIn(pmData.textEn, Enums.LanguageCode.en);
          this.bulletin.setAvActivityHighlightsIn(pmData.textFr, Enums.LanguageCode.fr);
          break;
        case "avActivityComment":
          this.bulletin.setAvActivityCommentTextcat(pmData.textDef);
          this.bulletin.setAvActivityCommentIn(pmData.textDe, Enums.LanguageCode.de);
          this.bulletin.setAvActivityCommentIn(pmData.textIt, Enums.LanguageCode.it);
          this.bulletin.setAvActivityCommentIn(pmData.textEn, Enums.LanguageCode.en);
          this.bulletin.setAvActivityCommentIn(pmData.textFr, Enums.LanguageCode.fr);
          break;
        case "snowpackStructureComment":
          this.bulletin.setSnowpackStructureCommentTextcat(pmData.textDef);
          this.bulletin.setSnowpackStructureCommentIn(pmData.textDe, Enums.LanguageCode.de);
          this.bulletin.setSnowpackStructureCommentIn(pmData.textIt, Enums.LanguageCode.it);
          this.bulletin.setSnowpackStructureCommentIn(pmData.textEn, Enums.LanguageCode.en);
          this.bulletin.setSnowpackStructureCommentIn(pmData.textFr, Enums.LanguageCode.fr);
          break;
        case "tendencyComment":
          this.bulletin.setTendencyCommentTextcat(pmData.textDef);
          this.bulletin.setTendencyCommentIn(pmData.textDe, Enums.LanguageCode.de);
          this.bulletin.setTendencyCommentIn(pmData.textIt, Enums.LanguageCode.it);
          this.bulletin.setTendencyCommentIn(pmData.textEn, Enums.LanguageCode.en);
          this.bulletin.setTendencyCommentIn(pmData.textFr, Enums.LanguageCode.fr);
          break;
        
        default:
          break;
      }

      this.hideDialog();
    }
  }

  showDialog() {
    this.display = true;
  }

  hideDialog() {
    this.display = false;
  }
}
