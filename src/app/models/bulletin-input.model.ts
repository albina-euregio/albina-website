 import { BulletinElevationDescriptionModel } from "./bulletin-elevation-description.model";
import { TextModel } from './text.model';
import * as Enums from '../enums/enums';

export class BulletinInputModel {
	public regions: String[];

	public avalancheSituationHighlight: string;
	public avalancheSituationComment: string;

	public elevationDependency: boolean;
	public daytimeDependency: boolean;

	public elevation: number;

	public forenoonAbove: BulletinElevationDescriptionModel;
	public forenoonBelow: BulletinElevationDescriptionModel;
	public afternoonAbove: BulletinElevationDescriptionModel;
	public afternoonBelow: BulletinElevationDescriptionModel;

	constructor() {
		this.regions = new Array<String>();
		this.avalancheSituationHighlight = undefined;
		this.avalancheSituationComment = undefined;
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

	getAvalancheSituationHighlight() : string {
		return this.avalancheSituationHighlight;
	}

	setAvalancheSituationHighlight(avalancheSituationHighlight: string) {
		this.avalancheSituationHighlight = avalancheSituationHighlight;
	}

	getAvalancheSituationComment() : string {
		return this.avalancheSituationComment;
	}

	setAvalancheSituationComment(avalancheSituationComment: string) {
		this.avalancheSituationComment = avalancheSituationComment;
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
}