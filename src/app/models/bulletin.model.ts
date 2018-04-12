import { BulletinElevationDescriptionModel } from "./bulletin-elevation-description.model";
import { TextModel } from './text.model';
import * as Enums from '../enums/enums';

export class BulletinModel {
	public id: string;

	public creator: string;
	public creatorRegion: string;

	public publicationDate: Date;

	public validFrom: Date;
	public validUntil: Date;

	public suggestedRegions: String[];
	public savedRegions: String[];
	public publishedRegions: String[];

	public hasElevationDependency: boolean;
	public hasDaytimeDependency: boolean;

	public elevation: number;
	public treeline: boolean;

	public forenoonAbove: BulletinElevationDescriptionModel;
	public forenoonBelow: BulletinElevationDescriptionModel;
	public afternoonAbove: BulletinElevationDescriptionModel;
	public afternoonBelow: BulletinElevationDescriptionModel;

	public avActivityCommentTextcat: string;
	public snowpackStructureHighlightsTextcat: string;
	public snowpackStructureCommentTextcat: string;
	public tendencyCommentTextcat: string;

	public avActivityHighlightsTextcat: TextModel[];
	public avActivityHighlights: TextModel[];
	public avActivityComment: TextModel[];

	public snowpackStructureHighlights: TextModel[];
	public snowpackStructureComment: TextModel[];

	public tendencyComment: TextModel[];

	public tendency: Enums.Tendency;

	public dangerPattern1: Enums.DangerPattern;
	public dangerPattern2: Enums.DangerPattern;

	constructor(bulletin?: BulletinModel) {
		this.creator = undefined;
		this.creatorRegion = undefined;
		this.publicationDate = undefined;
		if (bulletin) {
			this.validFrom = bulletin.validFrom;
			this.validUntil = bulletin.validUntil;
			this.suggestedRegions = bulletin.suggestedRegions;
			this.savedRegions = bulletin.savedRegions;
			this.publishedRegions = bulletin.publishedRegions;
			this.forenoonAbove = new BulletinElevationDescriptionModel(bulletin.forenoonAbove);
			this.forenoonBelow = new BulletinElevationDescriptionModel(bulletin.forenoonBelow);
			this.afternoonAbove = new BulletinElevationDescriptionModel(bulletin.afternoonAbove);
			this.afternoonBelow = new BulletinElevationDescriptionModel(bulletin.afternoonBelow);
			this.avActivityHighlightsTextcat = bulletin.avActivityHighlightsTextcat;
			this.avActivityCommentTextcat = bulletin.avActivityCommentTextcat;
			this.snowpackStructureHighlightsTextcat = bulletin.snowpackStructureHighlightsTextcat;
			this.snowpackStructureCommentTextcat = bulletin.snowpackStructureCommentTextcat;
			this.tendencyCommentTextcat = bulletin.tendencyCommentTextcat;
			this.avActivityHighlights = bulletin.avActivityHighlights;
			this.avActivityComment = bulletin.avActivityComment;
			this.snowpackStructureHighlights = bulletin.snowpackStructureHighlights;
			this.snowpackStructureComment = bulletin.snowpackStructureComment;
			this.tendencyComment = bulletin.tendencyComment;
			this.tendency = bulletin.tendency;
			this.dangerPattern1 = bulletin.dangerPattern1;
			this.dangerPattern2 = bulletin.dangerPattern2;
			this.elevation = bulletin.elevation;
			this.treeline = bulletin.treeline;
			this.hasDaytimeDependency = bulletin.hasDaytimeDependency;
			this.hasElevationDependency = bulletin.hasElevationDependency;
		} else {
			this.validFrom = undefined;
			this.validUntil = undefined;
			this.suggestedRegions = new Array<String>();
			this.savedRegions = new Array<String>();
			this.publishedRegions = new Array<String>();
			this.forenoonAbove = new BulletinElevationDescriptionModel();
			this.forenoonBelow = new BulletinElevationDescriptionModel();
			this.afternoonAbove = new BulletinElevationDescriptionModel();
			this.afternoonBelow = new BulletinElevationDescriptionModel();
			this.avActivityHighlightsTextcat = undefined;
			this.avActivityCommentTextcat = undefined;
			this.snowpackStructureHighlightsTextcat = undefined;
			this.getSnowpackStructureCommentTextcat = undefined;
			this.tendencyCommentTextcat = undefined;
			this.snowpackStructureHighlights = undefined;
			this.snowpackStructureComment = undefined;
			this.avActivityHighlights = new Array<TextModel>();
			this.avActivityComment = new Array<TextModel>();
			this.snowpackStructureHighlights = new Array<TextModel>();
			this.snowpackStructureComment = new Array<TextModel>();
			this.tendencyComment = new Array<TextModel>();
			this.tendency = undefined;
			this.dangerPattern1 = undefined;
			this.dangerPattern2 = undefined;
			this.elevation = undefined;
			this.treeline = false;
			this.hasDaytimeDependency = false;
			this.hasElevationDependency = false;
		}
	}

	getId(): string {
		return this.id;
	}

	setId(id: string) {
		this.id = id;
	}

	getCreator(): string {
		return this.creator;
	}

	setCreator(creator: string) {
		this.creator = creator;
	}

	getCreatorRegion(): string {
		return this.creatorRegion;
	}

	setCreatorRegion(creatorRegion: string) {
		this.creatorRegion = creatorRegion;
	}

	getPublicationDate() {
		return this.publicationDate;
	}

	setPublicationDate(publicationDate: Date) {
		this.publicationDate = publicationDate;
	}

	getValidFrom(): Date {
		return this.validFrom
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

	getElevation(): number {
		return this.elevation
	}

	setElevation(elevation: number) {
		this.elevation = elevation;
	}

	getTreeline(): boolean {
		return this.treeline
	}

	setTreeline(treeline: boolean) {
		this.treeline = treeline;
	}

	getHasElevationDependency() {
		return this.hasElevationDependency;
	}

	setHasElevationDependency(hasElevationDependency: boolean) {
		this.hasElevationDependency = hasElevationDependency;
	}

	getHasDaytimeDependency() {
		return this.hasDaytimeDependency;
	}

	setHasDaytimeDependency(hasDaytimeDependency: boolean) {
		this.hasDaytimeDependency = hasDaytimeDependency;
	}

	getForenoonAbove(): BulletinElevationDescriptionModel {
		return this.forenoonAbove
	}

	setForenoonAbove(forenoonAbove: BulletinElevationDescriptionModel) {
		this.forenoonAbove = forenoonAbove;
	}

	getForenoonBelow(): BulletinElevationDescriptionModel {
		return this.forenoonBelow
	}

	setForenoonBelow(forenoonBelow: BulletinElevationDescriptionModel) {
		this.forenoonBelow = forenoonBelow;
	}

	getAfternoonAbove(): BulletinElevationDescriptionModel {
		return this.afternoonAbove
	}

	setAfternoonAbove(afternoonAbove: BulletinElevationDescriptionModel) {
		this.afternoonAbove = afternoonAbove;
	}

	getAfternoonBelow(): BulletinElevationDescriptionModel {
		return this.afternoonBelow
	}

	setAfternoonBelow(afternoonBelow: BulletinElevationDescriptionModel) {
		this.afternoonBelow = afternoonBelow;
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




	getAvActivityHighlightsTextcat(): TextModel[] {
		return this.avActivityHighlightsTextcat;
	}

	getAvActivityHighlightsTextcatIn(language: Enums.LanguageCode, srcLang: string): string {
		if (this.avActivityHighlightsTextcat) {
			for (var i = this.avActivityHighlightsTextcat.length - 1; i >= 0; i--) {
				if (this.avActivityHighlightsTextcat[i].getLanguageCode() == language)
					return this.avActivityHighlightsTextcat[i].getText();
			}
		}
		else
		{
			let model = new TextModel();
			model.setLanguageCode(Enums.LanguageCode[srcLang]);
			model.setText("");
			let avActivityHighlightsTextcat = new Array<TextModel>();
			avActivityHighlightsTextcat.push(model);
			this.setAvActivityHighlightsTextcat(avActivityHighlightsTextcat);
		}
	}

/*
	getAvActivityHighlightsTextcatInString(language: string): string {
		return this.getAvActivityHighlightsTextcatIn(Enums.LanguageCode[language]);
	}
*/

	setAvActivityHighlightsTextcat(avActivityHighlightsTextcat: TextModel[]) {
		this.avActivityHighlightsTextcat = avActivityHighlightsTextcat;
	}

	setAvActivityHighlightsTextcatIn(text: string, language: Enums.LanguageCode) {
		for (var i = this.avActivityHighlightsTextcat.length - 1; i >= 0; i--) {
			if (this.avActivityHighlightsTextcat[i].getLanguageCode() == language) {
				this.avActivityHighlightsTextcat[i].setText(text);
				return;
			}
		}
		let model = new TextModel();
		model.setLanguageCode(language);
		model.setText(text);
		this.avActivityHighlightsTextcat.push(model);
	}

	getAvActivityHighlights(): TextModel[] {
		return this.avActivityHighlights;
	}

	getAvActivityHighlightsIn(language: Enums.LanguageCode): string {
		for (var i = this.avActivityHighlights.length - 1; i >= 0; i--) {
			if (this.avActivityHighlights[i].getLanguageCode() == language)
				return this.avActivityHighlights[i].getText();
		}
	}

	getAvActivityHighlightsInString(language: string): string {
		return this.getAvActivityHighlightsIn(Enums.LanguageCode[language]);
	}

	setAvActivityHighlights(avActivityHighlights: TextModel[]) {
		this.avActivityHighlights = avActivityHighlights;
	}

	setAvActivityHighlightsIn(text: string, language: Enums.LanguageCode) {
		for (var i = this.avActivityHighlights.length - 1; i >= 0; i--) {
			if (this.avActivityHighlights[i].getLanguageCode() == language) {
				this.avActivityHighlights[i].setText(text);
				return;
			}
		}
		let model = new TextModel();
		model.setLanguageCode(language);
		model.setText(text);
		this.avActivityHighlights.push(model);
	}

	getAvActivityComment(): TextModel[] {
		return this.avActivityComment;
	}

	getAvActivityCommentIn(language: Enums.LanguageCode): string {
		for (var i = this.avActivityComment.length - 1; i >= 0; i--) {
			if (this.avActivityComment[i].getLanguageCode() == language)
				return this.avActivityComment[i].getText();
		}
	}

	setAvActivityComment(avActivityComment: TextModel[]) {
		this.avActivityComment = avActivityComment;
	}

	setAvActivityCommentIn(text: string, language: Enums.LanguageCode) {
		for (var i = this.avActivityComment.length - 1; i >= 0; i--) {
			if (this.avActivityComment[i].getLanguageCode() == language) {
				this.avActivityComment[i].setText(text);
				return;
			}
		}
		let model = new TextModel();
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
		for (var i = this.snowpackStructureHighlights.length - 1; i >= 0; i--) {
			if (this.snowpackStructureHighlights[i].getLanguageCode() == language)
				return this.snowpackStructureHighlights[i].getText();
		}
	}

	getSnowpackStructureHighlightInString(language: string): string {
		return this.getSnowpackStructureHighlightIn(Enums.LanguageCode[language]);
	}

	setSnowpackStructureHighlight(snowpackStructureHighlights: TextModel[]) {
		this.snowpackStructureHighlights = snowpackStructureHighlights;
	}

	setSnowpackStructureHighlightsIn(text: string, language: Enums.LanguageCode) {
		for (var i = this.snowpackStructureHighlights.length - 1; i >= 0; i--) {
			if (this.snowpackStructureHighlights[i].getLanguageCode() == language) {
				this.snowpackStructureHighlights[i].setText(text);
				return;
			}
		}
		let model = new TextModel();
		model.setLanguageCode(language);
		model.setText(text);
		this.snowpackStructureHighlights.push(model);
	}

	getSnowpackStructureComment(): TextModel[] {
		return this.snowpackStructureComment;
	}

	getSnowpackStructureCommentIn(language: Enums.LanguageCode): string {
		for (var i = this.snowpackStructureComment.length - 1; i >= 0; i--) {
			if (this.snowpackStructureComment[i].getLanguageCode() == language)
				return this.snowpackStructureComment[i].getText();
		}
	}

	setSnowpackStructureComment(snowpackStructureComment: TextModel[]) {
		this.snowpackStructureComment = snowpackStructureComment;
	}

	setSnowpackStructureCommentIn(text: string, language: Enums.LanguageCode) {
		for (var i = this.snowpackStructureComment.length - 1; i >= 0; i--) {
			if (this.snowpackStructureComment[i].getLanguageCode() == language) {
				this.snowpackStructureComment[i].setText(text);
				return;
			}
		}
		let model = new TextModel();
		model.setLanguageCode(language);
		model.setText(text);
		this.snowpackStructureComment.push(model);
	}

	getTendencyComment(): TextModel[] {
		return this.tendencyComment;
	}

	getTendencyCommentIn(language: Enums.LanguageCode): string {
		for (var i = this.tendencyComment.length - 1; i >= 0; i--) {
			if (this.tendencyComment[i].getLanguageCode() == language)
				return this.tendencyComment[i].getText();
		}
	}

	setTendencyComment(tendencyComment: TextModel[]) {
		this.tendencyComment = tendencyComment;
	}

	setTendencyCommentIn(text: string, language: Enums.LanguageCode) {
		for (var i = this.tendencyComment.length - 1; i >= 0; i--) {
			if (this.tendencyComment[i].getLanguageCode() == language) {
				this.tendencyComment[i].setText(text);
				return;
			}
		}
		let model = new TextModel();
		model.setLanguageCode(language);
		model.setText(text);
		this.tendencyComment.push(model);
	}

	getForenoonDangerRatingAbove(): Enums.DangerRating {
		return this.forenoonAbove.dangerRating.getValue();
	}

	getAfternoonDangerRatingAbove(): Enums.DangerRating {
		let test: any = this.afternoonAbove.dangerRating.getValue();
		if (this.hasDaytimeDependency && this.afternoonAbove && this.afternoonAbove.dangerRating && test != "missing")
			return this.afternoonAbove.dangerRating.getValue();
		else
			return this.forenoonAbove.dangerRating.getValue();
	}

	getForenoonDangerRatingBelow(): Enums.DangerRating {
		if (this.hasElevationDependency)
			return this.forenoonBelow.dangerRating.getValue();
		else
			return this.getForenoonDangerRatingAbove();
	}

	getAfternoonDangerRatingBelow(): Enums.DangerRating {
		if (this.hasDaytimeDependency) {
			if (this.hasElevationDependency) {
				let test: any = this.afternoonBelow.dangerRating.getValue();
				if (this.afternoonBelow && this.afternoonBelow.dangerRating && test != "missing")
					return this.afternoonBelow.dangerRating.getValue();
				else
					return this.forenoonBelow.dangerRating.getValue();
			} else
				return this.getAfternoonDangerRatingAbove();
		} else
			return this.getForenoonDangerRatingBelow();
	}

	toJson() {
		var json = Object();

		if (this.id && this.id != undefined)
			json['id'] = this.id;
		if (this.creator && this.creator != undefined)
			json['creator'] = this.creator;
		if (this.creatorRegion && this.creatorRegion != undefined)
			json['creatorRegion'] = this.creatorRegion;

		if (this.publicationDate && this.publicationDate != undefined)
			json['publicationDate'] = this.getISOStringWithTimezoneOffsetUrlEncoded(this.publicationDate);

		var validity = Object();
		if (this.validFrom && this.validFrom != undefined)
			validity['from'] = this.getISOStringWithTimezoneOffsetUrlEncoded(this.validFrom);
		if (this.validUntil && this.validUntil != undefined)
			validity['until'] = this.getISOStringWithTimezoneOffsetUrlEncoded(this.validUntil);
		json['validity'] = validity;

		if (this.suggestedRegions && this.suggestedRegions.length > 0) {
			let suggestedRegions = [];
			for (let i = 0; i <= this.suggestedRegions.length - 1; i++) {
				suggestedRegions.push(this.suggestedRegions[i]);
			}
			json['suggestedRegions'] = suggestedRegions;
		}

		if (this.savedRegions && this.savedRegions.length > 0) {
			let savedRegions = [];
			for (let i = 0; i <= this.savedRegions.length - 1; i++) {
				savedRegions.push(this.savedRegions[i]);
			}
			json['savedRegions'] = savedRegions;
		}

		if (this.publishedRegions && this.publishedRegions.length > 0) {
			let publishedRegions = [];
			for (let i = 0; i <= this.publishedRegions.length - 1; i++) {
				publishedRegions.push(this.publishedRegions[i]);
			}
			json['publishedRegions'] = publishedRegions;
		}

		if (this.hasDaytimeDependency)
			json['hasDaytimeDependency'] = true;
		else
			json['hasDaytimeDependency'] = false;

		if (this.hasElevationDependency) {
			json['hasElevationDependency'] = true;
			if (this.treeline)
				json['treeline'] = this.treeline;
			else if (this.elevation && this.elevation != undefined)
				json['elevation'] = this.elevation;
		} else
			json['hasElevationDependency'] = false;

		if (this.hasElevationDependency && this.forenoonBelow && this.forenoonBelow != undefined)
			json['forenoonBelow'] = this.forenoonBelow.toJson();

		if (this.forenoonAbove && this.forenoonAbove != undefined)
			json['forenoonAbove'] = this.forenoonAbove.toJson();

		if (this.hasElevationDependency && this.hasDaytimeDependency && this.afternoonBelow && this.afternoonBelow != undefined)
			json['afternoonBelow'] = this.afternoonBelow.toJson();

		if (this.hasDaytimeDependency && this.afternoonAbove && this.afternoonAbove != undefined)
			json['afternoonAbove'] = this.afternoonAbove.toJson();

		if (this.avActivityHighlightsTextcat && this.avActivityHighlightsTextcat != undefined)
			json['avActivityHighlightsTextcat'] = this.avActivityHighlightsTextcat;

		if (this.avActivityCommentTextcat && this.avActivityHighlightsTextcat != undefined)
			json['avActivityCommentTextcat'] = this.avActivityCommentTextcat;

		if (this.snowpackStructureHighlightsTextcat && this.snowpackStructureHighlightsTextcat != undefined)
			json['snowpackStructureHighlightsTextcat'] = this.snowpackStructureHighlightsTextcat;

		if (this.snowpackStructureCommentTextcat && this.snowpackStructureCommentTextcat != undefined)
			json['snowpackStructureCommentTextcat'] = this.snowpackStructureCommentTextcat;

		if (this.tendencyCommentTextcat && this.tendencyCommentTextcat != undefined)
			json['tendencyCommentTextcat'] = this.tendencyCommentTextcat;

		if (this.avActivityHighlights && this.avActivityHighlights != undefined && this.avActivityHighlights.length > 0) {
			let highlight = [];
			for (let i = 0; i <= this.avActivityHighlights.length - 1; i++) {
				highlight.push(this.avActivityHighlights[i].toJson());
			}
			json['avActivityHighlights'] = highlight;
		}
		if (this.avActivityComment && this.avActivityComment != undefined && this.avActivityComment.length > 0) {
			let comment = [];
			for (let i = 0; i <= this.avActivityComment.length - 1; i++) {
				comment.push(this.avActivityComment[i].toJson());
			}
			json['avActivityComment'] = comment;
		}

		if (this.snowpackStructureHighlights && this.snowpackStructureHighlights != undefined && this.snowpackStructureHighlights.length > 0) {
			let highlight = [];
			for (let i = 0; i <= this.snowpackStructureHighlights.length - 1; i++) {
				highlight.push(this.snowpackStructureHighlights[i].toJson());
			}
			json['snowpackStructureHighlights'] = highlight;
		}
		if (this.snowpackStructureComment && this.snowpackStructureComment != undefined && this.snowpackStructureComment.length > 0) {
			let comment = [];
			for (let i = 0; i <= this.snowpackStructureComment.length - 1; i++) {
				comment.push(this.snowpackStructureComment[i].toJson());
			}
			json['snowpackStructureComment'] = comment;
		}

		if (this.tendencyComment && this.tendencyComment != undefined && this.tendencyComment.length > 0) {
			let comment = [];
			for (let i = 0; i <= this.tendencyComment.length - 1; i++) {
				comment.push(this.tendencyComment[i].toJson());
			}
			json['tendencyComment'] = comment;
		}

		if (this.tendency && this.tendency != undefined)
			json['tendency'] = this.tendency;

		if (this.dangerPattern1 && this.dangerPattern1 != undefined)
			json['dangerPattern1'] = this.dangerPattern1;

		if (this.dangerPattern2 && this.dangerPattern2 != undefined)
			json['dangerPattern2'] = this.dangerPattern2;

		return json;
	}

	static createFromJson(json) {
		let bulletin = new BulletinModel();

		bulletin.setId(json.id);
		bulletin.setCreator(json.creator);
		bulletin.setCreatorRegion(json.creatorRegion);

		if (json.publicationDate)
			bulletin.setPublicationDate(new Date(json.publicationDate));

		bulletin.setValidFrom(new Date(json.validity.from));
		bulletin.setValidUntil(new Date(json.validity.until));

		let jsonSuggestedRegions = json.suggestedRegions;
		let suggestedRegions = new Array<String>();
		for (let i in jsonSuggestedRegions) {
			suggestedRegions.push(jsonSuggestedRegions[i]);
		}
		bulletin.setSuggestedRegions(suggestedRegions);

		let jsonSavedRegions = json.savedRegions;
		let savedRegions = new Array<String>();
		for (let i in jsonSavedRegions) {
			savedRegions.push(jsonSavedRegions[i]);
		}
		bulletin.setSavedRegions(savedRegions);

		let jsonPublishedRegions = json.publishedRegions;
		let publishedRegions = new Array<String>();
		for (let i in jsonPublishedRegions) {
			publishedRegions.push(jsonPublishedRegions[i]);
		}
		bulletin.setPublishedRegions(publishedRegions);

		bulletin.setElevation(json.elevation);
		bulletin.setTreeline(json.treeline);
		bulletin.setHasDaytimeDependency(json.hasDaytimeDependency);
		bulletin.setHasElevationDependency(json.hasElevationDependency);

		if (json.forenoonAbove)
			bulletin.setForenoonAbove(BulletinElevationDescriptionModel.createFromJson(json.forenoonAbove));
		if (json.forenoonBelow)
			bulletin.setForenoonBelow(BulletinElevationDescriptionModel.createFromJson(json.forenoonBelow));
		if (json.afternoonAbove)
			bulletin.setAfternoonAbove(BulletinElevationDescriptionModel.createFromJson(json.afternoonAbove));
		if (json.afternoonBelow)
			bulletin.setAfternoonBelow(BulletinElevationDescriptionModel.createFromJson(json.afternoonBelow));

		//if (json.avActivityHighlightsTextcat)
		//	bulletin.setAvActivityHighlightsTextcat(json.avActivityHighlightsTextcat);
		if (json.avActivityCommentTextcat)
			bulletin.setAvActivityCommentTextcat(json.avActivityCommentTextcat);
		if (json.snowpackStructureHighlightsTextcat)
			bulletin.setSnowpackStructureHighlightsTextcat(json.snowpackStructureHighlightsTextcat);
		if (json.snowpackStructureCommentTextcat)
			bulletin.setSnowpackStructureCommentTextcat(json.snowpackStructureCommentTextcat);
		if (json.tendencyCommentTextcat)
			bulletin.setTendencyCommentTextcat(json.tendencyCommentTextcat);

		let jsonAvActivityHighlightsTextcat = json.avActivityHighlightsTextcat;
		let avActivityHighlightsTextcat = new Array<TextModel>();
		for (let i in jsonAvActivityHighlightsTextcat) {
			avActivityHighlightsTextcat.push(TextModel.createFromJson(jsonAvActivityHighlightsTextcat[i]));
		}
		bulletin.setAvActivityHighlightsTextcat(avActivityHighlightsTextcat);


		let jsonAvActivityHighlights = json.avActivityHighlights;
		let avActivityHighlights = new Array<TextModel>();
		for (let i in jsonAvActivityHighlights) {
			avActivityHighlights.push(TextModel.createFromJson(jsonAvActivityHighlights[i]));
		}
		bulletin.setAvActivityHighlights(avActivityHighlights);

		let jsonAvActivityComment = json.avActivityComment;
		let avActivityComment = new Array<TextModel>();
		for (let i in jsonAvActivityComment) {
			avActivityComment.push(TextModel.createFromJson(jsonAvActivityComment[i]));
		}
		bulletin.setAvActivityComment(avActivityComment);

		let jsonSnowpackStructureHighlight = json.snowpackStructureHighlights;
		let snowpackStructureHighlights = new Array<TextModel>();
		for (let i in jsonSnowpackStructureHighlight) {
			snowpackStructureHighlights.push(TextModel.createFromJson(jsonSnowpackStructureHighlight[i]));
		}
		bulletin.setSnowpackStructureHighlight(snowpackStructureHighlights);

		let jsonSnowpackStructureComment = json.snowpackStructureComment;
		let snowpackStructureComment = new Array<TextModel>();
		for (let i in jsonSnowpackStructureComment) {
			snowpackStructureComment.push(TextModel.createFromJson(jsonSnowpackStructureComment[i]));
		}
		bulletin.setSnowpackStructureComment(snowpackStructureComment);

		let jsonTendencyComment = json.tendencyComment;
		let tendencyComment = new Array<TextModel>();
		for (let i in jsonTendencyComment) {
			tendencyComment.push(TextModel.createFromJson(jsonTendencyComment[i]));
		}
		bulletin.setTendencyComment(tendencyComment);

		if (json.tendency)
			bulletin.setTendency(json.tendency);

		if (json.dangerPattern1)
			bulletin.setDangerPattern1(json.dangerPattern1);
		if (json.dangerPattern2)
			bulletin.setDangerPattern2(json.dangerPattern2);

		return bulletin;
	}

	private getISOStringWithTimezoneOffsetUrlEncoded(date: Date) {
		let offset = -date.getTimezoneOffset();
		let dif = offset >= 0 ? '+' : '-';

		return date.getFullYear() +
			'-' + this.extend(date.getMonth() + 1) +
			'-' + this.extend(date.getDate()) +
			'T' + this.extend(date.getHours()) +
			':' + this.extend(date.getMinutes()) +
			':' + this.extend(date.getSeconds()) +
			dif + this.extend(offset / 60) +
			':' + this.extend(offset % 60);
	}

	private extend(num: number) {
		let norm = Math.abs(Math.floor(num));
		return (norm < 10 ? '0' : '') + norm;
	}
}