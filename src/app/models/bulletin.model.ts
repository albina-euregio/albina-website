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

	public avActivityHighlights: TextModel[];
	public avActivityComment: TextModel[];

	public snowpackStructureHighlights: TextModel[];
	public snowpackStructureComment: TextModel[];

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
			this.avActivityHighlights = bulletin.avActivityHighlights;
			this.avActivityComment = bulletin.avActivityComment;
			this.snowpackStructureHighlights = bulletin.snowpackStructureHighlights;
			this.snowpackStructureComment = bulletin.snowpackStructureComment;
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
			this.avActivityHighlights = new Array<TextModel>();
			this.avActivityComment = new Array<TextModel>();
			this.snowpackStructureHighlights = new Array<TextModel>();
			this.snowpackStructureComment = new Array<TextModel>();
			this.elevation = undefined;
			this.treeline = false;
			this.hasDaytimeDependency = false;
			this.hasElevationDependency = false;
		}
	}

	getId() : string {
		return this.id;
	}

	setId(id: string) {
		this.id = id;
	}

	getCreator() : string {
		return this.creator;
	}

	setCreator(creator: string) {
		this.creator = creator;
	}

	getCreatorRegion() : string {
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

	getValidFrom() : Date {
		return this.validFrom
	}

	setValidFrom(validFrom: Date) {
		this.validFrom = validFrom;
	}

	getValidUntil() : Date {
		return this.validUntil;
	}

	setValidUntil(validUntil: Date) {
		this.validUntil = validUntil;
	}

	getSuggestedRegions() : String[] {
		return this.suggestedRegions;
	}

	setSuggestedRegions(suggestedRegions: String[]) {
		this.suggestedRegions = suggestedRegions;
	}

	getSavedRegions() : String[] {
		return this.savedRegions;
	}

	setSavedRegions(savedRegions: String[]) {
		this.savedRegions = savedRegions;
	}

	getPublishedRegions() : String[] {
		return this.publishedRegions;
	}

	setPublishedRegions(publishedRegions: String[]) {
		this.publishedRegions = publishedRegions;
	}

	getElevation() : number {
		return this.elevation
	}

	setElevation(elevation: number) {
		this.elevation = elevation;
	}

	getTreeline() : boolean {
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

	getForenoonAbove() : BulletinElevationDescriptionModel {
		return this.forenoonAbove
	}

	setForenoonAbove(forenoonAbove: BulletinElevationDescriptionModel) {
		this.forenoonAbove = forenoonAbove;
	}

	getForenoonBelow() : BulletinElevationDescriptionModel {
		return this.forenoonBelow
	}

	setForenoonBelow(forenoonBelow: BulletinElevationDescriptionModel) {
		this.forenoonBelow = forenoonBelow;
	}

	getAfternoonAbove() : BulletinElevationDescriptionModel {
		return this.afternoonAbove
	}

	setAfternoonAbove(afternoonAbove: BulletinElevationDescriptionModel) {
		this.afternoonAbove = afternoonAbove;
	}

	getAfternoonBelow() : BulletinElevationDescriptionModel {
		return this.afternoonBelow
	}

	setAfternoonBelow(afternoonBelow: BulletinElevationDescriptionModel) {
		this.afternoonBelow = afternoonBelow;
	}

	getAvActivityHighlights() : TextModel[] {
		return this.avActivityHighlights;
	}

	getAvActivityHighlightsIn(language: Enums.LanguageCode) : string {
		for (var i = this.avActivityHighlights.length - 1; i >= 0; i--) {
			if (this.avActivityHighlights[i].getLanguageCode() == language)
				return this.avActivityHighlights[i].getText();
		}
	}

	getAvActivityHighlightsInString(language: string) : string {
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

	getAvActivityComment() : TextModel[] {
		return this.avActivityComment;
	}

	getAvActivityCommentIn(language: Enums.LanguageCode) : string {
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

	getSnowpackStructureHighlightIn(language: Enums.LanguageCode) : string {
		for (var i = this.snowpackStructureHighlights.length - 1; i >= 0; i--) {
			if (this.snowpackStructureHighlights[i].getLanguageCode() == language)
				return this.snowpackStructureHighlights[i].getText();
		}
	}

	getSnowpackStructureHighlightInString(language: string) : string {
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

	getSnowpackStructureComment() : TextModel[] {
		return this.snowpackStructureComment;
	}

	getSnowpackStructureCommentIn(language: Enums.LanguageCode) : string {
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

	getForenoonDangerRatingAbove() : Enums.DangerRating {
		return this.forenoonAbove.dangerRating.getValue();
	}

	getAfternoonDangerRatingAbove() : Enums.DangerRating {
		let test : any = this.afternoonAbove.dangerRating.getValue();
		if (this.hasDaytimeDependency && this.afternoonAbove && this.afternoonAbove.dangerRating && test != "missing")
			return this.afternoonAbove.dangerRating.getValue();
		else
			return this.forenoonAbove.dangerRating.getValue();
	}

	getForenoonDangerRatingBelow() : Enums.DangerRating {
		if (this.hasElevationDependency)
			return this.forenoonBelow.dangerRating.getValue();
		else
			return this.getForenoonDangerRatingAbove();
	}

	getAfternoonDangerRatingBelow() : Enums.DangerRating {
		if (this.hasDaytimeDependency) {
			if (this.hasElevationDependency) {
				let test : any = this.afternoonBelow.dangerRating.getValue();
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