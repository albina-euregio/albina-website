import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConstantsService } from "../constants-service/constants.service";
import { AuthenticationService } from "../authentication-service/authentication.service";

@Injectable()
export class SocialmediaService {

  constructor(
    public http: HttpClient,
    private constantsService: ConstantsService,
    private authenticationService: AuthenticationService) {
  }

  public sendRapidMail(regionId: String, language: String, mailingsPost: String) {
    const url = this.constantsService.getServerUrl() + "social-media/rapidmail/send-message/" + regionId + "/" + language;
    const options = { headers: this.authenticationService.newAuthHeader() };
    const body = mailingsPost;
    return this.http.post(url, body, options);
  }
}
