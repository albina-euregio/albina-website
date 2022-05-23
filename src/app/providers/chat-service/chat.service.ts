import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { HttpClient } from "@angular/common/http";
import { ChatMessageModel } from "../../models/chat-message.model";
import { AuthenticationService } from "../authentication-service/authentication.service";
import { ConstantsService } from "../constants-service/constants.service";

@Injectable()
export class ChatService {
  public messages: WebSocketSubject<object>;

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
    public http: HttpClient,
    public constantsService: ConstantsService,
    public authenticationService: AuthenticationService,
    ) {
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


  public connect(): void {
    const url = this.constantsService.getWsChatUrl() + this.authenticationService.getUsername();
    this.messages = webSocket(url);
    this.messages.subscribe(
      (data) => {
        const message = ChatMessageModel.createFromJson(data);
        console.log("Chat message received: " + message.getText());
        this.addChatMessage(message, true);
      },
      (error) => {
        console.error("Message could not be sent!", error);
      }
    );

    console.debug("Successfully connected: " + url);

    if (this.authenticationService.getActiveRegionId() && this.authenticationService.getActiveRegionId() !== undefined) {
      this.getMessages().subscribe(
        data => {
          for (const jsonChatMessage of (data as any)) {
            this.addChatMessage(ChatMessageModel.createFromJson(jsonChatMessage), false);
          }
        },
        () => {
          console.error("Chat messages could not be loaded!");
        }
      );

      this.getActiveUsersFromServer().subscribe(
      data => {
        for (const user of (data as any)) {
          if (user !== this.authenticationService.getUsername()) {
            this.activeUsers.push(user);
          }
        }
        this.activeUsers.sort((a, b): number => {
          if (a < b) {
            return 1;
          }
          if (a > b) {
            return -1;
          }
          return 0;
        });
      },
        error => {
          console.error("Active users could not be loaded!");
        }
      );
    }
  }

  public disconnect(): void {
    this.messages.unsubscribe();
  }

  sendMessage(text: string, region?: string): void {
    const message = new ChatMessageModel();
    message.setUsername(this.authenticationService.getUsername());
    message.setTime(new Date());
    message.setText(text);
    message.setChatId(this.authenticationService.getChatId(region));

    this.messages.next(message);

    console.log("Chat message sent: " + message.getText());
  }

  private addChatMessage(message: ChatMessageModel, update: boolean): void {
    switch (message.chatId) {
      case 0:
        this.chatMessages0.push(message);
        this.chatMessages0.sort((a, b): number => {
          if (a.time < b.time) { return 1; }
          if (a.time > b.time) { return -1; }
          return 0;
        });
        if (update && message.getUsername() !== this.authenticationService.getUsername()) {
          this.newMessageCount0++;
        }
        break;
      case 1:
        this.chatMessages1.push(message);
        this.chatMessages1.sort((a, b): number => {
          if (a.time < b.time) { return 1; }
          if (a.time > b.time) { return -1; }
          return 0;
        });
        if (update && message.getUsername() !== this.authenticationService.getUsername()) {
          this.newMessageCount1++;
        }
        break;
      case 2:
        this.chatMessages2.push(message);
        this.chatMessages2.sort((a, b): number => {
          if (a.time < b.time) { return 1; }
          if (a.time > b.time) { return -1; }
          return 0;
        });
        if (update && message.getUsername() !== this.authenticationService.getUsername()) {
          this.newMessageCount2++;
        }
        break;
      case 3:
        this.chatMessages3.push(message);
        this.chatMessages3.sort((a, b): number => {
          if (a.time < b.time) { return 1; }
          if (a.time > b.time) { return -1; }
          return 0;
        });
        if (update && message.getUsername() !== this.authenticationService.getUsername()) {
          this.newMessageCount3++;
        }
        break;
      default:
        break;
    }
  }

  getMessages(): Observable<Response> {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const url = this.constantsService.getServerUrl() + "chat?date=" + this.constantsService.getISOStringWithTimezoneOffsetUrlEncoded(date);
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers: headers };
    return this.http.get<Response>(url, options);
  }

  getActiveUsersFromServer(): Observable<Response> {
    const url = this.constantsService.getServerUrl() + "chat/users";
    const headers = this.authenticationService.newAuthHeader();
    const options = { headers: headers };
    return this.http.get<Response>(url, options);
  }

  /*
    getNumberOfActiveUsersForRegion(region?: string) {
    if (region) {
    let count = 0;
    for (var i = this.activeUsers.length - 1; i >= 0; i--) {
    if (this.activeUsers[i].getRegions().includes(region) || this.activeUsers[i].getRegions().includes(this.authenticationService.getActiveRegionId()))
      count = count + 1;
    }
    return count;
    } else
    return this.activeUsers.length;
    }

    getActiveUsersForRegion(region?: string) {
    let users = new Array<string>();
    for (var i = this.activeUsers.length - 1; i >= 0; i--) {
    if ((region && (this.activeUsers[i].getRegions().includes(region) || this.activeUsers[i].getRegions().includes(this.authenticationService.getActiveRegionId()))) || !region)
    users.push(this.activeUsers[i].getName());
    }
    return users;
    }
  */

  getNumberOfActiveUsers(): number {
    return this.activeUsers.length;
  }

  getActiveUsers(): string[] {
    return this.activeUsers;
  }

  // region
  getNewMessageCountSum(region: string): number {
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

  getNewMessageCount(region?: string): number {
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

  resetNewMessageCount(region?: string): void {
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

  getChatMessages(region?: string): ChatMessageModel[] {
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
