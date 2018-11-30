import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { Tab } from './tab.component';
import { SettingsService } from '../providers/settings-service/settings.service';
import * as Enums from '../enums/enums';

@Component({
  selector: 'tabs',
  templateUrl: 'tabs.component.html'
})
export class Tabs implements AfterContentInit {
  
  @ContentChildren(Tab) tabs: QueryList<Tab>;

  constructor(
    private settingsService: SettingsService)
  {
  }
  
  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab)=>tab.active);

    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {
      if (this.settingsService.getLang() == Enums.LanguageCode.de)
        this.selectTab(this.tabs.toArray()[0]);
      if (this.settingsService.getLang() == Enums.LanguageCode.it)
        this.selectTab(this.tabs.toArray()[1]);
      if (this.settingsService.getLang() == Enums.LanguageCode.en)
        this.selectTab(this.tabs.toArray()[2]);
    }
  }
  
  selectTab(tab: Tab){
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);
    
    // activate the tab the user has clicked on.
    tab.active = true;
  }

}