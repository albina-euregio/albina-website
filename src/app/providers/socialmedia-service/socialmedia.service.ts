import { Injectable } from "@angular/core";
import { Http, RequestOptions } from "@angular/http";
import { ConstantsService } from "../constants-service/constants.service";
import { AuthenticationService } from "../authentication-service/authentication.service";

@Injectable()
export class SocialmediaService {

  constructor(
    public http: Http,
    private constantsService: ConstantsService,
    private authenticationService: AuthenticationService) {
  }

  public sendRapidMail(regionId: String, language: String, mailingsPost: String) {
    const url = this.constantsService.getServerUrl() + "social-media/rapidmail/send-message/" + regionId + "/" + language;
    const headers = this.authenticationService.newAuthHeader();
    const options = new RequestOptions({ headers: headers });
    const body = mailingsPost;
    return this.http.post(url, body, options);
  }

  public sendMP(regionId: String, language: String, message: String, attachment: String) {
    // http://localhost:8080/albina/api/social-media/messenger-people/send-message/IT-32-TN/IT?message=Testmessengerpeople&attachment=http%3A%2F%2Fwww.pdf995.com%2Fsamples%2Fpdf.pdf
    let url = this.constantsService.getServerUrl() + "social-media/messenger-people/send-message/" + regionId + "/" + language;
    url = url + "?message=" + message + "&attachment=" + attachment;
    const headers = this.authenticationService.newAuthHeader();
    const options = new RequestOptions({ headers: headers });
    return this.http.post(url, options);
  }

  public sendTW(regionId: String, language: String, message: String, previous_id: Number) {
    // http://localhost:8080/albina/api/social-media/twitter/send-message/IT-32-TN/IT
    let url = this.constantsService.getServerUrl() + "social-media/twitter/send-message/" + regionId + "/" + language;
    if (previous_id > 0) {
      url = url + "?previous_id=" + previous_id;
    }

    const headers = this.authenticationService.newAuthHeader("text/html");
    const options = new RequestOptions({ headers: headers });
    const body = message;
    return this.http.post(url, body, options);
  }
}
