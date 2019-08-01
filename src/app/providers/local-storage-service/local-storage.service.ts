import { Injectable } from "@angular/core";
import { BulletinModel } from "../../models/bulletin.model";


@Injectable()
export class LocalStorageService {

  constructor() {
  }

  save(date: Date, region: string, author: string, bulletins: BulletinModel[]) {
    localStorage.setItem("date", date.getTime().toString());
    localStorage.setItem("region", region);
    localStorage.setItem("author", author);
    const jsonBulletins = [];
    for (let i = bulletins.length - 1; i >= 0; i--) {
      jsonBulletins.push(bulletins[i].toJson());
    }
    localStorage.setItem("bulletins", JSON.stringify(jsonBulletins));
  }

  clear() {
    localStorage.removeItem("date");
    localStorage.removeItem("region");
    localStorage.removeItem("author");
    localStorage.removeItem("bulletins");
  }

  getBulletins(): BulletinModel[] {
    const bulletinsList = new Array<BulletinModel>();
    const stringBulletins = localStorage.getItem("bulletins");
    if (stringBulletins !== undefined) {
      const jsonBulletins = JSON.parse(stringBulletins);

      for (const jsonBulletin of jsonBulletins) {
        bulletinsList.push(BulletinModel.createFromJson(jsonBulletin));
      }
    }
    return bulletinsList;
  }

  getDate(): Date {
    return new Date(+localStorage.getItem("date"));
  }

  getRegion(): string {
    return localStorage.getItem("region");
  }

  getAuthor(): string {
    return localStorage.getItem("author");
  }
}
