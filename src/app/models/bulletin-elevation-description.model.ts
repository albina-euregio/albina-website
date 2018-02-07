import * as Enums from '../enums/enums';
import { BehaviorSubject } from 'rxjs/Rx';
import { MatrixInformationModel } from './matrix-information.model';

export class BulletinElevationDescriptionModel {
	public dangerRating: BehaviorSubject<Enums.DangerRating>;
	public matrixInformation: MatrixInformationModel;
	public avalancheProblem: Enums.AvalancheProblem;
	public aspects: Enums.Aspect[];

	constructor(bulletinElevationDescription?: BulletinElevationDescriptionModel) {
		this.dangerRating = new BehaviorSubject<Enums.DangerRating>(Enums.DangerRating.missing);
		this.aspects = new Array<Enums.Aspect>();
		if (!bulletinElevationDescription) {
			this.setDangerRating("missing");
			this.matrixInformation = new MatrixInformationModel();
			this.avalancheProblem = undefined;
		} else {
			this.setDangerRating(bulletinElevationDescription.getDangerRating());
			this.matrixInformation = new MatrixInformationModel(bulletinElevationDescription.getMatrixInformation());
			this.avalancheProblem = bulletinElevationDescription.getAvalancheProblem();
			for (let aspect of bulletinElevationDescription.aspects)
				this.addAspect(aspect);
		}
	}

	getDangerRating() {
		return this.dangerRating.getValue();
	}

	setDangerRating(dangerRating) {
		this.dangerRating.next(dangerRating);
	}

	getMatrixInformation() {
		return this.matrixInformation;
	}

	setMatrixInformation(matrixInformation) {
		this.matrixInformation = matrixInformation;
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

	addAspect(aspect) {
		if (this.aspects.indexOf(aspect) == -1)
			this.aspects.push(aspect);
	}

	removeAspect(aspect) {
		let index = this.aspects.indexOf(aspect);
		if (index > -1)
			this.aspects.splice(index, 1);
	}

	containsAspect(aspect) {
		if (this.aspects.includes(aspect))
			return true;
		else
			return false;
	}

	toJson() {
		var json = Object();

		if (this.dangerRating && this.dangerRating != undefined)
			json['dangerRating'] = this.dangerRating.getValue();
		if (this.matrixInformation && this.matrixInformation != undefined)
			json['matrixInformation'] = this.matrixInformation.toJson();
		if (this.avalancheProblem && this.avalancheProblem != undefined)
			json['avalancheProblem'] = this.avalancheProblem;
		if (this.aspects && this.aspects.length > 0) {
			let aspects = [];
			for (let i = 0; i <= this.aspects.length - 1; i++) {
				aspects.push(this.aspects[i]);
			}
			json['aspects'] = aspects;
		}

		return json;
	}

	static createFromJson(json) {
		let bulletinElevationDescription = new BulletinElevationDescriptionModel();

		bulletinElevationDescription.dangerRating.next(json.dangerRating);
		if (json.matrixInformation)
			bulletinElevationDescription.matrixInformation = MatrixInformationModel.createFromJson(json.matrixInformation);
		bulletinElevationDescription.avalancheProblem = json.avalancheProblem;

		let jsonAspects = json.aspects;
		let aspects = new Array<Enums.Aspect>();
		for (let i in jsonAspects) {
			aspects.push(jsonAspects[i]);
		}
		bulletinElevationDescription.setAspects(aspects);

		return bulletinElevationDescription;
	}
}