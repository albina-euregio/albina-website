import * as Enums from '../enums/enums';

export class RegionModel {
	public id: string;
	public name: string;
	public parentRegion: RegionModel;
	public subregions: RegionModel[];
	public aggregatedRegion: RegionModel;

	constructor() {
		this.id = undefined;
		this.name = undefined;
		this.parentRegion = undefined;
		this.subregions = new Array<RegionModel>();
		this.aggregatedRegion = undefined;
	}

	getId() {
		return this.id;
	}

	setId(id) {
		this.id = id;
	}

	getName() {
		return this.name;
	}

	setName(name) {
		this.name = name;
	}

	getParentRegion() {
		return this.parentRegion;
	}

	setParentRegion(parentRegion) {
		this.parentRegion = parentRegion;
	}

	getSubregions() {
		return this.subregions;
	}

	setSubregions(subregions) {
		this.subregions = subregions;
	}

	getAggregatedRegion() {
		return this.aggregatedRegion;
	}

	setAggregatedRegion(aggregatedRegion) {
		this.aggregatedRegion = aggregatedRegion;
	}

	toJson() {
		var json = Object();
		
		if (this.id && this.id != undefined)
			json['id'] = this.id;
		if (this.name && this.name != undefined)
			json['name'] = this.name;

		if (this.parentRegion && this.parentRegion != undefined)
			json['parentRegion'] = this.parentRegion.toJson();

		if (this.subregions && this.subregions.length > 0) {
			let subregions = [];
			for (let i = 0; i <= this.subregions.length - 1; i++) {
				subregions.push(this.subregions[i]);
			}
			json['subregions'] = subregions;
		}

		if (this.aggregatedRegion && this.aggregatedRegion != undefined)
			json['aggregatedRegion'] = this.aggregatedRegion.toJson();

		return json;
	}

	static createFromJson(json) {
		let region = new RegionModel();

		region.setId(json.id);
		region.setName(json.name);
		region.setParentRegion(RegionModel.createFromJson(json.parentRegion));

		let jsonSubregions = json.subregions;
		let subregions = new Array<RegionModel>();
		for (let i in jsonSubregions) {
			subregions.push(RegionModel.createFromJson(jsonSubregions[i]));
		}
		region.setSubregions(subregions);

		region.setAggregatedRegion(RegionModel.createFromJson(json.aggregatedRegion));

		return region;
	}
}