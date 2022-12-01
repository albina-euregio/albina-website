import * as types from  "../../qfa/types/QFA";

import { HttpClient, HttpHeaders } from "@angular/common/http";

export class QfaFile implements types.QFA {
  public metadata = {} as types.metadata;
  public parameters = {} as types.parameters;
  private skironURL = "https://admin.avalanche.report/forecast.uoa.gr/0day/DUST/GRID1/zoomdload/%d.zoomdload.png"

  constructor(private http: HttpClient) {}

  get data(): types.data {
    return {
      metadata: this.metadata,
      parameters: this.parameters
    }
  }

  get coordinates() {
      return this.metadata.coords;
  }

  get height () {
      return this.metadata.height;
  }

  get date() {
    const date = new Intl.DateTimeFormat("de", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
      timeZoneName: "short"
    })
    const stringDate = date.format(this.metadata.date)
      .replace(/\./, "")
      .replace(" um", ",");
    return stringDate;
  }

  get paramDates() {
    const intlDates = this.metadata.dates.map(date => new Intl.DateTimeFormat("de", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      timeZone: "UTC"
    }).format(date));

    const prettyDates = intlDates.map(date =>
      date.replace(/\./, "")
    );

    return prettyDates;
  }

  public listParameters() {
      return Object.keys(this.parameters);
  }

  private getHTMLFile = (url: string) => {
    return this.http.get(
      url, {
        responseType: "text",
        observe: "body"
      }
    )
  }

  private loadSkironForecast = (time: number) => {
    const paddedNumber = time.toString().padStart(3, "0");
    const url = this.skironURL.replace("%d", paddedNumber);
    const headers = new HttpHeaders({
      "Accept": "image/avif,image/webp,*/*"
    })
    return this.http.get(
      url, {
        responseType: "blob",
        observe: "body",
        headers: headers
      }
    )
  }

  public getDustParams = async () => {
    const nSteps = 16
    for(let i = 0; i <= nSteps*6; i+=6) {
      const imageBlob = await this.loadSkironForecast(i).toPromise() as Blob;
      console.log(imageBlob);
    }
  }

  public loadFromURL = async (url: string) => {
    const fullUrl = `https://static.avalanche.report/zamg_qfa/${url}`;
    const response = await this.getHTMLFile(fullUrl).toPromise() as string;
    this.parseText(response);
    // console.log(this.data);
    return;
  }

  private parseMetaData = (plainText: string): types.metadata => {
      const plainMetadata = plainText.split("=======================================================================================")[0];
      const data = plainMetadata.split(/[\s]{2,}/g);

      const days = data[9].match(/\d/g);
      const nDays = Number(days![1]) - Number(days![0] || 0) + 1;
      const date = this.parseDate(data[6]);

      const parameters: types.metadata = {
          location: data[1],
          coords: {
              lng: Number(data[2]),
              lat: Number(data[3]),
          },
          height: Number(data[4]),
          orog: Number(data[5].match(/[\d]+/g)),
          date: date,
          timezone: data[7].split(" ")[1],
          model: data[8],
          nDays: nDays,
      }
      return parameters
  }

  private parseDate = (date: string): Date => {
      const months = ["Jan", "Feb", "Mrz", "Apr", "Mai", "Juni", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
      const day = Number(date.match(/[\d]+/));
      const month = months.filter(month => date.includes(month))[0];
      const year = Number(date.match(/[\d]{4}/));
      const parameters = new Date(Date.UTC(year, months.indexOf(month), day));
      return parameters;
  }

  private parseParameters = (plainText: string): types.parameters => {
      let data = plainText.split("=======================================================================================")[1]
      data = data.replace("=", "");
      // data = data.replace(/[\s]{2,}/g, " ");
      data = data.replace(/[-]{5,}\|/g, "");
      const allLines = data.split("\n");
      const plainDates = allLines[1].split(" |");
      this.metadata.dates = [
          this.parseDate(plainDates[1]),
          this.parseDate(plainDates[2]),
          this.parseDate(plainDates[3]),
      ]
      const dateStrings = this.metadata.dates.map(el => el.toISOString().split('T')[0]);
      const lines = allLines.filter((el, i) => el !== '' && i > 3);

      const parameters = {} as types.parameters;
      for(const line of lines) {
          let sub = line.substring(0, line.length - 2);
          sub = sub.replace(/[\s]{24,}/g, " --- --- --- --- ");
          sub = sub.replace(/[\s]{18,}/g, " --- --- ---");
          sub = sub.replace(/[\s]{12,}/g, " --- --- ");
          sub = sub.replace(/[\s]{6,}/g, " --- ");
          sub = sub.replace(/[\s]+/g, " ");
          // console.log(sub);
          const cols = sub.split(" | ");
          // console.log(cols);

          const partial = []
          for(const strKey of Object.keys(dateStrings)) {
              // console.log(key, value)
              const key = parseInt(strKey) + 1;
              // console.log(key);
              partial.push({
                  "00": cols[key].split(" ")[0],
                  "06": cols[key].split(" ")[1],
                  "12": cols[key].split(" ")[2],
                  "18": cols[key].split(" ")[3],
              })
          }
          const parameterName = cols[0].split(" ---")[0];
          parameters[parameterName] = partial;
      }

      return parameters;
  }

  private parseText = (plainText: string) =>  {
      this.metadata = this.parseMetaData(plainText);
      this.parameters = this.parseParameters(plainText);
  }
}
