export class AuthorModel {
	public accessToken: string;
	public refreshToken: string;
	public name: string;
	public email: string;
	public phone: string;
	public organization: string;
	public roles: string[];
	public image: string;
	public regions: string[];

	constructor() {
		this.accessToken = undefined;
		this.refreshToken = undefined;
		this.name = undefined;
		this.email = undefined;
		this.phone = undefined;
		this.organization = undefined;
		this.roles = undefined;
		this.image = undefined;
		this.regions = undefined;
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

	getRoles() : string[] {
		return this.roles;
	}

	setRoles(roles: string[]) {
		this.roles = roles; 
	}

	hasRole(role: string) {
		if (this.roles.indexOf(role) > -1)
			return true;
		else
			return false;
	}

	getImage() {
		return this.image;
	}

	setImage(image) {
		this.image = image;
	}

	getRegions() : string[] {
		return this.regions;
	}

	setRegions(regions: string[]) {
		this.regions = regions;
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
		if (this.roles && this.roles.length > 0) {
			let roles = [];
			for (let i = 0; i <= this.roles.length - 1; i++) {
				roles.push(this.roles[i]);
			}
			json['roles'] = roles;
		}
		if (this.regions && this.regions.length > 0) {
			let regions = [];
			for (let i = 0; i <= this.regions.length - 1; i++) {
				regions.push(this.regions[i]);
			}
			json['regions'] = regions;
		}

		return json;
	}

	static createFromJson(json) {
		let author = new AuthorModel();

		author.setName(json.name);
		author.setEmail(json.email);
		author.setPhone(json.phone);
		author.setOrganization(json.organization);
		let jsonRoles = json.roles;
		let roles = new Array<string>();
		for (let i in jsonRoles) {
			roles.push(jsonRoles[i]);
		}
		author.setRoles(roles);
		author.setImage(json.image);
		let jsonRegions = json.regions;
		let regions = new Array<string>();
		for (let i in jsonRegions) {
			regions.push(jsonRegions[i]);
		}
		author.setRegions(regions);

		return author;
	}
}
