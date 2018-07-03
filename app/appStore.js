/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */

import { observable, action, computed, toJS } from 'mobx';
import React from 'react';
import { LocaleStore } from './util/mobx-react-intl.es5.js';
import translations from './data/translations.json';

class AppStore extends React.Component {
  @observable keyDown;
  @observable locale;
  regions;
  languages;

  constructor() {
    super();
    const defaultLanguage = 'de'; // TODO: get from Browser config/config.ini
    this.locale = new LocaleStore(defaultLanguage, translations);

    // TODO: maybe fetch from CMS API
    this.regions = {
      'tirol': {en: 'Tyrol', de: 'Tirol', it: 'Tirolo'},
      'southtirol': {en: 'South Tyrol', de: 'Südtirol', it: 'Alto Adige'},
      'trentino': {en: 'Trentino', de: 'Trentino', it: 'Trentino'}
    };

    this.languages = ['de', 'it', 'en'];
  }

  set language(newLanguage) {
    this.locale.value = newLanguage;
  }

  get language() {
    return this.locale.value;
  }

  /**
   * Get regions for current language.
   */
  getRegions() {
    const lang = this.language;

    return Object.keys(this.regions).reduce((acc, r) => {
      acc[r] = this.regions[r][lang];
      return acc;
    }, {});
  }
}

export default AppStore;
