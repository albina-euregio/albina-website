import { atom, computed } from "nanostores";

export type Language = "ca" | "en" | "de" | "es" | "fr" | "it" | "oc";

// i18n
const translationImports = import.meta.glob("./i18n/*.json", {
  import: "default",
  eager: true
});

// Using @eaws/micro-regions_names is blocked by https://github.com/yarnpkg/berry/issues/6631
const regionTranslationImports = import.meta.glob(
  "./i18n/micro-regions_names/*.json",
  {
    import: "default",
    eager: true
  }
);

export const languages: Language[] = ["ca", "en", "de", "es", "fr", "it", "oc"];

export const mainLanguages: Language[] = ["en", "de", "it"];

export const $language = atom("" as Language);
export const $messages = atom(
  {} as Record<FormatjsIntl.Message["ids"], string>
);

function loadMessages(newLanguage: Language) {
  const messages = translationImports[`./i18n/${newLanguage}.json`];
  const regions =
    regionTranslationImports[`./i18n/micro-regions_names/${newLanguage}.json`];
  const allMessages = Object.freeze(
    Object.assign(
      { ...messages },
      { "region:Salzburg": regions["AT-05"] }, // for StationTable
      { "region:Vorarlberg": regions["AT-08"] }, // for StationTable
      ...Object.entries(regions).map(([id, name]) => ({
        [`region:${id}`]: name
      }))
    )
  );
  return allMessages;
}
export function setLanguage(newLanguage: Language) {
  const oldLanguage = $language.get();
  if (!languages.includes(newLanguage) || oldLanguage === newLanguage) {
    return Promise.resolve();
  }
  $messages.set(loadMessages(newLanguage));
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
