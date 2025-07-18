import { atom, computed } from "nanostores";
import { z } from "zod/mini";

export const LanguageSchema = z.enum([
  "ca",
  "en",
  "de",
  "es",
  "fr",
  "it",
  "oc"
]);
export type Language = z.infer<typeof LanguageSchema>;

// i18n
const translationImports = import.meta.glob("./i18n/*.json", {
  import: "default"
});

// Using @eaws/micro-regions_names is blocked by https://github.com/yarnpkg/berry/issues/6631
const regionTranslationImports = import.meta.glob(
  "../node_modules/@eaws/micro-regions_names/*.json",
  {
    import: "default"
  }
);

export const languages: Language[] = Object.values(LanguageSchema.def.entries);

export const mainLanguages: Language[] = ["en", "de", "it"];

export const $language = atom("" as Language);
export const $messages = atom(
  {} as Record<FormatjsIntl.Message["ids"], string>
);

async function loadMessages(newLanguage: Language) {
  const [messages, regions] = await Promise.all([
    translationImports[`./i18n/${newLanguage}.json`](),
    regionTranslationImports[
      `../node_modules/@eaws/micro-regions_names/${newLanguage}.json`
    ]()
  ]);
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
export async function setLanguage(newLanguage: Language): Promise<void> {
  const oldLanguage = $language.get();
  if (!languages.includes(newLanguage) || oldLanguage === newLanguage) {
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
