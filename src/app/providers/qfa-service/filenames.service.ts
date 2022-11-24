import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

interface File {
  date: string;
  hours: string;
  minutes: string;
  startDay: string;
  endDay: string;
  city: string;
  qfa: string;
  filename: string;
}

@Injectable()
export class GetFilenamesService {
  private baseUrl="https://static.avalanche.report/zamg_qfa";

  constructor(private http: HttpClient) {}

  private getHTMLResponse() {
    return this.http.get(
      this.baseUrl, {
        observe: "body"
      }
    )
  }

  public getFilenames = async (baseUrl: string, city: string) => {
    this.baseUrl = baseUrl;
    const response = await this.getHTMLResponse().toPromise() as any[];
    const files = response.reverse();
    console.log(files);
    const filteredFiles = files.filter(file => file.name.includes(city));
    return filteredFiles;
  }

  public parseFilename = (filename: string): File => {
    const parts = filename.split("_");
    return {
      date: parts[0],
      hours: parts[1].substring(0, 2),
      minutes: parts[1].substring(2, 4),
      startDay: parts[4].substring(0, 2),
      endDay: parts[4].substring(2, 4),
      city: parts[3],
      qfa: parts[2],
      filename: filename
    }
  }

  public stringifyFile = (file: File): string => {
    return `${file.date}_${file.hours}${file.minutes}_${file.qfa}_${file.city}_${file.startDay}${file.endDay}.txt`;
  }

  public changeDay =(file: File, startDay: string, endDay: string): File => {
    file.startDay = startDay;
    file.endDay = endDay;
    file.filename = this.stringifyFile(file);
    return file;
  }

  public getCityName = (files: File[]): string | void => {
    if(files.length) {
      const name = files[0].city.charAt(0).toUpperCase() + files[0].city.slice(1);
      return name;
    }
  }
}
