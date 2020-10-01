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
    const translationLookup = { ca, en, de, es, fr, it, oc };

    // initial language is changed after config has arrived!!!
    this.locale = new LocaleStore("en", translationLookup);
    this.cookieConsent = new CookieStore("cookieConsentAccepted");
    this.cookieFeedback = new CookieStore("feedbackAccepted");
    this.navigation = new NavigationStore();

    this.regions = {
      "AT-07": {
        en: en["region:AT-07"],
        de: de["region:AT-07"],
        fr: fr["region:AT-07"],
        it: it["region:AT-07"]
      },
      "IT-32-BZ": {
        en: en["region:IT-32-BZ"],
        de: de["region:IT-32-BZ"],
        fr: fr["region:IT-32-BZ"],
        it: it["region:IT-32-BZ"]
      },
      "IT-32-TN": {
        en: en["region:IT-32-TN"],
        de: de["region:IT-32-TN"],
        fr: fr["region:IT-32-TN"],
        it: it["region:IT-32-TN"]
      }
    };

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
        if (APP_DEV_MODE) console.log("new language set", newLanguage);
        this.locale.value = newLanguage;
      }
      return true;
    }
    return false;
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
    if (this.regions[code]) {
      const lang = this.language;
      return this.regions[code][lang];
    }
    return "";
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
