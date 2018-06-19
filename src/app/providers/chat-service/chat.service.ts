import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { ConstantsService } from '../constants-service/constants.service';
import { SocketService } from '../socket-service/socket.service';
import { ChatMessageModel } from '../../models/chat-message.model';
import { AuthorModel } from '../../models/author.model';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {

  public activeUsers: AuthorModel[];
  public chatMessages: ChatMessageModel[];
  public newMessageCount: number;

  constructor(
    public http: Http,
    public constantsService: ConstantsService,
    public authenticationService: AuthenticationService,
    public socketService: SocketService)
  {
    this.chatMessages = new Array<ChatMessageModel>();
    this.activeUsers = new Array<AuthorModel>();
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

    this.socketService.getSocket().on('login', function(data) {
      let json = JSON.parse(data)
      console.log("SocketIO login event recieved: " + json.name);
      if (json.name != this.authenticationService.getUsername()) {
        let user = AuthorModel.createFromJson(json);
        let found = false;
        for (var i = this.activeUsers.length - 1; i >= 0; i--) {
          if (this.activeUsers[i].getEmail() === json.email) {
            found = true;
            break;
          }
        }
        if (!found) {
          this.activeUsers.push(user);
          this.activeUsers.sort((a, b) : number => {
            if (a.name < b.name) return 1;
            if (a.name > b.name) return -1;
            return 0;
          });
        }
      }
    }.bind(this));

    this.socketService.getSocket().on('logout', function(data) {
      let json = JSON.parse(data)
      console.log("SocketIO logout event recieved: " + json.name);
      if (json.name != this.authenticationService.getUsername()) {
        let user = AuthorModel.createFromJson(json);
        let index = -1;
        for (var i = this.activeUsers.length - 1; i >= 0; i--) {
          if (this.activeUsers[i].getEmail() === json.email) {
            index = i;
            break;
          }
        }
        if (index > -1)
          this.activeUsers.splice(index, 1);
      }
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

    this.getActiveUsers().subscribe(
      data => {
        let response = data.json();
        for (let user of response) {
          if (user.name != this.authenticationService.getUsername())
            this.activeUsers.push(AuthorModel.createFromJson(user));
        }
        this.activeUsers.sort((a, b) : number => {
            if (a.name < b.name) return 1;
            if (a.name > b.name) return -1;
            return 0;
        });
      },
      error => {
        console.error("Active users could not be loaded!");
      }
    );
  }

  getMessages() : Observable<Response> {
    let date = new Date();
    date.setHours(0,0,0,0);
    let url = this.constantsService.getServerUrl() + 'chat?date=' + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options);
  }

  getActiveUsers() : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'chat/users';
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options);
  }

  getNumberOfActiveUsersForRegion(region?: string) {
    if (region) {
      let count = 0;
      for (var i = this.activeUsers.length - 1; i >= 0; i--) {
        if (this.activeUsers[i].getRegion().startsWith(region))
          count = count + 1;
      }
      return count;
    } else
      return this.activeUsers.length;
  }

  getActiveUsersForRegion(region?: string) {
    let users = new Array<string>();
    for (var i = this.activeUsers.length - 1; i >= 0; i--) {
      if ((region && this.activeUsers[i].getRegion().startsWith(region)) || !region)
        users.push(this.activeUsers[i].getName());
    }
    return users;
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