import * as Enums from '../enums/enums';
import { BehaviorSubject } from 'rxjs/Rx';
import { MatrixInformationModel } from './matrix-information.model';

export class AvalancheSituationModel {
	public avalancheSituation: Enums.AvalancheSituation;
	public aspects: Enums.Aspect[];

	constructor(avalancheSituation?: AvalancheSituationModel) {
		this.aspects = new Array<Enums.Aspect>();

		if (!avalancheSituation)
			this.avalancheSituation = undefined;
		else {
			this.avalancheSituation = avalancheSituation.getAvalancheSituation();
			for (let aspect of avalancheSituation.aspects)
				this.addAspect(aspect);
		}
	}

	getAvalancheSituation() {
		return this.avalancheSituation;
	}

	setAvalancheSituation(avalancheSituation) {
		this.avalancheSituation = avalancheSituation;
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

		if (this.avalancheSituation && this.avalancheSituation != undefined)
			json['avalancheSituation'] = this.avalancheSituation;
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
		let avalancheSituation = new AvalancheSituationModel();

		avalancheSituation.avalancheSituation = json.avalancheSituation;
		let jsonAspects = json.aspects;
		let aspects = new Array<Enums.Aspect>();
		for (let i in jsonAspects) {
			aspects.push(jsonAspects[i]);
		}
		avalancheSituation.setAspects(aspects);

		return avalancheSituation;
	}
}