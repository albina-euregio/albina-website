 import { BulletinElevationDescriptionModel } from "./bulletin-elevation-description.model";
import { TextModel } from './text.model';
import * as Enums from '../enums/enums';

export class BulletinModel {
	public id: string;

	public aggregatedRegionId: string;

	public validFrom: Date;
	public validUntil: Date;

	public regions: String[];
	public elevation: number;
	public above: BulletinElevationDescriptionModel;
	public below: BulletinElevationDescriptionModel;

	public avActivityHighlights: TextModel[];
	public avActivityComment: TextModel[];

	public snowpackStructureHighlights: TextModel[];
	public snowpackStructureComment: TextModel[];

	public status: Enums.BulletinStatus;

	constructor(bulletin?: BulletinModel) {
		if (bulletin) {
			this.aggregatedRegionId = bulletin.aggregatedRegionId;
			this.validFrom = bulletin.validFrom;
			this.validUntil = bulletin.validUntil;
			this.regions = bulletin.regions;
			this.above = bulletin.above;
			this.below = bulletin.below;
			this.status = bulletin.status;
			this.avActivityHighlights = bulletin.avActivityHighlights;
			this.avActivityComment = bulletin.avActivityComment;
			this.snowpackStructureHighlights = bulletin.snowpackStructureHighlights;
			this.snowpackStructureComment = bulletin.snowpackStructureComment;
			this.elevation = bulletin.elevation;
		} else {
			this.aggregatedRegionId = undefined;
			this.validFrom = undefined;
			this.validUntil = undefined;
			this.regions = new Array<String>();
			this.above = new BulletinElevationDescriptionModel();
			this.below = new BulletinElevationDescriptionModel();
			this.status = Enums.BulletinStatus.draft;
			this.avActivityHighlights = new Array<TextModel>();
			this.avActivityComment = new Array<TextModel>();
			this.snowpackStructureHighlights = new Array<TextModel>();
			this.snowpackStructureComment = new Array<TextModel>();
			this.elevation = undefined;
		}
	}

	getId() : string {
		return this.id;
	}

	setId(id: string) {
		this.id = id;
	}

	getAggregatedRegionId() : string {
		return this.aggregatedRegionId;
	}

	setAggregatedRegionId(aggregatedRegionId: string) {
		this.aggregatedRegionId = aggregatedRegionId;
	}

	getValidFrom() : Date{
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

	getRegions() : String[] {
		return this.regions;
	}

	setRegions(regions: String[]) {
		this.regions = regions;
	}

	getElevation() : number {
		return this.elevation
	}

	setElevation(elevation: number) {
		this.elevation = elevation;
	}

	getAbove() : BulletinElevationDescriptionModel {
		return this.above
	}

	setAbove(above: BulletinElevationDescriptionModel) {
		this.above = above;
	}

	getBelow() : BulletinElevationDescriptionModel {
		return this.below
	}

	setBelow(below: BulletinElevationDescriptionModel) {
		this.below = below;
	}

	getStatus() : Enums.BulletinStatus {
		return this.status;
	}

	setStatus(status: Enums.BulletinStatus) {
		this.status = status;
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

	toJson() {
		var json = Object();

		if (this.id && this.id != undefined)
			json['id'] = this.id;
		if (this.aggregatedRegionId && this.aggregatedRegionId != undefined)
			json['aggregatedRegionId'] = this.aggregatedRegionId;
		
		var validity = Object();
		if (this.validFrom && this.validFrom != undefined)
			validity['from'] = this.getISOStringWithTimezoneOffset(this.validFrom);
		if (this.validUntil && this.validUntil != undefined)
			validity['until'] = this.getISOStringWithTimezoneOffset(this.validUntil);
		json['validity'] = validity;

		if (this.regions && this.regions.length > 0) {
			let regions = [];
			for (let i = 0; i <= this.regions.length - 1; i++) {
				regions.push(this.regions[i]);
			}
			json['regions'] = regions;
		}

		if (this.above && this.above != undefined)
			json['above'] = this.above.toJson();

		if (this.elevation && this.elevation != undefined) {
			json['elevation'] = this.elevation;
			if (this.below && this.below != undefined)
				json['below'] = this.below.toJson();
		}
		
		if (this.status && this.status != undefined)
			json['status'] = Enums.BulletinStatus[this.status];

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
		bulletin.setAggregatedRegionId(json.aggregatedRegionId);

		bulletin.setValidFrom(new Date(json.validity.from));
		bulletin.setValidUntil(new Date(json.validity.until));

		let jsonRegions = json.regions;
		let regions = new Array<String>();
		for (let i in jsonRegions) {
			regions.push(jsonRegions[i]);
		}
		bulletin.setRegions(regions);

		bulletin.setElevation(json.elevation);

		if (json.above)
			bulletin.setAbove(BulletinElevationDescriptionModel.createFromJson(json.above));
		if (json.below)
			bulletin.setBelow(BulletinElevationDescriptionModel.createFromJson(json.below));

		bulletin.setStatus(Enums.BulletinStatus[<string>json.status]);

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
	
	private getISOStringWithTimezoneOffset(date: Date) {
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