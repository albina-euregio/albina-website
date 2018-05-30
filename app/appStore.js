/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */

import { observable, action, computed, toJS } from 'mobx';
import React from 'react';
import { LocaleStore } from "mobx-react-intl";

class AppStore extends React.Component {
  @observable keyDown;
  @observable locale;

  constructor() {
    super();
    const defaultLanguage = 'de'; // TODO: get from Browser config/config.ini
    const translations = {
      "en": {
        "home": "home",
        "bulletin:header:forecast": "Avalanche Forecast"
      },
      "de": {
        "home": "Zuhause",
        "bulletin:header:forecast": "Lawinenprognose"
      },
      "it": {
        "home": "casa",
        "bulletin:header:forecast": "Avalanche Forecast"
      }
    };
    this.locale = new LocaleStore(defaultLanguage, translations);
  }

  set language(newLanguage) {
    this.locale.value = newLanguage;
  }

  get language() {
    return this.locale.value;
  }
}

export default AppStore;
