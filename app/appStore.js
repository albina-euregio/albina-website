import { observable, action, makeObservable } from "mobx";
import { BULLETIN_STORE } from "./stores/bulletinStore";

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
const regionTranslationImports = Object.freeze({
  ca: () => import("@eaws/micro-regions_names/ca.json"),
  de: () => import("@eaws/micro-regions_names/de.json"),
  en: () => import("@eaws/micro-regions_names/en.json"),
  es: () => import("@eaws/micro-regions_names/es.json"),
  fr: () => import("@eaws/micro-regions_names/fr.json"),
  it: () => import("@eaws/micro-regions_names/it.json"),
  oc: () => import("@eaws/micro-regions_names/oc.json")
});

class AppStore {
  constructor() {
    //console.log("AppStore");
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

    makeObservable(this, {
      language: observable,
      messages: observable,
      setMessages: action,
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
    BULLETIN_STORE.clear(); // bulleting store is language dependent
    const messages = translationImports[newLanguage]();
    const regions = regionTranslationImports[newLanguage]();
    this.setMessages((await messages).default, (await regions).default);
    this.language = newLanguage;
    requestAnimationFrame(() => {
      // replace language-dependent body classes on language change.
      document.body.parentElement.lang = newLanguage;
      document.body.className = document.body.className
        .replace(/domain-[a-z]{2}/, "domain-" + newLanguage)
        .replace(/language-[a-z]{2}/, "language-" + newLanguage);
    });
  }

  get locale() {
    if (!this.language) {
      return "en-GB";
    } else if (this.language === "en") {
      return "en-GB";
    } else if (this.language === "de") {
      // Jänner :-)
      return "de-AT";
    } else {
      return this.language;
    }
  }

  setMessages(messages, regions) {
    this.messages = Object.freeze(
      Object.assign(
        { ...messages },
        { "region:Salzburg": regions["AT-05"] }, // for StationTable
        { "region:Vorarlberg": regions["AT-08"] }, // for StationTable
        ...Object.entries(regions).map(([id, name]) => ({
          [`region:${id}`]: name
        }))
      )
    );
  }
}

export default AppStore;

export const APP_STORE = new AppStore();
