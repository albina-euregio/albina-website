import * as Enums from "../enums/enums";

export class DatetimeModel {
  public date: Date;
  public quality: Enums.Quality;

  static createFromJson(json) {
    const datetime = new DatetimeModel();
    datetime.setDate(new Date(json.date));
    datetime.setQuality(Enums.Quality[json.quality]);

    return datetime;
  }

  constructor() {
    this.date = undefined;
    this.quality = undefined;
  }

  getDate() {
    return this.date;
  }

  setDate(date) {
    this.date = date;
  }

  getQuality() {
    return this.quality;
  }

  setQuality(quality) {
    this.quality = quality;
  }

  toJson() {
    const json = Object();

    if (this.date && this.date !== undefined) {
      json["date"] = this.date;
    }
    if (this.quality && this.quality !== undefined) {
      json["quality"] = Enums.Quality[this.quality];
    }

    return json;
  }
}