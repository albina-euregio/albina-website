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
  public chatMessages0: ChatMessageModel[];
  public chatMessages1: ChatMessageModel[];
  public chatMessages2: ChatMessageModel[];
  public chatMessages3: ChatMessageModel[];
  public newMessageCount0: number;
  public newMessageCount1: number;
  public newMessageCount2: number;
  public newMessageCount3: number;

  constructor(
    public http: Http,
    public constantsService: ConstantsService,
    public authenticationService: AuthenticationService,
    public socketService: SocketService)
  {
    this.chatMessages0 = new Array<ChatMessageModel>();
    this.chatMessages1 = new Array<ChatMessageModel>();
    this.chatMessages2 = new Array<ChatMessageModel>();
    this.chatMessages3 = new Array<ChatMessageModel>();
    this.activeUsers = new Array<AuthorModel>();
    this.newMessageCount0 = 0;
    this.newMessageCount1 = 0;
    this.newMessageCount2 = 0;
    this.newMessageCount3 = 0;

    this.socketService.getSocket().on('chatEvent', function(data) {
      console.log("SocketIO chat event recieved: " + data);
      let message = ChatMessageModel.createFromJson(JSON.parse(data));
      this.addChatMessage(message, true)
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
        for (let jsonChatMessage of response)
          this.addChatMessage(ChatMessageModel.createFromJson(jsonChatMessage), false);
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

  private addChatMessage(message, update) {
    switch (message.chatId) {
      case 0:
        this.chatMessages0.push(message);
        this.chatMessages0.sort((a, b) : number => {
          if (a.time < b.time) return 1;
          if (a.time > b.time) return -1;
          return 0;
        });
        if (update && message.getUsername() != this.authenticationService.getUsername())
          this.newMessageCount0++;
        break;
      case 1:
        this.chatMessages1.push(message);
        this.chatMessages1.sort((a, b) : number => {
          if (a.time < b.time) return 1;
          if (a.time > b.time) return -1;
          return 0;
        });
        if (update && message.getUsername() != this.authenticationService.getUsername())
          this.newMessageCount1++;
        break;
      case 2:
        this.chatMessages2.push(message);
        this.chatMessages2.sort((a, b) : number => {
          if (a.time < b.time) return 1;
          if (a.time > b.time) return -1;
          return 0;
        });
        if (update && message.getUsername() != this.authenticationService.getUsername())
          this.newMessageCount2++;
        break;
      case 3:
        this.chatMessages3.push(message);
        this.chatMessages3.sort((a, b) : number => {
          if (a.time < b.time) return 1;
          if (a.time > b.time) return -1;
          return 0;
        });
        if (update && message.getUsername() != this.authenticationService.getUsername())
          this.newMessageCount3++;
        break;
      default:
        break;
    }
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
        if (this.activeUsers[i].getRegion().startsWith(region) || this.activeUsers[i].getRegion().startsWith(this.authenticationService.getUserRegion()))
          count = count + 1;
      }
      return count;
    } else
      return this.activeUsers.length;
  }

  getActiveUsersForRegion(region?: string) {
    let users = new Array<string>();
    for (var i = this.activeUsers.length - 1; i >= 0; i--) {
      if ((region && (this.activeUsers[i].getRegion().startsWith(region) || this.activeUsers[i].getRegion().startsWith(this.authenticationService.getUserRegion()))) || !region)
        users.push(this.activeUsers[i].getName());
    }
    return users;
  }

  sendMessage(text: string, region?: string) {
    let message = new ChatMessageModel();
    message.setUsername(this.authenticationService.getUsername());
    message.setTime(new Date());
    message.setText(text);
    message.setChatId(this.authenticationService.getChatId(region));
    this.socketService.getSocket().emit('chatEvent', JSON.stringify(message.toJson()));
    console.log("SocketIO chat event sent: " + message);
  }

  getNewMessageCountSum(region: string) {
    switch (region) {
      case this.constantsService.codeTyrol:
        return this.newMessageCount0 + this.newMessageCount1 + this.newMessageCount2;
      case this.constantsService.codeSouthTyrol:
        return this.newMessageCount0 + this.newMessageCount1 + this.newMessageCount3;
      case this.constantsService.codeTrentino:
        return this.newMessageCount0 + this.newMessageCount2 + this.newMessageCount3;
      
      default:
        return 0;
    }
  }

  getNewMessageCount(region?: string) {
    switch (this.authenticationService.getChatId(region)) {
      case 0:
        return this.newMessageCount0;
      case 1:
        return this.newMessageCount1;
      case 2:
        return this.newMessageCount2;
      case 3:
        return this.newMessageCount3;
      
      default:
        return this.newMessageCount0;
    }
  }

  resetNewMessageCount(region?: string) {
    switch (this.authenticationService.getChatId(region)) {
      case 0:
        this.newMessageCount0 = 0;
        break;
      case 1:
        this.newMessageCount1 = 0;
        break;
      case 2:
        this.newMessageCount2 = 0;
        break;
      case 3:
        this.newMessageCount3 = 0;
        break;
      
      default:
        break;
    }
  }

  getChatMessages(region?: string) {
    switch (this.authenticationService.getChatId(region)) {
      case 0:
        return this.chatMessages0;
      case 1:
        return this.chatMessages1;
      case 2:
        return this.chatMessages2;
      case 3:
        return this.chatMessages3;
      default:
        return null;
    }
  }
}