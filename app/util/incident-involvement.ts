import { createElement, type ReactNode } from "react";
import type { MessageId, useIntl } from "../i18n";
import {
  translateIncidentValue,
  type IncidentReportMessages
} from "../i18n/incident-report";
import type {
  IncidentData,
  IncidentInvolvement
} from "../stores/incidentDataStore";
import { escapeHtml } from "./escape-html";

/**
 * Involvement categories are labelled from the shared incident-report resource.
 */
const INVOLVEMENT_LABELS: Record<
  IncidentInvolvement,
  [category: string, value: string]
> = {
  fatal: ["incidentReport", "fatalities"],
  injured: ["incidentReport", "injuredSurvivors"],
  involved: ["personInvolvement", "Yes"],
  uninvolved: ["personInvolvement", "No"],
  unknown: ["personInvolvement", "Unknown"]
};

export function involvementLabel(
  messages: IncidentReportMessages,
  involvement: IncidentInvolvement
): string {
  const [category, value] = INVOLVEMENT_LABELS[involvement];
  return translateIncidentValue(messages, category, value) ?? value;
}

/**
 * The involvement phrase for an incident, plus the persons count it
 * interpolates where the category has one.
 */
function involvementMessage(
  incident: IncidentData
): [id: MessageId, count?: number] {
  const { involvement, fatalities, injuredSurvivors } = incident;
  switch (involvement) {
    case "fatal":
      return ["incidents:involvement:fatal", fatalities];
    case "injured":
      return ["incidents:involvement:injured", injuredSurvivors];
    case "involved":
      return ["incidents:involvement:involved"];
    case "uninvolved":
      return ["incidents:involvement:uninvolved"];
    case "unknown":
      return ["incidents:involvement:unknown"];
  }
}

/**
 * The persons count as it reads inside the involvement phrase: parenthesized,
 * and — being whitespace-free — unbreakable across lines. The parentheses live
 * here rather than in the message so the emphasis can cover them too.
 */
function countText(count: number, intl: ReturnType<typeof useIntl>): string {
  return `(${intl.formatNumber(count)})`;
}

/**
 * An incident's involvement as one short phrase — "Incident with fatalities
 * (2)", "Incident without involvement", … The persons count is set in bold so
 * it reads apart from the label around it. Shared by the incident table and the
 * details dialog; the map's marker tooltip uses `involvementHtml` instead.
 */
export function involvementText(
  incident: IncidentData,
  intl: ReturnType<typeof useIntl>
): ReactNode {
  const [id, count] = involvementMessage(incident);
  return count === undefined
    ? intl.formatMessage({ id })
    : intl.formatMessage(
        { id },
        {
          count: createElement(
            "strong",
            { key: "count" },
            countText(count, intl)
          )
        }
      );
}

// Stands in for the count while the phrase around it is escaped, so the
// emphasis markup can be injected afterwards without being escaped too.
const COUNT_PLACEHOLDER = "\u0000";

/**
 * `involvementText` as an escaped HTML string, for the map tooltip's `setHTML`.
 */
export function involvementHtml(
  incident: IncidentData,
  intl: ReturnType<typeof useIntl>
): string {
  const [id, count] = involvementMessage(incident);
  if (count === undefined) return escapeHtml(intl.formatMessage({ id }));
  return escapeHtml(
    intl.formatMessage({ id }, { count: COUNT_PLACEHOLDER })
  ).replace(COUNT_PLACEHOLDER, `<strong>${countText(count, intl)}</strong>`);
}
