export class AuthorModel {
	public accessToken: string;
	public refreshToken: string;
	public name: string;
	public email: string;
	public phone: string;
	public organization: string;
	public role: string;
	public image: string;
	public region: string;

	constructor() {
		this.accessToken = undefined;
		this.refreshToken = undefined;
		this.name = undefined;
		this.email = undefined;
		this.phone = undefined;
		this.organization = undefined;
		this.role = undefined;
		this.image = undefined;
		this.region = undefined;
	}

	getAccessToken() {
		return this.accessToken;
	}

	setAccessToken(accessToken) {
		this.accessToken = accessToken;
	}

	getRefreshToken() {
		return this.refreshToken;
	}

	setRefreshToken(refreshToken) {
		this.refreshToken = refreshToken;
	}

	getName() {
		return this.name;
	}

	setName(name) {
		this.name = name;
	}

	getEmail() {
		return this.email;
	}

	setEmail(email) {
		this.email = email;
	}

	getPhone() {
		return this.phone;
	}

	setPhone(phone) {
		this.phone = phone;
	}

	getOrganization() {
		return this.organization;
	}

	setOrganization(organization) {
		this.organization = organization;
	}

	getRole() {
		return this.role;
	}

	setRole(role) {
		this.role = role; 
	}

	getImage() {
		return this.image;
	}

	setImage(image) {
		this.image = image;
	}

	getRegion() {
		return this.region;
	}

	setRegion(region) {
		this.region = region;
	}

	toJson() {
		var json = Object();

		if (this.name && this.name != undefined && this.name != "")
			json['name'] = this.name;
		if (this.email && this.email != undefined && this.email != "")
			json['email'] = this.email;
		if (this.phone && this.phone != undefined && this.phone != "")
			json['phone'] = this.phone;
		if (this.organization && this.organization != undefined && this.organization != "")
			json['organization'] = this.organization;
		if (this.role && this.role != undefined && this.role != "")
			json['role'] = this.role;
		if (this.region && this.region != undefined && this.region != "")
			json['region'] = this.region;

		return json;
	}

	static createFromJson(json) {
		let author = new AuthorModel();

		author.setName(json.name);
		author.setEmail(json.email);
		author.setPhone(json.phone);
		author.setOrganization(json.organization);
		author.setRole(json.role);
		author.setImage(json.image);
		author.setRegion(json.region);

		return author;
	}
}
