import { Injectable } from '@angular/core';
import { ConstantsService } from '../constants-service/constants.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

  private socket;

  constructor(
    public constantsService: ConstantsService,
    public authenticationService: AuthenticationService)
  {
  }

  getSocket() {
    return this.socket;
  }

  login() {
  	let query = 'username=' + this.authenticationService.getUsername();
    this.socket = io(this.constantsService.socketIOUrl, {query: query});
  }

  logout() {
    this.socket.disconnect();
  }
}