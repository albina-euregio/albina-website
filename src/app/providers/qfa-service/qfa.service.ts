import { Injectable } from "@angular/core";
import * as types from  "../../qfa/types/QFA";

import { HttpClient } from "@angular/common/http";

@Injectable()
export class QfaService implements types.QFA {
  public data = {} as types.data;

  constructor(private http: HttpClient) {}

  get coordinates() {
      return this.data.metadata.coords;
  }

  get height () {
      return this.data.metadata.height;
  }

  get metadata() {
      return this.data.metadata;
  }

  get parameters() {
      return this.data.parameters;
  }

  public listParameters() {
      return Object.keys(this.data.parameters);
  }

  private getHTMLFile = (url: string) => {
    return this.http.get(
      url, {
        responseType: "text",
        observe: "body"
      }
    )
  }

  public loadFromURL = async (url: string) => {
    const fullUrl = `https://static.avalanche.report/zamg_qfa/${url}`;
    const response = await this.getHTMLFile(fullUrl).toPromise() as string;
    this.data = this.parseText(response);
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
              lat: Number(data[2]),
              lon: Number(data[3]),
          },
          height: Number(data[4]),
          orog: Number(data[5].match(/[\d]+/g)),
          date: date,
          timezone: data[7].split(" ")[1],
          model: data[8],
          days: nDays
      }
      return parameters
  }

  private parseDate = (date: string): Date => {
      const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
      const day = Number(date.match(/[\d]+/));
      const month = months.filter(month => date.includes(month))[0];
      const year = Number(date.match(/[\d]{4}/));
      const parameters = new Date(year, months.indexOf(month), day);
      return parameters;
  }

  private parseParameters = (plainText: string): types.parameters => {
      let data = plainText.split("=======================================================================================")[1]
      data = data.replace("=", "");
      // data = data.replace(/[\s]{2,}/g, " ");
      data = data.replace(/[-]{5,}\|/g, "");
      const allLines = data.split("\n");
      const plainDates = allLines[1].split(" |");
      const dates = [
          this.parseDate(plainDates[1]),
          this.parseDate(plainDates[2]),
          this.parseDate(plainDates[3]),
      ]
      const dateStrings = dates.map(el => el.toISOString().split('T')[0]);
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

          const partial = {}
          for(const [strKey, value] of Object.entries(dateStrings)) {
              // console.log(key, value)
              const key = parseInt(strKey) + 1;
              // console.log(key);
              partial[value] = {
                  "00": cols[key].split(" ")[0],
                  "06": cols[key].split(" ")[1],
                  "12": cols[key].split(" ")[2],
                  "18": cols[key].split(" ")[3],
              }
          }
          const parameterName = cols[0].split(" ---")[0];
          parameters[parameterName] = partial;
      }

      return parameters;
  }

  private parseText = (plainText: string) =>  {
      const metadata = this.parseMetaData(plainText);
      const parameters = this.parseParameters(plainText);

      const result = {
          metadata,
          parameters,
      }

      return result;
  }
}
