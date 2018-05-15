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
    this.keyDown = observable.box(false);
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

  @computed
  get getKeyDown() {
    return toJS(this.keyDown);
  }

  @action
  setLanguage(newLanguage) {
    this.language.set(newLanguage);
  }

  @action
  SetKeyDown(key) {
    this.keyDown.set(key);
  }
}

export default AppStore;
