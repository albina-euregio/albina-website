import { BulletinElevationDescriptionModel } from "./bulletin-elevation-description.model";
import { TextModel } from './text.model';
import { BulletinModel } from './bulletin.model';
import * as Enums from '../enums/enums';

export class BulletinInputModel {
	public regions: String[];

	public avalancheSituationHighlight: TextModel[];
	public avalancheSituationComment: TextModel[];

	public elevationDependency: boolean;
	public daytimeDependency: boolean;

	public elevation: number;

	public forenoonAbove: BulletinElevationDescriptionModel;
	public forenoonBelow: BulletinElevationDescriptionModel;
	public afternoonAbove: BulletinElevationDescriptionModel;
	public afternoonBelow: BulletinElevationDescriptionModel;

	constructor() {
		this.regions = new Array<String>();
		this.avalancheSituationHighlight = new Array<TextModel>();
		this.avalancheSituationComment = new Array<TextModel>();
		this.elevationDependency = false;
		this.daytimeDependency = false;
		this.elevation = undefined;
		this.forenoonAbove = new BulletinElevationDescriptionModel();
		this.forenoonBelow = new BulletinElevationDescriptionModel();
		this.afternoonAbove = new BulletinElevationDescriptionModel();
		this.afternoonBelow = new BulletinElevationDescriptionModel();
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
		return this.avalancheSituationHighlight;
	}

	getAvalancheSituationHighlightIn(language: Enums.LanguageCode) : string {
		for (var i = this.avalancheSituationHighlight.length - 1; i >= 0; i--) {
			if (this.avalancheSituationHighlight[i].getLanguageCode() == language)
				return this.avalancheSituationHighlight[i].getText();
		}
	}

	getAvalancheSituationHighlightInString(language: string) : string {
		return this.getAvalancheSituationHighlightIn(Enums.LanguageCode[language]);
	}

	setAvalancheSituationHighlight(avalancheSituationHighlight: TextModel[]) {
		this.avalancheSituationHighlight = avalancheSituationHighlight;
	}

	setAvalancheSituationHighlightIn(text: string, language: Enums.LanguageCode) {
		for (var i = this.avalancheSituationHighlight.length - 1; i >= 0; i--) {
			if (this.avalancheSituationHighlight[i].getLanguageCode() == language) {
				this.avalancheSituationHighlight[i].setText(text);
				return;
			}
		}
		let model = new TextModel();
		model.setLanguageCode(language);
		model.setText(text);
		this.avalancheSituationHighlight.push(model);
	}

	getAvalancheSituationComment() : TextModel[] {
		return this.avalancheSituationComment;
	}

	getAvalancheSituationCommentIn(language: Enums.LanguageCode) : string {
		for (var i = this.avalancheSituationComment.length - 1; i >= 0; i--) {
			if (this.avalancheSituationComment[i].getLanguageCode() == language)
				return this.avalancheSituationComment[i].getText();
		}
	}

	setAvalancheSituationComment(avalancheSituationComment: TextModel[]) {
		this.avalancheSituationComment = avalancheSituationComment;
	}

	setAvalancheSituationCommentIn(text: string, language: Enums.LanguageCode) {
		for (var i = this.avalancheSituationComment.length - 1; i >= 0; i--) {
			if (this.avalancheSituationComment[i].getLanguageCode() == language) {
				this.avalancheSituationComment[i].setText(text);
				return;
			}
		}
		let model = new TextModel();
		model.setLanguageCode(language);
		model.setText(text);
		this.avalancheSituationComment.push(model);
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

	toBulletins(aggregatedRegionId: string, date: Date) : BulletinModel[] {
		let result = new Array<BulletinModel>();
		let forenoonBulletin = new BulletinModel();

		forenoonBulletin.aggregatedRegionId = aggregatedRegionId;
		forenoonBulletin.validFrom = date;

		forenoonBulletin.regions = this.regions;
		if (this.elevation)
			forenoonBulletin.elevation = this.elevation;
		
		forenoonBulletin.above = this.forenoonAbove;
		if (this.elevationDependency)
			forenoonBulletin.below = this.forenoonBelow;

		forenoonBulletin.avalancheSituationHighlight = this.avalancheSituationHighlight;
		forenoonBulletin.avalancheSituationComment = this.avalancheSituationComment;

		// TODO whats with the status?

		if (this.daytimeDependency) {
			date.setTime(date.getTime() + (19*60*60*1000));
			forenoonBulletin.validUntil = date;

			let afternoonBulletin = new BulletinModel(forenoonBulletin);
			afternoonBulletin.aggregatedRegionId = aggregatedRegionId;
			afternoonBulletin.validFrom = date;
			date.setTime(date.getTime() + (5*60*60*1000));
			afternoonBulletin.validUntil = date;

			afternoonBulletin.above = this.afternoonAbove;
			if (this.elevationDependency)
				afternoonBulletin.below = this.afternoonBelow;

			// TODO whats with the status?

			result.push(afternoonBulletin);
		} else {
			date.setTime(date.getTime() + (24*60*60*1000));
			forenoonBulletin.validUntil = date;
		}

		result.push(forenoonBulletin)

		return result;
	}
}