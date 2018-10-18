import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { WsChatService } from '../ws-chat-service/ws-chat.service';
import { ChatMessageModel } from '../../models/chat-message.model';
import { AuthorModel } from '../../models/author.model';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { ConstantsService } from '../constants-service/constants.service';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

@Injectable()
export class ChatService {
	public messages: Subject<ChatMessageModel>;

	public activeUsers: string[];
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
	    public wsChatService: WsChatService)
	{
	  this.chatMessages0 = new Array<ChatMessageModel>();
	  this.chatMessages1 = new Array<ChatMessageModel>();
	  this.chatMessages2 = new Array<ChatMessageModel>();
	  this.chatMessages3 = new Array<ChatMessageModel>();
	  this.activeUsers = new Array<string>();
	  this.newMessageCount0 = 0;
	  this.newMessageCount1 = 0;
	  this.newMessageCount2 = 0;
	  this.newMessageCount3 = 0;
	}


  public connect() {
    this.messages = <Subject<ChatMessageModel>>this.wsChatService
      .connect(this.constantsService.chatUrl + this.authenticationService.getUsername())
      .map((response: any): ChatMessageModel => {
        let data = JSON.parse(response.data);
        let message = ChatMessageModel.createFromJson(data);
        this.addChatMessage(message, true);
        console.debug("Chat message received: " + message.getText());
        return message;
      });

    this.messages.subscribe(msg => {
    });

    if (this.authenticationService.getActiveRegion() && this.authenticationService.getActiveRegion() != undefined) {
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

/*
      this.getActiveUsers().subscribe(
        data => {
          debugger
          let response = data.json();
          for (let user of response) {
            if (user != this.authenticationService.getUsername())
              this.activeUsers.push(user);
          }
          this.activeUsers.sort((a, b) : number => {
              if (a < b) return 1;
              if (a > b) return -1;
              return 0;
          });
        },
        error => {
          console.error("Active users could not be loaded!");
        }
      );
*/
    }
  }

  public disconnect() {
    // TODO implement
  }

  sendMessage(text: string, region?: string) {
      let message = new ChatMessageModel();
      message.setUsername(this.authenticationService.getUsername());
      message.setTime(new Date());
      message.setText(text);
      message.setChatId(this.authenticationService.getChatId(region));

      this.messages.next(message);

      console.debug("Chat message sent: " + message.getText());
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
    return this.http.get(encodeURI(url), options);
  }

  getActiveUsers() : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'chat/users';
    let authHeader = 'Bearer ' + this.authenticationService.getAccessToken();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(encodeURI(url), options);
  }

/*
  getNumberOfActiveUsersForRegion(region?: string) {
    if (region) {
      let count = 0;
      for (var i = this.activeUsers.length - 1; i >= 0; i--) {
        if (this.activeUsers[i].getRegions().includes(region) || this.activeUsers[i].getRegions().includes(this.authenticationService.getActiveRegion()))
          count = count + 1;
      }
      return count;
    } else
      return this.activeUsers.length;
  }

  getActiveUsersForRegion(region?: string) {
    let users = new Array<string>();
    for (var i = this.activeUsers.length - 1; i >= 0; i--) {
      if ((region && (this.activeUsers[i].getRegions().includes(region) || this.activeUsers[i].getRegions().includes(this.authenticationService.getActiveRegion()))) || !region)
        users.push(this.activeUsers[i].getName());
    }
    return users;
  }
*/

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