import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  // Localhost
  //public serverUrl: string = 'http://localhost:8080/albina/api/';
  //public socketIOUrl: string = 'http://localhost:9092';

  // Development server
  public serverUrl: string = 'http://212.47.231.185:8080/albina/api/';
  public socketIOUrl: string = 'http://212.47.231.185:9092';

  // CLESIUS
  //public serverUrl: string = 'http://192.168.30.189:8080/albina/api/';
  //public socketIOUrl: string = 'http://192.168.30.189:9092';

  public snowObserverServerUrl: string = 'https://snowobserver.com/snowobserver/api/';
  public natlefsServerUrl: string = 'https://natlefs.snowobserver.com/snowobserver/api/';
  public natlefsUsername: string = 'norbert.lanzanasto@tirol.gv.at';
  public natlefsPassword: string = 'FRYLjTQ2';

  public codeTyrol: string = 'AT-07';
  public codeSouthTyrol: string = 'IT-32-BZ';
  public codeTrentino: string = 'IT-32-TN';

  public lat: Map<string, number> = new Map([[this.codeTyrol, 47.10], [this.codeSouthTyrol, 46.65], [this.codeTrentino, 46.05]])
  public lng: Map<string, number> = new Map([[this.codeTyrol, 11.44], [this.codeSouthTyrol, 11.40], [this.codeTrentino, 11.07]])

  public mapBoundaryN: number = 48.0;
  public mapBoundaryE: number = 13.5;
  public mapBoundaryS: number = 45.0;
  public mapBoundaryW: number = 9.0;

  public timeframe: number = 14;

  public regions: Map<string, String[]> = new Map([
    [this.codeTyrol, ['AT-07-01', 'AT-07-02', 'AT-07-03', 'AT-07-04', 'AT-07-05', 'AT-07-06', 'AT-07-07', 'AT-07-08', 'AT-07-09', 'AT-07-10', 'AT-07-11', 'AT-07-12', 'AT-07-13', 'AT-07-14', 'AT-07-15', 'AT-07-16', 'AT-07-17', 'AT-07-18', 'AT-07-19', 'AT-07-20', 'AT-07-21', 'AT-07-22', 'AT-07-23', 'AT-07-24', 'AT-07-25', 'AT-07-26']],
    [this.codeSouthTyrol, ['IT-32-BZ-01', 'IT-32-BZ-02', 'IT-32-BZ-03', 'IT-32-BZ-04', 'IT-32-BZ-05', 'IT-32-BZ-06', 'IT-32-BZ-07', 'IT-32-BZ-08', 'IT-32-BZ-09', 'IT-32-BZ-10', 'IT-32-BZ-11', 'IT-32-BZ-12', 'IT-32-BZ-13', 'IT-32-BZ-14', 'IT-32-BZ-15', 'IT-32-BZ-16', 'IT-32-BZ-17']],
    [this.codeTrentino, ['IT-32-TN-01', 'IT-32-TN-02', 'IT-32-TN-03', 'IT-32-TN-04', 'IT-32-TN-05', 'IT-32-TN-06', 'IT-32-TN-07', 'IT-32-TN-08', 'IT-32-TN-09', 'IT-32-TN-10', 'IT-32-TN-11', 'IT-32-TN-12', 'IT-32-TN-13', 'IT-32-TN-14', 'IT-32-TN-15', 'IT-32-TN-16', 'IT-32-TN-17', 'IT-32-TN-18', 'IT-32-TN-19', 'IT-32-TN-20', 'IT-32-TN-21']]
  ]);

  public colorDangerRatingLow = '#cbd859';
  public colorDangerRatingModerate = '#f3e500';
  public colorDangerRatingConsiderable = '#f49719';
  public colorDangerRatingHigh = '#e42420';
  public colorDangerRatingVeryHigh = '#000000';
  public colorDangerRatingMissing = '#969696';
  public colorActiveSelection = '#3852A4';

  public lineColor = '#000000';
  public lineWeight = 0.5;
  public lineOpacityOwnRegion = 1.0;
  public lineOpacityForeignRegion = 0.3;

  public fillOpacityOwnSelected = 1.0;
  public fillOpacityOwnDeselected = 0.6;
  public fillOpacityOwnSelectedSuggested = 0.8;
  public fillOpacityOwnDeselectedSuggested = 0.5;

  public fillOpacityForeignSelected = 0.5;
  public fillOpacityForeignDeselected = 0.3;
  public fillOpacityForeignSelectedSuggested = 0.5;
  public fillOpacityForeignDeselectedSuggested = 0.2;

  public fillOpacityEditSelected = 0.5;
  public fillOpacityEditSuggested = 0.3;


  constructor() {
  }

  getDangerRatingColor(dangerRating) {
    switch (dangerRating) {
      case "very_high":
        return this.colorDangerRatingVeryHigh;
      case "high":
        return this.colorDangerRatingHigh;
      case "considerable":
        return this.colorDangerRatingConsiderable;
      case "moderate":
        return this.colorDangerRatingModerate;
      case "low":
        return this.colorDangerRatingLow;
      
      default:
        return this.colorDangerRatingMissing;
    }
  }

  getServerUrl() {
    return this.serverUrl;
  }

  getSnowObserverServerUrl() {
    return this.snowObserverServerUrl;
  }

  getNatlefsServerUrl() {
    return this.natlefsServerUrl;
  }

  getNatlefsUsername() {
    return this.natlefsUsername;
  }

  getNatlefsPassword() {
    return this.natlefsPassword;
  }

  getTimeframe() {
    return this.timeframe;
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