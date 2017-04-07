import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  public serverUrl: string = 'http://163.172.163.251:8080/ALBINA/api/';

  constructor() {
  }

  getServerUrl() {
    return this.serverUrl;
  }
}