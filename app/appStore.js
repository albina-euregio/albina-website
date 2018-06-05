/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */

import { observable, action, computed, toJS } from 'mobx';
import React from 'react';
import { LocaleStore } from "mobx-react-intl";
import translations from './data/translations.json';

class AppStore extends React.Component {
  @observable keyDown;
  @observable locale;

  constructor() {
    super();
    const defaultLanguage = 'de'; // TODO: get from Browser config/config.ini
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
