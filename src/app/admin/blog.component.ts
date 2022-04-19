import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BlogService } from "../providers/blog-service/blog.service";
import { AlertComponent } from "ngx-bootstrap/alert";

@Component({
  templateUrl: "blog.component.html",
  selector: "app-blog"
})
export class BlogComponent {

  public alerts: any[] = [];

  constructor(
    public blogService: BlogService,
    public translateService: TranslateService) {
  }

  sendLatestBlogPost(event, region, language, test) {
    event.stopPropagation();
    const prefix = test ? "[TEST] " : "";
    this.blogService.sendLatestBlogPost(region, language, test).subscribe(
      data => {
        console.debug("Email, telegram and push sent!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "success",
          msg: this.translateService.instant("admin.blog.all.success", {prefix: prefix}),
          timeout: 5000
        });
      },
      error => {
        console.error("Email, telegram and push could not be sent!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("admin.blog.all.error", {prefix: prefix}),
          timeout: 5000
        });
      }
    );
  }

  sendLatestBlogPostEmail(event, region, language, test) {
    event.stopPropagation();
    const prefix = test ? "[TEST] " : "";
    this.blogService.sendLatestBlogPostEmail(region, language, test).subscribe(
      data => {
        console.debug("Email sent!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "success",
          msg: this.translateService.instant("admin.blog.email.success", {prefix: prefix}),
          timeout: 5000
        });
      },
      error => {
        console.error("Email could not be sent!");
        window.scrollTo(0, 0);
        this.alerts.push({
          type: "danger",
          msg: this.translateService.instant("admin.blog.email.error", {prefix: prefix}),
          timeout: 5000
        });
      }
    );
  }

  sendLatestBlogPostTelegram(event, region, language, test) {
    event.stopPropagation();
    const prefix = test ? "[TEST] " : "";
    this.blogService.sendLatestBlogPostTelegram(region, language, test).subscribe(
    data => {
      console.debug("Telegram sent!");
      window.scrollTo(0, 0);
      this.alerts.push({
        type: "success",
        msg: this.translateService.instant("admin.blog.telegram.success", {prefix: prefix}),
        timeout: 5000
      });
    },
    error => {
      console.error("Telegram could not be sent!");
      window.scrollTo(0, 0);
      this.alerts.push({
        type: "danger",
        msg: this.translateService.instant("admin.blog.telegram.error", {prefix: prefix}),
        timeout: 5000
      });
    }
  );
}

  sendLatestBlogPostPush(event, region, language, test) {
    event.stopPropagation();
    const prefix = test ? "[TEST] " : "";
    this.blogService.sendLatestBlogPostPush(region, language, test).subscribe(
    data => {
      console.debug("Push sent!");
      window.scrollTo(0, 0);
      this.alerts.push({
        type: "success",
        msg: this.translateService.instant("admin.blog.push.success", {prefix: prefix}),
        timeout: 5000
      });
    },
    error => {
      console.error("Push could not be sent!");
      window.scrollTo(0, 0);
      this.alerts.push({
        type: "danger",
        msg: this.translateService.instant("admin.blog.push.error", {prefix: prefix}),
        timeout: 5000
      });
    }
  );
}

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
