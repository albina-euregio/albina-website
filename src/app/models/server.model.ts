export class ServerModel {
  public accessToken: string;
  public refreshToken: string;
  public name: string;
  public email: string;
  public roles: string[];
  public regions: string[];
  public apiUrl: string;

  static createFromJson(json: Partial<ServerModel> & {access_token?: string; refresh_token?: string; api_url?: string}) {
    const author = new ServerModel();

    author.setName(json.name);
    author.setEmail(json.email);
    const jsonRoles = json.roles;
    const roles = new Array<string>();
    for (const i in jsonRoles) {
     if (jsonRoles[i] !== null) {
       roles.push(jsonRoles[i]);
     }
    }
    author.setRoles(roles);
    const jsonRegions = json.regions;
    const regions = new Array<string>();
    for (const i in jsonRegions) {
      if (jsonRegions[i] !== null) {
        regions.push(jsonRegions[i]);
      }
    }
    author.setRegions(regions);

    author.setAccessToken(json.accessToken ?? json.access_token);
    author.setRefreshToken(json.refreshToken ?? json.refresh_token);
    author.setApiUrl(json.apiUrl ?? json.api_url);

    return author;
  }

  constructor() {
    this.accessToken = undefined;
    this.refreshToken = undefined;
    this.name = undefined;
    this.email = undefined;
    this.roles = undefined;
    this.regions = undefined;
    this.apiUrl = undefined;
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

  getRoles(): string[] {
    return this.roles;
  }

  setRoles(roles: string[]) {
    this.roles = roles;
  }

  hasRole(role: string) {
    if (this.roles.indexOf(role) > -1) {
      return true;
    } else {
      return false;
    }
  }

  getRegions(): string[] {
    return this.regions;
  }

  setRegions(regions: string[]) {
    this.regions = regions;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  setApiUrl(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  toJson() {
    const json = Object();

    if (this.name && this.name !== undefined && this.name !== "") {
      json["name"] = this.name;
    }
    if (this.email && this.email !== undefined && this.email !== "") {
      json["email"] = this.email;
    }

    return json;
  }
}
