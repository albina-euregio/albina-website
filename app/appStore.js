import { observable, action } from "mobx";
import React from "react";
import { LocaleStore } from "./util/mobx-react-intl.es5.js";
import { BulletinStore } from "./stores/bulletinStore";
import CookieStore from "./stores/cookieStore";
import NavigationStore from "./stores/navigationStore";

// i18n
import ca from "./i18n/ca.json";
import de from "./i18n/de.json";
import en from "./i18n/en.json";
import es from "./i18n/es.json";
import fr from "./i18n/fr.json";
import it from "./i18n/it.json";
import oc from "./i18n/oc.json";

class AppStore extends React.Component {
  @observable
  keyDown;
  @observable
  locale;
  @observable
  cookieConsent;
  navigation;
  regions;
  languages;
  warnlevelNumbers;

  constructor() {
    super();
    this.languages = ["ca", "en", "de", "es", "fr", "it", "oc"];
    this.mainLanguages = ["en", "de", "it"];
    const translationLookup = { ca, en, de, es, fr, it, oc };

    // initial language is changed after config has arrived!!!
    this.locale = new LocaleStore("en", translationLookup);
    this.cookieConsent = new CookieStore("cookieConsentAccepted");
    this.cookieFeedback = new CookieStore("feedbackAccepted");
    this.navigation = new NavigationStore();

    this.warnlevelNumbers = {
      low: 1,
      moderate: 2,
      considerable: 3,
      high: 4,
      very_high: 5,
      no_snow: 0,
      no_rating: 0
    };

    this.avalancheProblems = Object.keys(en)
      .filter(k => k.match(/^problem:/))
      .map(k => k.substr(8));
  }

  get language() {
    return this.locale.value;
  }

  @action
  setLanguage(newLanguage) {
    if (this.languages.includes(newLanguage)) {
      if (this.locale.value !== newLanguage) {
        if (window.bulletinStore !== undefined) {
          window.bulletinStore = new BulletinStore(); // bulleting store is language dependent
        }
        // console.log("new language set", newLanguage);
        this.locale.value = newLanguage;
      }
      return true;
    }
    return false;
  }

  getWarnlevelNumber(id) {
    if (this.warnlevelNumbers[id]) {
      return this.warnlevelNumbers[id];
    }
    return 0;
  }

  getWarnLevelId(num) {
    if (num > 0) {
      return Object.keys(this.warnlevelNumbers).find(k => {
        return this.warnlevelNumbers[k] == num;
      });
    }
    return "";
  }
}

export default AppStore;
