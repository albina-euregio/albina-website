import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, ResponseOptions } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { Observable } from 'rxjs/Observable';
import { BulletinModel } from '../../models/bulletin.model';
import * as Enums from '../../enums/enums';
import { RegionsService } from '../regions-service/regions.service';
import * as io from 'socket.io-client';


@Injectable()
export class BulletinsService {

  private activeDate: Date;
  private isEditable: boolean;

  private socket;

  constructor(
    public http: Http,
    private constantsService: ConstantsService,
    private authenticationService: AuthenticationService)
  {
    this.activeDate = undefined;
    this.isEditable = false;
  }

  getActiveDate() : Date {
    return this.activeDate;
  }

  setActiveDate(date: Date) {
    this.activeDate = date;
  }

  getIsEditable() : boolean {
    return this.isEditable;
  }

  setIsEditable(isEditable: boolean) {
    this.isEditable = isEditable;
  }
  
  getStatus(region: string, date: Date) : Observable<Response> {
    // TODO check how to encode date with timezone in url
    let url = this.constantsService.getServerUrl() + 'bulletins/status?date=' + date.toISOString() + '&region=' + region;
    let authHeader = 'Bearer ' + this.authenticationService.getToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    // TODO delete
    console.log(url);

    return this.http.get(url, options);
  }

  loadBulletins(date: Date) : Observable<Response> {
    // TODO check how to encode date with timezone in url
    let url = this.constantsService.getServerUrl() + 'bulletins?date=' + date.toISOString();
    let authHeader = 'Bearer ' + this.authenticationService.getToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    // TODO delete
    console.log(url);

    return this.http.get(url, options);
  }

  loadCaamlBulletins(date: Date) : Observable<Response> {
    // TODO check how to encode date with timezone in url
    let url = this.constantsService.getServerUrl() + 'bulletins?date=' + date.toISOString();
    let authHeader = 'Bearer ' + this.authenticationService.getToken();
    let headers = new Headers({
      'Content-Type': 'application/xml',
      'Accept': 'application/xml',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    // TODO delete
    console.log(url);

    return this.http.get(url, options);
  }

  saveBulletin(bulletin: BulletinModel) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins';
    let authHeader = 'Bearer ' + this.authenticationService.getToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify(bulletin.toJson());
    console.log(body);
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options);
  }

  updateBulletin(bulletin: BulletinModel) {
    let url = this.constantsService.getServerUrl() + 'bulletins';
    let authHeader = 'Bearer ' + this.authenticationService.getToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify(bulletin.toJson());
    console.log(body);
    let options = new RequestOptions({ headers: headers });

    return this.http.put(url, body, options);
  }

  sendMessage() {
    let message = "BULLETIN UPDATE!";
    this.socket.emit('bulletinUpdate', message);
    console.log("SocketIO message sent: " + message);
  }
}