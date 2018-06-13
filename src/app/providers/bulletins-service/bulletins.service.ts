import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, ResponseOptions } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { RegionsService } from '../regions-service/regions.service';
import { SettingsService } from '../settings-service/settings.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { SocketService } from '../socket-service/socket.service';
import { Observable } from 'rxjs/Observable';
import { BulletinModel } from '../../models/bulletin.model';
import * as Enums from '../../enums/enums';
import * as io from 'socket.io-client';

@Injectable()
export class BulletinsService {

  private activeDate: Date;
  private copyDate: Date;
  private isEditable: boolean;
  private isUpdate: boolean;
  private isSmallChange: boolean;

  public lockedRegions: Map<string, Date[]>;
  // public lockedBulletins: Map<string, String[]>;

  public statusMapTrentino: Map<number, Enums.BulletinStatus>;
  public statusMapSouthTyrol: Map<number, Enums.BulletinStatus>;
  public statusMapTyrol: Map<number, Enums.BulletinStatus>;

  constructor(
    public http: Http,
    private constantsService: ConstantsService,
    private authenticationService: AuthenticationService,
    private settingsService: SettingsService,
    private socketService: SocketService)
  {
    this.activeDate = undefined;
    this.copyDate = undefined;
    this.isEditable = false;
    this.isUpdate = false;
    this.isSmallChange = false;
    this.statusMapTrentino = new Map<number, Enums.BulletinStatus>();
    this.statusMapSouthTyrol = new Map<number, Enums.BulletinStatus>();
    this.statusMapTyrol = new Map<number, Enums.BulletinStatus>();
    this.lockedRegions = new Map<string, Date[]>();
    // this.lockedBulletins = new Map<string, String[]>();

    this.socketService.getSocket().on('lockRegion', function(data) {
      console.log("[SocketIO] Message received: lockRegion - " + data);
      let message = JSON.parse(data);
      let date = new Date(message.date);
      this.addLockedRegion(message.region, date);
    }.bind(this));

    this.socketService.getSocket().on('unlockRegion', function(data) {
      console.log("[SocketIO] Message received: unlockRegion - " + data);
      let message = JSON.parse(data);
      let date = new Date(message.date);
      this.removeLockedRegion(message.region, date);
  
      let observableBatch = [];
/*
      observableBatch.push(this.getStatus(this.constantsService.codeTyrol, date));
      observableBatch.push(this.getStatus(this.constantsService.codeSouthTyrol, date));
      observableBatch.push(this.getStatus(this.constantsService.codeTrentino, date));

      Observable.forkJoin(observableBatch).subscribe(
        data => {
          this.statusMapTyrol.set(date.getTime(), Enums.BulletinStatus[<string>(<Response>data[0]).json()['status']]);
          this.statusMapSouthTyrol.set(date.getTime(), Enums.BulletinStatus[<string>(<Response>data[1]).json()['status']]);
          this.statusMapTrentino.set(date.getTime(), Enums.BulletinStatus[<string>(<Response>data[2]).json()['status']]);
        },
        error => {
          console.error("Status could not be loaded!");
        }
      );
*/
    }.bind(this));

/*
    this.socketService.getSocket().on('lockBulletin', function(data) {
      console.log("[SocketIO] Message received: lockBulletin - " + data);
      let message = JSON.parse(data);
      this.addLockedBulletin(message);
    }.bind(this));

    this.socketService.getSocket().on('unlockBulletin', function(data) {
      console.log("[SocketIO] Message received: unlockBulletin - " + data);
      let message = JSON.parse(data);
      this.removeLockedBulletin(message);
    }.bind(this));
*/

    this.getLockedRegions(this.constantsService.codeTrentino).subscribe(
      data => {
        let response = data.json();
        for (let lockedDate of response) {
          let date = new Date(lockedDate);
          this.addLockedRegion(this.constantsService.codeTrentino, date);
        }
      },
      error => {
        console.warn("Locked regions for Trentino could not be loaded!");
      }
    );

    this.getLockedRegions(this.constantsService.codeSouthTyrol).subscribe(
      data => {
        let response = data.json();
        for (let lockedDate of response) {
          let date = new Date(lockedDate);
          this.addLockedRegion(this.constantsService.codeSouthTyrol, date);
        }
      },
      error => {
        console.warn("Locked regions for South Tyrol could not be loaded!");
      }
    );

    this.getLockedRegions(this.constantsService.codeTyrol).subscribe(
      data => {
        let response = data.json();
        for (let lockedDate of response) {
          let date = new Date(lockedDate);
          this.addLockedRegion(this.constantsService.codeTyrol, date);
        }
      },
      error => {
        console.warn("Locked regions for Tyrol could not be loaded!");
      }
    );

/*
    this.getLockedBulletins().subscribe(
      data => {
      },
      error => {
        console.warn("Locked bulletins could not be loaded!");
      }
    );
*/
  }

  getActiveDate() : Date {
    return this.activeDate;
  }

  setActiveDate(date: Date) {
    this.activeDate = date;
  }

  getCopyDate() : Date {
    return this.copyDate;
  }

  setCopyDate(date: Date) {
    this.copyDate = date;
  }

  getIsEditable() : boolean {
    return this.isEditable;
  }

  setIsEditable(isEditable: boolean) {
    this.isEditable = isEditable;
  }

  getIsUpdate() {
    return this.isUpdate;
  }

  setIsUpdate(isUpdate: boolean) {
    this.isUpdate = isUpdate;
  }

  getIsSmallChange() {
    return this.isSmallChange;
  }

  setIsSmallChange(isSmallChange: boolean) {
    this.isSmallChange = isSmallChange;
  }

  getUserRegionStatus(date: Date) : Enums.BulletinStatus {
    let region = this.authenticationService.getUserRegion();
    switch (region) {
      case "IT-32-TN":
        return this.statusMapTrentino.get(date.getTime());
      case "IT-32-BZ":
        return this.statusMapSouthTyrol.get(date.getTime());
      case "AT-07":
        return this.statusMapTyrol.get(date.getTime());
      
      default:
        return undefined;
    }
  }
  
  setUserRegionStatus(date: Date, status: Enums.BulletinStatus) {
    let region = this.authenticationService.getUserRegion();
    switch (region) {
      case "IT-32-TN":
        this.statusMapTrentino.set(date.getTime(), status);
        break;
      case "IT-32-BZ":
        this.statusMapSouthTyrol.set(date.getTime(), status);
        break;
      case "AT-07":
        this.statusMapTyrol.set(date.getTime(), status);
        break;
      
      default:
        return undefined;
    }
  }
  
  getStatus(region: string, startDate: Date, endDate: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/status?startDate=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(startDate) + '&endDate=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(endDate) + '&region=' + region;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  loadBulletins(date: Date, regions?: String[]) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/edit?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    if (regions) {
      for (let region of regions)
        url += "&regions=" + region;
    }
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  loadCaamlBulletins(date: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + '&lang=' + this.settingsService.getLangString();
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/xml',
      'Accept': 'application/xml',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });
 
    return this.http.get(url, options);
  }

  loadJsonBulletins(date: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });
 
    return this.http.get(url, options);
  }

  saveBulletins(bulletins, date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + "&region=" + this.authenticationService.getUserRegion();
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let jsonBulletins = [];
    for (var i = bulletins.length - 1; i >= 0; i--)
      jsonBulletins.push(bulletins[i].toJson());
    let body = JSON.stringify(jsonBulletins);
    console.log("SAVE bulletins:");
    console.log(body);
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options);
  }

  changeBulletins(bulletins, date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/change?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + "&region=" + this.authenticationService.getUserRegion();
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let jsonBulletins = [];
    for (var i = bulletins.length - 1; i >= 0; i--)
      jsonBulletins.push(bulletins[i].toJson());
    let body = JSON.stringify(jsonBulletins);
    console.log("SAVE bulletins:");
    console.log(body);
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options);
  }

  submitBulletins(date: Date, region: string) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/submit?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + '&region=' + region;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify("");
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options);
  }

  publishBulletins(date: Date, region: string) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/publish?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + '&region=' + region;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify("");
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options);
  }

  checkBulletins(date: Date, region: string) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/check?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + '&region=' + region;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  getLockedRegions(region: string) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'regions/locked?region=' + region;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

/*
  getLockedBulletins() : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/locked';
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }
*/

  isLocked(date: Date, region: string) {
    if (this.lockedRegions.has(region)) {
      let index = this.lockedRegions.get(region).indexOf(date);
      for (let entry of this.lockedRegions.get(region)) {
        if (entry.getTime() === date.getTime())
          return true;
      }
    }
    return false;
  }

  lockRegion(date: Date, region: string) {

    // TODO make rest call and subscribe then to result to be sure it was successfull

    var json = Object();

    json['date'] = this.constantsService.getISOStringWithTimezoneOffset(date);
    json['region'] = region;

    this.sendMessage('lockRegion', json);
  }

  unlockRegion(date: Date, region: string) {
    var json = Object();

    json['date'] = this.constantsService.getISOStringWithTimezoneOffset(date);
    json['region'] = region;

    this.sendMessage('unlockRegion', json);
  }

  lockBulletin(date: Date, bulletinId: string) {

    // TODO make rest call and subscribe then to result to be sure it was successfull
    
    var json = Object();

    json['date'] = this.constantsService.getISOStringWithTimezoneOffset(date);
    json['bulletinId'] = bulletinId;

    this.sendMessage('lockBulletin', json);
  }

  unlockBulletin(date: Date, bulletinId: string) {
    var json = Object();

    json['date'] = this.constantsService.getISOStringWithTimezoneOffset(date);
    json['bulletinId'] = bulletinId;

    this.sendMessage('unlockBulletin', json);
  }

  sendMessage(type: string, message: Object) {
    this.socketService.getSocket().emit(type, JSON.stringify(message), function(data) {
      console.log("[SocketIO] Message sent: " + type + " - " + JSON.stringify(message));
      // TODO create a return value somehow
      if (data)
        console.log("[SocketIO] Success!");
      else
        console.log("[SocketIO] Failure!");
    });
  }

  addLockedRegion(region: string, date: Date) {
    if (this.lockedRegions.has(region)) {
      if (this.lockedRegions.get(region).indexOf(date) == -1)
        this.lockedRegions.get(region).push(date);
      else
        console.warn("[SocketIO] Region already locked!");
    } else {
      let entry = new Array<Date>();
      entry.push(date);
      this.lockedRegions.set(region, entry);
    }
  }

  removeLockedRegion(region: string, date: Date) {
    let index = -1;
    if (this.lockedRegions.has(region)) {
      for (let entry of this.lockedRegions.get(region)) {
        if (entry.getTime() === date.getTime()) {
          index = this.lockedRegions.get(region).indexOf(entry);
        }
      }
    }

    if (index != -1)
      this.lockedRegions.get(region).splice(index, 1);
    else
      console.warn("[SocketIO] Region was not locked!");
  }

/*
  addLockedBulletin(message) {
    if (this.lockedBulletins.has(message.date)) {
      if (this.lockedBulletins.get(message.date).indexOf(message.bulletinId) != -1)
        this.lockedBulletins.get(message.date).push(message.bulletinId);
      else
        console.warn("[SocketIO] Bulletin already locked!");
    } else {
      let entry = new Array<String>();
      entry.push(message.bulletinId);
      this.lockedBulletins.set(message.date, entry);
    }
  }

  removeLockedBulletin(message) {
    if (this.lockedBulletins.has(message.date)) {
      let index = this.lockedBulletins.get(message.date).indexOf(message.bulletinId);
      if (index != -1)
        this.lockedBulletins.get(message.date).splice(index, 1);
      else
        console.warn("[SocketIO] Bulletin was not locked!");
    }
  }
*/
}