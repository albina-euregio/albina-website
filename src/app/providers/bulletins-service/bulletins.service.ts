import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, ResponseOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { ConstantsService } from '../constants-service/constants.service';
import { RegionsService } from '../regions-service/regions.service';
import { SettingsService } from '../settings-service/settings.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { WsBulletinService } from '../ws-bulletin-service/ws-bulletin.service';
import { WsRegionService } from '../ws-region-service/ws-region.service';
import { BulletinModel } from '../../models/bulletin.model';
import { RegionLockModel } from '../../models/region-lock.model';
import { BulletinLockModel } from '../../models/bulletin-lock.model';
import * as Enums from '../../enums/enums';

@Injectable()
export class BulletinsService {

  private activeDate: Date;
  private copyDate: Date;
  private isEditable: boolean;
  private isUpdate: boolean;
  private isSmallChange: boolean;

  public lockedRegions: Map<string, Date[]>;
  public regionLocks: Subject<RegionLockModel>;
  public lockedBulletins: Map<string, string>;
  public bulletinLocks: Subject<BulletinLockModel>;

  public statusMap: Map<number, Enums.BulletinStatus>;

  public dates: Date[];

  constructor(
    public http: Http,
    private constantsService: ConstantsService,
    private authenticationService: AuthenticationService,
    private settingsService: SettingsService,
    private wsBulletinService: WsBulletinService,
    private wsRegionService: WsRegionService)
  {
    this.init();
  }

  init() {
    this.dates = new Array<Date>();
    this.activeDate = undefined;
    this.copyDate = undefined;
    this.isEditable = false;
    this.isUpdate = false;
    this.isSmallChange = false;
    this.statusMap = new Map<number, Enums.BulletinStatus>();
    this.lockedRegions = new Map<string, Date[]>();
    this.lockedBulletins = new Map<string, string>();

    // connect to websockets
    this.wsRegionConnect();
    this.wsBulletinConnect();

    this.getLockedRegions(this.authenticationService.getActiveRegion()).subscribe(
      data => {
        let response = data.json();
        for (let lockedDate of response) {
          let date = new Date(lockedDate);
          this.addLockedRegion(this.authenticationService.getActiveRegion(), date);
        }
      },
      error => {
        console.warn("Locked regions could not be loaded!");
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

    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);
    endDate.setHours(0, 0, 0, 0);

    for (let i = 0; i <= 10; i++) {
      let date = new Date();
      date.setDate(date.getDate() + 3 - i);
      date.setHours(0, 0, 0, 0);
      this.dates.push(date);
    }

    this.getStatus(this.authenticationService.getActiveRegion(), startDate, endDate).subscribe(
      data => {
        let json = data.json();
        for (var i = json.length - 1; i >= 0; i--) 
          this.statusMap.set(Date.parse(json[i].date), Enums.BulletinStatus[<string>json[i].status]);
      },
      error => {
        console.error("Status could not be loaded!");
      }
    );
  }

  public wsRegionConnect() {
    this.regionLocks = <Subject<RegionLockModel>>this.wsRegionService
      .connect(this.constantsService.getWsRegionUrl() + this.authenticationService.getUsername())
      .map((response: any): RegionLockModel => {
        let data = JSON.parse(response.data);
        let regionLock = RegionLockModel.createFromJson(data);
        if (regionLock.getLock()) {
          console.debug("Region lock received: " + regionLock.getDate().toLocaleDateString() + " - " + regionLock.getRegion() + " [" + regionLock.getUsername() + "]");
          this.addLockedRegion(regionLock.getRegion(), regionLock.getDate());
        } else {
          console.debug("Region unlock received: " + regionLock.getDate().toLocaleDateString() + " - " + regionLock.getRegion() + " [" + regionLock.getUsername() + "]");
          this.removeLockedRegion(regionLock.getRegion(), regionLock.getDate());
        }
        return regionLock;
      });

    this.regionLocks.subscribe(msg => {
    });
  }

  public wsRegionDisconnect() {
    this.wsRegionService.disconnect();
  }

  public wsBulletinConnect() {
    this.bulletinLocks = <Subject<BulletinLockModel>>this.wsBulletinService
      .connect(this.constantsService.getWsBulletinUrl() + this.authenticationService.getUsername())
      .map((response: any): BulletinLockModel => {
        let data = JSON.parse(response.data);
        let bulletinLock = BulletinLockModel.createFromJson(data);
        if (bulletinLock.getLock()) {
          console.debug("Bulletin lock received: " + bulletinLock.getBulletin());
          this.addLockedBulletin(bulletinLock.getBulletin(), bulletinLock.getUsername());
        } else {
          console.debug("Bulletin unlock received: " + bulletinLock.getBulletin());
          this.removeLockedBulletin(bulletinLock.getBulletin());
        }
        return bulletinLock;
      });

    this.bulletinLocks.subscribe(msg => {
    });
  }

  public wsBulletinDisconnect() {
    this.wsBulletinService.disconnect();
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
    return this.statusMap.get(date.getTime());
  }
  
  setUserRegionStatus(date: Date, status: Enums.BulletinStatus) {
      this.statusMap.set(date.getTime(), status);
  }
  
  getStatus(region: string, startDate: Date, endDate: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/status/internal?startDate=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(startDate) + '&endDate=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(endDate) + '&region=' + region;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(encodeURI(url), options);
  }

  getPublicationsStatus(region: string, startDate: Date, endDate: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/status/publications?startDate=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(startDate) + '&endDate=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(endDate) + '&region=' + region;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(encodeURI(url), options);
  }

  getPublicationStatus(region: string, date: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/status/publication?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + '&region=' + region;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(encodeURI(url), options);
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

    return this.http.get(encodeURI(url), options);
  }

  loadCaamlBulletins(date: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + '&lang=' + this.settingsService.getLangString();
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/xml',
      'Accept': 'application/xml',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });
 
    return this.http.get(encodeURI(url), options);
  }

  loadJsonBulletins(date: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });
 
    return this.http.get(encodeURI(url), options);
  }

  saveBulletins(bulletins, date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + "&region=" + this.authenticationService.getActiveRegion();
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let jsonBulletins = [];
    for (var i = bulletins.length - 1; i >= 0; i--)
      jsonBulletins.push(bulletins[i].toJson());
    let body = JSON.stringify(jsonBulletins);
    let options = new RequestOptions({ headers: headers });

    return this.http.post(encodeURI(url), body, options);
  }

  changeBulletins(bulletins, date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/change?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + "&region=" + this.authenticationService.getActiveRegion();
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let jsonBulletins = [];
    for (var i = bulletins.length - 1; i >= 0; i--)
      jsonBulletins.push(bulletins[i].toJson());
    let body = JSON.stringify(jsonBulletins);
    let options = new RequestOptions({ headers: headers });

    return this.http.post(encodeURI(url), body, options);
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

    return this.http.post(encodeURI(url), body, options);
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

    return this.http.post(encodeURI(url), body, options);
  }

  publishAllBulletins(date: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/publish/all?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify("");
    let options = new RequestOptions({ headers: headers });

    return this.http.post(encodeURI(url), body, options);
  }

  createCaaml(date: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/publish/caaml?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify("");
    let options = new RequestOptions({ headers: headers });

    return this.http.post(encodeURI(url), body, options);
  }

  createPdf(date: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/publish/pdf?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify("");
    let options = new RequestOptions({ headers: headers });

    return this.http.post(encodeURI(url), body, options);
  }

  createHtml(date: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/publish/html?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify("");
    let options = new RequestOptions({ headers: headers });

    return this.http.post(encodeURI(url), body, options);
  }

  createMap(date: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/publish/map?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify("");
    let options = new RequestOptions({ headers: headers });

    return this.http.post(encodeURI(url), body, options);
  }

  createStaticWidget(date: Date) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/publish/staticwidget?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify("");
    let options = new RequestOptions({ headers: headers });

    return this.http.post(encodeURI(url), body, options);
  }

  sendEmail(date: Date, region: string) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/publish/email?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + "&region=" + region;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify("");
    let options = new RequestOptions({ headers: headers });

    return this.http.post(encodeURI(url), body, options);
  }

  triggerMessengerpeople(date: Date, region: string) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/publish/messengerpeople?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + "&region=" + region;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let body = JSON.stringify("");
    let options = new RequestOptions({ headers: headers });

    return this.http.post(encodeURI(url), body, options);
  }

  checkBulletins(date: Date, region: string) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/check?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date) + '&region=' + region;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(encodeURI(url), options);
  }

  getLockedRegions(region: string) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'regions/locked?region=' + region;
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(encodeURI(url), options);
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

    return this.http.get(encodeURI(url), options);
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

  lockRegion(region: string, date: Date) {
      let regionLock = new RegionLockModel();
      regionLock.setUsername(this.authenticationService.getUsername());
      regionLock.setRegion(region);
      regionLock.setDate(date);
      regionLock.setLock(true);

      this.regionLocks.next(regionLock);

      console.debug("Region lock sent: " + regionLock.getDate().toLocaleDateString() + " - " + regionLock.getRegion());
  }

  unlockRegion(date: Date, region: string) {
      let regionLock = new RegionLockModel();
      regionLock.setUsername(this.authenticationService.getUsername());
      regionLock.setRegion(region);
      regionLock.setDate(date);
      regionLock.setLock(false);

      this.regionLocks.next(regionLock);

      console.debug("Region unlock sent: " + regionLock.getDate().toLocaleDateString() + " - " + regionLock.getRegion());
  }

  lockBulletin(date: Date, bulletinId: string) {
      let bulletinLock = new BulletinLockModel();
      bulletinLock.setUsername(this.authenticationService.getUsername());
      bulletinLock.setBulletin(bulletinId);
      bulletinLock.setDate(date);
      bulletinLock.setLock(true);

      this.bulletinLocks.next(bulletinLock);

      console.debug("Bulletin lock sent: " + bulletinLock.getDate() + " - " + bulletinLock.getBulletin());
  }

  unlockBulletin(date: Date, bulletinId: string) {
      let bulletinLock = new BulletinLockModel();
      bulletinLock.setUsername(this.authenticationService.getUsername());
      bulletinLock.setBulletin(bulletinId);
      bulletinLock.setDate(date);
      bulletinLock.setLock(false);

      this.bulletinLocks.next(bulletinLock);

      console.debug("Bulletin unlock sent: " + bulletinLock.getDate() + " - " + bulletinLock.getBulletin());
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

  addLockedBulletin(bulletinId, username) {
    if (this.lockedBulletins.has(bulletinId))
      console.warn("Bulletin already locked by " + this.lockedBulletins.get(bulletinId));
    else
      this.lockedBulletins.set(bulletinId, username);
  }

  removeLockedBulletin(bulletinId) {
    if (this.lockedBulletins.has(bulletinId))
      this.lockedBulletins.delete(bulletinId);
    else
      console.warn("Bulletin was not locked!");
  }
}