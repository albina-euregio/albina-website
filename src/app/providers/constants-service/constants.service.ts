import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  //public serverUrl: string = 'http://localhost:8080/albina/api/';
  public serverUrl: string = 'http://212.47.231.185:8080/albina/api/';
  
  //public socketIOUrl: string = 'http://localhost:9092';
  //public socketIOUrl: string = 'http://127.0.0.1:9092';
  public socketIOUrl: string = 'http://212.47.231.185:9092';

  public codeTyrol: string = 'AT-07';
  public codeSouthTyrol: string = 'IT-32-BZ';
  public codeTrentino: string = 'IT-32-TN';

  public lat: Map<string, number> = new Map([[this.codeTyrol, 47.10], [this.codeSouthTyrol, 46.65], [this.codeTrentino, 46.05]])
  public lng: Map<string, number> = new Map([[this.codeTyrol, 11.44], [this.codeSouthTyrol, 11.40], [this.codeTrentino, 11.07]])

  constructor() {
  }

  getServerUrl() {
    return this.serverUrl;
  }

  getISOStringWithTimezoneOffsetUrlEncoded(date: Date) {
    return encodeURIComponent(this.getISOStringWithTimezoneOffset(date));
  }

  getISOStringWithTimezoneOffset(date: Date) {
    let offset = -date.getTimezoneOffset();
    let dif = offset >= 0 ? '+' : '-';

    return date.getFullYear() + 
      '-' + this.extend(date.getMonth() + 1) +
      '-' + this.extend(date.getDate()) +
      'T' + this.extend(date.getHours()) +
      ':' + this.extend(date.getMinutes()) +
      ':' + this.extend(date.getSeconds()) +
      dif + this.extend(offset / 60) +
      ':' + this.extend(offset % 60);
  }

  extend(num: number) {
    let norm = Math.abs(Math.floor(num));
    return (norm < 10 ? '0' : '') + norm;
  }

  getLat(region: string) {
    return this.lat.get(region);
  }

  getLng(region: string) {
    return this.lng.get(region);
  }
}