import { atom, computed } from "nanostores";
import { BULLETIN_STORE } from "./stores/bulletinStore";

export type Language = "ca" | "en" | "de" | "es" | "fr" | "it" | "oc";

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

export const languages = ["ca", "en", "de", "es", "fr", "it", "oc"];

export const mainLanguages = ["en", "de", "it"];

export const $language = atom("" as Language);
export const $messages = atom(
  {} as Record<FormatjsIntl.Message["ids"], string>
);

export async function setLanguage(newLanguage: Language) {
  const oldLanguage = $language.get();
  if (!languages.includes(newLanguage) || oldLanguage === newLanguage) {
    return Promise.resolve();
  }
  BULLETIN_STORE.clear(); // bulleting store is language dependent
  const messages = (await translationImports[newLanguage]()).default;
  const regions = (await regionTranslationImports[newLanguage]()).default;
  $messages.set(
    Object.freeze(
      Object.assign(
        { ...messages },
        { "region:Salzburg": regions["AT-05"] }, // for StationTable
        { "region:Vorarlberg": regions["AT-08"] }, // for StationTable
        ...Object.entries(regions).map(([id, name]) => ({
          [`region:${id}`]: name
        }))
      )
    )
  );
  $language.set(newLanguage);
  requestAnimationFrame(() => {
    // replace language-dependent body classes on language change.
    document.body.parentElement.lang = newLanguage;
    document.body.classList.remove(
      `domain-${oldLanguage}`,
      `language-${oldLanguage}`
    );
    document.body.classList.add(
      `domain-${newLanguage}`,
      `language-${newLanguage}`
    );
  });
}

export const $locale = computed($language, language => {
  if (!language) {
    return "en-GB";
  } else if (language === "en") {
    return "en-GB";
  } else if (language === "de") {
    // Jänner :-)
    return "de-AT";
  } else {
    return language;
  }
});
