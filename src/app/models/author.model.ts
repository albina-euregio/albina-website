export class AuthorModel {
	public name: String;
	public email: String;
	public phone: String;
	public organization: String;
	public role: String;

	constructor() {
		this.name = undefined;
		this.email = undefined;
		this.phone = undefined;
		this.organization = undefined;
		this.role = undefined;
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

		return json;
	}

	static createFromJson(json) {
		let author = new AuthorModel();

		author.setName(json.name);
		author.setEmail(json.email);
		author.setPhone(json.phone);
		author.setOrganization(json.organization);
		author.setRole(json.role);

		return author;
	}
}
