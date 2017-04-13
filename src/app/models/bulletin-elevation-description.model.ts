import * as Enums from '../enums/enums';

export class BulletinElevationDescriptionModel {
	public dangerRating: Enums.DangerRating;
	public avalancheProblem: Enums.AvalancheProblem;
	public aspects: Enums.Aspect[];

	constructor() {
		this.dangerRating = null;
		this.avalancheProblem = null;
		this.aspects = new Array<Enums.Aspect>();
	}

	getDangerRating() {
		return this.dangerRating
	}

	setDangerRating(dangerRating) {
		this.dangerRating = dangerRating;
	}

	getAvalancheProblem() {
		return this.avalancheProblem;
	}

	setAvalancheProblem(avalancheProblem) {
		this.avalancheProblem = avalancheProblem;
	}

	getAspects() {
		return this.aspects;
	}

	setAspects(aspects) {
		this.aspects = aspects;
	}

	toJson() {
		var json = Object();

		if (this.dangerRating && this.dangerRating != undefined)
			json['dangerRating'] = Enums.DangerRating[this.dangerRating];
		if (this.avalancheProblem && this.avalancheProblem != undefined)
			json['avalancheProblem'] = Enums.AvalancheProblem[this.avalancheProblem];
		if (this.aspects && this.aspects.length > 0) {
			let aspects = [];
			for (let i = 0; i <= this.aspects.length - 1; i++) {
				aspects.push(Enums.Aspect[this.aspects[i]]);
			}
			json['aspects'] = aspects;
		}

		return json;
	}

	static createFromJson(json) {
		let bulletinElevationDescription = new BulletinElevationDescriptionModel();

		bulletinElevationDescription.dangerRating = Enums.DangerRating[<string>json.dangerRating];
		bulletinElevationDescription.avalancheProblem = Enums.AvalancheProblem[<string>json.avalancheProblem];

		let jsonAspects = json.aspects;
		let aspects = new Array<Enums.Aspect>();
		for (let i in jsonAspects) {
			aspects.push(Enums.Aspect[<string>jsonAspects[i]]);
		}
		bulletinElevationDescription.setAspects(aspects);

		return bulletinElevationDescription;
	}
}