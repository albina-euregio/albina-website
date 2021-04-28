import { BulletinDaytimeDescriptionModel } from "./bulletin-daytime-description.model";
import { TextModel } from "./text.model";
import { AuthorModel } from "./author.model";
import * as Enums from "../enums/enums";

export class BulletinModel {
  public id: string;

  public author: AuthorModel;
  public additionalAuthors: String[];
  public ownerRegion: String;

  public publicationDate: Date;

  public validFrom: Date;
  public validUntil: Date;

  public suggestedRegions: String[];
  public savedRegions: String[];
  public publishedRegions: String[];

  public hasDaytimeDependency: boolean;

  public forenoon: BulletinDaytimeDescriptionModel;
  public afternoon: BulletinDaytimeDescriptionModel;

  public highlightsTextcat: string;
  public avActivityHighlightsTextcat: string;
  public avActivityCommentTextcat: string;
  public snowpackStructureHighlightsTextcat: string;
  public snowpackStructureCommentTextcat: string;
  public tendencyCommentTextcat: string;

  public avActivityHighlightsNotes: string;
  public avActivityCommentNotes: string;
  public snowpackStructureHighlightsNotes: string;
  public snowpackStructureCommentNotes: string;
  public tendencyCommentNotes: string;

  public highlights: TextModel[];
  public avActivityHighlights: TextModel[];
  public avActivityComment: TextModel[];
  public snowpackStructureHighlights: TextModel[];
  public snowpackStructureComment: TextModel[];
  public tendencyComment: TextModel[];

  public tendency: Enums.Tendency;

  public dangerPattern1: Enums.DangerPattern;
  public dangerPattern2: Enums.DangerPattern;

  static createFromJson(json) {
    const bulletin = new BulletinModel();

    bulletin.setId(json.id);
    bulletin.setAuthor(AuthorModel.createFromJson(json.author));
    const jsonAdditionalAuthors = json.additionalAuthors;
    const additionalAuthors = new Array<String>();
    for (const i in jsonAdditionalAuthors) {
      if (jsonAdditionalAuthors[i] !== null) {
        additionalAuthors.push(jsonAdditionalAuthors[i]);
      }
    }
    bulletin.setAdditionalAuthors(additionalAuthors);

    if (json.ownerRegion) {
      bulletin.setOwnerRegion(json.ownerRegion);
    }

    if (json.publicationDate) {
      bulletin.setPublicationDate(new Date(json.publicationDate));
    }

    bulletin.setValidFrom(new Date(json.validity.from));
    bulletin.setValidUntil(new Date(json.validity.until));

    const jsonSuggestedRegions = json.suggestedRegions;
    const suggestedRegions = new Array<String>();
    for (const i in jsonSuggestedRegions) {
      if (jsonSuggestedRegions[i] !== null) {
        suggestedRegions.push(jsonSuggestedRegions[i]);
      }
    }
    bulletin.setSuggestedRegions(suggestedRegions);

    const jsonSavedRegions = json.savedRegions;
    const savedRegions = new Array<String>();
    for (const i in jsonSavedRegions) {
     if (jsonSavedRegions[i] !== null) {
       savedRegions.push(jsonSavedRegions[i]);
     }
    }
    bulletin.setSavedRegions(savedRegions);

    const jsonPublishedRegions = json.publishedRegions;
    const publishedRegions = new Array<String>();
    for (const i in jsonPublishedRegions) {
      if (jsonPublishedRegions[i] !== null) {
        publishedRegions.push(jsonPublishedRegions[i]);
      }
    }
    bulletin.setPublishedRegions(publishedRegions);

    bulletin.setHasDaytimeDependency(json.hasDaytimeDependency);

    if (json.forenoon) {
      bulletin.setForenoon(BulletinDaytimeDescriptionModel.createFromJson(json.forenoon));
    }
    if (json.afternoon) {
      bulletin.setAfternoon(BulletinDaytimeDescriptionModel.createFromJson(json.afternoon));
    }

    if (json.highlightsTextcat) {
      bulletin.setHighlightsTextcat(json.highlightsTextcat);
    }
    const jsonHighlights = json.highlights;
    const highlights = new Array<TextModel>();
    for (const i in jsonHighlights) {
      if (jsonHighlights[i] !== null) {
        highlights.push(TextModel.createFromJson(jsonHighlights[i]));
      }
    }
    bulletin.setHighlights(highlights);

    if (json.avActivityHighlightsTextcat) {
      bulletin.setAvActivityHighlightsTextcat(json.avActivityHighlightsTextcat);
    }
    const jsonAvActivityHighlights = json.avActivityHighlights;
    const avActivityHighlights = new Array<TextModel>();
    for (const i in jsonAvActivityHighlights) {
      if (jsonAvActivityHighlights[i] !== null) {
        avActivityHighlights.push(TextModel.createFromJson(jsonAvActivityHighlights[i]));
      }
    }
    bulletin.setAvActivityHighlights(avActivityHighlights);
    if (json.avActivityHighlightsNotes) {
      bulletin.setAvActivityHighlightsNotes(json.avActivityHighlightsNotes);
    }

    if (json.avActivityCommentTextcat) {
      bulletin.setAvActivityCommentTextcat(json.avActivityCommentTextcat);
    }
    const jsonAvActivityComment = json.avActivityComment;
    const avActivityComment = new Array<TextModel>();
    for (const i in jsonAvActivityComment) {
      if (jsonAvActivityComment[i] !== null) {
        avActivityComment.push(TextModel.createFromJson(jsonAvActivityComment[i]));
      }
    }
    bulletin.setAvActivityComment(avActivityComment);
    if (json.avActivityCommentNotes) {
      bulletin.setAvActivityCommentNotes(json.avActivityCommentNotes);
    }

    if (json.snowpackStructureHighlightsTextcat) {
      bulletin.setSnowpackStructureHighlightsTextcat(json.snowpackStructureHighlightsTextcat);
    }
    const jsonSnowpackStructureHighlight = json.snowpackStructureHighlights;
    const snowpackStructureHighlights = new Array<TextModel>();
    for (const i in jsonSnowpackStructureHighlight) {
      if (jsonSnowpackStructureHighlight[i] !== null) {
        snowpackStructureHighlights.push(TextModel.createFromJson(jsonSnowpackStructureHighlight[i]));
      }
    }
    bulletin.setSnowpackStructureHighlight(snowpackStructureHighlights);
    if (json.snowpackStructureHighlightsNotes) {
      bulletin.setSnowpackStructureHighlightsNotes(json.SnowpackStructureHighlightsNotes);
    }

    if (json.snowpackStructureCommentTextcat) {
      bulletin.setSnowpackStructureCommentTextcat(json.snowpackStructureCommentTextcat);
    }
    const jsonSnowpackStructureComment = json.snowpackStructureComment;
    const snowpackStructureComment = new Array<TextModel>();
    for (const i in jsonSnowpackStructureComment) {
      if (jsonSnowpackStructureComment[i] !== null) {
        snowpackStructureComment.push(TextModel.createFromJson(jsonSnowpackStructureComment[i]));
      }
    }
    bulletin.setSnowpackStructureComment(snowpackStructureComment);
    if (json.snowpackStructureCommentNotes) {
      bulletin.setSnowpackStructureCommentNotes(json.snowpackStructureCommentNotes);
    }

    if (json.tendencyCommentTextcat) {
      bulletin.setTendencyCommentTextcat(json.tendencyCommentTextcat);
    }
    const jsonTendencyComment = json.tendencyComment;
    const tendencyComment = new Array<TextModel>();
    for (const i in jsonTendencyComment) {
      if (jsonTendencyComment[i] !== null) {
        tendencyComment.push(TextModel.createFromJson(jsonTendencyComment[i]));
      }
    }
    bulletin.setTendencyComment(tendencyComment);
    if (json.tendencyCommentNotes) {
      bulletin.setTendencyCommentNotes(json.tendencyCommentNotes);
    }

    if (json.tendency) {
      bulletin.setTendency(json.tendency);
    }

    if (json.dangerPattern1) {
      bulletin.setDangerPattern1(json.dangerPattern1);
    }
    if (json.dangerPattern2) {
      bulletin.setDangerPattern2(json.dangerPattern2);
    }

    return bulletin;
  }

  constructor(bulletin?: BulletinModel) {
    this.author = undefined;
    this.publicationDate = undefined;
    if (bulletin) {
      this.additionalAuthors = bulletin.additionalAuthors;
      this.ownerRegion = bulletin.ownerRegion;
      this.validFrom = bulletin.validFrom;
      this.validUntil = bulletin.validUntil;
      this.suggestedRegions = bulletin.suggestedRegions;
      this.savedRegions = bulletin.savedRegions;
      this.publishedRegions = bulletin.publishedRegions;
      this.forenoon = new BulletinDaytimeDescriptionModel(bulletin.forenoon);
      this.afternoon = new BulletinDaytimeDescriptionModel(bulletin.afternoon);
      this.highlightsTextcat = bulletin.highlightsTextcat;
      this.avActivityHighlightsTextcat = bulletin.avActivityHighlightsTextcat;
      this.avActivityCommentTextcat = bulletin.avActivityCommentTextcat;
      this.snowpackStructureHighlightsTextcat = bulletin.snowpackStructureHighlightsTextcat;
      this.snowpackStructureCommentTextcat = bulletin.snowpackStructureCommentTextcat;
      this.tendencyCommentTextcat = bulletin.tendencyCommentTextcat;
      this.avActivityHighlightsNotes = bulletin.avActivityHighlightsNotes;
      this.avActivityCommentNotes = bulletin.avActivityCommentNotes;
      this.snowpackStructureHighlightsNotes = bulletin.snowpackStructureHighlightsNotes;
      this.snowpackStructureCommentNotes = bulletin.snowpackStructureCommentNotes;
      this.tendencyCommentNotes = bulletin.tendencyCommentNotes;

      let array = new Array<TextModel>();
      for (const entry of bulletin.highlights) {
        array.push(TextModel.createFromJson(entry.toJson()));
      }
      this.highlights = array;

      array = new Array<TextModel>();
      for (const entry of bulletin.avActivityHighlights) {
        array.push(TextModel.createFromJson(entry.toJson()));
      }
      this.avActivityHighlights = array;

      array = new Array<TextModel>();
      for (const entry of bulletin.avActivityComment) {
        array.push(TextModel.createFromJson(entry.toJson()));
      }
      this.avActivityComment = array;

      array = new Array<TextModel>();
      for (const entry of bulletin.snowpackStructureHighlights) {
        array.push(TextModel.createFromJson(entry.toJson()));
      }
      this.snowpackStructureHighlights = array;

      array = new Array<TextModel>();
      for (const entry of bulletin.snowpackStructureComment) {
        array.push(TextModel.createFromJson(entry.toJson()));
      }
      this.snowpackStructureComment = array;

      array = new Array<TextModel>();
      for (const entry of bulletin.tendencyComment) {
        array.push(TextModel.createFromJson(entry.toJson()));
      }
      this.tendencyComment = array;

      this.tendency = bulletin.tendency;
      this.dangerPattern1 = bulletin.dangerPattern1;
      this.dangerPattern2 = bulletin.dangerPattern2;
      this.hasDaytimeDependency = bulletin.hasDaytimeDependency;
    } else {
      this.additionalAuthors = new Array<String>();
      this.ownerRegion = undefined;
      this.validFrom = undefined;
      this.validUntil = undefined;
      this.suggestedRegions = new Array<String>();
      this.savedRegions = new Array<String>();
      this.publishedRegions = new Array<String>();
      this.forenoon = new BulletinDaytimeDescriptionModel();
      this.afternoon = new BulletinDaytimeDescriptionModel();
      this.highlightsTextcat = undefined;
      this.avActivityHighlightsTextcat = undefined;
      this.avActivityCommentTextcat = undefined;
      this.snowpackStructureHighlightsTextcat = undefined;
      this.snowpackStructureCommentTextcat = undefined;
      this.tendencyCommentTextcat = undefined;
      this.avActivityHighlightsNotes = undefined;
      this.avActivityCommentNotes = undefined;
      this.snowpackStructureHighlightsNotes = undefined;
      this.snowpackStructureCommentNotes = undefined;
      this.tendencyCommentNotes = undefined;
      this.highlights = new Array<TextModel>();
      this.avActivityHighlights = new Array<TextModel>();
      this.avActivityComment = new Array<TextModel>();
      this.snowpackStructureHighlights = new Array<TextModel>();
      this.snowpackStructureComment = new Array<TextModel>();
      this.tendencyComment = new Array<TextModel>();
      this.tendency = undefined;
      this.dangerPattern1 = undefined;
      this.dangerPattern2 = undefined;
      this.hasDaytimeDependency = false;
    }
  }

  getId(): string {
    return this.id;
  }

  setId(id: string) {
    this.id = id;
  }

  getAuthor(): AuthorModel {
    return this.author;
  }

  setAuthor(author: AuthorModel) {
    this.author = author;
  }

  getAdditionalAuthors(): String[] {
    return this.additionalAuthors;
  }

  setAdditionalAuthors(additionalAuthors: String[]) {
    this.additionalAuthors = additionalAuthors;
  }

  addAdditionalAuthor(author: string) {
    if (this.additionalAuthors.indexOf(author) < 0) {
      this.additionalAuthors.push(author);
    }
  }

  getOwnerRegion() {
    return this.ownerRegion;
  }

  setOwnerRegion(ownerRegion: String) {
    this.ownerRegion = ownerRegion;
  }

  getPublicationDate() {
    return this.publicationDate;
  }

  setPublicationDate(publicationDate: Date) {
    this.publicationDate = publicationDate;
  }

  getValidFrom(): Date {
    return this.validFrom;
  }

  setValidFrom(validFrom: Date) {
    this.validFrom = validFrom;
  }

  getValidUntil(): Date {
    return this.validUntil;
  }

  setValidUntil(validUntil: Date) {
    this.validUntil = validUntil;
  }

  getSuggestedRegions(): String[] {
    return this.suggestedRegions;
  }

  setSuggestedRegions(suggestedRegions: String[]) {
    this.suggestedRegions = suggestedRegions;
  }

  getSavedRegions(): String[] {
    return this.savedRegions;
  }

  setSavedRegions(savedRegions: String[]) {
    this.savedRegions = savedRegions;
  }

  getPublishedRegions(): String[] {
    return this.publishedRegions;
  }

  setPublishedRegions(publishedRegions: String[]) {
    this.publishedRegions = publishedRegions;
  }

  getHasDaytimeDependency() {
    return this.hasDaytimeDependency;
  }

  setHasDaytimeDependency(hasDaytimeDependency: boolean) {
    this.hasDaytimeDependency = hasDaytimeDependency;
  }

  getForenoon(): BulletinDaytimeDescriptionModel {
    return this.forenoon;
  }

  setForenoon(forenoon: BulletinDaytimeDescriptionModel) {
    this.forenoon = forenoon;
  }

  getAfternoon(): BulletinDaytimeDescriptionModel {
    return this.afternoon;
  }

  setAfternoon(afternoon: BulletinDaytimeDescriptionModel) {
    this.afternoon = afternoon;
  }

  getAvActivityCommentTextcat(): string {
    return this.avActivityCommentTextcat;
  }

  setAvActivityCommentTextcat(avActivityCommentTextcat: string) {
    this.avActivityCommentTextcat = avActivityCommentTextcat;
  }

  getSnowpackStructureHighlightsTextcat(): string {
    return this.snowpackStructureHighlightsTextcat;
  }

  setSnowpackStructureHighlightsTextcat(snowpackStructureHighlightsTextcat: string) {
    this.snowpackStructureHighlightsTextcat = snowpackStructureHighlightsTextcat;
  }

  getSnowpackStructureCommentTextcat(): string {
    return this.snowpackStructureCommentTextcat;
  }

  setSnowpackStructureCommentTextcat(snowpackStructureCommentTextcat: string) {
    this.snowpackStructureCommentTextcat = snowpackStructureCommentTextcat;
  }

  getTendencyCommentTextcat(): string {
    return this.tendencyCommentTextcat;
  }

  setTendencyCommentTextcat(tendencyCommentTextcat: string) {
    this.tendencyCommentTextcat = tendencyCommentTextcat;
  }

  getAvActivityHighlightsTextcat(): string {
    return this.avActivityHighlightsTextcat;
  }

  setAvActivityHighlightsTextcat(avActivityHighlightsTextcat: string) {
    this.avActivityHighlightsTextcat = avActivityHighlightsTextcat;
  }

  getAvActivityHighlightsNotes(): string {
    return this.avActivityHighlightsNotes;
  }

  setAvActivityHighlightsNotes(avActivityHighlightsNotes: string) {
    this.avActivityHighlightsNotes = avActivityHighlightsNotes;
  }

  getAvActivityCommentNotes(): string {
    return this.avActivityCommentNotes;
  }

  setAvActivityCommentNotes(avActivityCommentNotes: string) {
    this.avActivityCommentNotes = avActivityCommentNotes;
  }

  getSnowpackStructureHighlightsNotes(): string {
    return this.snowpackStructureHighlightsNotes;
  }

  setSnowpackStructureHighlightsNotes(snowpackStructureHighlightsNotes: string) {
    this.snowpackStructureHighlightsNotes = snowpackStructureHighlightsNotes;
  }

  getSnowpackStructureCommentNotes(): string {
    return this.snowpackStructureCommentNotes;
  }

  setSnowpackStructureCommentNotes(snowpackStructureCommentNotes: string) {
    this.snowpackStructureCommentNotes = snowpackStructureCommentNotes;
  }

  getTendencyCommentNotes(): string {
    return this.tendencyCommentNotes;
  }

  setTendencyCommentNotes(tendencyCommentNotes: string) {
    this.tendencyCommentNotes = tendencyCommentNotes;
  }

  getHighlightsTextcat(): string {
    return this.highlightsTextcat;
  }

  setHighlightsTextcat(highlightsTextcat: string) {
    this.highlightsTextcat = highlightsTextcat;
  }

  getHighlights(): TextModel[] {
    return this.highlights;
  }

  getHighlightsIn(language: Enums.LanguageCode): string {
    for (let i = this.highlights.length - 1; i >= 0; i--) {
      if (this.highlights[i].getLanguageCode() === language) {
        return this.highlights[i].getText();
      }
    }
  }

  getHighlightsInString(language: string): string {
    return this.getHighlightsIn(Enums.LanguageCode[language]);
  }

  setHighlights(highlights: TextModel[]) {
    this.highlights = highlights;
  }

  setHighlightsIn(text: string, language: Enums.LanguageCode) {
    for (let i = this.highlights.length - 1; i >= 0; i--) {
      if (this.highlights[i].getLanguageCode() === language) {
        this.highlights[i].setText(text);
        return;
      }
    }
    const model = new TextModel();
    model.setLanguageCode(language);
    model.setText(text);
    this.highlights.push(model);
  }

  getAvActivityHighlights(): TextModel[] {
    return this.avActivityHighlights;
  }

  getAvActivityHighlightsIn(language: Enums.LanguageCode): string {
    for (let i = this.avActivityHighlights.length - 1; i >= 0; i--) {
      if (this.avActivityHighlights[i].getLanguageCode() === language) {
        return this.avActivityHighlights[i].getText();
      }
    }
  }

  getAvActivityHighlightsInString(language: string): string {
    return this.getAvActivityHighlightsIn(Enums.LanguageCode[language]);
  }

  setAvActivityHighlights(avActivityHighlights: TextModel[]) {
    this.avActivityHighlights = avActivityHighlights;
  }

  setAvActivityHighlightsIn(text: string, language: Enums.LanguageCode) {
    for (let i = this.avActivityHighlights.length - 1; i >= 0; i--) {
      if (this.avActivityHighlights[i].getLanguageCode() === language) {
        this.avActivityHighlights[i].setText(text);
        return;
      }
    }
    const model = new TextModel();
    model.setLanguageCode(language);
    model.setText(text);
    this.avActivityHighlights.push(model);
  }

  getAvActivityComment(): TextModel[] {
    return this.avActivityComment;
  }

  getAvActivityCommentIn(language: Enums.LanguageCode): string {
    for (let i = this.avActivityComment.length - 1; i >= 0; i--) {
      if (this.avActivityComment[i].getLanguageCode() === language) {
        return this.avActivityComment[i].getText();
      }
    }
  }

  setAvActivityComment(avActivityComment: TextModel[]) {
    this.avActivityComment = avActivityComment;
  }

  setAvActivityCommentIn(text: string, language: Enums.LanguageCode) {
    for (let i = this.avActivityComment.length - 1; i >= 0; i--) {
      if (this.avActivityComment[i].getLanguageCode() === language) {
        this.avActivityComment[i].setText(text);
        return;
      }
    }
    const model = new TextModel();
    model.setLanguageCode(language);
    model.setText(text);
    this.avActivityComment.push(model);
  }

  getTendency() {
    return this.tendency;
  }

  setTendency(tendency: Enums.Tendency) {
    this.tendency = tendency;
  }

  getDangerPattern1() {
    return this.dangerPattern1;
  }

  setDangerPattern1(dangerPattern: Enums.DangerPattern) {
    this.dangerPattern1 = dangerPattern;
  }

  getDangerPattern2() {
    return this.dangerPattern2;
  }

  setDangerPattern2(dangerPattern: Enums.DangerPattern) {
    this.dangerPattern2 = dangerPattern;
  }

  getSnowpackStructureHighlightIn(language: Enums.LanguageCode): string {
    for (let i = this.snowpackStructureHighlights.length - 1; i >= 0; i--) {
      if (this.snowpackStructureHighlights[i].getLanguageCode() === language) {
        return this.snowpackStructureHighlights[i].getText();
      }
    }
  }

  getSnowpackStructureHighlightInString(language: string): string {
    return this.getSnowpackStructureHighlightIn(Enums.LanguageCode[language]);
  }

  setSnowpackStructureHighlight(snowpackStructureHighlights: TextModel[]) {
    this.snowpackStructureHighlights = snowpackStructureHighlights;
  }

  setSnowpackStructureHighlightsIn(text: string, language: Enums.LanguageCode) {
    for (let i = this.snowpackStructureHighlights.length - 1; i >= 0; i--) {
      if (this.snowpackStructureHighlights[i].getLanguageCode() === language) {
        this.snowpackStructureHighlights[i].setText(text);
        return;
      }
    }
    const model = new TextModel();
    model.setLanguageCode(language);
    model.setText(text);
    this.snowpackStructureHighlights.push(model);
  }

  getSnowpackStructureComment(): TextModel[] {
    return this.snowpackStructureComment;
  }

  getSnowpackStructureCommentIn(language: Enums.LanguageCode): string {
    for (let i = this.snowpackStructureComment.length - 1; i >= 0; i--) {
      if (this.snowpackStructureComment[i].getLanguageCode() === language) {
        return this.snowpackStructureComment[i].getText();
      }
    }
  }

  setSnowpackStructureComment(snowpackStructureComment: TextModel[]) {
    this.snowpackStructureComment = snowpackStructureComment;
  }

  setSnowpackStructureCommentIn(text: string, language: Enums.LanguageCode) {
    for (let i = this.snowpackStructureComment.length - 1; i >= 0; i--) {
      if (this.snowpackStructureComment[i].getLanguageCode() === language) {
        this.snowpackStructureComment[i].setText(text);
        return;
      }
    }
    const model = new TextModel();
    model.setLanguageCode(language);
    model.setText(text);
    this.snowpackStructureComment.push(model);
  }

  getTendencyComment(): TextModel[] {
    return this.tendencyComment;
  }

  getTendencyCommentIn(language: Enums.LanguageCode): string {
    for (let i = this.tendencyComment.length - 1; i >= 0; i--) {
      if (this.tendencyComment[i].getLanguageCode() === language) {
        return this.tendencyComment[i].getText();
      }
    }
  }

  setTendencyComment(tendencyComment: TextModel[]) {
    this.tendencyComment = tendencyComment;
  }

  setTendencyCommentIn(text: string, language: Enums.LanguageCode) {
    for (let i = this.tendencyComment.length - 1; i >= 0; i--) {
      if (this.tendencyComment[i].getLanguageCode() === language) {
        this.tendencyComment[i].setText(text);
        return;
      }
    }
    const model = new TextModel();
    model.setLanguageCode(language);
    model.setText(text);
    this.tendencyComment.push(model);
  }

  getForenoonDangerRatingAbove(): Enums.DangerRating {
    return this.forenoon.dangerRatingAbove.getValue();
  }

  getAfternoonDangerRatingAbove(): Enums.DangerRating {
    const test: any = this.afternoon.dangerRatingAbove.getValue();
    if (this.hasDaytimeDependency && this.afternoon && this.afternoon.dangerRatingAbove && test !== "missing") {
      return this.afternoon.dangerRatingAbove.getValue();
    } else {
      return this.forenoon.dangerRatingAbove.getValue();
    }
  }

  getForenoonDangerRatingBelow(): Enums.DangerRating {
    if (this.forenoon.hasElevationDependency) {
      return this.forenoon.dangerRatingBelow.getValue();
    } else {
      return this.getForenoonDangerRatingAbove();
    }
  }

  getAfternoonDangerRatingBelow(): Enums.DangerRating {
    if (this.hasDaytimeDependency) {
      if (this.afternoon.hasElevationDependency) {
        const test: any = this.afternoon.dangerRatingBelow.getValue();
        if (this.afternoon && this.afternoon.dangerRatingBelow && test !== "missing") {
          return this.afternoon.dangerRatingBelow.getValue();
        } else {
          return this.forenoon.dangerRatingBelow.getValue();
        }
      } else {
        return this.getAfternoonDangerRatingAbove();
      }
    } else {
      return this.getForenoonDangerRatingBelow();
    }
  }

  toJson() {
    const json = Object();

    if (this.id && this.id !== undefined) {
      json["id"] = this.id;
    }
    if (this.author && this.author !== undefined) {
      json["author"] = this.author.toJson();
    }
    if (this.additionalAuthors && this.additionalAuthors.length > 0) {
      const additionalAuthors = [];
      for (let i = 0; i <= this.additionalAuthors.length - 1; i++) {
        additionalAuthors.push(this.additionalAuthors[i]);
      }
      json["additionalAuthors"] = additionalAuthors;
    }

    if (this.ownerRegion && this.ownerRegion !== undefined) {
      json["ownerRegion"] = this.ownerRegion;
    }

    if (this.publicationDate && this.publicationDate !== undefined) {
      json["publicationDate"] = this.getISOStringWithTimezoneOffsetUrlEncoded(this.publicationDate);
    }

    const validity = Object();
    if (this.validFrom && this.validFrom !== undefined) {
      validity["from"] = this.getISOStringWithTimezoneOffsetUrlEncoded(this.validFrom);
    }
    if (this.validUntil && this.validUntil !== undefined) {
      validity["until"] = this.getISOStringWithTimezoneOffsetUrlEncoded(this.validUntil);
    }
    json["validity"] = validity;

    if (this.suggestedRegions && this.suggestedRegions.length > 0) {
      const suggestedRegions = [];
      for (let i = 0; i <= this.suggestedRegions.length - 1; i++) {
        suggestedRegions.push(this.suggestedRegions[i]);
      }
      json["suggestedRegions"] = suggestedRegions;
    }

    if (this.savedRegions && this.savedRegions.length > 0) {
      const savedRegions = [];
      for (let i = 0; i <= this.savedRegions.length - 1; i++) {
        savedRegions.push(this.savedRegions[i]);
      }
      json["savedRegions"] = savedRegions;
    }

    if (this.publishedRegions && this.publishedRegions.length > 0) {
      const publishedRegions = [];
      for (let i = 0; i <= this.publishedRegions.length - 1; i++) {
        publishedRegions.push(this.publishedRegions[i]);
      }
      json["publishedRegions"] = publishedRegions;
    }

    if (this.hasDaytimeDependency) {
      json["hasDaytimeDependency"] = true;
    } else {
      json["hasDaytimeDependency"] = false;
    }

    if (this.forenoon && this.forenoon !== undefined) {
      json["forenoon"] = this.forenoon.toJson();
    }

    if (this.hasDaytimeDependency && this.afternoon && this.afternoon !== undefined) {
      json["afternoon"] = this.afternoon.toJson();
    }

    if (this.highlightsTextcat && this.highlightsTextcat !== undefined) {
      json["highlightsTextcat"] = this.highlightsTextcat;
    }

    if (this.avActivityHighlightsTextcat && this.avActivityHighlightsTextcat !== undefined) {
      json["avActivityHighlightsTextcat"] = this.avActivityHighlightsTextcat;
    }

    if (this.avActivityCommentTextcat && this.avActivityCommentTextcat !== undefined) {
      json["avActivityCommentTextcat"] = this.avActivityCommentTextcat;
    }

    if (this.snowpackStructureHighlightsTextcat && this.snowpackStructureHighlightsTextcat !== undefined) {
      json["snowpackStructureHighlightsTextcat"] = this.snowpackStructureHighlightsTextcat;
    }

    if (this.snowpackStructureCommentTextcat && this.snowpackStructureCommentTextcat !== undefined) {
      json["snowpackStructureCommentTextcat"] = this.snowpackStructureCommentTextcat;
    }

    if (this.tendencyCommentTextcat && this.tendencyCommentTextcat !== undefined) {
      json["tendencyCommentTextcat"] = this.tendencyCommentTextcat;
    }

    if (this.avActivityHighlightsNotes && this.avActivityHighlightsNotes !== undefined) {
      json["avActivityHighlightsNotes"] = this.avActivityHighlightsNotes;
    }

    if (this.avActivityCommentNotes && this.avActivityCommentNotes !== undefined) {
      json["avActivityCommentNotes"] = this.avActivityCommentNotes;
    }

    if (this.snowpackStructureHighlightsNotes && this.snowpackStructureHighlightsNotes !== undefined) {
      json["snowpackStructureHighlightsNotes"] = this.snowpackStructureHighlightsNotes;
    }

    if (this.snowpackStructureCommentNotes && this.snowpackStructureCommentNotes !== undefined) {
      json["snowpackStructureCommentNotes"] = this.snowpackStructureCommentNotes;
    }

    if (this.tendencyCommentNotes && this.tendencyCommentNotes !== undefined) {
      json["tendencyCommentNotes"] = this.tendencyCommentNotes;
    }

    if (this.highlights && this.highlights !== undefined && this.highlights.length > 0) {
      const highlight = [];
      for (let i = 0; i <= this.highlights.length - 1; i++) {
        highlight.push(this.highlights[i].toJson());
      }
      json["highlights"] = highlight;
    }

    if (this.avActivityHighlights && this.avActivityHighlights !== undefined && this.avActivityHighlights.length > 0) {
      const highlight = [];
      for (let i = 0; i <= this.avActivityHighlights.length - 1; i++) {
        highlight.push(this.avActivityHighlights[i].toJson());
      }
      json["avActivityHighlights"] = highlight;
    }
    if (this.avActivityComment && this.avActivityComment !== undefined && this.avActivityComment.length > 0) {
      const comment = [];
      for (let i = 0; i <= this.avActivityComment.length - 1; i++) {
        comment.push(this.avActivityComment[i].toJson());
      }
      json["avActivityComment"] = comment;
    }

    if (this.snowpackStructureHighlights && this.snowpackStructureHighlights !== undefined && this.snowpackStructureHighlights.length > 0) {
      const highlight = [];
      for (let i = 0; i <= this.snowpackStructureHighlights.length - 1; i++) {
        highlight.push(this.snowpackStructureHighlights[i].toJson());
      }
      json["snowpackStructureHighlights"] = highlight;
    }
    if (this.snowpackStructureComment && this.snowpackStructureComment !== undefined && this.snowpackStructureComment.length > 0) {
      const comment = [];
      for (let i = 0; i <= this.snowpackStructureComment.length - 1; i++) {
        comment.push(this.snowpackStructureComment[i].toJson());
      }
      json["snowpackStructureComment"] = comment;
    }

    if (this.tendencyComment && this.tendencyComment !== undefined && this.tendencyComment.length > 0) {
      const comment = [];
      for (let i = 0; i <= this.tendencyComment.length - 1; i++) {
        comment.push(this.tendencyComment[i].toJson());
      }
      json["tendencyComment"] = comment;
    }

    if (this.tendency && this.tendency !== undefined) {
      json["tendency"] = this.tendency;
    }

    if (this.dangerPattern1 && this.dangerPattern1 !== undefined) {
      json["dangerPattern1"] = this.dangerPattern1;
    }

    if (this.dangerPattern2 && this.dangerPattern2 !== undefined) {
      json["dangerPattern2"] = this.dangerPattern2;
    }

    return json;
  }

  private getISOStringWithTimezoneOffsetUrlEncoded(date: Date) {
    const offset = -date.getTimezoneOffset();
    const dif = offset >= 0 ? "+" : "-";

    return date.getFullYear() +
      "-" + this.extend(date.getMonth() + 1) +
      "-" + this.extend(date.getDate()) +
      "T" + this.extend(date.getHours()) +
      ":" + this.extend(date.getMinutes()) +
      ":" + this.extend(date.getSeconds()) +
      dif + this.extend(offset / 60) +
      ":" + this.extend(offset % 60);
  }

  private extend(num: number) {
    const norm = Math.abs(Math.floor(num));
    return (norm < 10 ? "0" : "") + norm;
  }
}
