import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { ConstantsService } from '../constants-service/constants.service';
import { ChatMessageModel } from '../../models/chat-message.model';

@Injectable()
export class ChatService {

  public chatMessages: ChatMessageModel[];
  private newMessageCount: number;

  constructor(
    public http: Http,
    public constantsService: ConstantsService,
    public authenticationService: AuthenticationService)
  {
    this.chatMessages = new Array<ChatMessageModel>();
    this.newMessageCount = 0;
  }

  sendMessage(text: string) {
    let message = new ChatMessageModel();
    message.setUsername(this.authenticationService.getUsername());
    message.setTime(new Date());
    message.setText(text);
    console.log("MOCK: SocketIO chat event sent: " + message);
  }

  getNewMessageCount() {
    return this.newMessageCount;
  }

  resetNewMessageCount() {
    this.newMessageCount = 0;
  }
}