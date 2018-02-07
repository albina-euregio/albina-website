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
		this.dangerRating = Enums.DangerRating.missing;
		this.spontaneousDangerRating = Enums.DangerRating.missing;
	}

	getDangerRating() {
		return this.dangerRating;
	}

	setDangerRating(dangerRating) {
		this.dangerRating = dangerRating
	}

	getAvalancheSize() {
		return this.avalancheSize;
	}

	setAvalancheSize(avalancheSize) {
		this.avalancheSize = avalancheSize;
	}

	getAvalancheReleaseProbability() {
		return this.avalancheReleaseProbability;
	}

	setAvalancheReleaseProbability(avalancheReleaseProbability) {
		this.avalancheReleaseProbability = avalancheReleaseProbability;
	}

	getHazardSiteDistribution() {
		return this.hazardSiteDistribution;
	}

	setHazardSiteDistribution(hazardSiteDistribution) {
		this.hazardSiteDistribution = hazardSiteDistribution;
	}

	getSpontaneousDangerRating() {
		return this.spontaneousDangerRating;
	}

	setSpontaneousDangerRating(spontaneousDangerRating) {
		this.spontaneousDangerRating = spontaneousDangerRating
	}

	getSpontaneousAvalancheReleaseProbability() {
		return this.spontaneousAvalancheReleaseProbability;
	}

	setSpontaneousAvalancheReleaseProbability(spontaneousAvalancheReleaseProbability) {
		this.spontaneousAvalancheReleaseProbability = spontaneousAvalancheReleaseProbability;
	}

	getSpontaneousHazardSiteDistribution() {
		return this.spontaneousHazardSiteDistribution;
	}

	setSpontaneousHazardSiteDistribution(spontaneousHazardSiteDistribution) {
		this.spontaneousHazardSiteDistribution = spontaneousHazardSiteDistribution;
	}

	toJson() {
		var json = Object();

		if (this.dangerRating && this.dangerRating != undefined)
			json['dangerRating'] = this.dangerRating;
		if (this.avalancheSize && this.avalancheSize != undefined)
			json['avalancheSize'] = this.avalancheSize;
		if (this.avalancheReleaseProbability && this.avalancheReleaseProbability != undefined)
			json['avalancheReleaseProbability'] = this.avalancheReleaseProbability;
		if (this.hazardSiteDistribution && this.hazardSiteDistribution != undefined)
			json['hazardSiteDistribution'] = this.hazardSiteDistribution;
		if (this.spontaneousDangerRating && this.spontaneousDangerRating != undefined)
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