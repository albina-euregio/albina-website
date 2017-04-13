import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  public serverUrl: string = 'http://localhost:8080/albina/api/';

  constructor() {
  }

  getServerUrl() {
    return this.serverUrl;
  }
}