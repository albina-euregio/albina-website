import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  public serverUrl: string = 'http://localhost:8080/albina/api/';
  public socketIOUrl: string = 'http://localhost:5000';

  constructor() {
  }

  getServerUrl() {
    return this.serverUrl;
  }
}