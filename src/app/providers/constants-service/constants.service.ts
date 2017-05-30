import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  //public serverUrl: string = 'http://localhost:8080/albina/api/';
  public serverUrl: string = 'http://212.47.231.185:8080/albina/api/';
  
  //public socketIOUrl: string = 'http://localhost:9092';
  //public socketIOUrl: string = 'http://127.0.0.1:9092';
  public socketIOUrl: string = 'http://212.47.231.185:9092';

  constructor() {
  }

  getServerUrl() {
    return this.serverUrl;
  }
}