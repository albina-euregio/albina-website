import { BulletinElevationDescriptionModel } from "./bulletin-elevation-description.model";
import { TextModel } from './text.model';
import { BulletinModel } from './bulletin.model';
import * as Enums from '../enums/enums';

export class BulletinInputModel {
	public regions: String[];

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

	constructor(bulletinInput?: BulletinInputModel) {
		if (!bulletinInput) {
			this.regions = new Array<String>();
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
			this.regions = new Array<String>();
			this.avActivityHighlights = bulletinInput.avActivityHighlights;
			this.avActivityComment = bulletinInput.avActivityComment;
			this.snowpackStructureHighlights = bulletinInput.snowpackStructureHighlights;
			this.snowpackStructureComment = bulletinInput.snowpackStructureComment;
			this.elevationDependency = bulletinInput.elevationDependency;
			this.daytimeDependency = bulletinInput.daytimeDependency;
			this.elevation = bulletinInput.elevation;
			this.forenoonAbove = bulletinInput.forenoonAbove;
			this.forenoonBelow = bulletinInput.forenoonBelow;
			this.afternoonAbove = bulletinInput.afternoonAbove;
			this.afternoonBelow = bulletinInput.afternoonBelow;
		}
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

	getHighestDangerRating() : Enums.DangerRating {
		// TODO implement some clever method
		return this.forenoonAbove.dangerRating.getValue();
	}

	toBulletins(aggregatedRegionId: string, date: Date) : BulletinModel[] {
		let result = new Array<BulletinModel>();
		let forenoonBulletin = new BulletinModel();

		forenoonBulletin.aggregatedRegionId = aggregatedRegionId;

		let validFrom = new Date(date);
		let validUntil = new Date(date);
		forenoonBulletin.validFrom = validFrom;

		forenoonBulletin.regions = this.regions;
		if (this.elevationDependency)
			forenoonBulletin.elevation = this.elevation;
		
		forenoonBulletin.above = this.forenoonAbove;
		if (this.elevationDependency)
			forenoonBulletin.below = this.forenoonBelow;

		forenoonBulletin.avActivityHighlights = this.avActivityHighlights;
		forenoonBulletin.avActivityComment = this.avActivityComment;
		forenoonBulletin.snowpackStructureHighlights = this.snowpackStructureHighlights;
		forenoonBulletin.snowpackStructureComment = this.snowpackStructureComment;

		// TODO whats with the status?

		if (this.daytimeDependency) {
			validUntil.setTime(validUntil.getTime() + (12*60*60*1000));
			forenoonBulletin.validUntil = validUntil;

			let afternoonBulletin = new BulletinModel(forenoonBulletin);
			afternoonBulletin.validFrom = new Date(validUntil);
			let validUntilAfternoon = new Date(validUntil);
			validUntilAfternoon.setTime(validUntilAfternoon.getTime() + (12*60*60*1000));
			afternoonBulletin.validUntil = validUntilAfternoon;

			afternoonBulletin.above = this.afternoonAbove;
			if (this.elevationDependency)
				afternoonBulletin.below = this.afternoonBelow;

			// TODO whats with the status?

			result.push(afternoonBulletin);
		} else {
			validUntil.setTime(validUntil.getTime() + (24*60*60*1000));
			forenoonBulletin.validUntil = validUntil;
		}

		result.push(forenoonBulletin)

		return result;
	}
}