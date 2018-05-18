/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */

import { observable, action, computed, toJS } from 'mobx';
import React from 'react';

class AppStore extends React.Component {
  @observable language = 'de';
  @observable keyDown;

  constructor() {
    super();
    this.language = observable.box('de');
  }

  @computed
  get homeTranslation() {
    const translations = {
      en: 'home',
      it: 'casa',
      de: 'Zuhause'
    };
    return translations[this.language];
  }

  @action
  setLanguage(newLanguage) {
    this.language.set(newLanguage);
  }
}

export default AppStore;
