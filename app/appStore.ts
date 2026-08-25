import { atom, computed } from "nanostores";
import * as v from "valibot";
import { vLanguageCode } from "./api/valibot.gen";

export type Language = v.InferOutput<typeof vLanguageCode>;

// i18n
const translationImports = import.meta.glob<Record<string, string>>(
  "./i18n/*.json",
  { import: "default" }
);

const caamlTranslationImports = import.meta.glob<Record<string, string>>(
  "./i18n/caaml/*.json",
  { import: "default" }
);

const regionTranslationImports = import.meta.glob<Record<string, string>>(
  "../node_modules/@eaws/micro-regions_names/*.json",
  {
    import: "default"
  }
);

export const $language = atom("" as Language);
export const $messages = atom(
  {} as Record<FormatjsIntl.Message["ids"], string>
);

async function loadMessages(newLanguage: Language) {
  const [fallbackMessages, messages, caamlFallback, caamlMessages, regions] =
    await Promise.all([
      // en.json is the source of truth, the other locales are synced from
      // Transifex and lag behind it — untranslated keys fall back to English.
      translationImports["./i18n/en.json"](),
      translationImports[`./i18n/${newLanguage}.json`](),
      caamlTranslationImports["./i18n/caaml/en.json"](),
      caamlTranslationImports[`./i18n/caaml/${newLanguage}.json`](),
      regionTranslationImports[
        `../node_modules/@eaws/micro-regions_names/${newLanguage}.json`
      ]()
    ]);
  const caamlAll = { ...caamlFallback, ...caamlMessages };
  const allMessages = Object.freeze(
    Object.assign(
      { ...fallbackMessages, ...messages },
      { "region:Kärnten": regions["AT-02"] }, // for StationTable
      { "region:Salzburg": regions["AT-05"] }, // for StationTable
      { "region:Vorarlberg": regions["AT-08"] }, // for StationTable
      ...Object.entries(regions).map(([id, name]) => ({
        [`region:${id}`]: String(name).trim()
      })),
      ...Object.entries(caamlAll).map(([id, text]) => ({
        [`caaml:${id}`]: text
      }))
    )
  );
  return allMessages;
}
export async function setLanguage(newLanguage: Language): Promise<void> {
  const oldLanguage = $language.get();
  if (!config.languages.includes(newLanguage) || oldLanguage === newLanguage) {
    return;
  }
  $messages.set(await loadMessages(newLanguage));
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

export const $headless = atom(false);

export const $province = atom("" as string);

/**
 * The "primary" region(s). Used for map focus and display of blue no-rating indicator.
 */
export const $focusRegions = computed($province, province =>
  province ? [province] : config.regionCodes
);

/**
 * Other regions for which we load the full CAAML. When province is active,
 * regionCodes are demoted to this set (instead of being the focus regions).
 */
export const $extraRegions = computed($province, province =>
  province
    ? [
        ...config.regionCodes.filter(r => r !== province),
        ...config.extraRegions.filter(r => r !== province)
      ]
    : config.extraRegions
);
