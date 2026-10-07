import { atom } from "nanostores";
import { useStore } from "@nanostores/react";
import { $language, mergeTranslations, type Language } from "../appStore";

export type IncidentReportMessages = Record<string, Record<string, string>>;

const translationImports = import.meta.glob<IncidentReportMessages>(
  "./incident-report/*.json",
  { import: "default" }
);

const FALLBACK_LANGUAGE: Language = "en";

const $incidentReportMessages = atom<IncidentReportMessages>({});
let loadedLanguage: Language | "" = "";

async function loadIncidentReportMessages(
  language: Language
): Promise<IncidentReportMessages> {
  const [fallback, messages] = await Promise.all(
    [FALLBACK_LANGUAGE, language].map(
      lang => translationImports[`./incident-report/${lang}.json`]?.() ?? {}
    )
  );
  return mergeTranslations(fallback, messages);
}

$language.subscribe(language => {
  if (!language || language === loadedLanguage) return;
  loadedLanguage = language;
  void loadIncidentReportMessages(language).then(messages =>
    $incidentReportMessages.set(messages)
  );
});

/** Reactive access to the `incident-report` Transifex resource (see README). */
export function useIncidentReportMessages(): IncidentReportMessages {
  return useStore($incidentReportMessages);
}

/** Looks up `messages[category][value]`, falling back to the raw value if untranslated. */
export function translateIncidentValue(
  messages: IncidentReportMessages,
  category: string,
  value: string | undefined
): string | undefined {
  if (!value) return undefined;
  return messages[category]?.[value] ?? value;
}
