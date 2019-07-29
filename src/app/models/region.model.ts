import * as Enums from '../enums/enums';

export class RegionModel {
	public id: string;
	public name: string;
	public parentRegion: string;
	public aggregatedRegion: string;

	constructor() {
		this.id = undefined;
		this.name = undefined;
		this.parentRegion = undefined;
		this.aggregatedRegion = undefined;
	}

	getId() : string {
		return this.id;
	}

	setId(id: string) {
		this.id = id;
	}

	getName() : string {
		return this.name;
	}

	setName(name: string) {
		this.name = name;
	}

	getParentRegion() : string {
		return this.parentRegion;
	}

	setParentRegion(parentRegion: string) {
		this.parentRegion = parentRegion;
	}

	getAggregatedRegion() : string {
		return this.aggregatedRegion;
	}

	setAggregatedRegion(aggregatedRegion: string) {
		this.aggregatedRegion = aggregatedRegion;
	}

	static createFromJson(json) {
		let region = new RegionModel();

		region.setId(json.properties.id);
		region.setName(json.properties.name);
		region.setParentRegion(json.properties.parentRegion);

		region.setAggregatedRegion(json.properties.aggregatedRegion);

		return region;
	}
}