export class UserModel {
  public name: string;
  public email: string;
  public organization: string;
  public image: string;
  public password: string;
  public roles: string[];
  public regions: string[];

  constructor() {
    this.name = undefined;
    this.email = undefined;
    this.organization = undefined;
    this.roles = [];
    this.image = undefined;
    this.regions = [];
    this.password = undefined;
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

  getOrganization() {
    return this.organization;
  }

  setOrganization(organization) {
    this.organization = organization;
  }

  getRoles(): string[] {
    return this.roles;
  }

  setRoles(roles: string[]) {
    this.roles = roles;
  }

  addRole(role: string) {
    if (role !== undefined && role.length > 0) {
      this.roles.push(role);
    }
  }

  getImage() {
    return this.image;
  }

  setImage(image) {
    this.image = image;
  }

  getRegions(): string[] {
    return this.regions;
  }

  setRegions(regions: string[]) {
    this.regions = regions;
  }

  getPassword() {
    return this.image;
  }

  setPassword(password) {
    this.password = password;
  }

  toJson() {
    const json = Object();

    if (this.name && this.name !== undefined && this.name !== "") {
      json["name"] = this.name;
    }
    if (this.email && this.email !== undefined && this.email !== "") {
      json["email"] = this.email;
    }
    if (this.password && this.password !== undefined && this.password !== "") {
      json["password"] = this.password;
    }
    if (this.organization && this.organization !== undefined && this.organization !== "") {
      json["organization"] = this.organization;
    }
    if (this.regions && this.regions.length > 0) {
      const regions = [];
      for (let i = 0; i <= this.regions.length - 1; i++) {
        regions.push(this.regions[i]);
      }
      json["regions"] = regions;
    }
    if (this.roles && this.roles.length > 0) {
      const roles = [];
      for (let i = 0; i <= this.roles.length - 1; i++) {
        roles.push(this.roles[i]);
      }
      json["roles"] = roles;
    }

    return json;
  }
}
