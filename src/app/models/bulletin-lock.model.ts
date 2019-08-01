import * as Enums from "../enums/enums";

export class BulletinLockModel {
  public username: string;
  public bulletin: string;
  public date: Date;
  public lock: boolean;

  static createFromJson(json) {
    const bulletinLock = new BulletinLockModel();

    bulletinLock.setUsername(json.username);
    bulletinLock.setDate(new Date(json.date));
    bulletinLock.setBulletin(json.bulletin);
    bulletinLock.setLock(json.lock);

    return bulletinLock;
  }

  constructor() {
    this.username = undefined;
    this.bulletin = undefined;
    this.date = undefined;
    this.lock = undefined;
  }

  getUsername() {
    return this.username;
  }

  setUsername(username: string) {
    this.username = username;
  }

  getBulletin() {
    return this.bulletin;
  }

  setBulletin(bulletin: string) {
    this.bulletin = bulletin;
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
    if (this.bulletin && this.bulletin !== undefined && this.bulletin !== "") {
      json["bulletin"] = this.bulletin;
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
