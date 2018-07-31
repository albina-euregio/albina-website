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
    this.languages = ['de', 'it', 'en'];
    const defaultLanguage = 'de'; // TODO: get from Browser config/config.ini
    const translationFallbackLanguage = 'all';

    const translationLookup = {};
    this.languages.forEach((lang) => { translationLookup[lang] = {}; });

    Object.keys(translations).forEach((key) =>
      this.languages.forEach((lang) => {
        // take language key, or english, if translation is missing
        translationLookup[lang][key] =
          (translations[key][lang]) ? translations[key][lang] : translations[key][translationFallbackLanguage];
      })
    );

    this.locale = new LocaleStore(defaultLanguage, translationLookup);

    this.regions = {
      'AT-07': translations['region:AT-07'],
      'IT-32-BZ': translations['region:IT-32-BZ'],
      'IT-32-TN': translations['region:IT-32-TN']
    };
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
    return Object.keys(this.regions).reduce((acc, r) => {
      acc[r] = this.getRegionName(r);
      return acc;
    }, {});
  }

  getRegionName(code) {
    if(this.regions[code]) {
      const lang = this.language;
      return this.regions[code][lang];
    }
    return '';
  }
}

export default AppStore;
