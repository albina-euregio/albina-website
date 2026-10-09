import { atom, onMount } from "nanostores";
import { useStore } from "@nanostores/react";
import { $language, mergeTranslations, type Language } from "../appStore";
import type { MessageId } from ".";

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

// load on first use, e.g. when an incident dialog opens
onMount($incidentReportMessages, () =>
  $language.subscribe(language => {
    if (!language || language === loadedLanguage) return;
    loadedLanguage = language;
    void loadIncidentReportMessages(language).then(messages =>
      $incidentReportMessages.set(messages)
    );
  })
);

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

/**
 * Field labels and value translations of the `incident-report` resource.
 * Until it has loaded, labels fall back to the raw field name.
 */
export function useIncidentLabels() {
  const messages = useIncidentReportMessages();
  const label = (field: string) =>
    (messages.incidentReport?.[field] ?? field).trim();
  const tr = (category: string, value: string | undefined) =>
    translateIncidentValue(messages, category, value);
  /** Translates each entry of a list and joins them, dropping empty values. */
  const trList = (
    category: string,
    values: (string | undefined)[] | undefined,
    separator = ", "
  ) =>
    values
      ?.map(value => tr(category, value))
      .filter(Boolean)
      .join(separator);
  return { messages, label, tr, trList };
}

export function problemTypeMessageId(problemType: string): MessageId {
  return `caaml:avalancheProblem.${problemType}` as MessageId;
}
