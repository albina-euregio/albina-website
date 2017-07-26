import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { ConstantsService } from '../constants-service/constants.service';
import { SocketService } from '../socket-service/socket.service';
import { ChatMessageModel } from '../../models/chat-message.model';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {

  public chatMessages: ChatMessageModel[];
  public newMessageCount: number;

  constructor(
    public http: Http,
    public constantsService: ConstantsService,
    public authenticationService: AuthenticationService,
    public socketService: SocketService)
  {
    this.chatMessages = new Array<ChatMessageModel>();
    this.newMessageCount = 0;

    this.socketService.getSocket().on('chatEvent', function(data) {
      console.log("SocketIO chat event recieved: " + data);
      let message = ChatMessageModel.createFromJson(JSON.parse(data));
      this.chatMessages.push(message);
      this.chatMessages.sort((a, b) : number => {
        if (a.time < b.time) return 1;
        if (a.time > b.time) return -1;
        return 0;
      });
      if (message.getUsername() != this.authenticationService.getUsername())
        this.newMessageCount++;
    }.bind(this));

    this.getMessages().subscribe(
      data => {
        let response = data.json();
        for (let jsonChatMessage of response) {
          this.chatMessages.push(ChatMessageModel.createFromJson(jsonChatMessage));
        }
        this.chatMessages.sort((a, b) : number => {
            if (a.time < b.time) return 1;
            if (a.time > b.time) return -1;
            return 0;
        });
      },
      error => {
        console.error("Chat messages could not be loaded!");
      }
    );
  }

  getMessages() : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'chat';
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  sendMessage(text: string) {
    let message = new ChatMessageModel();
    message.setUsername(this.authenticationService.getUsername());
    message.setTime(new Date());
    message.setText(text);
    this.socketService.getSocket().emit('chatEvent', JSON.stringify(message.toJson()));
    console.log("SocketIO chat event sent: " + message);
  }

  getNewMessageCount() {
    return this.newMessageCount;
  }

  resetNewMessageCount() {
    this.newMessageCount = 0;
  }
}