import * as Enums from '../enums/enums';

export class MatrixInformationModel {

	public dangerRating: Enums.DangerRating;
	public avalancheSize: Enums.AvalancheSize;
	public avalancheReleaseProbability: Enums.AvalancheReleaseProbability;
	public hazardSiteDistribution: Enums.HazardSiteDistribution;

	public spontaneousDangerRating: Enums.DangerRating;
	public spontaneousAvalancheReleaseProbability: Enums.SpontaneousAvalancheReleaseProbability;
	public spontaneousHazardSiteDistribution: Enums.HazardSiteDistribution;

	constructor(matrixInformation?: MatrixInformationModel) {
		if (!matrixInformation) {
			this.setDangerRating('missing');
			this.avalancheSize = undefined;
			this.avalancheReleaseProbability = undefined;
			this.hazardSiteDistribution = undefined;
			this.setSpontaneousDangerRating('missing');
			this.spontaneousAvalancheReleaseProbability = undefined;
			this.spontaneousHazardSiteDistribution = undefined;
		} else {
			this.dangerRating = matrixInformation.getDangerRating();
			this.avalancheSize = matrixInformation.getAvalancheSize();
			this.avalancheReleaseProbability = matrixInformation.getAvalancheReleaseProbability();
			this.hazardSiteDistribution = matrixInformation.getHazardSiteDistribution();
			this.spontaneousDangerRating = matrixInformation.getSpontaneousDangerRating();
			this.spontaneousAvalancheReleaseProbability = matrixInformation.getSpontaneousAvalancheReleaseProbability();
			this.spontaneousHazardSiteDistribution = matrixInformation.getSpontaneousHazardSiteDistribution();
		}
	}

	getDangerRating() : Enums.DangerRating {
		return this.dangerRating;
	}

	setDangerRating(dangerRating) {
		this.dangerRating = dangerRating
	}

	getAvalancheSize() : Enums.AvalancheSize {
		return this.avalancheSize;
	}

	setAvalancheSize(avalancheSize) {
		this.avalancheSize = avalancheSize;
	}

	getAvalancheReleaseProbability() : Enums.AvalancheReleaseProbability {
		return this.avalancheReleaseProbability;
	}

	setAvalancheReleaseProbability(avalancheReleaseProbability) {
		this.avalancheReleaseProbability = avalancheReleaseProbability;
	}

	getHazardSiteDistribution() : Enums.HazardSiteDistribution {
		return this.hazardSiteDistribution;
	}

	setHazardSiteDistribution(hazardSiteDistribution) {
		this.hazardSiteDistribution = hazardSiteDistribution;
	}

	getSpontaneousDangerRating() : Enums.DangerRating {
		return this.spontaneousDangerRating;
	}

	setSpontaneousDangerRating(spontaneousDangerRating) {
		this.spontaneousDangerRating = spontaneousDangerRating
	}

	getSpontaneousAvalancheReleaseProbability() : Enums.SpontaneousAvalancheReleaseProbability {
		return this.spontaneousAvalancheReleaseProbability;
	}

	setSpontaneousAvalancheReleaseProbability(spontaneousAvalancheReleaseProbability) {
		this.spontaneousAvalancheReleaseProbability = spontaneousAvalancheReleaseProbability;
	}

	getSpontaneousHazardSiteDistribution() : Enums.HazardSiteDistribution {
		return this.spontaneousHazardSiteDistribution;
	}

	setSpontaneousHazardSiteDistribution(spontaneousHazardSiteDistribution) {
		this.spontaneousHazardSiteDistribution = spontaneousHazardSiteDistribution;
	}

	toJson() {
		var json = Object();

		if (this.dangerRating && this.dangerRating != undefined && this.dangerRating != Enums.DangerRating.missing)
			json['dangerRating'] = this.dangerRating;
		if (this.avalancheSize && this.avalancheSize != undefined)
			json['avalancheSize'] = this.avalancheSize;
		if (this.avalancheReleaseProbability && this.avalancheReleaseProbability != undefined)
			json['avalancheReleaseProbability'] = this.avalancheReleaseProbability;
		if (this.hazardSiteDistribution && this.hazardSiteDistribution != undefined)
			json['hazardSiteDistribution'] = this.hazardSiteDistribution;
		if (this.spontaneousDangerRating && this.spontaneousDangerRating != undefined && this.spontaneousDangerRating != Enums.DangerRating.missing)
			json['spontaneousDangerRating'] = this.spontaneousDangerRating;
		if (this.spontaneousAvalancheReleaseProbability && this.spontaneousAvalancheReleaseProbability != undefined)
			json['spontaneousAvalancheReleaseProbability'] = this.spontaneousAvalancheReleaseProbability;
		if (this.spontaneousHazardSiteDistribution && this.spontaneousHazardSiteDistribution != undefined)
			json['spontaneousHazardSiteDistribution'] = this.spontaneousHazardSiteDistribution;

		return json;
	}

	static createFromJson(json) {
		let matrixInformation = new MatrixInformationModel();

		matrixInformation.dangerRating = json.dangerRating;
		matrixInformation.avalancheSize = json.avalancheSize;
		matrixInformation.avalancheReleaseProbability = json.avalancheReleaseProbability;
		matrixInformation.hazardSiteDistribution = json.hazardSiteDistribution;
		matrixInformation.spontaneousDangerRating = json.spontaneousDangerRating;
		matrixInformation.spontaneousAvalancheReleaseProbability = json.spontaneousAvalancheReleaseProbability;
		matrixInformation.spontaneousHazardSiteDistribution = json.spontaneousHazardSiteDistribution;

		return matrixInformation;
	}
}