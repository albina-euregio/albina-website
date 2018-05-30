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
        "home": "home"
      },
      "de": {
        "home": "Zuhause"
      },
      "it": {
        "home": "casa"
      }
    };
    this.locale = new LocaleStore(defaultLanguage, translations);
  }

  set language(newLanguage) {
    //this.language.set(newLanguage);
    this.locale.value = newLanguage;
  }

  get language() {
    return this.locale.value;
  }
}

export default AppStore;
