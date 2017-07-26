import { Injectable } from '@angular/core';
import { ConstantsService } from '../constants-service/constants.service';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

  private socket;

  constructor(
    public constantsService: ConstantsService)
  {
    this.socket = io(this.constantsService.socketIOUrl);
  }

  getSocket() {
    return this.socket;
  }
}