import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";


@Injectable()
export class GetQfaFilesService {
  private baseUrl="https://static.avalanche.report/zamg_qfa";

  constructor(private http: HttpClient) {}

  private getHTMLResponse() {
    return this.http.get(
      this.baseUrl, {
        observe: "body"
      }
    )
  }

  public getFilenames = async (baseUrl: string) => {
    this.baseUrl = baseUrl;
    const response = await this.getHTMLResponse().toPromise() as any[];
    const fileObjects = response.reverse();
    const lastFilename = localStorage.getItem("lastFilename") || "";
    const filenames = [] as string[];
    for(const fileObject of fileObjects) {
      if(fileObject.name === lastFilename) break;
      filenames.push(fileObject.name);
    }
    localStorage.setItem("lastFilename", filenames[0] || lastFilename);
    return filenames;
  }
}
