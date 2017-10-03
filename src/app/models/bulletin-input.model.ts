import { BulletinElevationDescriptionModel } from "./bulletin-elevation-description.model";
import { TextModel } from './text.model';
import { BulletinModel } from './bulletin.model';
import * as Enums from '../enums/enums';

export class BulletinInputModel {
	public suggestedRegions: String[];
	public savedRegions: String[];
	public publishedRegions: String[];

	public creator: string;
	public creatorRegion: string;

	public avActivityHighlights: TextModel[];
	public avActivityComment: TextModel[];

	public snowpackStructureHighlights: TextModel[];
	public snowpackStructureComment: TextModel[];

	public elevationDependency: boolean;
	public daytimeDependency: boolean;

	public elevation: number;

	public forenoonAbove: BulletinElevationDescriptionModel;
	public forenoonBelow: BulletinElevationDescriptionModel;
	public afternoonAbove: BulletinElevationDescriptionModel;
	public afternoonBelow: BulletinElevationDescriptionModel;

	public forenoonBulletinId: string;
	public afternoonBulletinId: string

	constructor(bulletinInput?: BulletinInputModel) {
		this.suggestedRegions = new Array<String>();
		this.savedRegions = new Array<String>();
		this.publishedRegions = new Array<String>();

		this.forenoonBulletinId = undefined;
		this.afternoonBulletinId = undefined;

		if (!bulletinInput) {
			this.creator = undefined;
			this.creatorRegion = undefined;
			this.avActivityHighlights = new Array<TextModel>();
			this.avActivityComment = new Array<TextModel>();
			this.snowpackStructureHighlights = new Array<TextModel>();
			this.snowpackStructureComment = new Array<TextModel>();
			this.elevationDependency = false;
			this.daytimeDependency = false;
			this.elevation = undefined;
			this.forenoonAbove = new BulletinElevationDescriptionModel();
			this.forenoonBelow = new BulletinElevationDescriptionModel();
			this.afternoonAbove = new BulletinElevationDescriptionModel();
			this.afternoonBelow = new BulletinElevationDescriptionModel();
		} else {
			this.creator = bulletinInput.creator;
			this.creatorRegion = bulletinInput.creatorRegion;
			this.avActivityHighlights = bulletinInput.avActivityHighlights;
			this.avActivityComment = bulletinInput.avActivityComment;
			this.snowpackStructureHighlights = bulletinInput.snowpackStructureHighlights;
			this.snowpackStructureComment = bulletinInput.snowpackStructureComment;
			this.elevationDependency = bulletinInput.elevationDependency;
			this.daytimeDependency = bulletinInput.daytimeDependency;
			this.elevation = bulletinInput.elevation;
			this.forenoonAbove = new BulletinElevationDescriptionModel(bulletinInput.forenoonAbove);
			this.forenoonBelow = new BulletinElevationDescriptionModel(bulletinInput.forenoonBelow);
			this.afternoonAbove = new BulletinElevationDescriptionModel(bulletinInput.afternoonAbove);
			this.afternoonBelow = new BulletinElevationDescriptionModel(bulletinInput.afternoonBelow);
		}
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

	getElevation() : number {
		return this.elevation
	}

	setElevation(elevation: number) {
		this.elevation = elevation;
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

	getForenoonBulletinId() : string {
		return this.forenoonBulletinId;
	}

	setForenoonBulletinId(forenoonBulletinId: string) {
		this.forenoonBulletinId = forenoonBulletinId;
	}

	getAfternoonBulletinId() : string {
		return this.afternoonBulletinId;
	}

	setAfternoonBulletinId(afternoonBulletinId: string) {
		this.afternoonBulletinId = afternoonBulletinId;
	}

	getAvalancheSituationHighlight() : TextModel[] {
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

	getSnowpackStructureHighlights() : TextModel[] {
		return this.snowpackStructureHighlights;
	}

	getSnowpackStructureHighlightsIn(language: Enums.LanguageCode) : string {
		for (var i = this.snowpackStructureHighlights.length - 1; i >= 0; i--) {
			if (this.snowpackStructureHighlights[i].getLanguageCode() == language)
				return this.snowpackStructureHighlights[i].getText();
		}
	}

	getSnowpackStructureHighlightsInString(language: string) : string {
		return this.getSnowpackStructureHighlightsIn(Enums.LanguageCode[language]);
	}

	setSnowpackStructureHighlights(snowpackStructureHighlights: TextModel[]) {
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

	getDaytimeDependency() : boolean {
		return this.daytimeDependency;
	}

	setDaytimeDependency(daytimeDependency: boolean) {
		this.daytimeDependency = daytimeDependency;
	}

	getElevationDependency() : boolean {
		return this.elevationDependency;
	}

	setElevationDependency(elevationDependency: boolean) {
		this.elevationDependency = elevationDependency;
	}

	getForenoonDangerRatingAbove() : Enums.DangerRating {
		return this.forenoonAbove.dangerRating.getValue();
	}

	getAfternoonDangerRatingAbove() : Enums.DangerRating {
		let test : any = this.afternoonAbove.dangerRating.getValue();
		if (this.daytimeDependency && this.afternoonAbove && this.afternoonAbove.dangerRating && test != "missing")
			return this.afternoonAbove.dangerRating.getValue();
		else
			return this.forenoonAbove.dangerRating.getValue();
	}

	getForenoonDangerRatingBelow() : Enums.DangerRating {
		if (this.elevationDependency)
			return this.forenoonBelow.dangerRating.getValue();
		else
			return this.getForenoonDangerRatingAbove();
	}

	getAfternoonDangerRatingBelow() : Enums.DangerRating {
		if (this.daytimeDependency) {
			if (this.elevationDependency) {
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

	toBulletins(aggregatedRegionId: string, date: Date) : BulletinModel[] {
		let result = new Array<BulletinModel>();
		let forenoonBulletin = new BulletinModel();

		if (this.forenoonBulletinId != undefined)
			forenoonBulletin.setId(this.forenoonBulletinId);

		forenoonBulletin.aggregatedRegionId = aggregatedRegionId;

		let validFrom = new Date(date);
		let validUntil = new Date(date);
		forenoonBulletin.validFrom = validFrom;

		forenoonBulletin.creator = this.creator;
		forenoonBulletin.creatorRegion = this.creatorRegion;

		forenoonBulletin.suggestedRegions = this.suggestedRegions;
		forenoonBulletin.savedRegions = this.savedRegions;
		forenoonBulletin.publishedRegions = this.publishedRegions;

		if (this.elevationDependency)
			forenoonBulletin.elevation = this.elevation;
		
		forenoonBulletin.above = this.forenoonAbove;
		if (this.elevationDependency)
			forenoonBulletin.below = this.forenoonBelow;

		forenoonBulletin.avActivityHighlights = this.avActivityHighlights;
		forenoonBulletin.avActivityComment = this.avActivityComment;
		forenoonBulletin.snowpackStructureHighlights = this.snowpackStructureHighlights;
		forenoonBulletin.snowpackStructureComment = this.snowpackStructureComment;

		if (this.daytimeDependency) {
			validUntil.setTime(validUntil.getTime() + (12*60*60*1000));
			forenoonBulletin.validUntil = validUntil;

			let afternoonBulletin = new BulletinModel(forenoonBulletin);

			afternoonBulletin.creator = this.creator;
			afternoonBulletin.creatorRegion = this.creatorRegion;

			if (this.afternoonBulletinId != undefined)
				afternoonBulletin.setId(this.afternoonBulletinId);
			afternoonBulletin.validFrom = new Date(validUntil);
			let validUntilAfternoon = new Date(validUntil);
			validUntilAfternoon.setTime(validUntilAfternoon.getTime() + (12*60*60*1000));
			afternoonBulletin.validUntil = validUntilAfternoon;

			afternoonBulletin.above = this.afternoonAbove;
			if (this.elevationDependency)
				afternoonBulletin.below = this.afternoonBelow;

			result.push(afternoonBulletin);
		} else {
			validUntil.setTime(validUntil.getTime() + (24*60*60*1000));
			forenoonBulletin.validUntil = validUntil;
		}

		result.push(forenoonBulletin)

		return result;
	}
}