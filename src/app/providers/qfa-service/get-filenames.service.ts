import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";


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
    const filteredFiles = files.filter(name => name.includes(city));
    return filteredFiles;
  }
}
