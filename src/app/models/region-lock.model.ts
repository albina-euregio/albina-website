export class RegionLockModel {
  public username: string;
  public region: string;
  public date: Date;
  public lock: boolean;

  static createFromJson(json) {
    const regionLock = new RegionLockModel();

    regionLock.setUsername(json.username);
    regionLock.setDate(new Date(json.date));
    regionLock.setRegion(json.region);
    regionLock.setLock(json.lock);

    return regionLock;
  }

  constructor() {
    this.username = undefined;
    this.region = undefined;
    this.date = undefined;
    this.lock = undefined;
  }

  getUsername() {
    return this.username;
  }

  setUsername(username: string) {
    this.username = username;
  }

  getRegion() {
    return this.region;
  }

  setRegion(region: string) {
    this.region = region;
  }

  getDate() {
    return this.date;
  }

  setDate(date: Date) {
    this.date = date;
  }

  getLock() {
    return this.lock;
  }

  setLock(lock: boolean) {
    this.lock = lock;
  }

  toJson() {
    const json = Object();

    if (this.username && this.username !== undefined) {
      json["username"] = this.username;
    }
    if (this.region && this.region !== undefined && this.region !== "") {
      json["region"] = this.region;
    }
    if (this.date && this.date !== undefined) {
      json["date"] = this.getISOStringWithTimezoneOffset(this.date);
    }
    json["lock"] = this.lock;

    return json;
  }

  private getISOStringWithTimezoneOffset(date: Date) {
    const offset = -date.getTimezoneOffset();
    const dif = offset >= 0 ? "+" : "-";

    return date.getFullYear() +
      "-" + this.extend(date.getMonth() + 1) +
      "-" + this.extend(date.getDate()) +
      "T" + this.extend(date.getHours()) +
      ":" + this.extend(date.getMinutes()) +
      ":" + this.extend(date.getSeconds()) +
      dif + this.extend(offset / 60) +
      ":" + this.extend(offset % 60);
  }

  private extend(num: number) {
    const norm = Math.abs(Math.floor(num));
    return (norm < 10 ? "0" : "") + norm;
  }
}
