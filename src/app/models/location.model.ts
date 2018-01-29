import * as Enums from '../enums/enums';

export class LocationModel {
	public country: Enums.CountryAlpha2Code;
	public region: String;
	public subregion: String;
	public name: String;
	public latitude: number;
	public longitude: number;
	public accuracy: number;
	public elevation: number;
	public angle: number;
	public aspect: Enums.Aspect;
	public quality: Enums.Quality;

	constructor(location?) {
		if (location) {
			this.country = location.country;
			this.region = location.region;
			this.subregion = location.subregion;
			this.name = location.name;
			this.latitude = location.latitude;
			this.longitude = location.longitude;
			this.accuracy = location.accuracy;
			this.elevation = location.elevation;
			this.angle = location.angle;
			this.aspect = location.aspect;
			this.quality = location.quality;
		} else {
			this.country = undefined;
			this.region = undefined;
			this.subregion = undefined;
			this.name = undefined;
			this.latitude = undefined;
			this.longitude = undefined;
			this.accuracy = undefined;
			this.elevation = undefined;
			this.angle = undefined;
			this.aspect = undefined;
			this.quality = undefined;
		}
	}

	getCountry() {
		return this.country;
	}

	setCountry(country) {
		this.country = country;
	}

	getCountryString() {
		return Enums.CountryAlpha2Code[this.country];
	}

	getRegion() {
		return this.region;
	}

	setRegion(region) {
		this.region = region;
	}

	getSubregion(){
		return this.subregion;
	}

	setSubregion(subregion) {
		this.subregion = subregion;
	}

	getName() {
		return this.name;
	}

	setName(name) {
		this.name = name;
	}

	getLatitude() {
		return this.latitude;
	}

	setLatitude(latitude) {
		this.latitude = latitude;
	}

	getLongitude() {
		return this.longitude;
	}

	setLongitude(longitude) {
		this.longitude = longitude;
	}

	getAccuracy() {
		return this.accuracy;
	}

	setAccuracy(accuracy) {
		this.accuracy = accuracy;
	}

	getElevation() {
		return this.elevation;
	}

	setElevation(elevation) {
		this.elevation = elevation;
	}

	getAngle() {
		return this.angle;
	}

	setAngle(angle) {
		this.angle = angle;
	}

	getAspect() {
		return this.aspect;
	}

	setAspect(aspect) {
		this.aspect = aspect;
	}

	getQuality() {
		return this.quality;
	}

	setQuality(quality) {
		this.quality = quality;
	}

	toJson() {
		let json = Object();

		if (this.country != undefined)
			json['country'] = Enums.CountryAlpha2Code[this.country];
		if (this.region && this.region != undefined && this.region != "")
			json['region'] = this.region;
		if (this.subregion && this.subregion != undefined && this.subregion != "")
			json['subregion'] = this.subregion;
		if (this.name && this.name != undefined && this.name != "")
			json['name'] = this.name;

		if (this.latitude && this.latitude != undefined && this.latitude != 0 && this.longitude && this.longitude != undefined && this.longitude != 0) {
			let geo = Object();
			if (this.latitude && this.latitude != 0)
				geo['latitude'] =+ this.latitude;
			if (this.longitude && this.longitude != 0)
				geo['longitude'] =+ this.longitude;
			json['geo'] = geo;
		}

		if (this.accuracy && this.accuracy != undefined && this.accuracy != 0)
			json['accuracy'] =+ this.accuracy;
		if (this.elevation && this.elevation != undefined && this.elevation != 0)
			json['elevation'] =+ this.elevation;
		if (this.angle && this.angle != undefined && this.angle != 0)
			json['angle'] =+ this.angle;
		if (this.aspect && this.aspect != undefined)
			json['aspect'] = Enums.Aspect[this.aspect];
		if (this.quality && this.quality != undefined)
			json['quality'] = Enums.Quality[this.quality];

		return json;
	}

	static createFromJson(json) {
		let location = new LocationModel();

		location.setCountry(Enums.CountryAlpha2Code[json.country]);
		location.setRegion(json.region);
		location.setSubregion(json.subregion);
		location.setName(json.name);
		if (json.geo) {
			location.setLatitude(json.geo.latitude);
			location.setLongitude(json.geo.longitude);
		}
		location.setAccuracy(json.accuracy);
		location.setElevation(json.elevation);
		location.setAngle(json.angle);
		location.setAspect(Enums.Aspect[json.aspect]);
		location.setQuality(Enums.Quality[json.quality]);

		return location;
	}
}