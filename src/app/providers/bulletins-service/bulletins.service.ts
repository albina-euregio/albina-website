import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { Observable } from 'rxjs/Observable';
import { BulletinModel } from '../../models/bulletin.model';
import * as Enums from '../../enums/enums';
import { RegionsService } from '../regions-service/regions.service';
import * as io from 'socket.io-client';


@Injectable()
export class BulletinsService {

  constantsService: ConstantsService;
  regionsService: RegionsService;

  private socket;

  constructor(
    public http: Http,
    public constants: ConstantsService,
    public regions: RegionsService)
  {
    this.constantsService = constants;
    this.regionsService = regions;

    this.socket = io(this.constantsService.socketIOUrl);
    this.socket.on('bulletinUpdate', function(data) {
      console.log("SocketIO message recieved: " + data);
    }.bind(this));
  }

  getEuregioBulletins() : Observable<Response> {
    var regions = [ "AT-07", "IT-32-TN", "IT-32-BZ" ];
    return this.getBulletins(regions);
  }

  getBulletins(regions) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins?';
    for (let region of regions)
      url += 'regions=' + region + '&';
    console.log(url);
    let headers = new Headers({
      'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  getBulletin(id) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'bulletins/' + id;
    console.log(url);
    let headers = new Headers({
      'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  sendMessage() {
    let message = "BULLETIN UPDATE!";
    this.socket.emit('bulletinUpdate', message);
    console.log("SocketIO message sent: " + message);
  }
}