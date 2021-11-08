import { observable, action, computed, reaction, makeObservable } from "mobx";
import { BulletinStore } from "./stores/bulletinStore";
import CookieStore from "./stores/cookieStore";
import NavigationStore from "./stores/navigationStore";

/**
 * @typedef {"ca" | "en" | "de" | "es" | "fr" | "it" | "oc"} Language
 */

// i18n
import ca from "./i18n/ca.json";
import de from "./i18n/de.json";
import en from "./i18n/en.json";
import es from "./i18n/es.json";
import fr from "./i18n/fr.json";
import it from "./i18n/it.json";
import oc from "./i18n/oc.json";
/**
 * @type {Record<Language, Record<string, string>}
 */
const translationLookup = Object.freeze({ ca, en, de, es, fr, it, oc });

class AppStore {
  constructor() {
    /**
     * @type {Language}
     */
    this.language = "en";
    /**
     * @type {Language[]}
     */
    this.languages = ["ca", "en", "de", "es", "fr", "it", "oc"];
    this.mainLanguages = ["en", "de", "it"];

    // initial language is changed after config has arrived!!!
    this.cookieConsent = new CookieStore("cookieConsentAccepted");
    this.cookieFeedback = new CookieStore("feedbackAccepted");
    this.navigation = new NavigationStore();

    this.avalancheProblems = Object.keys(en)
      .filter(k => k.match(/^problem:/))
      .map(k => k.substr(8));

    // replace language-dependent body classes on language change.
    reaction(
      () => this.language,
      newLang => {
        document.body.parentElement.lang = newLang;
        document.body.className = document.body.className
          .replace(/domain-[a-z]{2}/, "domain-" + newLang)
          .replace(/language-[a-z]{2}/, "language-" + newLang);
      }
    );
    makeObservable(this, {
      cookieConsent: observable,
      language: observable,
      messages: computed,
      setLanguage: action
    });
  }

  /**
   * @returns {Record<string, string>}
   */
  get messages() {
    return translationLookup[this.language];
  }

  /**
   * @param {Language} newLanguage
   */
  setLanguage(newLanguage) {
    if (this.languages.includes(newLanguage)) {
      if (this.language !== newLanguage) {
        if (window.bulletinStore !== undefined) {
          window.bulletinStore = new BulletinStore(); // bulleting store is language dependent
        }
        // console.log("new language set", newLanguage);
        this.language = newLanguage;
      }
      return true;
    }
    return false;
  }
}

export default AppStore;
