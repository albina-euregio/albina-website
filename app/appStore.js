import { observable, action, makeObservable } from "mobx";
import { BulletinStore } from "./stores/bulletinStore";
import CookieStore from "./stores/cookieStore";
import NavigationStore from "./stores/navigationStore";

/**
 * @typedef {"ca" | "en" | "de" | "es" | "fr" | "it" | "oc"} Language
 */

// i18n
const ca = () => import("./i18n/ca.json");
const de = () => import("./i18n/de.json");
const en = () => import("./i18n/en.json");
const es = () => import("./i18n/es.json");
const fr = () => import("./i18n/fr.json");
const it = () => import("./i18n/it.json");
const oc = () => import("./i18n/oc.json");
const translationImports = Object.freeze({ ca, en, de, es, fr, it, oc });

class AppStore {
  constructor() {
    /**
     * @type {Language}
     */
    this.language = "";
    /**
     * @type {Language[]}
     */
    this.languages = ["ca", "en", "de", "es", "fr", "it", "oc"];
    this.mainLanguages = ["en", "de", "it"];
    /**
     * @type {Record<string, string>}
     */
    this.messages = {};

    // initial language is changed after config has arrived!!!
    this.cookieConsent = new CookieStore("cookieConsentAccepted");
    this.cookieFeedback = new CookieStore("feedbackAccepted");
    this.navigation = new NavigationStore();

    this.avalancheProblems = [
      "new_snow",
      "wind_drifted_snow",
      "persistent_weak_layers",
      "wet_snow",
      "gliding_snow",
      "favourable_situation"
    ];

    makeObservable(this, {
      cookieConsent: observable,
      language: observable,
      messages: observable,
      setLanguage: action
    });
  }

  /**
   * @param {Language} newLanguage
   */
  async setLanguage(newLanguage) {
    if (
      !this.languages.includes(newLanguage) ||
      this.language === newLanguage
    ) {
      return Promise.resolve();
    }
    if (window.bulletinStore !== undefined) {
      window.bulletinStore = new BulletinStore(); // bulleting store is language dependent
    }
    const { default: messages } = await translationImports[newLanguage]();
    this.messages = messages;
    // console.log("new language set", newLanguage);
    this.language = newLanguage;
    requestAnimationFrame(() => {
      // replace language-dependent body classes on language change.
      document.body.parentElement.lang = newLanguage;
      document.body.className = document.body.className
        .replace(/domain-[a-z]{2}/, "domain-" + newLanguage)
        .replace(/language-[a-z]{2}/, "language-" + newLanguage);
    });
  }
}

export default AppStore;
