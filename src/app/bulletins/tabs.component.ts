import { Component, ContentChildren, QueryList, AfterContentInit } from "@angular/core";
import { TabComponent } from "./tab.component";
import { SettingsService } from "../providers/settings-service/settings.service";
import * as Enums from "../enums/enums";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.component.html"
})
export class TabsComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  constructor(
    private settingsService: SettingsService) {
  }

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      if (this.settingsService.getLang() === Enums.LanguageCode.de) {
        this.selectTab(this.tabs.toArray()[0]);
      }
      if (this.settingsService.getLang() === Enums.LanguageCode.it) {
        this.selectTab(this.tabs.toArray()[1]);
      }
      if (this.settingsService.getLang() === Enums.LanguageCode.en) {
        this.selectTab(this.tabs.toArray()[2]);
      }
    }
  }

  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(t => t.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
