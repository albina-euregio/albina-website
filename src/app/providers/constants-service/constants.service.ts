import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  public serverUrl: string = 'http://localhost:8080/albina/api/';
  //public serverUrl: string = 'http://212.47.231.185:8080/albina/api/';
  
  public socketIOUrl: string = 'http://localhost:9092';
  //public socketIOUrl: string = 'http://127.0.0.1:9092';
  //public socketIOUrl: string = 'http://212.47.231.185:9092';

  constructor() {
  }

  getServerUrl() {
    return this.serverUrl;
  }

  getISOStringWithTimezoneOffset(date: Date) {
    let offset = -date.getTimezoneOffset();
    let dif = offset >= 0 ? '+' : '-';

    return encodeURIComponent(date.getFullYear() + 
      '-' + this.extend(date.getMonth() + 1) +
      '-' + this.extend(date.getDate()) +
      'T' + this.extend(date.getHours()) +
      ':' + this.extend(date.getMinutes()) +
      ':' + this.extend(date.getSeconds()) +
      dif + this.extend(offset / 60) +
      ':' + this.extend(offset % 60));
  }

  extend(num: number) {
    let norm = Math.abs(Math.floor(num));
    return (norm < 10 ? '0' : '') + norm;
  }
}